$(function() {
    (function() {
        // Top
        'use strict';
        var $tar = $('.m-home, .c-help');

        $tar.mouseenter(function() {
            $(this).addClass('tnav-hover').find('dl').stop().slideDown()
        }).mouseleave(function() {
            $(this).find('dl').stop().slideUp().parent().removeClass('tnav-hover')
        })
    })();

    (function() {
        //Recommend



    })();

    (function() {
        //购物车
        'use strict';
        var $cart = $('.cart'),
            $aCart,
            $popCart ;

        $cart.mouseenter(function() {
            if (!$aCart) {
                $aCart = $('.a-cart');
                $popCart = $('.pop-cart');
            }

            $aCart.addClass('a-cart-hover');
            $popCart.stop().slideDown()

        }).mouseleave(function() {
            $aCart.removeClass('a-cart-hover');
            $popCart.stop().slideUp()
        })

        $('.cart tbody').on('mouseenter mouseleave', 'tr', function() {
            $(this).toggleClass('primary')
        })

    })();

    (function() {
        'use strict';

        //商品分类
        var $mainNav = $('.mainNav'),
            $mainNavUl = $('.main-nav-ul');

        $mainNav.hover(
            function() {
                $mainNavUl.stop().slideDown()
            },
            function() {
                $mainNavUl.stop().slideUp()
            }
        );

        $mainNavUl.on('mouseenter', 'li', function() {
            $(this).find('.cate-part').stop().fadeIn(200);
        }).on('mouseleave', 'li', function() {
            $(this).find('.cate-part').stop().fadeOut(200)
        })

    })()

})
