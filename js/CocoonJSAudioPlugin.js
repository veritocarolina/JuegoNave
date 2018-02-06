/*
 * CocoonJSAudioPlugin for SoundJS
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 *
 * Copyright (c) 2012 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @author Olaf Horstmann, indiegamr.com
 */

/**
 * @module SoundJS
 */

// namespace:
this.createjs = this.createjs || {};

(function () {

	/**
	 * Play sounds when Packaged through the CocoonJS-packager.
	 * This is an alternated/simplified version of the HTMLAudioPlugin.
	 *
	 * See {{#crossLink "Sound"}}{{/crossLink}} for general notes on known issues.
	 *
	 * @class CocoonJSAudioPlugin
	 * @constructor
	 */
	function CocoonJSAudioPlugin() {
		this.init();
	}

	var s = CocoonJSAudioPlugin;

	/**
	 * The capabilities of the plugin. This is generated via the the SoundInstance {{#crossLink "TMLAudioPlugin/generateCapabilities"}}{{/crossLink}}
	 * method. Please see the Sound {{#crossLink "Sound/getCapabilities"}}{{/crossLink}} method for an overview of all
	 * of the available properties.
	 * @property capabilities
	 * @type {Object}
	 * @static
	 */
	s.capabilities = null;

	/**
	 * Event constant for the "canPlayThrough" event for cleaner code.
	 * @property AUDIO_READY
	 * @type {String}
	 * @default canplaythrough
	 * @static
	 */
	s.AUDIO_READY = "canplaythrough";

	/**
	 * Event constant for the "ended" event for cleaner code.
	 * @property AUDIO_ENDED
	 * @type {String}
	 * @default ended
	 * @static
	 */
	s.AUDIO_ENDED = "ended";

	/**
	 * Determine if this is CocoonJS, if so - go with it.
	 * browsers except iOS, where it is limited.
	 * @method isSupported
	 * @return {Boolean} If the plugin can be initialized.
	 * @static
	 */
	s.isSupported = function () {
		if (!navigator.isCocoonJS) {
			return false;
		}
		
		s.generateCapabilities();
		if (s.capabilities == null) {
			return false;
		}
		return true;
	};

	/**
	 * Determine the capabilities of the plugin. Used internally. Please see the Sound API {{#crossLink "Sound/getCapabilities"}}{{/crossLink}}
	 * method for an overview of plugin capabilities.
	 * @method generateCapabiities
	 * @static
	 * @protected
	 */
	s.generateCapabilities = function () {
		if (s.capabilities != null) {
			return;
		}

		s.capabilities = {
			panning:false, //no panning currently for Cocoon
			volume:true,
			tracks:-1
		};

		// determine which extensions our browser supports for this plugin by iterating through Sound.SUPPORTED_EXTENSIONS
		var supportedExtensions = createjs.Sound.SUPPORTED_EXTENSIONS;
		var extensionMap = createjs.Sound.EXTENSION_MAP;
		for (var i = 0, l = supportedExtensions.length; i < l; i++) {
			var ext = supportedExtensions[i];
			var playType = extensionMap[ext] || ext;
			s.capabilities[ext] = (playType == "mp4" || playType == "mpeg" || playType == "wav");  //Cocoon can play m4a, mpeg and wav
		}
	}

	var p = s.prototype = {

		/**
		 * The capabilities of the plugin, created by the {{#crossLink "CocoonJSAudioPlugin/generateCapabilities"}}{{/crossLink}}
		 * method.
		 */
		capabilities:null,

		/**
		 * Object hash indexed by the source of each file to indicate if an audio source is loaded, or loading.
		 * @property audioSources
		 * @type {Object}
		 * @protected
		 * @since 0.4.0
		 */
		audioSources:null,

		/**
		 * Object hash indexed by the source of each file to reference tags, since for CocoonJS only 1 tag/audio object is needed for a sound.
		 * @property audioSources
		 * @type {Object}
		 * @protected
		 * @since 0.4.0
		 */
		tagMap:null,

		/**
		 * An initialization function run by the constructor
		 * @method init
		 * @private
		 */
		init:function () {
			this.capabilities = s.capabilities;
			this.audioSources = {};
			this.tagMap = {};
		},

		/**
		 * Pre-register a sound instance when preloading/setup. This is called by {{#crossLink "Sound"}}{{/crossLink}}.
		 * Note that this provides an object containing a tag used for preloading purposes, which
		 * <a href="http://preloadjs.com">PreloadJS</a> can use to assist with preloading.
		 * @method register
		 * @param {String} src The source of the audio
		 * @param {Number} instances The number of concurrently playing instances to allow for the channel at any time.
		 * @return {Object} A result object, containing a tag for preloading purposes and a numChannels value for internally
		 * controlling how many instances of a source can be played by default.
		 */
		register:function (src, instances) {
			this.audioSources[src] = true;
			
			var tag = new Audio(); //if there's another "new Audio()" somewhere in this class, something is wrong or Cocoon massivly changed
			tag.autoplay = false;
			tag.src = src;

			this.tagMap[src] = tag; //the registered tag is persistent and shared for ALL SoundInstances

			return {
				tag:tag
			};
		},

		/**
		 * Create a sound instance.
		 * @method create
		 * @param {String} src The sound source to use.
		 * @return {SoundInstance} A sound instance for playback and control.
		 */
		create:function (src) {
			return new SoundInstance(src, this);
		},

		/**
		 * Checks if preloading has started for a specific source.
		 * @method isPreloadStarted
		 * @param {String} src The sound URI to check.
		 * @return {Boolean} If the preload has started.
		 * @since 0.4.0
		 */
		isPreloadStarted:function (src) {
			return true;
		},

		/**
		 * Internally preload a sound.
		 * @method preload
		 * @param {String} src The sound URI to load.
		 * @param {Object} instance An object containing a tag property that is an HTML audio tag used to load src.
		 * @since 0.4.0
		 */
		preload:function (src, instance) {
			this.audioSources[src] = true;
			var tag = this.tagMap[src];
			tag.addEventListener(createjs.CocoonJSAudioPlugin.AUDIO_READY, this.audioReadyHandler, false);
			tag.load();
		},

		audioReadyHandler:function(event) {
			this.removeEventListener(createjs.CocoonJSAudioPlugin.AUDIO_READY, this.audioReadyHandler);
			createjs.Sound.sendLoadComplete(this.src);
		},

		toString:function () {
			return "[CocoonJSAudioPlugin]";
		}

	}

	createjs.CocoonJSAudioPlugin = CocoonJSAudioPlugin;


// NOTE Documentation for the SoundInstance class in WebAudioPlugin file. Each plugin generates a SoundInstance that
// follows the same interface.
	function SoundInstance(src, owner) {
		this.init(src, owner);
	}

	var p = SoundInstance.prototype = {

		src:null,
		uniqueId:-1,
		playState:null,
		owner:null,
		loaded:false,
		offset:0,
		delay:0,
		volume:1,
		pan:0,
		duration:0,
		remainingLoops:0,
		delayTimeoutId:null,
		tag:null,
		muted:false,
		paused:false,

// mix-ins:
		// EventDispatcher methods:
		addEventListener:null,
		removeEventListener:null,
		removeAllEventListeners:null,
		dispatchEvent:null,
		hasEventListener:null,
		_listeners:null,

// Callbacks
		onComplete:null,
		onLoop:null,
		onReady:null,
		onPlayFailed:null,
		onPlayInterrupted:null,
		onPlaySucceeded:null,

		// Proxies, make removing listeners easier.
		endedHandler:null,
		readyHandler:null,
		stalledHandler:null,

// Constructor
		init:function (src, owner) {
			this.src = src;
			this.owner = owner;

			this.endedHandler = createjs.proxy(this.handleSoundComplete, this);

			this.tag = owner.tagMap[src];
		},

		sendEvent:function (eventString) {
			var event = {
				target:this,
				type:eventString
			};
			this.dispatchEvent(event);
		},

		cleanUp:function () {
			var tag = this.tag;
			if (tag != null) {
				tag.pause();
				try {
					tag.currentTime = 0;
				} catch (e) {
				} // Reset Position
				tag.removeEventListener(createjs.CocoonJSAudioPlugin.AUDIO_ENDED, this.endedHandler, false);
			}

			clearTimeout(this.delayTimeoutId);
			if (window.createjs == null) {
				return;
			}
			createjs.Sound.playFinished(this);
		},

		interrupt:function () {
			if (this.tag == null) {
				return;
			}
			this.playState = createjs.Sound.PLAY_INTERRUPTED;
			if (this.onPlayInterrupted) {
				this.onPlayInterrupted(this);
			}
			this.sendEvent("interrupted");
			this.cleanUp();
			this.paused = false;
		},

// Public API
		play:function (interrupt, delay, offset, loop, volume, pan) {
			this.cleanUp(); //LM: Is this redundant?
			createjs.Sound.playInstance(this, interrupt, delay, offset, loop, volume, pan);
		},

		beginPlaying:function (offset, loop, volume, pan) {
			if (window.createjs == null) {
				return -1;
			}
			var tag = this.tag;
			if (tag == null) {
				this.playFailed();
				return -1;
			}

			this.duration = this.tag.duration * 1000;
			// OJR would like a cleaner way to do this in init, discuss with LM
			// need this for setPosition on stopped sounds

			tag.addEventListener(createjs.CocoonJSAudioPlugin.AUDIO_ENDED, this.endedHandler, false);

			// Reset this instance.
			this.offset = offset;
			this.volume = volume;
			this.updateVolume();  // note this will set for mute and masterMute
			this.remainingLoops = loop;

			this.handleSoundReady(null);

			this.onPlaySucceeded && this.onPlaySucceeded(this);
			this.sendEvent("succeeded");
			return 1;
		},

		handleSoundReady:function (event) {
			if (window.createjs == null) {
				return;
			}

			this.playState = createjs.Sound.PLAY_SUCCEEDED;
			this.paused = false;

			if (this.offset >= this.getDuration()) {
				this.playFailed();  // OJR: throw error?
				return;
			} else if (this.offset > 0) {
				this.tag.currentTime = this.offset * 0.001; // offset won't work for CocoonJS currently, maybe in the future
			}
			if (this.remainingLoops == -1) {
				this.tag.loop = true;
			}
			this.tag.play();
		},

		pause:function () {
			if (!this.paused && this.playState == createjs.Sound.PLAY_SUCCEEDED && this.tag != null) {
				this.paused = true;
				// Note: when paused by user, we hold a reference to our tag. We do not release it until stopped.
				this.tag.pause();

				clearTimeout(this.delayTimeoutId);

				return true;
			}
			return false;
		},

		resume:function () {
			if (!this.paused || this.tag == null) {
				return false;
			}
			this.paused = false;
			this.tag.play();
			return true;
		},

		stop:function () {
			this.offset = 0;
			this.pause();
			this.playState = createjs.Sound.PLAY_FINISHED;
			this.cleanUp();
			return true;
		},

		setMasterVolume:function (value) {
			this.updateVolume();
			return true;
		},

		setVolume:function (value) {
			if (Number(value) == null) {
				return false;
			}
			value = Math.max(0, Math.min(1, value));
			this.volume = value;
			this.updateVolume();
			return true;
		},

		updateVolume:function () {
			if (this.tag != null) {
				var newVolume = (this.muted || createjs.Sound.masterMute) ? 0 : this.volume * createjs.Sound.masterVolume;
				if (newVolume != this.tag.volume) {
					this.tag.volume = newVolume;
				}
				return true;
			} else {
				return false;
			}
		},

		getVolume:function (value) {
			return this.volume;
		},

		mute:function (isMuted) {
			this.muted = isMuted;
			this.updateVolume();
			return true;
		},

		setMasterMute:function (isMuted) {
			this.updateVolume();
			return true;
		},

		setMute:function (isMuted) {
			if (isMuted == null || isMuted == undefined) {
				return false
			}
			;

			this.muted = isMuted;
			this.updateVolume();
			return true;
		},

		getMute:function () {
			return this.muted;
		},

		setPan:function (value) {
			return false;
		}, // Can not set pan in HTML

		getPan:function () {
			return 0;
		},

		getPosition:function () {
			if (this.tag == null) {
				return this.offset;
			}
			return this.tag.currentTime * 1000;
		},

		setPosition:function (value) {
			if (this.tag == null) {
				this.offset = value
			} else try {
				this.tag.currentTime = value * 0.001;
			} catch (error) { // Out of range
				return false;
			}
			return true;
		},

		getDuration:function () {  // NOTE this will always return 0 until sound has been played.
			return this.duration;
		},

		handleSoundComplete:function (event) {
			this.offset = 0;

			if (this.remainingLoops != 0) {
				this.remainingLoops--;

				//try { this.tag.currentTime = 0; } catch(error) {}
				this.tag.play();
				if (this.onLoop != null) {
					this.onLoop(this);
				}
				this.sendEvent("loop");
				return;
			}

			if (window.createjs == null) {
				return;
			}
			this.playState = createjs.Sound.PLAY_FINISHED;
			if (this.onComplete != null) {
				this.onComplete(this);
			}
			this.sendEvent("complete");
			this.cleanUp();
		},

		playFailed:function () {
			if (window.createjs == null) {
				return;
			}
			this.playState = createjs.Sound.PLAY_FAILED;
			if (this.onPlayFailed != null) {
				this.onPlayFailed(this);
			}
			this.sendEvent("failed");
			this.cleanUp();
		},

		toString:function () {
			return "[CocoonJSAudioPlugin SoundInstance]";
		}

	}

	createjs.EventDispatcher.initialize(SoundInstance.prototype);

	// Do not add SoundInstance to namespace.

}());
