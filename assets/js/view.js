define('view', ['system', 'grid', 'validator'], function(System, Grid, Validator) { 'use strict';
    function createTable(element) {
        var row, table = $('<table>').addClass('grid');
        for (let i = 0; i < 9; i++) {
            row = $('<tr>');
            for (let j = 0; j < 9; j++) {
                row.append($('<td>').append(createGridCell(i, j)));
            }
            table.append(row);
        }
        element.append(table);
    };

    function createGridCell(x, y) {
        var cell = $('<input id="it' + ((x * 9) + y) + '" type="tel" maxlength="1">');
        cell.addClass('animable');
        cell.data('X', x).data("Y", y);
        cell.on('keydown', clearCell);
        cell.on('keyup', setCellValue);
        return cell;
    };

    function setCellValue() {
        var x   = $(this).data('X')
        ,   y   = $(this).data("Y")
        ,   val = parseInt($(this).val());

        if(!isNaN(val)) {
            Grid.setField(x, y, val);
            if(Validator.checkConflicts(Grid.get(), x, y, val)) {
                // System.print('Conflict detected!', '#ce5454');
                $(this).addClass('field-with-error');
                $('.field-with-error').removeClass('field-with-error').addClass('restart-animation');
                setTimeout(function(){ $('.restart-animation').addClass('field-with-error').removeClass('restart-animation')  }, 300);
            } else {
                $(this).removeClass('field-with-error');
            }
        }
        else {
            Grid.setField(x, y, 0);
            $(this).removeClass('field-with-error').val('');
        }
        if (Grid.isFull()) { Validator.checkSolutionWithMessage( Grid.get() ) }
    };

    function clearCell() {
        $(this).val('');
        Grid.setField($(this).data('X'), $(this).data('Y'), 0);
    };

    function update() {
        var needUpdate = localStorage.getItem('viewNeedUpdate');
        if(needUpdate === 'true') {
            var grid = Grid.get();
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    $('#it' + ((i * 9) + j)).val(grid[i][j] ? grid[i][j] : '');
                }
            }
            localStorage.setItem('viewNeedUpdate', false);
        }
    };

    function clearTable() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                let handle = $('#it' + ((i * 9) + j));
                if(!handle.prop("disabled")) {
                    handle.val('').css('text-shadow', '0 0 0 Black');
                    Grid.setField(i, j, 0);
                }
            }
        }
    };

    function disableCells() {
        for(let i = 0; i < 9; i++) {
             for(let j = 0; j < 9; j++) {
                 if(Grid.get()[i][j] != 0) {
                     $('#it' + ((i * 9) + j)).prop("disabled", true);
                 }
             }
        }
    };

    function enableCells() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                $('#it' + ((i * 9) + j)).prop("disabled", false);
            }
        }
    };

    return {
        createTable : createTable,
        clearTable : clearTable,
        enableCells : enableCells,
        disableCells : disableCells,
        update : update
    };
});
