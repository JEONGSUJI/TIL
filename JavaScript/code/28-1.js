// let strObj = new String(1);
// console.log(strObj);

// strObj = new String(undefined);
// console.log(strObj);

const camelCase = 'helloWorld';
console.log(camelCase.replace(/[\w][A-Z]/g, function(match){
  console.log(match);}));
