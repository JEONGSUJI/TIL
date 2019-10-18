const Person = (function (){
  let _name = '';

  function Person(name){
    _name = name;
  }

  // 9는 Person prototype의 메소드 추가다 중첩함수가 아니다.
  Person.prototype.sayHi = function(){
    console.log(`Hi ${_name}`);  // 여기 Lee가 나오면 안되는데 나오는 것이 클로져 이해의 시작
  };

  return Person;
}());

const me = new Person('Lee');
console.log(me);

me.sayHi(); // 이 함수가 호출될 수 있는 이유는 Person.prototype 객체가 죽은게 아니기 때문이다.

// 모든 함수는 자신이 생성될 때 자신의 상위 스코프를 기억한다.
// 모든 함수는 [[Environment]]라는 내부 슬롯을 갖고 있다. -> 렉시컬 환경을 가리키고 있다.
// 가리키고 있으면 안죽음 그래서 살아있다.