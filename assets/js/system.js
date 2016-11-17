define('system', ['grid', 'filesaver'], function(Grid) { 'use strict';
    var currentMsgTimeout = 0;

    function print(message, background = '#54a4ce', timeout = 2000) {
        clearTimeout(currentMsgTimeout);
        $(".message").hide().css("background", background).html(message).fadeIn(200);
        currentMsgTimeout = setTimeout( function() {
            $(".message").fadeOut(1000); }, timeout
        );
    };

    function printNotice(message) {
        if ( confirm(message) ) {
            $('.select-level > .btn-active').click();
        }
    };

    function printAlert(message) {
        alert(message);
    };

    function exportGridToFile() {
        var output = "", grid = Grid.get();
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 8; j++) {
                output += grid[i][j] + " ";
            }
            output += grid[i][8] + "\r\n";
        }
        saveAs(new Blob([output], {type: "text/plain"}), "file.txt");
    };

    function importGridFromFile(filePath) {
        var reader = new FileReader(), input = "";
        if(filePath.files && filePath.files[0]) {
            reader.onload = mapStringToGrid;
            reader.readAsText(filePath.files[0]);
        }
    };

    function mapStringToGrid(e) {
        Grid.set(
            e.target.result.split("\r\n").map(function(e) {
                return e.split(" ").map(Number);
            })
        );
        localStorage.setItem('viewNeedUpdate', true);
    };

    return {
        print : print,
        printNotice : printNotice,
        printAlert : printAlert,
        importGridFromFile : importGridFromFile,
        exportGridToFile : exportGridToFile
    };
});
