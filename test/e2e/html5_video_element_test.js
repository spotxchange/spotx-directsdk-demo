describe('HTML5 <video>', function () {
    var URL = '/html5_video_element/index.html'
    it('starts playing ad [html5]', function () {
        return browser
            .url(URL)
            .getAttribute("video", "currentSrc").then(function (currentSrc) {
                expect(currentSrc).toMatch(/Wildlife/);
            })
            .getAttribute("iframe", "id").then(function (iframe_id) {
                return browser.frame(iframe_id);
            })
            .frame(null) //switch back to top level document
            .pause(4000)
            .getAttribute("video", "currentSrc").then(function (currentSrc) {
                expect(currentSrc).not.toMatch(/Wildlife/);
            });
    });
});


