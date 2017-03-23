(function($) {
    $(function() {
        // Slider

        function Slider(opts) {
            this._init(opts);
            this._timer;
            this._index = 0;
        }

        $.extend(Slider.prototype, {
            _init: function(opts) {
                var self = this;
                self.opts = {
                    sliderBoxSelector          : 'slider',            //幻灯片容器选择器
                    sliderListSelector         : 'slider-list',       //幻灯片子项父元素选择器
                    sliderItemSelector         : 'slider-item',       //幻灯片子项选择器
                    sliderIndicatorSelector    : 'slider-indicator',  //幻灯片控制器选择器
                    isAutoTab                  : true                 //是否自动切换幻灯片
                };

                $.extend(true, self.opts, opts || {});
                this._initDom();
                this._renderUI();
                this._bindEvent();
                this.opts.isAutoTab && this._autoTab();
            },

            _initDom: function() {
                var opts = this.opts;
                this.$sliderBox       = $('.' + opts.sliderBoxSelector);
                this.$sliderList      = $('.' + opts.sliderListSelector);
                this.$sliderIndicator = $('.' + opts.sliderIndicatorSelector);
            },

            _renderUI: function() {
                var self = this;
                var data = this.opts.data;

                var ul = $('<ul>')

                $.each(data, function(index, item) {
                    self.$sliderList.append(
                        $(
                            '<li class="'+self.opts.sliderItemSelector+'" style="background: url('+item.src+') no-repeat center center">' +
                                '<a href="productlist.html" target="_blank">' +

                                '</a>' +
                            '</li>'
                        )
                    );

                    ul.append(
                        '<li>'+
                            index
                        +'</li>'
                    )
                })

                this.$sliderIndicator.append(ul);

                this.$sliderItem = this.$sliderBox.find('.slider-item');
                this.$indicatorItem = this.$sliderIndicator.find('li');
                this.$curSliderItem = this.$sliderItem.eq(0);
                this.$curIndicatorItem = this.$indicatorItem.eq(0);

                this.$curSliderItem.fadeIn();
                this.$curIndicatorItem.addClass('on');

            },

            _tabView: function(index) {
                this.$curIndicatorItem.removeClass('on');
                this.$curSliderItem.fadeOut();
                this.$curIndicatorItem = this.$indicatorItem.eq(index).addClass('on');
                this.$curSliderItem = this.$sliderItem.eq(index).fadeIn();
                this._index = index;
            },

            _bindEvent: function() {
                var self = this;

                this.$indicatorItem.on('click', function() {
                    clearInterval(self._timer)
                    self._tabView($(this).index())

                })
                this.$sliderBox.on('mouseover', function() {
                    clearInterval(self._timer)
                }).on('mouseleave', function() {
                    self._autoTab()
                })
            },

            _autoTab: function() {
                var self = this;
                var timer = setInterval(function() {
                    if (self._index === 7) {
                        self._index = -1;
                    }
                    self._tabView(++self._index)
                },3000)
                self._timer = timer;
            }

        })

        $.getJSON('data.json', function(data) {
            var slider = new Slider({
                sliderBoxSelector       : 'slider',
                sliderListSelector      : 'slider-list',
                sliderItemSelector      : 'slider-item',
                sliderIndicatorSelector : 'slider-indicator',
                data : data
            })
        })

        function Scroll(opts) {
            this._init(opts);
            this.curActivedTab = null;

        }
        Scroll.prototype._init = function(opts) {
            var self = this;

            self.opts = {
                archorSelector    : '',         //锚点选择器
                tabItemActive     : '',         //激活状态标签类
                tabItemSelector   : '',         //标签选择器
                baseBoxSelector   : 'window',   //滚动基础盒子选择器
                contSelector      : 'html,body' //滚动内容选择器
            }
            $.extend(true, self.opts, opts || {})

            self._shift = self.opts.baseBoxSelector === 'window' ? 'offset' : 'position';

            this._initEle();
            this.bindScrollEvent();
            this.bindClickEvent();
            this.$baseBox.trigger('scroll')
        }

        Scroll.prototype._initEle = function() {
            this.$anchor = $(this.opts.archorSelector);
            this.$tabItem = $(this.opts.tabItemSelector);
            this.$baseBox = this.opts.baseBoxSelector === 'window' ? $(window) : $(this.opts.baseBoxSelector);
            this.$cont = $(this.opts.contSelector);
        }

        Scroll.prototype.getAnchorPosition = function() {
            var position = [];
            var self = this;

            self.$anchor.each(function() {
                position.push($(this)[self._shift]().top)
            })
            return position;
        }

        Scroll.prototype.move = function(dest) {

            this.$baseBox.scrollTop() != dest &&
                    !this.$cont.is('animated') &&
                        this.$cont.stop().animate({
                            'scrollTop': dest
                        })
        }

        Scroll.prototype.changeActiveItem = function(index) {
            var tabItem = this.$tabItem;
            var tabActive = this.opts.tabItemActive;
            this.curActivedTab = tabItem.eq(index).siblings().removeClass(tabActive).end().addClass(tabActive);


        }

        Scroll.prototype.bindClickEvent = function() {
            var tabItem = this.$tabItem;
            var dest = this.getAnchorPosition();

            var self = this;
            tabItem.on('click', function() {
                var index = $(this).index();
                index <= 3 && self.move(dest[index])
                index === tabItem.length-1 && self.move(0)
            })
        }

        Scroll.prototype.bindScrollEvent = function() {
            var anchorPosition = this.getAnchorPosition();
            var tabItem = this.$tabItem;
            var diff = Math.abs((this.$baseBox.height() - this.$anchor.eq(0).height())/2);
            var self = this;

            if (this._shift === 'offset') {
                this.$baseBox.on('scroll', function() {

                    var scrollTop = $(this).scrollTop();

                    scrollTop <= 300 && tabItem.removeClass(self.opts.tabItemActive) && (function() {
                        self.curActivedTab = null;
                    })()
                    scrollTop >= self.$baseBox.height() ? tabItem.eq(-1).fadeIn() : tabItem.eq(-1).fadeOut()

                    anchorPosition.forEach(function(item, index) {
                        if (scrollTop + diff >= item) {
                            self.changeActiveItem(index)
                        }
                    })
                })
            }
        }

        var scroll = new Scroll({
            archorSelector: '.fbox',
            tabItemSelector: '.tab-item',
            tabItemActive: 'on',
            baseBoxSelector: 'window',
            contSelector: 'html,body'
        })

        $('.tab-item').each(function(index) {

            $(this).on('mouseover', function() {
                if (index < 5) {
                    $(this).addClass('on').find('span.fdesc').stop().animate({
                        left: '0'
                    }, 300)
                }
                if (index === 5) {
                    $(this).find('span.tel-num').stop().animate({
                        'right': 40,
                        'opacity': 1
                    }, 500)
                }
            }).on('mouseout', function() {
                if (index<5) {
                    $(this).find('.fdesc').stop().animate({
                        'left': 40
                    }, 300)
                    if (!scroll.curActivedTab) {
                        $(this).removeClass('on')
                    } else {
                        this !== scroll.curActivedTab.get(0) && $(this).removeClass('on')
                    }
                }

                index === 5 && $(this).find('span.tel-num').stop().animate({
                    'right': 0,
                    'opacity': 0,
                }, 500)
            })
        })
    })

})(jQuery);
