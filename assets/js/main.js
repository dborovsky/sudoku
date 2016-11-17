require.config({
    paths: {
        'jQuery': 'ext/jquery.min',
        'filesaver': 'ext/filesaver.min'
    },
    shim: {
        'jQuery': {
            exports: '$'
        }
    }
});

require(['jQuery', 'game', 'view'], function($, Game, View) { 'use strict';
    $(document).ready(function () {
        Game.init(View);
        if (window.stashedGame) {
            Game.restore(View);
        } else {
            Game.generate(View, 35);
        }

        $('.select-level > button').on('click', function() {
            if ( !$(this).hasClass('btn-active') ) {
              $(this).siblings().removeClass('btn-active');
              $(this).addClass('btn-active');
            }
        });

        $('.auth-toggles > a').on('click', function(e) {
            e.preventDefault();
            $(this).addClass('active')
            $(this).siblings('a').removeClass('active')
            var formName = $(this).attr('data-form-name');
            var form = $('#' + formName);
            form.siblings('form').hide();
            form.show();
        });
    });
});
