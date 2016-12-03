const Scroll = {};
(function(win, doc, $) {
    var CusScrollBar = function(opts) {
        this._init(opts)

    }
    $.extend(CusScrollBar.prototype, {
        _init: function(opts) {
                var self = this;
                self.opts = {
                    scrollDir      : 'y',   //滚动方向
                    contSelector   : '',    //滚动内容选择器
                    barSelector    : '',    //滚动条选择器
                    sliderSelector : '',    //滚动滑块选择器
                    tabItemSelector: '',   //标签选择器
                    tabItemActive  : ''  ,   //激活状态标签类
                    divider        : '',
                    anchorSelector : ''   //锚点选择器
                }
                $.extend(true, self.opts, opts || {});
                this._initDomEvent();
                this._initSliderEvent();
                this._bindContScroll();
                this._bindMouseWheel();
                this._initTabEvent();

        },
        /**
         * 初始化DOM
         * @method _initDomEvent
         * @return {CusScrollBar}
         */
         _initDomEvent: function() {
             var opts = this.opts;
             this.$cont    = $(opts.contSelector);
             this.$bar     = $(opts.barSelector);
             this.$slider  = $(opts.sliderSelector);
             this.$doc     = $(doc);
             this.$tabItem = $(opts.tabItemSelector);
             this.$divider = $(opts.divider)
             this.$anchor  = $(opts.anchorSelector)
         },
        /**
         * 初始化滑块拖动功能
         * @return {[Object]} [this]
         */
        _initSliderEvent: function() {
            var $slider = this.$slider,slider = $slider[0],
                $cont = this.$cont,
                doc = this.$doc,
                contScrollHeight = this.getContScrollHeight(),
                sliderScrollHeight = this.getSliderScrollHeight(),
                scrollRate = contScrollHeight / sliderScrollHeight,
                startPagePosition,
                startTop,
                self = this;

            $slider.on('mousedown', function(e) {
                startPagePosition = e.pageY;
                startContScrollTop = $cont.scrollTop();

                doc.on('mousemove.scroll', function(e) {
                    var dis = e.pageY - startPagePosition;

                    self.scrollTo(dis * scrollRate + startContScrollTop);
                }).on('mouseup.scroll', function(e) {
                    doc.off('.scroll')
                })
            })
        },
        //初始化标签切换事件
        _initTabEvent: function() {
            var tabItem = this.$tabItem;
            var self = this;
            var anchor = this.$anchor;
            var anchorPosition = this.getAnchorPosition();


            tabItem.on('click', function() {
                var index = $(this).index();
                self._changeActiveItem(index);
                self.scrollTo(anchorPosition[index], true)
            })


        },
        //改变标签状态
        _changeActiveItem: function(index) {
            var tabItem = this.$tabItem;
            var tabActive = this.opts.tabItemActive;
            var divider = this.$divider;

            tabItem.eq(index).addClass(tabActive).siblings().removeClass(tabActive);
            divider.stop().animate({
                left: index * 111 + 'px'
            }, 500)
        },
        //获取锚点的top值
        getAnchorPosition: function() {
            var position = [];
            this.$anchor.each(function() {
                position.push($(this).position().top)
            })
            return position;
        },
        //绑定鼠标滚轮事件
        _bindMouseWheel: function() {
            var self = this;
            this.$cont.on('mousewheel DOMMouseScroll', function(e) {
                var oEv = e.originalEvent,
                    wheelRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detail|| 0);

                self.scrollTo(self.$cont.scrollTop() + wheelRange * 50)
            })

        },
        //内容可滚动的高度
        getContScrollHeight: function() {
            var self = this;
            return Math.max(self.$cont.height(), self.$cont[0].scrollHeight) - self.$cont.height();
        },

        //滑块可移动的距离
        getSliderScrollHeight: function() {
            var self = this;
            return self.$bar.height() - self.$slider.height()
        },

        //计算滑块的当前位置
        getSliderPosition: function() {
            var $cont = this.$cont,
                $slider = this.$slider;

            return $cont.scrollTop() * this.getSliderScrollHeight() / this.getContScrollHeight();

        },

        //滚动内容到指定高度
        scrollTo: function(pos, animation) {

            if (typeof animation === 'boolean' && animation) {
                this.$cont.stop().animate({
                    scrollTop: pos
                })
                return this;
            }

            this.$cont.scrollTop(pos)
            return this;

        },

        //监听滚动的内容，同步滑块高度
        _bindContScroll: function() {
            var $cont = this.$cont,
                $slider = this.$slider,
                self = this,
                anchorPosition = this.getAnchorPosition();

            $cont.on('scroll', function(e) {
                var contScrollTop = $(this).scrollTop();

                anchorPosition.forEach(function(item, index) {
                    if (contScrollTop >= item) {
                        // self._changeActiveItem(index)
                    }
                })

                $slider.css('top', self.getSliderPosition());

            })
        }
    })

    Scroll.CusScrollBar = CusScrollBar;
})(window, document, jQuery)

var scroll = new Scroll.CusScrollBar({
    contSelector   :  '.scroll-cont',
    barSelector    :  '.scroll-bar',
    sliderSelector :  '.scroll-slider',
    tabItemSelector:  '.tab-item',
    tabItemActive  :  'tab-active',
    divider        :  '.divider',
    anchorSelector :  '.anchor'
})
