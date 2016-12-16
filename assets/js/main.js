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
            Game.level = 35;
            Game.generate(View, Game.level);
        }

        $('.generate [data-value="easy"]').on('click', function() {
            Game.level = 35;
            Game.generate(View, Game.level);
            $('input.field-with-error').removeClass('field-with-error');
        })

        $('.generate [data-value="medium"]').on('click', function() {
            Game.level = 40;
            Game.generate(View, Game.level);
            $('input.field-with-error').removeClass('field-with-error');
        })

        $('.generate [data-value="hard"]').on('click', function() {
            Game.level = 45;
            Game.generate(View, Game.level);
            $('input.field-with-error').removeClass('field-with-error');
        })

        $('.generate [data-value="expert"]').on('click', function() {
            Game.level = 50;
            Game.generate(View, Game.level);
            $('input.field-with-error').removeClass('field-with-error');
        })

        $('.generate [data-value="insane"]').on('click', function() {
            Game.level = 55;
            Game.generate(View, Game.level);
            $('input.field-with-error').removeClass('field-with-error');
        })

        $('.new-game').on('click', function(event) {
            $('input.field-with-error').removeClass('field-with-error');
            if (Game.level) {
                Game.generate(View, Game.level);
            } else {
                Game.level = 35;
                Game.generate(View, Game.level);
            }
        });

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
