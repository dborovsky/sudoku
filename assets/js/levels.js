define('levels', ['grid'], function (Grid) { 'use strict';
    var cellsLevel;

    function cleaner(erased) {
        cellsLevel = erased;
        var row, col, i;
        for(i = 0; i < erased; i++){
            row = Math.floor(Math.random()*9);
            col = Math.floor(Math.random()*9);
            if (!Grid.fieldIsEmpty(row,col)) {
                Grid.setField(row,col,0);
            }
            else i--;
        }
    };

    function setLevel(cells_count) {
        cellsLevel = cells_count;
    }

    function getCurrentLevel() {
        return cellsLevel;
    }

    return {
        cleaner : cleaner,
        getCurrentLevel : getCurrentLevel,
        setLevel : setLevel
    };
});
