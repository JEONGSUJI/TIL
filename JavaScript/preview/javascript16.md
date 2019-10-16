# 생성자 함수에 의한 객체 생성



## 1. Object 생성자 함수

- **new 연산자와 함께 Object 생성자 함수를 호출하면 빈 객체를 생성하여 반환한다.**
- 빈 객체 생성 이후 프로퍼티 또는 메소드를 추가하여 객체를 완성한다.
- **생성자 함수란 new 연산자와 함께 호출하여 객체(인스턴스)를 생성하는 함수를 말하며, 생성자 함수에 의해 생성된 객체를 인스턴스라 한다.**
- 반드시 해당을 사용해 빈 객체를 생성해야 하는 것은 아니다. 객체 리터럴을 사용하는 것이 더 간편하다. 단, 대량 생성하고자 할 때는 생성자 함수를 쓰는게 좋다.
  



> **인스턴스**
>
> 객체가 메모리에 저장되어 실제로 존재하는 것에 초점을 맞춘 용어로 생성자 함수도 객체이기 때문에 **생성자 함수나 클래스가 생성한 객체를 다른 객체와 구분하기 위해 인스턴스라 부른다.**



```javascript
//빈 객체의 생성
const person = new Object();

// 프로퍼티 추가
person.name = 'Lee';
person.sayHello = function () {
    console.log('Hi! My Name is' + this.name);
};
```



자바스크립트는 Object 생성자 함수 이외에도 String, Number, Boolean, Function, Array, Date, RegExp 등 빌트인 생성자 함수를 제공한다.

```javascript
// String 생성자 함수에 의한 String 객체 생성
const strObj = new String('Lee');
console.log(typeof strObj); // object
console.log(strObj); // String {"Lee"}

// Number 생성자 함수에 의한 Number 객체 생성
const numObj = new Number(123);
console.log(typeof numObj); // object
console.log(numObj); // Number {123}

// Boolean 생성자 함수에 의한 Boolean 객체 생성
const boolObj = new Boolean(true);
console.log(typeof boolObj); // object
console.log(boolObj); // Boolean {true}

// Function 생성자 함수에 의한 Function 객체 생성
const func = new Function('x', 'return x * x');
console.log(typeof func); // function
console.dir(func); // f anonymous(x )

// Array 생성자 함수에 의한 Array 객체(배열) 생성

// RegExp 생성자 함수에 의한 RegExp 객체(정규 표현식) 생성

// Date 생성자 함수에 의한 Date 객체 생성
```



## 2. 생성자 함수

### 1) 객체 리터럴에 의한 객체 생성 방식의 문제점

- 객체 리터럴에 의한 객체 생성방식은 직관적이고 간편하나 **단 하나의 객체만을 생성**하기 때문에 **여러개 생성해야하는 경우 비효율적**이다.

  (객체 리터럴에 의해 생성하는 경우 프로퍼티 구조가 동일함에도 불구하고 매번 같은 프로퍼티와 메소드를 기술해야함)



### 2) 생성자 함수에 의한 객체 생성 방식의 장점

- 생성자 함수에 의한 객체 생성방식은 **객체를 생성하기 위한 템플릿(클래스)처럼 생성자 함수를 사용**하여 **프로퍼티 구조가 동일한 객체 여러 개를 간편하게 생성**할 수 있다.



```javascript
// 객체 리터럴에 의한 객체 생성방식
const circle1 = {
    radius: 5,
    getDiameter() {
        return 2 * this.radius;
    }
};

// 생성자 함수에 의한 객체 생성방식
function Circle(radius){
    this.radius = radius;
    this.getDiameter = function () {
        return 2 * this.radius;
    };
}

// 인스턴스의 생성
const circle1 = new Circle(5);
```



