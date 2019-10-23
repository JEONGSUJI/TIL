// var arr = [];

// for (var i = 0; i < 5; i++){
//   arr[i] = (function (id) { // ①
//     return function () {
//       return id;
//     };
//   }(i));
// }
// console.log(a);


// for (var j = 0; j < arr.length; j++) {
//   console.log(arr[j]());
// }

// const arr = [];

// for (let i = 0; i < 3; i++) {
//   arr[i] = () => i;
// }

// for (let i = 0; i < arr.length; i++) {
//   console.log(arr[i]()); // 0 1 2
// }

const arr = new Array(5).fill();

arr.forEach((v, i, self) => self[i] = () => i);
console.log(arr);


arr.forEach(f => console.log(f()));
console.log(arr);
