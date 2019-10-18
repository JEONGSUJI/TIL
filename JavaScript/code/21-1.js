// 1. 객체 리터럴 방식으로 생성한 객체의 경우
// 메소드 내부에서 메소드 자신이 속한 객체를 가리키는 식별자를
// 재귀적으로 참조할 수 있다.

// const Circle = {
//   radius: 5,
//   getDiameter(){
//     return 2 * circle.radius;
//   }
// };

// console.log(circle.getDiameter());


// 2. 생성자 함수 방식으로 생성한 객체의 경우

// function Circle(radius){
//   this.radius = radius;
// }

// Circle.prototype.getDiameter = function(){
//   return 2 * this.radius;
// }

// const circle = new Circle(5);
// console.log(circle.getDiameter());

// 3. 콜백 함수

// var value = 1;

// const obj = {
//   value: 100,
//   foo() {
//     const that = this;
//     console.log(that);

//     setTimeout(function(){
//       console.log("callback's this ", this);
//       console.log("callback's this.value: ", this.value);
//       console.log(that.value);
//     }, 100);
//   }
// };

// obj.foo();

// 4. 생성자 함수

// function Circle(radius){
//   this.radius = radius;
//   this.getDiameter = function () {
//     return 2 * this.radius;
//   };
// }

// const circle1 = new Circle(5);

// console.log(circle1);
// console.log(circle1.getDiameter);

// 5. Function.prototype call, apply

// function getThisBinding(){
//   return this;
// }

// // this로 사용할 객체
// const thisArg = { a:1, b:3 };

// console.log(getThisBinding());

// console.log(getThisBinding.apply(thisArg));
// console.log(getThisBinding.call(thisArg));

// 다시 다른 코드

// function getThisBinding(){
//   console.log(arguments);  
//   return this;
// }

// this로 사용할 객체
// const thisArg = { a:1 };

// console.log(getThisBinding.apply(thisArg, [1, 2, 3]));
// console.log(getThisBinding.call(thisArg, 1, 2, 3));

// Array.prototype.slice.apply(arguments);

// function convertArgsToArray() {
//   console.log(arguments);

//   const arr = Array.prototype.slice.apply(arguments);
//   console.log(arr);

//   return arr;  
// }

// convertArgsToArray(1, 2, 3);

// bind

function Person(name){
  this.name = name;
}

Person.prototype.doSomething = function (callback){
  callback.bind(this);
};

function foo(){
  console.log(this.name);
}

const person = new Person('Lee');

person.doSomething(foo);