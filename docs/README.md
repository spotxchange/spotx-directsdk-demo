# SpotX Direct AdOS SDK

 Monetize your website video content by extending your video player with an ad-experience.

***

# When You Should Use the Direct AdOS SDK

 - You want to use SpotX as your primary ad source
 - The video player you use knows nothing about VAST or VPAID
 - You want to keep the same user playback experience, but extend it with ads
 - You want to benefit from the VAST and VPAID industry standards, but you do not want to learn them

## Prerequisites

* A SpotX Publisher Account
 * [Apply to become a SpotX Publisher](http://www.spotxchange.com/publishers/apply-to-become-a-spotx-publisher/)


## Usage

  There are two major integration scenarios:

  1. You have a video player that integrates with the Direct AdOS SDK. You will only need a few lines of JavaScript
  to initialize the Direct AdOS SDK with a channel id and some other parameters.

  2. If you have a video player that does not integrate with the Direct AdOS SDK then there is a bit of extra work
  needed. You will have to write some code to handle the video player's events. The code will need to manage ad
  playback and its associated events in order to update the video player's states. Fortunately this is easy thanks
  to our simple API.


***

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

***

### Integrating with custom video player

  We recommend that you check these two examples:

  - [Playing ad in the same playback element the player uses](https://github.com/spotxchange/spotx-directsdk-demo/tree/master/custom_player_single_video_stream)

  - [Playing ad in the separate playback element the player uses](https://github.com/spotxchange/spotx-directsdk-demo/tree/master/custom_player_two_video_streams)

  The first one is a bit easier to implement since the Direct AdOS SDK takes care of stopping main video playback and
  resuming it after it finishes playing the ad. It also handles switching to full screen mode and back.

  The second one uses two video playback elements and you are responsible for properly updating their states, i.e. you
  have to stop one when the other is about to begin playing, and make sure that both go to full-screen when prompted,
   etc. One advantage with this method is that you could modify it to play mid-roll or post-roll ads.

***

### Key-value pairs

Key-value pairs can be passed to the Direct AdOS SDK in an options object when creating a new instance of `SpotX.DirectAdOS`
  
```
var directAdOS = new SpotX.DirectAdOS({
	key1: val1,
	keyn: valn
});
```

The options parameter can have many properties. For key-value pairs we will focus on two in particular: **content_id** and **custom**.

`content_id` *(String)*:  This is used when passing a single key-value pair. Using the form "content_id=VALUE" you can pass any list of values in this parameter, which the DirectAdOS will then pass into the ad request. Values may be unique IDs, strings of letters and numbers, names, etc.

Example use of `content_id`

```
var directAdOS = new SpotX.DirectAdOS({
	channel_id: 85394,
	// ...
	content_id: "9876543210"
});
```

In addition to the content_id parameter, you can pass the following other parameters and values for key-value pair reporting. This is accomplished by setting a custom object property into the options object.

```
var directAdOS = new SpotX.DirectAdOS({
	channel_id: 85394,
	// ...
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
```

To pass multiple keys, such as `custom[category]`, an array should be used:


```
var directAdOS = new SpotX.DirectAdOS({
	channel_id: 85394,
	// ...
	content_id: "9876543210",
	custom: {
		wgt: 9,
		// ...
		category: [
			'sports',
			'entertainment',
			'news'
		]
	}
});
```

The following is an incomplete list of properties that can be put on the custom object. These are the default SpotX key-value pairs, but publishers may add their own custom key-value pairs on request.

| Attribute              | Type   | Property Name | Description |
|------------------------|--------|---------------|-------------|
| Launcher Type          | Number | wgt           | custom[wgt] = number <br> number can be: <br> 0: UI <br> 1: AP <br> 8: Hz Launcher <br> 9: RMM ad, Sound On Slider <br> 10: Sound On 590 <br> 13: RMM ad, Sound On Inline 300 14: RMM ad, Sound On Inline 590 |
| Player Type            | Number | plt           | custom[plt] = number <br> number can be: <br> 2: 16x9 Full Player <br> 4: Inline 300 <br> 5: Single <br> 11: Inline 590 <br> 16: Studio Player <br> 17: 300x250 Slider <br> 18: 300x250 Playlist Slider <br> 19: Horizontal <br> 20: Vertical |
| Fold Position          | Number | fp            | custom[fp] = number <br> number can be: <br> 0: iFrame Code <br> 1: Above the fold <br> 2: Below the fold <br> 3: Scroll to above the fold |
| Content Category       | String | category      | custom[category] = string <br> string can be: <br> sports <br> news <br> health <br> travel <br> lifestyle <br> technology <br> politics <br> weather <br> entertainment <br> business |
| Content Provider       | any    | cid           | custom[cid] = value <br> value can be: <br> any URL-encoded value |
| Video ID               | any    | vid           | custom[vid] = value <br> value can be: <br> any URL-encoded value |
| Premium Targeted Reach | number | ptr           | custom[ptr] = value <br> value can be: <br> 0: PTR not enabled <br> 1: PTR enabled |
| Distribution Provider  | any    | dpid          | custom[dpid] = value <br> value can be: <br> any URL-encoded value |

***

### Sending Query Parameters to SpotMarket
Query Parameters can be passed to Spotmarket by including `ados["query_params"]` in the the DirectAdOS options.
`ados["query_params"]` should contain a string that represents the query string being appended to the SpotMarket request.

```
var directAdOS = new SpotX.DirectAdOS({
	channel_id: 85394,
	// ...
	ados: {
		query_params: "price_floor=75"
	}
});
```

**To set multiple parameters in the query string, delineate each one with an ampersand.**

```
var directAdOS = new SpotX.DirectAdOS({
	channel_id: 85394,
	// ...
	ados: {
		query_params: "price_floor=75&vpi=mp4"
	}
});
```

**To set parameters that require an array-like representation (such as `media_transcoding`), append an empty set of square brackets to the key.**

```
var directAdOS = new SpotX.DirectAdOS({
	channel_id: 85394,
	// ...
	ados: {
		query_params: "media_transcoding[]=medium
	}
});
```

The following is a list of parameters that can be passed as query_params.

| Attribute              | Type             | Property Name     | Description                                                                                                                                                                                                                                                                                          |
|------------------------|------------------|-------------------|-------------|
| Price Floor | Positive Integer | price_floor | This parameter can be passed in a request (in USD) to set the current channel price floor in real time                                                                                                                                                                                               |
| Audience ID | String | spotx_uid | Audience Id is used to pass AMP audience ids directly into the syndication request.                                                                                                                                                                                                                  |
| Video Player Interface | String | vpi | The VPI parameter allows the publisher to specify which specific types of media they are able to play. Possible values: `mp4`, `flv`, `wmv`, `vpaid`, `vpaid_js`, `webm`                                                                                                                                        |
| Publisher DSP UID | Any | pub\_dsp_uid | This parameter is intended to allow publishers operating in cookieless environments to provide a user ID that will be sent to DSPs for frequency capping                                                                                                                                             |
| Media Transcoding | String | media_transcoding[] | The media transcoding parameter allows a publisher to reduce the ads returned from an auction to only the requested quality. The quality can be low, medium, or high, and a publisher can request any combination of those values (e.g., you may request only low and medium transcoding qualities).
| Max Duration | Positive Integer | VMaxd | This parameter can be passed in a request (in seconds) to override the current channel's max duration value
| Mobile - App Information | String | app[] | The app parameter allows a mobile application to identify itself or provide other information about the app. Possible values: `bundle`, `cat`, `domain`, `id`, `name`, `privacypolicy`, `storeurl`, `store_foreign_app_id`, `ver`
| Mobile - Device Information | String | device[] | The app parameter allows a mobile application to provide information about the device

***

### Custom Pass-Through Macros

Custom Pass-Through Macros can be passed to SpotMarket by including an object named ​token​ in the DirectAdOS options. Each item in the ​token​ object represents a custom pass through macro.


```
var directAdOS = new SpotX.DirectAdOS({
	channel_id: 85394,
	// ...
	token: {
		"video_title": "EXAMPLE_VIDEO_TITLE",
		"video_description": "EXAMPLE_VIDEO_DESCRIPTION"
	}
});
```

***

### Subscribing to VPAID Events

The Direct AdOS SDK will publish several VPAID events. To attach a callback function to one of these events, call the `subscribe` method.

```
directAdOS.subscribe(function() { 
    console.log("AdPaused detected!");
}, "AdPaused");
```

| Supported VPAID Events|
|-----------------------|
| AdLoaded              |
| AdStarted             |
| AdStopped             |
| AdSkipped             |
| AdVideoStart          |
| AdVideoFirstQuartile  |
| AdVideoMidpoint       |
| AdVideoThirdQuartile  |
| AdVideoComplete       |
| AdClickThru           |
| AdUserMinimize        |
| AdUserClose           |
| AdPaused              |
| AdPlaying             |
| AdError               |
| AdSizeChange          |
| AdRemainingTimeChange |
| AdVolumeChange        |

