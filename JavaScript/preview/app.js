// const person = {
//   name : 'Lee',
//   sayHi() {
//     console.log(`Hi My name is ${this.name}`);
//   },

// };
// //할당문이기 때문에 ;을 붙인다.

// person.sayHi();

function Person() { // 생성자 함수임을 알리기 위해 Pascal 형식을 사용한다.
  console.log(this);

  this.name = 'Lee';
  this.sayHi = function () {}
    console.log(`Hi! My name is ${this.name}`);

  console.log(this);
  // return this가 생략되어 있는 것이다.
};
// 어떻게 new 연산자가 객체를 만든다.
// 중요! 자바스크립트가 암묵적으로 아래를 함
// 1. 함수의 맨 처음에서 빈 객체를 생성한다. 이를 this라는 애한테 할당한다. 그 후 return this를 반환한다.
// 우리는 객체에 프로퍼티를 추가하려면 this에 추가해야한다 이것이 인스턴스다.

const name = new Person();
console.log(name); //Person {} 에서 Person을 사용한건 누가 만들었는지 알려주기 위해 적어주는 것이다.

// const name2 = Person();
// console.log(name2); // undefined다. 일반함수로 호출되는데 return값이 없어 undefined를 출력