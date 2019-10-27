// const arr3 = Array.from({length:5},function(v, i){return i;})

// console.log(arr3);
// console.log(Object.getOwnPropertyDescriptors(arr3));

// const arr3 = Array.from({length:5},function(i){return i;})

// console.log(arr3);
// console.log(Object.getOwnPropertyDescriptors(arr3));


const values = [1, 2, 3, 4, 5, 6];

const average = values.reduce((pre, cur, i, self) => {
  // 마지막 순회인 경우, 누적값으로 평균을 구해 반환
  // 마지막 순회가 아닌 경우, 누적값을 반환
  return i === self.length - 1 ? (pre + cur) / self.length : pre + cur;
}, 0);

console.log(average); // 3.5