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

### Key-value pairs, Reporting, and Targeting

  Passing key-value pairs into the Direct AdOS SDK is easy; simply pass an options object into the constructor when initializing
  an instance of the DirectAdOS.
  ```
  <script>
    var directAdOS = new SpotX.DirectAdOS({
              key1: val1,
              keyn: valn
      });
  <script>
  ```

  The options parameter can have many properties. For key-value pairs we will focus on two in particular: content_id and custom.

  -  content_id (String):  This is used when passing a single key-value pair. Using the form "content_id=VALUE" you can pass any list of values in this parameter, which the DirectAdOS will then pass into the ad request. Values may be unique IDs, strings of letters and numbers, names, etc.

  Example use of content_id

  ```
  <script>
      var directAdOS = new SpotX.DirectAdOS({
                  channel_id: 85394,
                  slot: adContainer,
                  video_slot: document.getElementById('video-player'),
                  hide_skin: false,
                  autoplay: true,
                  content_id: "9876543210"
              });
  </script>
  ```

  In addition to the content_id parameter, you can pass the following other parameters and values for key-value pair reporting. This is accomplished by setting a custom object property into the options object.

  Example

  ```
  <script>
      var directAdOS = new SpotX.DirectAdOS({
                  channel_id: 85394,
                  slot: adContainer,
                  video_slot: document.getElementById('video-player'),
                  hide_skin: false,
                  autoplay: true,
                  content_id: "9876543210",
                  custom: {
                        wgt: 9,
                        plt: 18,
                        fp: 1,
                        category: "sports",
                        cid: "SpotX",
                        vid: "TEST",
                        ptr: 1,
                        dpid: 1234567890
                      }
              });
  </script>
  ```

  The following is an incomplete list of properties that can be put on the custom object. These are the default SpotX key-value pairs,
  but publishers may add their own custom key-value pairs on request.

  ##### Launcher Type (wgt)
  ###### type : NUMERIC VALUE


  NUMERIC VALUES include:

    0: UI
    1: AP
    8: Hz Launcher
    9: RMM ad, Sound On Slider
    10: Sound On 590
    13: RMM ad, Sound On Inline 300
    14: RMM ad, Sound On Inline 590

  ##### Player Type (plt)
  ###### type: NUMERIC VALUE

  NUMERIC VALUES include:

    2: 16x9 Full Player
    4: Inline 300
    5: Single
    11: Inline 590
    16: Studio Player
    17: 300x250 Slider
    18: 300x250 Playlist Slider
    19: Horizontal
    20: Vertical

  ##### Fold Position (fp)
  ###### type: NUMERIC VALUE

  NUMERIC VALUES include:

    0: iFrame Code
    1: Above the fold
    2: Below the fold
    3: Scroll to above the fold

  ##### Content Category (category)
  ###### type: STRING VALUE

  STRING VALUES include:

    sports
    news
    health
    travel
    lifestyle
    technology
    politics
    weather
    entertainment
    business

  in the event of multiple values for one key, please use an array:

  ```
  <script>
    var custom = {
      category: [
        'sports',
        'entertainment',
        'news'
      ]
    };
  </script>
  ```

  ##### Content Provider (cid)
  ###### type: VALUE
  VALUE can be any URL-encoded value

  ##### Video ID (vid)
  ###### type: VALUE
  VALUE can be any URL-encoded value

  ##### Premium Targeted Reach (ptr)
  ###### type: VALUE
  VALUES include:

    0: PTR not enabled
    1: PTR enabled

  ##### Distribution Provider (dpid)
  ###### type: VALUE
  VALUE can be any URL-encoded value

  ### Creating Key-Value Reports
  Once you start passing in key-value pairs, contact your Account Manager to schedule automatic delivery of reports.
  * Reports can be broken out at the Channel or Campaign level
  * In addition to the key-value pairs, all reports include the following data: impressions, clicks,
net revenue, gross revenue, CTR, net eCPM and gross eCPM
* Reports can be delivered daily, weekly or monthly on specific days
* Any emails or distribution lists can be added to receive the reports
* Reports are sent out via email with an attached CSV file

### Targeting on Key-Value Pairs
In addition to reporting based on key-value pairs, you can target campaigns based on the same key-value pairs. To enable targeting based on your key-value pairs in the Publisher Platform, submit a production support request ticket. As with key-value pair reporting, you will need to provide a spreadsheet with the parameter, display name and values.

After the production support ticket is complete, you can start passing your key-value pairs in the ad request. To see the key-value pairs as targeting options, select “Source” then “Publisher Name” when creating a new Campaign.

### Sending Custom Spotmarket Parameters
Sometimes, a publish will want to override certain spotmarket parameters at syndication time. For example, if a channel has a price floor set to $50.00, a publisher may want to change that to $75.00 for a certain syndication request. This is easily accomplished by passing an object called ados into the DirectAdOS options. For example:
```
<script>
var directAdOS = new SpotX.DirectAdOS({
                  channel_id: 85394,
                  slot: adContainer,
                  video_slot: document.getElementById('video-player'),
                  hide_skin: false,
                  autoplay: true,
                  content_id: "9876543210",
                  custom: customOptions,
                  ados: {
                    query_params: "price_floor=75"
                  }
              });
</script>
```

This will set the price_floor to $75.00 for this syndication request. Note the use of the query_params property in the ados object. This is what is used to specify all additional query parameters for the syndication request. To set multiple parameters, delineate each one with an ampersand.

```
<script>
  ados: {
    query_params: "price_floor=75&vpi=mp4"
  }
</script>
```

The following is a list of parameters that can be passed as query_params.

##### Price Floor (price_floor)
###### Type: Number greater than 0
This parameter can be passed in a request (in USD) to override the current channel price floor in real time.

##### Audience Id (spotx_uid)
###### Type: Any valid format of audience id
Audience Id is used to pass AMP audience ids directly into the syndication request.

##### Video Player Interface (vpi)
###### Type: (string) mp4, flv, wmv, vpaid, vpaid_js, webm
The VPI parameter allows the publisher to specify which specific types of media they are able to play. 

##### Publisher DSP UID (pub_dsp_uid)
###### Type: (any)
This parameter is intended to allow publishers operating in cookieless environments to provide a user ID that will be sent to DSPs for frequency capping

##### Media Transcoding (media_transcoding)
###### Type: (string)  low, medium, high
The media transcoding parameter allows a publisher to reduce the ads returned from an auction to only the requested quality. The quality can be low, medium, or high, and a publisher can request any combination of those values (e.g., you may request only low and medium transcoding qualities).

### VPAID Events

  The Direct AdOS support and publishes the following VPAID events and thus they are available to the publisher:

  - AdLoaded
  - AdStarted
  - AdStopped
  - AdSkipped
  - AdSizeChange
  - AdRemainingTimeChange
  - AdVolumeChange
  - AdVideoStart
  - AdVideoFirstQuartile
  - AdVideoMidpoint
  - AdVideoThirdQuartile
  - AdVideoComplete
  - AdClickThru
  - AdUserMinimize
  - AdUserClose
  - AdPaused
  - AdPlaying
  - AdError

  We have provided an easy way of subscribing to all of the above events using our eachVPAIDEvent function as
  implemented in our sample ados_logger.js helper file:
  ```js
    directAdOS.eachVPAIDEvent(function (eventName) {
        console.log("Publisher :: Requesting Event Subscription: " + eventName);
        directAdOS.subscribe(this._onDirectAdOSEvent.bind(this, eventName), eventName);
    }, this);
  ```
