// let strObj = new String(1);
// console.log(strObj);

// strObj = new String(undefined);
// console.log(strObj);


// camelCase => snake_case
const camelCase = 'helloWorld';
console.log(camelCase.replace(/[\w][A-Z]/g, function(match){
  console.log(match);
  return match[0] + '_' + match[1].toLowerCase();
}));