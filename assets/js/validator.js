define('validator', ['system', 'timer', 'levels', 'scores_counter'], function(System, Timer, Levels, ScoresCounter) { 'use strict';
    var checksum = 362880;

    function checkBlock(solution, row, col) {
        let gridsum = 1;
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                gridsum *= solution[row + i][col + j];
            }
        }
        return gridsum === checksum;
    };

    function checkConflicts(grid, row, col, val) {
        var inRow = 0, inCol = 0, inBlock = 0;
        var blockX = parseInt(row / 3) * 3, blockY = parseInt(col / 3) * 3;
        for(let i = 0; i < 9; i++) {
            if(grid[row][i] === val) inRow++;
            if(grid[i][col] === val) inCol++;
        }
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(grid[blockX + i][blockY + j] === val) {
                    inBlock++;
                }
            }
        }
        return (inRow > 1 || inCol > 1 || inBlock > 1);
    };

    function checkGrid(grid) {
        var val = 0;
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                val = grid[i][j];
                if(val && this.checkConflicts(grid, i, j , val)) {
                    return false;
                }
            }
        }
        return true;
    };

    function checkSolution(solution) {
        var rowsum = 1, colsum = 1;
        for(let i = 0; i < 9; i++) {
            rowsum = colsum = 1;
            for(let j = 0; j < 9; j++) {
                rowsum *= solution[i][j];
                colsum *= solution[j][i];
                if(i % 3 === 0 && j % 3 === 0 && !checkBlock(solution, i, j)) {
                    return false;
                }
            }
            if(rowsum !== checksum || colsum !== checksum) {
                return false;
            }
        }
        return true;
    };

    function checkSolutionWithMessage(solution) {
        if( checkSolution(solution) ) {
            var current_level = Levels.getCurrentLevel()
            // подсчитываем очки
            var resultScores = ScoresCounter.calculateScoresByLevel( current_level );
            // отправляем очки на сервер
            if ( !ScoresCounter.solveButtonIsPressed() ) {
                $.post('/game/completed', { 'scores': resultScores, 'level': current_level })
            }

            var time = Timer.getTime().split(',');

            $('.res-time').text(time.join(':'));
            $('.res-score').text(resultScores);
            window.remodals.remodalCorrect.open();

            Timer.stop();

            return true;
        }
        else {
            window.remodals.remodalWrong.open();

            return false;
        }
    };

    return {
        checkGrid : checkGrid,
        checkConflicts : checkConflicts,
        checkSolution : checkSolution,
        checkSolutionWithMessage: checkSolutionWithMessage
    };
});
