
(function($) {
    $('.aside_nav').on('click', 'li>a', function(event) {
        var li = $(this).parent();
        console.log(event.currentTarget.nodeName);
        li.toggleClass('ok');

        !li.hasClass('ok') ? li.find('dl').slideDown() : li.find('dl').slideUp();
    })
})(jQuery);
