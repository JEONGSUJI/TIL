일급 객체에 대한 특징 기억하기

일급 객체 다시 복습하기



- 콜백함수가 가능하려면 함수가 일급객체여야 가능
- 함수 일급객체 > 함수형 프로그래밍



`foo(); => foo.[[Call]]()`

`new foo(); => foo.[[Contructor]]()`



---

`__proto__` 접근자 프로퍼티

- 모든 객체가 가지고 있다



prototype  프로퍼티

- 함수 객체가 가지고 있는 프로토타입
- 모든 객체는 자신의 부모를 갖는 prototype 객체 (prototype)을 갖는다



Object.prototype이 단군이다.

```javascript
funtion Person(name){
    this.name = name;
}

const me = new Person('Lee');
```



Person 생성자 함수는 인스턴스를 만드는 것이 존재 목적이다.

여기서 this가 가리키는 것은 생성자함수가 생성할 예정인 인스턴스를 가리킨다.



우리는 me 프로퍼티에 name 프로퍼티만을 추가했는데

me.toString하면 반환이된다? 이것은 me 인스턴스의 부모에게 상속받은 것이다.

즉 인스턴스의 부모 Person.prototype인데 이 부모를 찾아간다.

그 찾아갈 수 있는 방법이 `me.__proto__`하면 // Person { } 이 나오는데

비어있다는 의미인데 비어있지 않고 constructor를 가지고 있다.

이 construction는 Person 생성자 함수를 가리켜 생성자 함수에 접근할 수 있다.

Person.prototype 



왜 Person 생성자함수한테 상속받지 않고 Person.prototype 양부모 (기르기만함)한테 상속받을까?

Person.prototype 양부모 (기르기만함)



프로토타입 체인은 단방향으로 † 흐르기 때문에 단방향 링크드 리스트라는 자료구조로 이루어져있다. 존재 목적은 프로퍼티를 찾는것이다.



스코프 체인의 존재 목적은 식별자를 찾는다.



객체.프로퍼티 키;

객체로 평가될 수 있는 식별자여야한다.

먼저 객체를 찾아야한다. 이때는 스코프 체인에서 찾는다.

봤더니 프로토타입 체인으로 이루어져있는것을 확인하고 프로퍼티 키를 찾는다.



식별자는 식별자네이밍규칙을 지켜야하고 스코프 체인에서 찾음

프로퍼티키는 식별자네이밍규칙을 꼭 따라야하는것은 아니고 프로토타입 체인에서 찾음



객체지향이란 무엇인가?

- 상속이라는 메커니즘을 구현하는 방법이 상속이다. 상속의 상위 개념은 객체 지향이다.



서버 클라이언트 CS 환경?

집에서 작성하던 파일을 회사에서도 쓰고 싶을때 워드라는 프로그램 / 해당 파일 데이터를 가져와야했는데 불편해서 집 컴퓨터도 아니고 회사 컴퓨터도 아닌 다른 컴퓨터 (서버)에 저장해놓고 네트워크를 통해 접근해야한다.



JSP, ASP, PHP는 브라우저를 동작하게 하기 위해 타 언어를 가지고 컴파일해서 돌리는 것이었다. 구글은 구글맵을 만들고 HTML, CSS, JS로만 만들어서 가능성을 알려줬다.



`__proto__`접근자 프로퍼티

- 모든 객체는 [[Prototype]] 내부 슬롯을 갖는다. [[Prototype]] 내부 슬롯은 객체 지향 프로그래밍의 상속을 구현하는 프로토타입 객체를 가리킨다.
- `__proto__`프로퍼티는 [[Prototype]] 내부 슬롯이 가리키는 프로토타입 객체에 접근하기 위해 사용하는 접근자 프로퍼티이다. 내부 슬롯은 직접 접근할 수 없고 간접적인 접근방법을 제공하는 경우에 한하여 접근할 수 있다.



클래스도 프로토타입 기반 패턴으로 되어있다



1. 객체지향 프로그래밍

