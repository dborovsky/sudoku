define('game', ['jQuery', 'grid', 'system', 'validator', 'solver', 'levels', 'timer', 'scores_counter'],
function ($, Grid, System, Validator, Solver, Levels, Timer, ScoresCounter) { 'use strict';
    var viewUpdate = null;

    function solveSudoku() {
        var grid = Grid.get();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if ( grid[i][j] == 0 ) {
                    Grid.setField(i, j, window.stashedGrid[i][j]);
                }
            }
        }
        localStorage.setItem('viewNeedUpdate', true);
        return true;
    }

    function solve() {
        // debugger
        if(Validator.checkGrid(Grid.get()) === false) {
            System.print("Grid is not correct !", "#ce5454");
            return false;
        }
        if(Solver.solve(Grid.get()) && Validator.checkSolution(Solver.getSolution())) {
            Grid.set(Solver.getSolution());
            localStorage.setItem('viewNeedUpdate', true);
            return true;
        }
        return false;
    };

    function getHint() {
        var grid = Grid.get();
        var emptyFields = []
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if ( grid[i][j] == 0 ) {
                    emptyFields.push([i, j])
                }
            }
        }

        var randomEmptyField = emptyFields[Math.floor(Math.random()*emptyFields.length)];

        Grid.setField(randomEmptyField[0] ,randomEmptyField[1], window.stashedGrid[ randomEmptyField[0] ][ randomEmptyField[1] ]);
        localStorage.setItem('viewNeedUpdate', true);
        return true;
    };

    function generate(View, cells) {
        View.enableCells();
        Grid.clear();
        ScoresCounter.setToDefault();
        solve();
        window.stashedGrid = JSON.parse(JSON.stringify(Grid.get()))
        Levels.cleaner(cells);
        View.disableCells();
        // обнуляем и запускаем таймер только при нажатии на grid
        Timer.reset();
        $('.grid').one('click', function(){
            Timer.start();
        });
    };

    function restore(View) {
        ScoresCounter.setToValue(window.stashedGame.scores);

        Grid.set( JSON.parse(window.stashedGame.stashed_grid_numbers) );
        var disabled_grid = JSON.parse(window.stashedGame.disabled_grid)
        window.stashedGrid = JSON.parse(window.stashedGame.right_solution)

        $('.grid tr').each( function(trIndex, tr) {
          $(this).find('> td > input').each(function(tdIndex, td) {
            if ( disabled_grid[trIndex][tdIndex] == "true" ) {
                $(this).prop('disabled', true)
            }
          });
        });

        var LEVELS_TABLE = [35, 40, 45, 50, 55]
        Levels.setLevel( parseInt(window.stashedGame.level) );
        var current_level = LEVELS_TABLE.indexOf( parseInt(window.stashedGame.level) )
        $('.select-level > button').removeClass('btn-active').eq(current_level).addClass('btn-active')

        localStorage.setItem('viewNeedUpdate', true);

        Timer.setTime(window.stashedGame.time);
        // чтобы ошибочные ячейки подсветились
        setTimeout( function() {
            $('.grid input:enabled').filter(function() { return $(this).val() != ""; }).keyup();
        }, 500)
        // чтобы отсчет времени пошёл только тогда, когда мы нажмем на любое поле в судоку
        $('.grid').one('click', function(){ Timer.start(); });
    };

    function init(View) {
        View.createTable($('#grid-wrapper'));
        viewUpdate = setInterval(View.update, 100);

        $('#export-btn').on('click', function () {
            System.exportGridToFile(Grid.get());
        });

        $('#import-btn').on('click', function () {
            View.enableCells();
            $('#file-input').click();
        });

        $('#file-input').on('change', function () {
            System.importGridFromFile(this);
            $(this).val('');
            setTimeout(function() {
                View.disableCells();
                Timer.start();
            }, 200);
        });

        $('#print-btn').on('click', function () {
            $('#logo').hide();
            $('#timer').hide();
            $('nav a').hide();
            setTimeout(function() {
                window.print();
                $('#logo').show();
                $('#timer').show();
                $('nav a').show();
            }, 200);
        });

        $('.generate [data-value="easy"]').on('click', function() {
            generate(View, 35);
        })

        $('.generate [data-value="medium"]').on('click', function() {
            generate(View, 40);
        })

        $('.generate [data-value="hard"]').on('click', function() {
            generate(View, 45);
        })

        $('.generate [data-value="expert"]').on('click', function() {
            generate(View, 50);
        })

        $('.generate [data-value="insane"]').on('click', function() {
            generate(View, 55);
        })


        $('#solve-btn').on('click', function () {
            // solve();
            ScoresCounter.setToZero();
            ScoresCounter.solveButtonPress();
            solveSudoku();
        });

        $('#clear-btn').on('click', function () {
            View.clearTable();
            Timer.start();
        });

        $('#hint-btn').on('click', function () {
            ScoresCounter.reduceBy(0.1);
            getHint();
        });

        $('#check-btn').on('click', function () {
            var solutionIsCorrect = Validator.checkSolutionWithMessage( Grid.get() )
        });

        $('#stash-btn').on('click', function () {
            var disabled_array = [ [], [], [], [], [], [], [], [], [] ];
            var stashed_array_numbers = [ [], [], [], [], [], [], [], [], [] ];

            $('.grid tr').each( function(trIndex, tr) {
              $(this).find('> td > input').each(function(tdIndex, td) {
                disabled_array[trIndex][tdIndex] = $(this).is(':disabled');
                stashed_array_numbers[trIndex][tdIndex] = $(this).val() == '' ? 0 : $(this).val();
              });
            });

            // подсчитываем очки
            var current_level = Levels.getCurrentLevel()
            var resultScores = ScoresCounter.calculateScoresByLevel( current_level );

            var time = Timer.getTime()

            var right_solution =JSON.parse(JSON.stringify(window.stashedGrid));

            $.post('/game/stash', { stashed_grid_numbers: stashed_array_numbers, right_solution: right_solution,
                                    disabled_grid: disabled_array, 'scores': resultScores, 'level': current_level , 'time': time }, function (data) {
                                        // console.log(data);
                                        // alert('Игра сохранена');
                                        var tr = '<tr class="spacer"></tr>' +
                                                 '<tr class="saves-item">' +
                                                    '<td class="saves-item-mark marked"></td>' +
                                                    '<td class="saves-item-date">' + data.created_at + '</td>' +
                                                    '<td class="saves-item-score desktop">Scores: ' + data.scores + '</td>' +
                                                    '<td class="saves-item-time desktop">Time: ' + data.time + '</td>' +
                                                    '<td class="saves-item-ctrls">' +
                                                      '<a href="/?stashed_game=' + data.id + '" class="load-save">Load game</a>' +
                                                      '<a href="#" class="delete-save"></a>' +
                                                    '</td>' +
                                                  '</tr>';
                                        $(tr).insertAfter('.stassh:last');
                                    }).fail( function(event) {
                                        if (event.status == 401) {
                                            alert('Для сохранения игры, вам необходимо авторизироваться в игре');
                                        } else {
                                            alert('Произошла ошибка при сохранении');
                                        }
                                    });
        });
    };

    return {
        solve : solve,
        generate : generate,
        getHint : getHint,
        init : init,
        restore : restore
    };
});
