let fileOutput;
let dfaObject;

let onFilePicked = function(event) {
  let input = event.target;

  let file = input.files[0];
  console.log(file.name);

  let reader = new FileReader();

  reader.readAsText(input.files[0]);

  reader.onload = function() {
      fileOutput = reader.result;
      dfaObject = dfaParser(fileOutput);
  };
};