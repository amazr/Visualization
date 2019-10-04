var fileOutput;
var dfaObject;
var onFilePicked = function (event) {
    var input = event.target;
    var reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = function () {
        fileOutput = reader.result;
        dfaObject = dfaParser(fileOutput);
    };
};