- object 객체, 나 이외에 대상화 할 수 있는 것 <-> subject 주체 
- 다양한 속성 중에서 프로그램에 필요한 속성만을 간추려 내어 표현하는 것 추상화
- 클래스는 생성자 함수같은 것이다. 실제로 존재하는 것은 인스턴스라고한다. 클래스도 값을 찍어내는 방법. 인스턴스를 찍어내기위한 사전작업/ 상태는 같으나 구조는 다르다.



> **추상화**
>
> 필요한 속성만 간추려 내어 표현하는 것



클래스 기반 언어는 항상 설계서 (클래스) 를 만들고 만들어야했고, 객체를 만든 이후 내부를 바꿀 수 없다.

객체리터럴로 만들때는 설계서가 없어도 된다. 객체를 만든 이후 프로퍼티 동적 추가 및 삭제가 가능함



결론: 프로퍼티는 상태를 나타내고 메소드는 행위를 나타낸다. 상태와 행위는 서로 관련이 있다.



생성자 함수의 단점

- 프로퍼티는 상태는 다를 수 있으니 모두가 가지는거 인정하지만 메소드는 동일한 함수 객체도 동일하게 가져야하는 단점이 있다(중복, 메모리 낭비)



상속은 중복제거을 위해 만들어졌다. 자바스크립트는 프로토타입을 기반으로 상속을 구현한다.



생성자 함수는 생성자.prototype이라고 하는 프로퍼티를 갖고 있다.

construct 내부 슬롯을 가지고 있는 normal만 prototype이라는 프로퍼티를 갖고 있다.



const me = new Person(); -> kind확인 후 me.Person[[contructor]]  + prototype



`__proto__`는 접근자 프로퍼티로 getter, setter 함수를 가지고 있다.

`circle1.__proto__;` 참조

찾는 



`__proto__`는 object.prototype에서 상속받은거다.



식별자를 찾을 떄는 참조한 코드가 속해있는 스코프부터 찾는다.

프로퍼티 찾을 때는 . 앞에 부터 찾는다.



모든 프로토타입은 constructor라는 프로퍼티를 갖는다.

Object -> Object.prototype (prototype)

Object <- Object.prototype (constructor)



circle1.consctructor는 찾으러올라가서 Circle 생성자 함수를 찾을 수 있다.

단방향 링크드 리스트라서 Circle 생성자 함수는 circle1을 찾을 수 없다.



프로토타입 체인이란 상속관계에서 프로퍼티를 탐색하는 메커니즘이다. 



`Circle.prototype === circle1.__proto__` // true



인스턴스에서 메소드는 인스턴스 메소드라고 부르고, 생성자 함수.prototype의 메소드는 prototype메소드, 생성자함수의 메소드는 정적 메소드라 부르자



---



객체의 중요한 키워드 상속, 추상화, 캡슐화



**캡슐화**

- 정보 은닉의 목적으로 만들어짐 (알약의 캡슐화로 쓴맛을 숨긴다)



클래스 기반 프로그래밍 언어에서는 접근제한자 public , private, protected를 사용해서 접근 제한을 정할 수 있다.

하지만 자바스크립트의 모든 것은 public이고 private, proteced를 지원해주는게 없다. 근데 클로저로 이걸 할 수 있다.



[의문]

정적메소드 프로토타입메소드 인스턴스메소드 만드는 방법과

다르게 부르는 이유



**오버라이딩과 프로퍼티 쉐도잉**



- 프로퍼티 쉐도잉
  - 프로토타입 메소드와 인스턴스 메소드의 프로퍼티 이름이 같을 때 인스턴스 메소드를 인스턴스에서 호출하면 프로토타입 메소드는 가려진다. 

- 오버라이딩
  - 상위 클래스가 가지고 있는 메소드를 하위 클래스가 재정의하여 사용하는 방식



- 10. 프로토타입의 교체



