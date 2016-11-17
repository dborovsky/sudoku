define('grid', function() { 'use strict';
    var grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    function stashInitialGrid(stashedGrid) {
        window.stashedGrid = stashedGrid;
    }

    function getStashedGrid() {
        return window.stashedGrid;
    };

    function get() {
        return grid;
    }

    function isFull() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if (grid[i][j] == 0) return false;
            }
        }
        return true;
    }

    function set(newGrid) {
        grid = newGrid;
    };

    function clear() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                grid[i][j] = 0;
            }
        }
    };

    function setField(x, y, value) {
        grid[x][y] = value;
    };

    function fieldIsEmpty(x, y) {
        return grid[x][y] == 0;
    };

    return {
        stashInitialGrid: stashInitialGrid,
        getStashedGrid: getStashedGrid,
        get : get,
        set : set,
        isFull : isFull,
        clear : clear,
        fieldIsEmpty : fieldIsEmpty,
        setField : setField
    };
});
