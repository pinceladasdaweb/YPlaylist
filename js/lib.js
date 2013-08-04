var YPlaylist = {
    init: function(config) {
        this.protocol = (config.secure === 'auto') ? window.location.protocol === 'https:' ? 'https://' : 'http://' : config.secure ? 'https://' : 'http://';
        this.url = this.protocol +'gdata.youtube.com/feeds/api/playlists/'+config.playlist+'?v=2&max-results=50&alt=json&callback=?',
        this.container = config.container;
        this.secure = config.secure;
        this.shuffle = config.shuffle; 
        this.fetch();
    },
    fetch: function() {
        var self = this,
            placeholder = $('<div class="placeholder"></div>'),
            carousel = $('<div class="carousel-container"><span class="prev controll"></span><div class="carousel-inner"><ul class="slider"></ul></div><span class="next controll"></span></div>');
        
        $.getJSON(self.url, function(data) {
            var list = "",
                feed = data.feed,
                entries = feed.entry || [];
                if(self.shuffle){
                    entries.sort(function() {
                        return 0.5 - Math.random()
                    });
                }

            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i],
                    title = entry.title.$t,
                    url = entry.link[0].href,
                    thumb = entry.media$group.media$thumbnail[1].url,
                    desc = entry.media$group.media$description.$t;

                if(i == 0){
                    $(self.container).append(placeholder);
                    $(placeholder).html(function(){
                        var mainVideo = self.getId(url);
                        return '<iframe width="820" height="380" src="'+self.protocol+'www.youtube.com/embed/'+mainVideo+'" frameborder="0" allowfullscreen></iframe><h2>'+ title +'</h2>';
                    });
                }

                list += '<li><a href="'+ url +'" title="'+ title +'"><img alt="'+ title+'" src="'+ thumb +'">';
                list += '<span class="shadow"></span></a>';
                list += '<h2>'+ title +'</h2>';
                list += '<span class="spacer"></span>';
                list += '<p>'+ self.truncate(desc, 90); +'</p>';
                list += '</li>';
            }
            $(self.container).append(carousel);
            $(list).appendTo('.slider');
            $('.slider').find('li:first').addClass('current');

            self.carousel();
            self.view($('.slider li'));
        });
    },
    truncate: function(text, limit) {
        if(text.length > limit){
            limit --;
            last = text.substr(limit-1,1);
            while(last != ' ' && limit > 0){
                limit--;
                last = text.substr(limit-1,1);
            }
            last = text.substr(limit - 2,1);
            if(last == ',' || last == ';'  || last == ':'){
                text = text.substr(0, limit - 2) + '...';
            } else if(last == '.' || last == '?' || last == '!'){
                text = text.substr(0, limit - 1);
            } else {
                text = text.substr(0, limit - 1) + '...';
            }
        }
        return text;
    },
    getId: function(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
            match = url.match(regExp);
        
        if (match && match[2].length == 11){
            return match[2];
        } else {
            throw new Error("Invalid video URL");
        }
    },
    view: function(el) {
        var self = this;
        el.click(function(e){
            e.preventDefault();
            var url = $(this).find('a').attr('href'),
                title = $(this).find('h2').text();

            if($(this).hasClass('current')){
                return
            }
            
            $('.slider li').removeClass('current');
            $(this).addClass('current');
            $('.placeholder iframe').attr({"src" : self.protocol+"www.youtube.com/embed/"+self.getId(url)+"?autoplay=1"});
            $('.placeholder h2').html(title);
            $('html, body').animate({
                scrollTop: $(".placeholder").offset().top
            }, 1000);
        });
    },
    carousel: function() {
        var itemWidth = $('.slider li').outerWidth(true);

        $('.slider li:first').before($('.slider li:last'));
        
        $(document.body).on('click', '.carousel-container .controll', function() {
            if($this.hasClass('next')){
                var left_indent = parseInt(slider.css('left')) - itemWidth;
                $('.slider:not(:animated)').animate({'left' : left_indent}, 500, function() {
                    $('.slider li:last').after($('.slider li:first'));
                    $('.slider').css({'left' : '-'+itemWidth+'px'});
                });
            } else {
                var left_indent = parseInt(slider.css('left')) + itemWidth;
                $('.slider:not(:animated)').animate({'left' : left_indent}, 500, function() {
                    $('.slider li:first').before($('.slider li:last'));
                    $('.slider').css({'left' : '-'+itemWidth+'px'});
                });
            }
        });
    }
}