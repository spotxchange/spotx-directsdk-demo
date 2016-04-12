# SpotX Direct AdOS SDK

 Monetize your website video content by extending your video player with an ad-experience.

# When You Should Use the Direct AdOS SDK

 - You want to use SpotX as your primary ad source
 - The video player you use knows nothing about VAST or VPAID
 - You want to keep the same user playback experience, but extend it with ads
 - You want to benefit from the VAST and VPAID industry standards, but you do not want to learn them

## Prerequisites

* A SpotX Publisher Account
 * [Apply to become a SpotX Publisher](http://www.spotxchange.com/publishers/apply-to-become-a-spotx-publisher/)


## Using the Direct AdOS SDK

  There are two major integration scenarios:

  1. You have a video player that integrates with the Direct AdOS SDK. You will only need a few lines of JavaScript
  to initialize the Direct AdOS SDK with a channel id and some other parameters.

  2. If you have a video player that does not integrate with the Direct AdOS SDK then there is a bit of extra work
  needed. You will have to write some code to handle the video player's events. The code will need to manage ad
  playback and its associated events in order to update the video player's states. Fortunately this is easy thanks
  to our simple API.




### Simplest integration scenario
1. Create files `index.html`, `styles.css`:

  **index.html**:
  ```
  <html>
  <head>
      <title>DirectSDK Demo: Playing Pre-Roll Ad in HTML5 &lt;video&gt; element</title>
      <link rel="stylesheet" type="text/css" href="styles.css">
  </head>
  <body>
  <h3>Playing Pre-Roll Ad in HTML5 &lt;video&gt; element</h3>
  <div id="video-container">
      <div id='video-content'>
          <video controls id="video-player">
              <source src="https://archive.org/0/items/Wildlife_20160113/Wildlife.mp4" type="video/mp4">
              <source src="https://archive.org/0/items/Wildlife_20160113/Wildlife.ogv" type="video/ogg">
              Your browser doesn't support HTML5 video tag.
          </video>
      </div>
  </div>

  <script type="text/javascript" src="http://js.spotx.tv/directsdk/v1/85394.js"></script>
  <script type="text/javascript">
      var adContainer = document.getElementById('video-content');
      var directAdOS = new SpotX.DirectAdOS({
                  channel_id: 85394,
                  slot: adContainer,
                  video_slot: document.getElementById('video-player'),
                  hide_skin: false,
                  autoplay: true
              });
      directAdOS.loadAd();
  </script>
  </body>
  </html>
  ```

  **styles.css**:
  ```
  body {
      margin: 0;
      padding: 0;
  }

  h3 {
      margin-left: 20px;
      margin-top: 20px;
  }

  #video-container {
      position: relative;
      width: 416px;
      height: 240px;
      display: inline-block;
      margin-top: 20px;
      margin-left: 20px;
  }

  #video-player {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 416px;
      height: 240px;
  }

  #video-content, #video-player video {
      width: 416px;
      height: 240px;
  }
  ```

2. Install and launch http server at the same directory:

     ```bash
     npm install http-server -g
     http-server .
     ```

3. Visit URL `http://localhost:8080/index.html` in the browser.
  You should see ad playing followed by main video content


### Integrating with custom video player

  We recommend that you check these two examples:

  - [Playing ad in the same playback element the player uses](https://github.com/spotxchange/spotx-directsdk-demo/tree/master/custom_player_single_video_stream)

  - [Playing ad in the separate playback element the player uses](https://github.com/spotxchange/spotx-directsdk-demo/tree/master/custom_player_two_video_streams)

  The first one is a bit easier to implement since the Direct AdOS SDK takes care of stopping main video playback and
  resuming it after it finishes playing the ad. It also handles switching to full screen mode and back.

  The second one uses two video playback elements and you are responsible for properly updating their states, i.e. you
  have to stop one when the other is about to begin playing, and make sure that both go to full-screen when prompted,
   etc. One advantage with this method is that you could modify it to play mid-roll or post-roll ads.
