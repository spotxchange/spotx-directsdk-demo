
describe('Custom Player with Single Stream', function () {
    var URL = '/custom_player_single_video_stream/index.html'

    it('starts playing an Ad on loading [single stream]', function () {
        return browser
            .url(URL)
            .waitForExist("#pause.enabled")
            .getAttribute("video", "currentSrc").then(function (currentSrc) {
                expect(currentSrc).not.toMatch(/Wildlife/);
                expect(currentSrc).toMatch(/http/);
            })
            .getAttribute("video", "paused").then(function(paused){
                expect(paused).toBeFalsy();
            })
            ;
    });

    it('pauses and resumes video [single stream]', function () {
        return browser
            .url(URL)
            .waitForExist("#pause.enabled").then(function () {
                return browser.getAttribute("video", "paused");
            }).then( function(paused){
                expect(paused).toBeFalsy();
                return browser.click("#pause");
            })
            .waitForExist("#resume.enabled").then(function(){
                return browser.pause(1000).getAttribute("video", "paused");
            }).then( function(paused){
                // video paused
                expect(paused).toBeTruthy();
                return browser.getAttribute("#pause", "class")
            }).then( function(pauseClass){
                // pause button disabled
                expect(pauseClass).toEqual("");
            })
    });

    it('switches to fullscreen [single stream]', function () {
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
            .waitForExist("#fullscreen.enabled", 3000).then(function () {
                return browser.pause(1000).click("#fullscreen").pause(3000).getElementSize("#video-player");
            }).then( function(size) {
                expect(size).toEqual({width: screenWidth, height: screenHeight});
            })
            .getLocation("#video-player").then( function(location) {
                expect(location).toEqual({x: 0, y:0})
            })
            .getAttribute("iframe", "id").then(function (iframe_id) {
                return browser.frame(iframe_id);
            })
            // FIXME
            //.waitForVisible(".control.exit").then( function(){
            //    console.log("exit full screen is visible");
            //})
            ;
    });
});
