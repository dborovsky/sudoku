(function ($) {
  $(document).ready(function () {
    var $signInBtn = $('#sign-in-btn'),
        $auth = $('.auth-dropdown'),
        $best = $('.best-dropdown'),
        $hamburger = $('.hamburger'),
        $navItems = $('.nav-items'),
        $overlay = $('.overlay'),

        r = window.remodals = {};

    function convertTime () {
      $.each($('.t_time'), function(index, val) {
         var time = $(val).text().split(',');

         $(val).text(time.join(':'));
         console.log(time);
      });
    }

    convertTime();
    window.convertTime = convertTime;


    $(".modal-social-icons").jsSocials({
      showLabel: false,
      showCount: false,
      shares: [{
        share: "facebook",
        logo: "../img/icon-facebook.png"
      },
      {
        share: "googleplus",
        logo: "../img/icon-google.png"
      }, {
        share: "twitter",
        logo: "../img/icon-twitter.png"
      }]
    });


    ///////////////////
    // Init Remodals //
    ///////////////////
    r.remodalWrong = $('[data-remodal-id="modal-solution-wrong"]').remodal();
    r.remodalCorrect = $('[data-remodal-id="modal-solution-correct"]').remodal();
    r.remodalSaves = $('[data-remodal-id="modal-saves"]').remodal();
    r.remodalSend = $('[data-remodal-id="modal-send"]').remodal();
    r.remodalRestore = $('[data-remodal-id="modal-restore"]').remodal();
    r.remodalRestoreFail = $('[data-remodal-id="modal-restore-fail"]').remodal();
    r.remodalValidate = $('[data-remodal-id="modal-validate"]').remodal();

    window.deleteSave = function (e) {
      var stashID = $(this).data('stash-id');
      var $deleteBtn = $(this);

      if (stashID) {
        $.post('/game/delete', { stash_id: stashID}, function(data, textStatus, xhr) {
          if (data.id) {
            $deleteBtn.parent().parent().hide();
          }
        });
      }
    };

    $('.delete-save').on('click', deleteSave);


    //////////////////////////////////////////////
    // Inform user if he entered existing email //
    //////////////////////////////////////////////
    $('#c-register-email').on('keyup', function(e) {
      var $this = $(this),
          $err = $('#error-register-email'),
          value = $(this).val();

      setTimeout(function() {
        $.post('/check_email', { email: value }, function(data) {
          if (data.status == 'EXIST') {
            $err.show();
            $this.addClass('error');
          } else {
            $err.hide();
            $this.removeClass('error');
          }
        });
      }, 1500);
    });


    //////////////////////////////////////////////////////////
    // Close mobile Main menu when clicked on another place //
    //////////////////////////////////////////////////////////
    $(document).on('click', function (e) {

      if ($(e.target).hasClass('overlay')) {
        $hamburger.removeClass('opened');
        $navItems.hide();
        $overlay.hide();
      }

      // if (!$(e.arget).hasClass('nav-auth') && !$(e.arget).hasClass('auth-dropdown'))
      //   if ($auth.hasClass('opened'))
      //     $auth
      //       .removeClass('opened')
      //       .hide();

      if (!$(e.target).hasClass('nav-best'))
        if ($best.hasClass('opened'))
          $best
            .removeClass('opened')
            .hide();
    });


    ////////////////////////
    // Feedback form send //
    ////////////////////////
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
      else
        remodals.remodalValidate.open();
    });


    //////////////////////
    // Restore password //
    //////////////////////
    $('#send-password-btn').on('click', function(e) {
      var cResendEmail = $('#c-resend-email').val();

      if (cResendEmail) {
        $.post('/restore', {
          email: cResendEmail
        }, function(data) {
          $('#c-resend-email').val('');
          if (data.status == 'OK') {
            remodals.remodalRestore.open();
          } else {
            remodals.remodalRestoreFail.open();
          }
        });
      }
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
