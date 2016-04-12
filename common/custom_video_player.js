var CustomVideoPlayer = function (jQuery, videoPlayerElement, directAdOS, adSharesVideoElement) {
    var videos = jQuery(videoPlayerElement).find('video');
    if (videos.length < 1) {
        return;
    }

    this._jQuery = jQuery;
    this._directAdOS = directAdOS;
    this._adSharesVideoElement = adSharesVideoElement;

    this._videoPlayerElement = videoPlayerElement;
    this._videoElement = videos[0];

    this._videoElementWidth = this._videoElement.offsetWidth;
    this._videoElementHeight = this._videoElement.offsetHeight;

    this._buttons = [];

    this._playModel = new PlayModel(this._jQuery);

    //In that case DirectAdOS will be managing playback, we have to give control to it by starting playing ad
    if (adSharesVideoElement) {
        this._playModel.focusOn(PlayModel.AD);
    }

    this._buildControls(videoPlayerElement);
    this._setupEventHandlers();
    this._fullscreenInfo = new FullscreenInfo(this.fullScreenElement());
}

// PUBLIC METHODS
CustomVideoPlayer.prototype.play = function () {
    if (this._playModel.focusedOn === PlayModel.AD) {
        this._directAdOS.playAd();
    }
    else {
        this._videoElement.play();
    }
};

CustomVideoPlayer.prototype.resume = function () {
    this.play();
};

CustomVideoPlayer.prototype.pause = function () {
    if (this._directAdOS.loaded()) {
        this._directAdOS.pauseAd();
    }
    else {
        this._videoElement.pause();
    }
};

CustomVideoPlayer.prototype.disableButtonWithId = function (nButtonId) {
    var $button = this._buttons[nButtonId];
    if ($button) {
        this._disableButton($button);
    }
};

// PRIVATE METHODS
CustomVideoPlayer.prototype._onPlayModelChanged = function () {
    if (this._playModel.isPlaying) {
        this._enableButton(this._buttons["pause"]);
        this._disableButton(this._buttons["resume"]);
    }
    else {
        this._disableButton(this._buttons["pause"]);
        this._enableButton(this._buttons["resume"]);
    }
};

CustomVideoPlayer.prototype._buildControls = function (videoPlayerElement) {
    var $playerControls = this._jQuery("<div>", {"id": "player-controls"});
    var $buttonsList = this._jQuery("<ul>").appendTo($playerControls);

    var buttons = {
        "resume": "<i class='fa fa-play'></i>",
        "pause": "<i class='fa fa-pause'></i>",
        "fullscreen": "<i class='fa fa-expand'></i>",
    };

    for (var buttonId in buttons) {
        this._buttons[buttonId] = this._jQuery("<li>", {id: buttonId, html: buttons[buttonId], "class": "enabled"});
        this._buttons[buttonId].appendTo($buttonsList);
    }

    this.disableButtonWithId("pause");
    $playerControls.appendTo($(videoPlayerElement));
    this._controlsElement = $playerControls[0];
};

CustomVideoPlayer.prototype._setupEventHandlers = function () {
    var _this = this;

    $(this._controlsElement).on("click", "li", this._onButtonClick.bind(this));

    this._directAdOS.subscribe(this._onAdPaused, SpotX.DirectAdOS.Events.AD_PAUSED, this);
    this._directAdOS.subscribe(this._onBeforeAdStarted, SpotX.DirectAdOS.Events.AD_BEFORE_STARTED, this);
    this._directAdOS.subscribe(this._onAfterAdStopped, SpotX.DirectAdOS.Events.AD_AFTER_STOPPED, this);
    this._directAdOS.subscribe(this._onAdResumed, SpotX.DirectAdOS.Events.AD_RESUMED, this);
    this._directAdOS.subscribe(this._onAdError, SpotX.DirectAdOS.Events.AD_ERROR, this);

    for (var key in FullscreenInfo.Events) {
        document.addEventListener(FullscreenInfo.Events[key], this._onFullscreenChange.bind(this), false);
    }

    $(this._videoElement).on("playing", function () {
        _this._onVideoElPlaying();
    });

    $(this._videoElement).on("pause", function () {
        _this._onVideoElPaused();
    });

    this._playModel.subscribe(PlayModel.CHANGED, function () {
        _this._onPlayModelChanged();
    });
};

CustomVideoPlayer.prototype._onVideoElPlaying = function () {
    this._playModel.play(PlayModel.CONTENT);
};

CustomVideoPlayer.prototype._onVideoElPaused = function () {
    this._playModel.pause(PlayModel.CONTENT);
};

CustomVideoPlayer.prototype._onAdPaused = function () {
    this._playModel.pause(PlayModel.AD);
};

CustomVideoPlayer.prototype._onAdResumed = function () {
    this._playModel.play(PlayModel.AD);
};

CustomVideoPlayer.prototype._onBeforeAdStarted = function () {
    if (!this._adSharesVideoElement) {
        this._videoElement.pause();
    }
    this._playModel.focusOn(PlayModel.AD);
    this._playModel.play(PlayModel.AD);
};

CustomVideoPlayer.prototype._onAfterAdStopped = function () {
    if (!this._adSharesVideoElement) {
        this._videoElement.play();
    }
    this._playModel.focusOn(PlayModel.CONTENT);
};

CustomVideoPlayer.prototype._onAdError = function () {
    if (!this._adSharesVideoElement ) {
        $(this._directAdOS.slot()).hide();
    }
}

