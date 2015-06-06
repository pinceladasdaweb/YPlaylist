YPlaylist
=================

Youtube Playlist with jQuery

##Usage

1. Paste right before your page's closing `</body>` tag
```html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<script type="text/javascript" src="js/lib.min.js"></script>
```

2. From within a script tag or a JS file
```javascript
YPlaylist.init({
    playlist: 'PLQCmSnNFVYnTD5p2fR4EXmtlR6jQJMbPb', // The ID of your Youtube Playlist
    apiKey: 'Your APY KEY here',                    // Your API KEY
    container: $('#container'),                     // domNode to attach to
    shuffle: false                                  // If true, Shuffle the playlist, default false
});
```

Here's how to get your API KEY: [https://developers.google.com/youtube/v3/getting-started](https://developers.google.com/youtube/v3/getting-started).

Change the HTML as it deems necessary.
