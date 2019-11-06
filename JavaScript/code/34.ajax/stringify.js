const o = { name: 'Lee', gender: 'male', age: 20};

const strObject = JSON.stringify(o);
// console.log(typeof strObject, strObject);

const strPrettyObject = JSON.stringify(o, null, 2);
// console.log(typeof strPrettyObject, strPrettyObject);

// 궁금한 지점
function filter(a, value) {
  return typeof value === 'number' ? undefined : value;
}

const strFilteredObject = JSON.stringify(o, filter, 2);
// console.log(typeof strFilteredObject,strFilteredObject);

const arr = [1, 5, 'false'];

const strArray = JSON.stringify(arr);
console.log(typeof strArray, strArray);

function replaceToUpper(key, value){
  return value.toString().toUpperCase();
}

const strFilteredArray = JSON.stringify(arr, replaceToUpper);
console.log(typeof strFilteredArray, strFilteredArray);