CustomVideoPlayer.prototype._enableButton = function ($button) {
    $button.addClass("enabled");
};

CustomVideoPlayer.prototype._disableButton = function ($button) {
    $button.removeClass("enabled");
};


CustomVideoPlayer.prototype.switchFullScreenMode = function () {
    if (this._fullscreenInfo.isInFullscreen) {
        if (this._fullscreenInfo.cancelFullscreenCallback) {
            this._fullscreenInfo.cancelFullscreenCallback.call(document);
        }
        else {
            this._onFullscreenChange();
        }
    } else {
        if (this._fullscreenInfo.requestFullscreenCallback) {
            this._fullscreenInfo.requestFullscreenCallback.call(this.fullScreenElement());
        }
        else {
            this._onFullscreenChange();
        }
    }
};

CustomVideoPlayer.prototype.fullScreenElement = function() {
    return this._videoPlayerElement;
}

CustomVideoPlayer.prototype._onButtonClick = function (ev) {
    this._initialUserAction();
    switch (ev.currentTarget.id) {
        case 'pause':
            this.pause();
            break;
        case 'resume':
            this.play();
            break;
        case 'fullscreen':
            this.switchFullScreenMode();
            break;
    }
    ev.stopPropagation();
    return;
};

CustomVideoPlayer.prototype._initialUserAction = function () {
    if (!this._hasInitialUserActionHappened) {
        this._hasInitialUserActionHappened = true;
        if (!this._adSharesVideoElement) {
            this._directAdOS.initialUserAction();
        }
    }
}

CustomVideoPlayer.prototype._onFullscreenChange = function () {
    if (this._fullscreenInfo.isInFullscreen) {
        this._resizeVideo('relative', 0, 0, this._videoElementWidth, this._videoElementHeight,  this._jQuery("#video-player")[0]);
        this._directAdOS.resize(this._videoElementWidth, this._videoElementHeight, SpotX.DirectAdOS.ViewModes.NORMAL);
        this._fullscreenInfo.isInFullscreen = false;
        this._buttons["fullscreen"].html("<i class='fa fa-expand'></i>");
    }
    else {
        this._resizeVideo('absolute', 0, 0, this._fullscreenInfo.width, this._fullscreenInfo.height, this._jQuery("#video-player")[0]);
        this._directAdOS.resize(this._fullscreenInfo.width, this._fullscreenInfo.height, SpotX.DirectAdOS.ViewModes.FULLSCREEN);
        this._fullscreenInfo.isInFullscreen = true;
        this._buttons["fullscreen"].html("<i class='fa fa-compress'></i>");
    }
    if (this._onFullscreenChangeCallback) {
        this._onFullscreenChangeCallback(this._fullscreenInfo.isInFullscreen);
    }
};

CustomVideoPlayer.prototype._resizeVideo = function (position, top, left, width, height, element) {
    var eVideoContainer = element || this._videoElement;
    eVideoContainer.style.position = position;
    eVideoContainer.style.top = top + 'px';
    eVideoContainer.style.left = left + 'px';
    eVideoContainer.style.width = width + 'px';
    eVideoContainer.style.height = height + 'px';
    this._videoElement.style.width = width + 'px';
    this._videoElement.style.height = height + 'px';
};

var FullscreenInfo = function(fullScreenElement) {
    this.isInFullscreen = false;
    this.requestFullscreenCallback = null;
    this.cancelFullscreenCallback = null;
    this._detectFullscreenProperties(fullScreenElement);
}


FullscreenInfo.prototype._detectFullscreenProperties = function (fullScreenElement) {
    this.requestFullscreenCallback = fullScreenElement.requestFullscreen ||
        fullScreenElement.webkitRequestFullscreen ||
        fullScreenElement.mozRequestFullscreen ||
        fullScreenElement.requestFullScreen ||
        fullScreenElement.webkitRequestFullScreen ||
        fullScreenElement.mozRequestFullScreen;
    if (this.requestFullscreenCallback) {
        this.width = window.screen.width;
        this.height = window.screen.height;
    }
    else {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    this.cancelFullscreenCallback = document.exitFullscreen ||
        document.exitFullScreen ||
        document.webkitCancelFullScreen ||
        document.mozCancelFullScreen;

};

FullscreenInfo.Events = ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange'];


var PlayModel = function (jQuery) {
    this.isPlaying = false;
    this.focusedOn = PlayModel.CONTENT;
    this._callbacks = {};
    this._callbacks[PlayModel.CHANGED] = jQuery.Callbacks();
}

PlayModel.prototype.play = function (what) {
    if (what != this.focusedOn) {
        return;
    }
    var bIsPlaying = this.isPlaying;
    this.isPlaying = true;

    if (bIsPlaying != this.isPlaying) {
        this._callbacks[PlayModel.CHANGED].fire();
    }
};

PlayModel.prototype.pause = function (what) {
    if (what != this.focusedOn) {
        return;
    }
    var bIsPlaying = this.isPlaying;
    this.isPlaying = false;
    if (bIsPlaying != this.isPlaying) {
        this._callbacks[PlayModel.CHANGED].fire();
    }
};

PlayModel.prototype.focusOn = function (what) {
    this.focusedOn = what;
};

PlayModel.prototype.subscribe = function(topic, callback) {
    if (this._callbacks[topic]) {
        this._callbacks[topic].add(callback);
    }
}

PlayModel.CHANGED = "CHANGED";
PlayModel.AD = "AD";
PlayModel.CONTENT = "CONTENT";
