define('scores_counter', function () { 'use strict';
    var scores;
    var solveButtonPressed = false;

    var scoresTable = {
        '35': 1,
        '40': 2,
        '45': 4,
        '50': 8,
        '55': 16
    }

    function getCurrentScores() {
        return scores;
    };

    function solveButtonIsPressed() {
        return solveButtonPressed;
    };

    function solveButtonPress() {
        solveButtonPressed = true;
    };

    function setToDefault() {
        scores = 1;
    };

    function setToValue(value) {
        scores = parseFloat(value);
    };

    function setToZero() {
        scores = 0;
    };

    function reduceBy(number) {
        if (scores == 0) { return 0; }
        scores = parseFloat( (scores - number*scores).toFixed(1) );
        return scores;
    };

    function increaseBy(number) {
        scores = parseFloat( (scores + number*scores).toFixed(1) );
        return scores;
    };

    function calculateScoresByLevel(level) {
        var levelScores = scoresTable[level]
        var resultScores = (levelScores*scores).toFixed(1);
        return resultScores;
    };

    return {
        solveButtonIsPressed : solveButtonIsPressed,
        solveButtonPress : solveButtonPress,
        setToDefault : setToDefault,
        setToZero : setToZero,
        getCurrentScores : getCurrentScores,
        reduceBy : reduceBy,
        increaseBy : increaseBy,
        calculateScoresByLevel : calculateScoresByLevel,
        setToValue : setToValue
    };
});