Object.create는 객체를 만드는데 프로토타입의 체인을 교체하면서 객체를 만들때 사용한다.



 Object.create(prototype[, propertiesObject]) 



 Object.create로 하면 

  그 이유는 Object.create 메소드를 통해 프로토타입 체인을 생성하지 않는 객체, 다시 말해 프로토타입의 종점에 위치하는 객체를 생성할 수 있기 때문이다. 이때 프로토타입 체인을 생성하지 않는 객체는 Object.prototype의 빌트인 메소드를 사용할 수 없다. 



 console.log(Object.prototype.hasOwnProperty.call(obj, 'a')) ;

 console.log(function.call(obj, 'a')) 

call -> this를 뭘로 쓸지, 'a' 인수를 줄 수 있다.  ,로 구분

apply -> 는 두번째 인수를 배열로 적어줘야함

bind -> this만 주고 호출안함



정적메소드는 생성자함수.생성자함수가가진메소드로 호출한다

인스턴스 메소드와 프로토타입 메소드는 인스턴스.으로 호출한다. 그래서 무조건 인스턴스가 있어야 쓸수있다.



14. 프로퍼티 존재확인

프로퍼티키 in 확인할 객체

in은 상속관계에 있는 모든 프로퍼티를 다 본다.



상속관계빼고 나한테 있는지 말해줘 hasOwnProperty로 확인한다.



15. 프로퍼티 열거

for...in

 for (변수선언문 in 객체) { … } 



상속받을 수 있는 것도 죄다 연결한다.



 for (const prop in person) {  console.log(prop + ': ' + person[prop]); } 



 for (const prop in person) {  // 객체 자신의 프로퍼티인지 확인한다.  if (!person.hasOwnProperty(prop)) continue;  console.log(prop + ': ' + person[prop]); } 



## 15.2. Object.keys/values/entries 메소드

자기것들만 반환 상속은 반환 안한다.





this는 반드시 객체를 가리킨다.

화살표함수는  this 자체를 안갖고있다.



































인스턴스 메소드는 반드시 인스턴스가 있어야함

프로토타입 메소드는 인스턴스가 없어도 되나 나중에 this 에 문제가 된다.

new 할때 인스턴스가 생성된다. prototype메소드를 부르려면 인스턴스가 있어야한다. 정적 메소드는 인스턴스 없이도 생성할 수 있다.



`__proto__`

proto 쓰지 말고 Object.getPrototypeOf(circle1)를 사용해라

```javascript
console.log(circle1.__proto__ === Circle.prototype);
console.log(Object.getPrototypeOf(circle1));

console.log(Object.setPrototypeOf(circle1)); // 할당 시
```



인스턴스의 입장에서 인스턴스의 prototype을 찾아갈 수 있다.

여기에 할당하면 prototype의 값을 바꾸는 것



인스턴스의 프로토타입 객체를 참조한다.



모든 객체는 [[Prototype]] 내부 슬롯을 갖고 있고 접근할 수 있다.



객체 리터럴로 정의한 객체는 누가 만들었나

- 객체 리터럴은 Object 생성자 함수가 만들었다고 볼 수 있다.
- CreateObject 추상연산이 만든다 / 빈객체만들고, 안에 프로퍼티 디스크립터를 가지고 빈객체에 프로퍼티를 추가한다.



왜 function 생성자함수를 쓰지 말라고 했었지?  클로져가 안만들어진다.



```javascript
console.log(person.toString()); // 정적메소드
console.log(Object.getPrototypeOf(person)); // 프로토타입메소드
```

1번은 인스턴스가 있어야 함 / 2번은 인스턴스가 없어도 됨



일반 객체이기 때문에 모든 객체의 프로토타입은 Object.prototype

Object.prototype은 프로토체인의 종점 여기에서 `__proto__`는 null 나옴

Object.prototype은 자바스크립트의 모든 애들이 다 쓸 수 있다.

원시값도 (1). 하면 래퍼 객체가 만들어진다.



왜 `__proto__`는 접근자 프로퍼티 일까

순환 참조를 막기 위해 무한 루프가 됨 / 가비지 컬렉터에 대상이 되지 않음



## Object.create에 의한 직접 상속

