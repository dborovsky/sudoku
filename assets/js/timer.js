define('timer', ['jQuery'], function ($) { 'use strict';
    var hours = 0, minutes = 0, seconds = 0, timer;

    function start() {
        // reset();
        timer = setInterval(function() {
            seconds++;

            if(seconds >= 60) {
                minutes++;
                seconds = 0;
            }

            if(minutes == 60) {
                hours++;
                minutes = 0;
            }

            $('#timer').html(
                (hours   < 10 ? "0" + hours   :   hours) + ":" +
                (minutes < 10 ? "0" + minutes : minutes) + ":" +
                (seconds < 10 ? "0" + seconds : seconds)
            );
        }, 1000);
    };

    function pause() {
        stop();
    }

    function stop() {
        clearInterval(timer);
    };

    function reset() {
        hours = minutes =seconds = 0;
        clearInterval(timer);
        $('#timer').html('00:00:00');
    };

    function getTime() {
        return [hours, minutes, seconds].join(',')
    };

    function setTime(time_string) {
        var time = time_string.split(",");
        hours = parseInt( time[0]);
        minutes = parseInt( time[1]);
        seconds = parseInt( time[2]);
        $('#timer').html(
            (hours   < 10 ? "0" + hours   :   hours) + ":" +
            (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds < 10 ? "0" + seconds : seconds)
        );
    };

    return {
        start : start,
        reset : reset,
        stop : stop,
        getTime : getTime,
        setTime : setTime
    };
});
