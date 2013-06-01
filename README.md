YPlaylist
=================

Youtube Playlist with jQuery

##Usage

1. Paste right before your page's closing `</body>` tag
```html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
<script type="text/javascript" src="js/lib.js"></script>
```

2. From within a script tag or a JS file
```javascript
YPlaylist.init({
    playlist: 'PLI9_ofA6tjoHDiiPndP_P5EMbOOT0-DmD', // The ID of your Youtube Playlist
    container: $('#container'),                     // domNode to attach to
    secure: true                                    // auto, true or false. If true all URLs starting with HTTPS
});
```

Change the HTML as it deems necessary.