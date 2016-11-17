define('solver', ['validator'], function (Validator) { 'use strict';
    var gridCopy = null, candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    Array.prototype.shuffle = function () {
        var randomIndex, itemAtIndex;
        for (let i = this.length - 1; i >= 0; i--) {
            randomIndex = Math.floor(Math.random() * (i + 1));
            itemAtIndex = this[randomIndex];
            this[randomIndex] = this[i];
            this[i] = itemAtIndex;
        }
        return this;
    };

    function setGrid(grid) {
        gridCopy = grid.slice();
        for(let i = 0; i < 9; i++) {
            gridCopy[i] = grid[i].slice();
        }
    };

    function solve(grid) {
        setGrid(grid);
        if(solveField(0, 0)) {
            return gridCopy;
        }
        return false;
    };

    function solveField(row, col) {
        if (gridCopy[row][col] === 0) {
            candidates.shuffle();
            for(let i = 0; i < candidates.length; i++) {
                gridCopy[row][col] = candidates[i];
                if (!Validator.checkConflicts(gridCopy, row, col, candidates[i])
                                    && stepIntoNextField(row, col)) {
                    return true;
                }
            }
            gridCopy[row][col] = 0;
            return false;
        }
        return stepIntoNextField(row, col);
    };

    function stepIntoNextField(row, col) {
        if(row === 8 && col === 8) return true;
        else if (row === 8) return solveField(0, col + 1);
        else return solveField(row + 1, col);
    };

    function getSolution() {
        return gridCopy;
    };

    return {
        solve : solve,
        getSolution : getSolution
    };
});
