const YPlaylist = {
    init(config) {
        this.url       = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${config.playlist}&key=${config.apiKey}&callback=?`;
        this.container = config.container;
        this.shuffle   = config.shuffle;
        this.fetch();
    },
    fetch() {
        const self        = this;
        const placeholder = $('<div class="placeholder"></div>');
        const carousel    = $('<div class="carousel-container"><span class="prev controll"></span><div class="carousel-inner"><ul class="slider"></ul></div><span class="next controll"></span></div>');

        $.getJSON(self.url, data => {
            let list    = "";
            let res     = {};
            const entries = data.items;
            let i;
            let len;

            if (self.shuffle) {
                entries.sort(() => 0.5 - Math.random());
            }

            $(self.container).append(placeholder);
            $(placeholder).html(() => {
                const mainVideo = entries[0].snippet.resourceId.videoId;
                return `<iframe width="820" height="380" src="https://www.youtube.com/embed/${mainVideo}" frameborder="0" allowfullscreen></iframe><h2>${entries[0].snippet.title}</h2>`;
            });

            for (i = 0, len = entries.length; i < len; i += 1) {
                res = {
                    title: entries[i].snippet.title,
                    url: entries[i].snippet.resourceId.videoId,
                    thumb: entries[i].snippet.thumbnails.medium.url,
                    desc: entries[i].snippet.description
                };

                list += `<li><a href="https://www.youtube.com/watch?v=${res.url}" title="${res.title}"><img alt="${res.title}" src="${res.thumb}">`;
                list += '<span class="shadow"></span></a>';
                list += `<h2>${res.title}</h2>`;
                list += '<span class="spacer"></span>';
                list += `<p>${self.truncate(res.desc, 90)}</p>`;
                list += '</li>';
            }

            $(self.container).append(carousel);
            $(list).appendTo('.slider');
            $('.slider').find('li:first').addClass('current');

            self.carousel();
            self.view($('.slider li'));
        });
    },
    truncate(text, limit) {
        let last;
        if (text.length > limit) {
            limit--;
            last = text.substr(limit - 1, 1);
            while (last !== ' ' && limit > 0) {
                limit--;
                last = text.substr(limit - 1, 1);
            }
            last = text.substr(limit - 2, 1);
            if (last === ',' || last === ';'  || last === ':') {
                text = `${text.substr(0, limit - 2)}...`;
            } else if (last === '.' || last === '?' || last === '!') {
                text = text.substr(0, limit - 1);
            } else {
                text = `${text.substr(0, limit - 1)}...`;
            }
        }
        return text;
    },
    getId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            return match[2];
        } else {
            throw new Error("Invalid video URL");
        }
    },
    view(el) {
        const self = this;
        el.click(function (e) {
            e.preventDefault();
            const url   = $(this).find('a').attr('href');
            const title = $(this).find('h2').text();

            if ($(this).hasClass('current')) {
                return;
            }

            $('.slider li').removeClass('current');
            $(this).addClass('current');
            $('.placeholder iframe').attr({"src" : `https://www.youtube.com/embed/${self.getId(url)}?autoplay=1`});
            $('.placeholder h2').html(title);
            $('html, body').animate({
                scrollTop: $(".placeholder").offset().top
            }, 1000);
        });
    },
    carousel() {
        const slider      = $('.slider');
        const itemWidth   = $('.slider li').outerWidth(true);
        let left_indent = 0;

        $('.slider li:first').before($('.slider li:last'));

        $(document.body).on('click', '.carousel-container .controll', function () {
            if ($(this).hasClass('next')) {
                left_indent = parseInt(slider.css('left'), 10) - itemWidth;
                $('.slider:not(:animated)').animate({'left' : left_indent}, 500, () => {
                    $('.slider li:last').after($('.slider li:first'));
                    $('.slider').css({'left' : `-${itemWidth}px`});
                });
            } else {
                left_indent = parseInt(slider.css('left'), 10) + itemWidth;
                $('.slider:not(:animated)').animate({'left' : left_indent}, 500, () => {
                    $('.slider li:first').before($('.slider li:last'));
                    $('.slider').css({'left' : `-${itemWidth}px`});
                });
            }
        });
    }
};