> **this**
>
> 객체 자신의 프로퍼티나 메소드를 참조하기 위한 자기 참조 변수(Self-referencing variable)이다. **this가 가리키는 값, 즉 this 바인딩은 함수 호출 방식에 따라 동적으로 결정된다**
>
> | 함수 호출 방식       | this가 가리키는 값                     |
> | -------------------- | -------------------------------------- |
> | 일반 함수로서 호출   | 전역 객체(window, global)              |
> | 메소드로서 호출      | 메소드를 호출한 객체                   |
> | 생성자 함수로서 호출 | 생성자 함수가 (미래에) 생성할 인스턴스 |
> | 객체 리터럴          | 자신(Self)                             |
>
> ```javascript
> function foo() {
>  	console.log(this);
> }
> 
> // 일반 함수로서 호출
> foo(); // window (단, Node.js 환경에서는 global)
> 
> // 메소드로서 호출
> const obj = { foo };
> obj.foo(); // obj
> 
> // 생성자 함수로서 호출
> const inst = new foo(); //inst
> ```



### 3) 내부 메소드 [[Call]]과 [[Construct]]

함수 선언문과 함수 표현식으로 정의한 함수는 일반적인 함수 호출, 생성자 함수로서 호출(new 연산자와 함께 호출하여 객체를 생성하는 것)이 모두 가능하다.

함수 객체는 함수로서 동작하기 위해 일반 객체의 내부 슬롯과 내부 메소드 이외에 내부 슬롯과 내부 메소드를 추가적으로 가지고 있다.



- 내부 메소드 [[Call]]을 갖는 함수 객체 : callable
  - 호출할 수 있는 객체, 함수를 말한다. (함수 객체는 반드시 callable)

함수 객체와 일반 객체의 차이는 호출인데 그 이유는 함수객체는 [[Call]] 내부 메소드를 갖는 것이다. 



- 내부 메소드 [[Construct]]를 갖는 함수 객체 : construct
  
  - **생성자 함수로서 호출할 수 있는 객체**를 의미한다. 이는 new 연산자(또는 super 연산자)와 함께 호출하는 것을 의미한다.
  
  
- 내부 메소드 [[Construct]]를 갖지 않는 함수 객체 : non-constructor
  - 메소드함수와 화살표함수가 이에 해당한다.
  - ECMAScript에서는 화살표 함수로 사용한 것과 ES6 축약표현으로 선언한 것만 메소드라고 한다.



