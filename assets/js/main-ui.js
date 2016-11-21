(function ($) {
  $(document).ready(function () {
    var $signInBtn = $('#sign-in-btn'),
        $auth = $('.auth-dropdown'),
        $best = $('.best-dropdown'),
        $hamburger = $('.hamburger'),
        $navItems = $('.nav-items'),
        $overlay = $('.overlay');

    var r = window.remodals = {};


    ///////////////////
    // Init Remodals //
    ///////////////////
    r.remodalWrong = $('[data-remodal-id="modal-solution-wrong"]').remodal();
    r.remodalCorrect = $('[data-remodal-id="modal-solution-correct"]').remodal();
    r.remodalSaves = $('[data-remodal-id="modal-saves"]').remodal();
    r.remodalSend = $('[data-remodal-id="modal-send"]').remodal();


    //////////////////////////////////////////////////////////
    // Close mobile Main menu when clicked on another place //
    //////////////////////////////////////////////////////////
    $(document).on('click', function (e) {
      console.log(e);
      if ($(e.target).hasClass('overlay')) {
        $hamburger.removeClass('opened');
        $navItems.hide();
        $overlay.hide();
      }
    });

    $('#c-form-send').on('click', function (e) {
      var cEmail = $('#c-form-email').val(),
          cUsername = $('#c-form-name').val(),
          cMessage = $('#c-form-message').val();

      if (cEmail && cUsername && cMessage)
        $.post('/send', {
          email: cEmail,
          username: cUsername,
          message: cMessage
        }, function(data, textStatus, xhr) {
          if (textStatus == 'success')
            remodals.remodalSend.open();
        });
    });


    ///////////////////////////
    // Toggle hamburger menu //
    ///////////////////////////
    var toggleHamburger = function (e) {
      if ($hamburger.hasClass('opened')) {
        $hamburger.removeClass('opened');
        $navItems.hide();
        $('.overlay').hide()
      } else {
        $hamburger.addClass('opened');
        $navItems.show();
        $('.overlay').show()
      }
    };


    ////////////////////////////////////////
    // Toogle authorization dropdown menu //
    ////////////////////////////////////////
    var toggleAuthMenuItem = function (e) {
      if ($(e.currentTarget).hasClass('nav-auth'))
        if ($auth.hasClass('opened'))
          $auth
            .removeClass('opened')
            .hide();
        else
          $auth
            .addClass('opened')
            .show();
      else
        return false;
    };


    ////////////////////////////////////////
    // Toogle Best players dropdown menu  //
    ////////////////////////////////////////
    var toggleBestPlayers = function (e) {
      if ($best.hasClass('opened'))
          $best
            .removeClass('opened')
            .hide();
        else
          $best
            .addClass('opened')
            .show();
    }


    ////////////////////////////////////////////////
    // Toggle "Lost password" and "Registration"  //
    ////////////////////////////////////////////////
    var toggleLink = function (e) {
      var $link = $(e.currentTarget),
          blockname = $link.data('block-name'),
          $block = $('div[data-block-name=' + blockname + ']');

      if (blockname === 'block-registration')
        if (!$signInBtn.hasClass('disabled'))
          $signInBtn.addClass('disabled');
        else
          $signInBtn.removeClass('disabled');

      if (blockname === 'block-lost-password')
        if (!$signInBtn.hasClass('hidden'))
          $signInBtn.addClass('hidden');
        else
          $signInBtn.removeClass('hidden');

      if ($link.hasClass('tr-open')) {
        $block.show();
        $link
          .removeClass('tr-open')
          .addClass('tr-close');
      } else {
        $block.hide();
        $link
          .removeClass('tr-close')
          .addClass('tr-open');
      }
    };



    $('select').niceSelect();

    $('.nav-best').on('click', toggleBestPlayers);
    $('.nav-auth').on('click', toggleAuthMenuItem);
    $('.toggle-link').on('click', toggleLink);
    $hamburger.on('click', toggleHamburger);

  });
})(jQuery); 
