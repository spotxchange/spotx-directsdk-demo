describe('Custom Player with Two Streams', function () {
    var URL = '/custom_player_two_video_streams/index.html'

    it('starts playing video in ad slot in 5 seconds and pauses player [two streams]', function () {
        return browser
            .url(URL)
            .waitForExist("#pause.enabled")
            .getAttribute("#video-player video", "currentSrc").then(function (currentSrc) {
                expect(currentSrc).toMatch(/Wildlife/);
            })
            .getAttribute("#ad-slot video", "currentSrc").then(function (currentSrc) {
                expect(currentSrc).toBeFalsy()
            })
            .pause(7000)
            .getAttribute("#video-player video", "currentSrc").then(function (currentSrc) {
                expect(currentSrc).toMatch(/Wildlife/);
            })
            .getAttribute("#video-player video", "paused").then(function (paused) {
                expect(paused).toBeTruthy();
            })
            .getAttribute("#ad-slot video", "currentSrc").then(function (currentSrc) {
                expect(currentSrc).toMatch(/http/)
            })
            .getAttribute("#ad-slot video", "paused").then(function (paused) {
                expect(paused).toBeFalsy();
            })
    });

    it('pauses and resumes video [two streams]', function () {
        return browser
            .url(URL)
            .waitForExist("#pause.enabled")
            .click("#pause")
            .waitForEnabled("#resume")
            .getAttribute("#content-video", "paused").then(function (paused) {
                //video player has been paused
                expect(paused).toBeTruthy();
            })
            .click("#resume")
            .waitForExist("#pause.enabled")
            .getAttribute("#content-video", "paused").then(function(paused){
                // video player has been resumed
                expect(paused).toBeFalsy();
            })
            .pause(10000)
            .getAttribute("#content-video", "paused").then(function(paused){
                // video player has been paused
                expect(paused).toBeTruthy();
            })
            .getAttribute("#ad-slot video", "paused").then(function(paused){
                // ad video is playing
                expect(paused).toBeFalsy();
            })
            .click("#pause")
            .waitForEnabled("#resume")
            .getAttribute("#content-video", "paused").then(function(paused){
                // video player has been paused
                expect(paused).toBeTruthy();
            })
            .getAttribute("#ad-slot video", "paused").then(function(paused){
                // ad video is paused too
                expect(paused).toBeTruthy();
            })
    });

    it('switches to fullscreen [two streams]', function () {
        var screenWidth = null;
        var screenHeight = null;

        return browser
            .url(URL)
            .execute("return window.screen.width").then(function(width){
                screenWidth = width.value;
            })
            .execute("return window.screen.height").then(function(height){
                screenHeight = height.value;
            })
            .waitForEnabled("#fullscreen").then(function () {
                return browser.click("#fullscreen").pause(1000).getElementSize("#video-player");
            }).then( function(size) {
                expect(size).toEqual({width: screenWidth, height: screenHeight});
            })
            .getLocation("#video-player").then( function(location) {
                expect(location).toEqual({x: 0, y:0})
            })
    });

});