![](https://poiemaweb.com/assets/fs-images/16-3.png)

- 모든 함수 객체는 callable이지만 모든 함수 객체가 constructor인 것은 아니다.



> **super 키워드**
>
> super는 ES6에서 도입된 클래스에서 부모 클래스를 참조할 때 또는 부모 클래스의 생성자를 호출할 때 사용한다.



#### 4) constructor와 non-constructor의 구분

자바스크립트 엔진은 함수를 생성할 때, FunctionCreate라는 추상 연산을 사용한다. 추상연산 FunctionCreate는 함수 정의가 평가될 때 호출되는데, 이때 **함수의 정의 방식**에 따라 **FunctionCreate의 첫번째 매개변수 kind에 함수의 종류를 나타내는 문자열이 전달**된다. (일반함수정의 : Normal / 화살표 함수 정의를 평가할 때 : Arrow / 메소드 정의를 평가할 때 : Method )

주의 : 일반적으로 프로퍼티의 값인 함수는 모두 메소드로 통칭하나 **ECMAScript 사양에서 메소드 정의란 ES6의 메소드 축약 표현만을 의미한다. **즉 함수 정의 방식에 따라 함수의 종류를 구분한다.

- costructor : 일반 함수로 정의된 함수
- non-constructor : 함수의 종류가 Arrow, Method인 함수

**=> 일반 함수로 정의된 함수만이 생성자 함수로서 호출 될 수 있다.**



주의! 생성자 함수로서 호출될 것을 기대하고 정의하지 않은 일반 함수에 new 연산자를 붙여 호출하면 생성자 함수처럼 동작할 수 있다. 

=> 따라서 **생성자 함수**는 일반적으로 첫문자를 대문자로 기술하는 **파스칼 케이스로 명명**하여 일반 함수와 구별할 수 있도록 노력한다.



> **추상연산 (abstract operation)**
>
> 추상연산은 ECMAScript 사양에서 내부 동작의 구현 알고리즘을 표현한 것



#### 5) 생성자 함수의 인스턴스 생성 과정

- **생성자 함수의 역할**은 프로퍼티 구조가 동일한 인스턴스를 생성하기 위한 템플릿으로 동작하여 **인스턴스를 생성하는 것(필수)**과 **생성된 인스턴스를 초기화(옵션) 하는 것**이다.



자바스크립트 엔진은 암묵적인 처리를 통해 인스턴스를 생성하고 반환한다.

1. **인스턴스 생성과 this 바인딩 암묵적으로 빈 객체가 생성된다.** (이 빈 객체가 바로 생성자 함수가 생성한 인스턴스) 생성자 함수가 생성한 인스턴스의 프로토타입으로 생성자 함수의 prototype 프로퍼티가 가리키는 객체가 설정된다. 암묵적으로 생성된 빈 객체, 즉 인스턴스는  this에 바인딩된다. 

2. **인스턴스 초기화 / 생성자 함수에 기술되어 있는 코드가 실행되어 this에 바인딩 되어있는 인스턴스를 초기화한다.** 즉, this에 바인딩되어 있는 인스턴스에 프로퍼티나 메소드를 추가하고 생성자함수가 인수로 전달받은 초기값을 인스턴스 프로퍼티에 할당하여 초기화하거나 고정값을 할당한다. 이 처리는 개발자가 기술한다.

3. **인스턴스 반환 / 생성자 함수 내부의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.** 만약 this가 아닌 다른 객체를 명시적으로 반환하면 this가 반환되지 못하고 return 문에 명시한 객체가 반환된다.

   하지만 명시적으로 원시값을 반환하면 원시값 반환은 무시되고 암묵적으로 this가 반환된다. 이처럼 *생성자 함수 내부에서 명시적으로 this가 아닌 다른 값을 반환하는 것은 생성자 함수의 기본 동작을 훼손한다.* 따라서 **생성자 함수 내부에서 return문을 반드시 생략해야한다.**



```javascript
function Circle(radius) {
    // 1. 암묵적으로 빈 객체가 생성되고 this에 바인딩 됨
    // Circle {}
    
    // 2. 생성자 함수에 기술되어 있는 코드가 실행되어 this에 바인딩 되어있는 인스턴스를 초기화 한다.
    // 즉, this에 바인딩 되어있는 인스턴스에 프로퍼티나 메소드를 추가하고 생성자 함수가 인수러 전달받은 초기값을 인스턴스 프로퍼티에 할당하여 초기화하거나 고정값을 할당한다.
    this.radius = radius;
  	this.getDiameter = function () {
    	return 2 * this.radius;
 	};
    
    // 3. 인스턴스 반환
    // 생성자 함수 내부의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.
    // 만약 this가 아닌 다른 객체를 명시적으로 반환하면 this가 반환되지 못하고 return문에 명시한 객체가 반환됨
}

	// 인스턴스 생성
	// Circle 생성자 함수는 명시적으로 반환한 객체를 반환한다.
const circle = new Circle(1);
console.log(circle);
	// Circle {radius: 1, getDiameter: ƒ}
```





> **바인딩**
>
> 식별자와 값을 연결하는 과정을 의미한다



#### 6) new 연산자

- 일반 함수와 생성자 함수의 특별한 형식적 차이는 없다. new 연산자와 함께 함수를 호출하면 해당 함수는 생성자 함수로 동작한다.
- 단, new 연산자와 함께 호출하는 함수는 non-constructor가 아닌 constructor이여야 한다.
-  반대로 new 연산자 없이 생성자 함수를 호출하면 일반 함수로 호출된다. 다시 말해, 함수 객체의 내부 메소드 [[Construct]]가 호출되는 것이 아니라 [[Call]]이 호출된다. 



```javascript
// case 1. 생성자 함수로서 정의하지 않은 일반 함수
function add(x,y) {
    return x + y;
}

// 생성자 함수로서 정의하지 않은 일반 함수를 new 연산자와 함께 호출
let inst = new add();
// 함수가 객체를 반환하지 않으므로 반환문이 무시되고 빈객체가 생성되어 반환
console.log(inst); // {}

// case 2. 객체를 반환하는 일반함수
function createUser(name, role) {
    return { name , role };
}

// 생성자 함수로서 정의하지 않은 일반함수를 new 연산자와 함께 호출
inst = new createUser('Lee', 'admin');
// 함수가 생성한 객체를 반환한다.
console.log(inst); {name: "Lee", role: "admin"}
```



```javascript
// 생성자 함수
function Circle(radius) {
    this.radius = radius;
    this.getDiameter = function () {
        return 2 * this.radius;
    };
}

// new 연산자 없이 생성자 함수 호출 시 일반 함수로서 호출된다
const circle = Circle(5);
console.log(circle); // undefined

// 일반함수 내부의 this는 전역객체 window를 가리킨다.
console.log(radius); //5
console.log(getDiameter()); // 10

circle.getDiameter(); //error can not read property
```



#### 7) new.target

- this와 유사하게 모든 함수 내부에서 암묵적인 지역 변수와 같이 사용되며 메타 프로퍼티라고 부른다.
- 참조 식별자, new 연산자와 함께 나를 호출했는지 알 수 있는 것, 방어 코드
- 함수 내부에서 new.target을 사용하면 new 연산자와 함께 함수가 호출되었는지를 확인할 수 있다. 함수가 new 연산자와 함께 호출되면 함수 내부의 new.target은 함수 자신을 가리킨다. (new 연산자 없이 호출된 함수 내부의 new.target은 undefined이다.)



```javascript
// 생성자 함수
function Circle(radius) {
    // 이 함수가 new 연산자와 힘께 호출되지 않았다면 new.target은 undefined이다.
    if (!new.target) {
        // new 연산자와 함께 호출하여 생성된 인스턴스를 반환
        return new Circle(radius);
    }
    this.radius = radius;
  	this.getDiameter = function () {
    return 2 * this.radius;
  };
}

// new 연산자 없이 생성자 함수를 호출하여도 생성자 함수로서 호출된다.
const circle = Circle(5);
console.log(circle.getDiameter());
```



단, new.target은 ES6에서 도입된 최신 문법으로 IE에서는 지원하지 않기 때문에 new.target을 사용할 수 없는 상황이라면 **스코프 세이프 생성자 패턴**을 사용할 수 있다.



```javascript
function Circle(radius){
    if (!(this instansceof Circle)){
        return new Circle(radius);
    }
    this.radius = radius;
    this.getDiameter = function () {
        return 2 * this.radius;
    };
}

const circle = Circle(5);
console.log(circle.getDiameter());
```



- new 연산자와 함께 생성자 함수에 의해 생성된 객체는 프로토타입에 의해 생성자 함수와 연결된다.
- 대부분의 빌트인 생성자 함수는 new 연산자와 함께 호출되었는지를 확인 후 적절한 값을 반환한다. 예를 들어 Object 또는 Function 생성자 함수는 new 연산자 없이 호출해도 new 연산자와 함께 호출했을 때와 동일하게 동작한다.



[주의해야하는 사항]

- String 생성자 함수는 new 연산자와 함께 호출했을 때 String 객체를 생성하여 반환하지만 new 연산자 없이 호출하면 문자열 리터럴을 반환한다. 



하지만 ES6를 지원하지 않는 Internet Explorer에서는 instanceof로 비교하고 다시 호출한다.



---

**[문의]**

- 자바스크립트는 Object 생성자 함수 이외에도 String, Number, Boolean, Function, Array, Date, RegExp 등 빌트인 생성자 함수를 제공한다. 부분의 예시 코드들의 결과값의 동작되는 원리에 대해 더 살펴봐야 할 것 같다. (Array, RegExp, Date 생성자 함수 부분은 추후 학습 후 진행해보기)
- 추상연산?
- 생성자 함수의 인스턴스 생성 과정
  - 인스턴스가 생성되고 this에 바인딩 된다는 것이 무슨 말이야?
    - 템플릿화를 생각한다면 이해가 됨
- <code>`o.__proto__`</code> === Object.prototype
