# 전역 객체



## 1. 전역 객체란?

- 전역 객체는 코드가 실행되기 이전 단계에 자바스크립트 엔진에 의해 생성되는 특수한 객체이다. 
- 클라이언트 사이드 환경에서는 **window**, 서버 사이드 환경에서는 **global** 객체를 의미한다.

- 내부에 포함되는 것들
  - 모든 표준 빌트인 객체(Object, String, Number, Boolean, Function, Array, RegExp, Date, Math, Promise)
  - 환경에 따른 호스트 객체(클라이언트 web API 또는 Node.js의 호스트 API)
    - 클라이언트 web APi : DOM, BOM, Canvas, XMLHttpRequest, Fetch, requestAnimationFrame, SVG, Web Storage, Web Component, Web worker
  - 프로퍼티로 var 키워드로 선언한 전역변수와 전역 함수
- 특징
  - 개발자가 의도적으로 생성할 수 없다.
  - 전역 객체의 프로퍼티를 참조할 때 window를 생략할 수 있다.
  - var 키워드로 선언한 전역 변수, 선언하지 않은 변수에 값을 할당한 암묵적 전역 변수, 전역 함수는 전역 객체의 프로퍼티가 된다.
  - let이나 const 키워드로 선언한 전역 변수는 전역 객체 window의 프로퍼티가 아니다. 즉 window.foo와 같이 접근할 수 없다. let이나 const 키워드로 선언한 전역 변수는 보이지 않는 개념적인 블록 내에 존재하게 된다.
  - 전역 객체는 몇가지 프로퍼티와 메소드를 가지고 있다. 전역 객체의 프로퍼티와 메소드는 window를 생략하여 참조/호출할 수 있으므로 전역 변수와 전역 함수처럼 사용할 수 있다.



[의문]

- 전역 객체의 프로퍼티를 참조할 때 window를 생략할 수 있다고 하는데 global은 생략가능한가?



## 2. 전역 프로퍼티(Global property)



- 전역 프로퍼티는 전역 객체의 프로퍼티를 말한다. 애플리케이션 전역에서 사용하는 값들을 나타내기 위해 사용한다.



### 1) Infinity

- 숫자 타입인 값으로 양/음의 무한대를 나타내는 숫자값 Infinity를 갖는다.



### 2) NaN

- NaN 프로퍼티는 숫자가 아님을 나타내는 숫자값 NaN을 갖는다.  NaN 프로퍼티는 Number.NaN 프로퍼티와 같다.



### 3) undefined

- undefined 프로퍼티는 원시 타입 undefined를 값으로 갖는다.





## 3. 빌트인 전역 함수(Built-in global function)

- 빌트인 전역 함수는 애플리케이션 전역에서 호출할 수 있는 빌트인 함수로서 전역 객체의 메소드이다.



### 1) eval

- 문자열 형태로 매개변수에 전달된 코드를 런타임에 동적으로 평가하고 실행하여 결과값을 반환한다. 
- 전달된 문자열 코드가 여러 개의 문으로 이루어져 있다면 모든 문을 실행 후 마지막 결과값을 반환한다.
- 객체 리터럴과 함수 리터럴은 반드시 괄호로 둘러 싼다.

```javascript
evar(code)

var o = eval('({ a: 1 })'); // 객체 리터럴은 반드시 괄호로 둘러 싼다.
console.log(o); // {a:1}

var f = eval('(function() {return 1; })'); // 함수 리터럴은 반드시 괄호로 둘러 싼다.
console.log(f()); // 1
```



- 자바스크립트는 렉시컬 스코프를 따르므로 스코프는 함수 정의가 평가되는 시점에 결정된다. 다시 말해 스코프는 런타임에 결정되는 것이 아니다. 하지만 eval 함수는 런타임에 자신이 호출된 기본 스코프를 동적으로 수정할 수 있다.  하지만 성능적인 면에서 손해를 감수해야 한다.



- 엄격 모드에서 eval 함수는 기존의 스코프를 수정하지 않고 자체적인 스코프를 생성한다.
- eval 함수에 전달한 변수 선언문이 let, const 키워드를 사용했다면 엄격 모드가 적용된다.



- eval 함수를 통해 사용자로부터 입력 받은 콘텐츠를 실행하는 것은 보안에 매우 취약하고, 자바스크립트 엔진에 의해 최적화가 수행되지 않으므로 일반적인 코드 실행에 비해 처리 속도가 느리기 때문에 eval 함수의 사용은 가급적 금지되어야한다.

  

[eval 의문]

- eval를 왜 사용하는가? 사용자로부터 입력을 받고 콘텐츠를 실행하는 것인가?
- 엄격 모드에서 eval 함수는 기존의 스코프를 수정하지 않고 자체적인 스코프를 생성한다의 예시에서 eval는 함수이기 때문에 함수레벨스코프가 적용되어 안에 있는 x가 지역변수처럼 존재하게 되는 것인가?



### 2) isFinite

- 매개 변수에 전달된 값이 정상적인 유한수인지 검사하여 그 결과를 불리언 타입으로 반환한다.
- 매개변수에 전달된 값이 숫자가 아닌 경우, 숫자로 타입을 변환한 후 검사를 수행한다.



```javascript
isFinite(testValue)

console.log(isFinite(Infinity)); // false
console.log(isFinite(NaN)); // false
console.log(isFinite('Hello')); // false
console.log(isFinite('2005/12/12')); // false

console.log(isFinite(0)); // true
console.log(isFinite(2e64)); // true
console.log(isFinite('10')); // true
console.log(isFinite(null)); // true
```



### 3) isNaN

- 매개변수에 전달된 값이 NaN인지 검사하여 그 결과를 불리언 타입으로 반환한다.
- 매개변수에 전달된 값이 숫자가 아닌 경우, 숫자로 타입을 변환한 후 검사를 수행한다.

```javascript
isNaN(testValue)

console.log(isNaN(NaN)); // true
console.log(isNaN('blabla')); // true
console.log(isNaN(undefined)); // true
console.log(isNaN({NaN})); // true
console.log(isNaN(new Date().toStirng()));  // true
```



### 4) parseFloat

- 매개변수에 전달된 문자열을 부동소수점 숫자로 변환하여 반환한다.

```javascript
parseFloat(string)

console.log(parseFloat('3.14')); // 3.14
console.log(parseFloat('10.00')); // 10
console.log(parseFloat('34 45 66')); // 34 -> 공백으로 구분된 문자열은 첫번째 문자열만 반환
console.log(parseFloat('He was 40')); // NaN -> 첫번째 문자열을 숫자로 변환 불가하면 NaN 반환
console.log(parseFloat('  60  ')); // 60 -> 공백은 무시됨
```



### 5) parseInt

- 매개변수에 전달된 문자열을 정수형 숫자(Integer)로 해석하여 반환한다. 반환값은 언제나 10진수이다.

```javascript
parseInt(string, radix);

// 주어진 문자열을 10진수 정수로 해석하여 반환한다.
console.log(parseInt('10.123')); // 10

// 주어진 변환 대상 값이 문자열이 아니면 문자열로 변환 후 정수형 숫자로 해석하여 반환한다.
console.log(parseInt(10.123)); // 10

// 2번째 매개변수에는 진법을 나타내는 기수를 지정할 수 있고 지정 시 해당 기수의 숫자로 해석하여 반환한다.
// 단 반환값은 언제나 10진수이다.
console.log(parseInt('10', 8)); // 8
console.log(parseInt('10', 16)); // 16
```



> 기수를 지정하여 10진수 숫자를 해당 기수의 문자열로 변환하여 반환하고 싶을 때는 **Number.prototype.toString** 메소드를 사용한다.



- 두번째 매개변수에 진법을 나타내는 기수를 지정하지 않아도 첫번째 매개변수에 전달된 문자열이 “0x” 또는 “0X”로 시작하는 16진수 리터럴이라면 16진수로 해석하여 10진수 정수로 반환한다. 
-  하지만 2진수 리터럴과 8진수 리터럴은 제대로 해석하지 못한다. ( ES5 이전까지는 비록 사용을 금지하고는 있었지만 “0”로 시작하는 숫자를 8진수로 해석하였다. ES6부터는 “0”로 시작하는 숫자를 8진수로 해석하지 않고 10진수로 해석한다. 따라서 문자열을 8진수로 해석하려면 지수를 반드시 지정하여야 한다. )
-  첫번째 매개변수에 전달된 문자열의 첫번째 문자가 해당 지수의 숫자로 변환될 수 없다면 NaN을 반환한다. 
-  하지만 첫번째 매개변수에 전달된 문자열의 두번째 문자부터 해당 진수를 나타내는 숫자가 아닌 문자(예를 들어 2진수의 경우, 2)와 마주치면 이 문자와 계속되는 문자들은 전부 무시되며 해석된 정수값만을 반환한다. 
-  첫번째 매개변수에 전달된 문자열에 공백이 있다면 첫번째 문자열만 해석하여 반환하며 전후 공백은 무시된다. 만일 첫번째 문자열을 숫자로 해석할 수 없는 경우, NaN을 반환한다. 

```javascript
const x = 15;
console.log(x.toString(2)); // '1111'
console.log(x.toString()); // '15'
console.log(parseInt('0xf')); // 15

// 2진수로 해석할 수 없는 '2'이후의 문자는 모두 무시된다.
console.log(parseInt('102', 2)); // 2
```



### 6) encodeURI /decodeURI

-  encodeURI 함수는 매개변수로 전달된 URI(Uniform Resource Identifier)를 인코딩한다.
- URI는 인터넷에 있는 자원을 나타내는 유일한 주소를 말한다. (URI의 하위개념으로 URL, URN이 있다.)

![](https://poiemaweb.com/assets/fs-images/20-2.png)



encodeURI : 완전한 URI를 전달받아 인코딩하여 이스케이프 처리한다.

decodeURI: 인코딩된 URI를 전달받아 이스케이프 처리되기 이전으로 디코딩한다.

```javascript
encodeURI(uri)
decodeURI(encodedURI)

// 완전한 URI
const uri = 'http://example.com?name=이웅모&job=programmer&teacher';

// encodeURI 함수는 완전한 URI를 전달받아 인코딩하여 이스케이프 처리한다.
const enc = encodeURI(uri);
console.log(enc);
// http://example.com?name=%EC%9D%B4%EC%9B%85%EB%AA%A8&job=programmer&teacher

// decodeURI 함수는 인코딩된 완전한 URI를 전달받아 이스케이프 처리되기 이전으로 디코딩한다.
const dec = decodeURI(enc);
console.log(dec);
// http://example.com?name=이웅모&job=programmer&teacher
```



[encodeURI/ decodeURI 문의]

- 이스케이프란?
  -  이스케이프 처리는 네트워크를 통해 정보를 공유할 때 어떤 시스템에서도 읽을 수 있는 아스키 문자 셋(ASCII Character-set)으로 변환하는 것이다. 
  -  UTF-8 특수문자의 경우, 1문자당 1~3byte, UTF-8 한글 표현의 경우, 1문자당 3btye이다. 예를 들어 특수문자 공백(space)은 %20, 한글 ‘가’는 %EC%9E%90으로 인코딩된다. 
-  인코딩이란 URI의 문자들을 이스케이프 처리하는 것을 의미한다. 





### 7) encodeURIComponent / decodeURIComponent

- **encodeURIComponent 함수**는 매개변수로 전달된 URI(Uniform Resource Identifier) 구성 요소(component)를 인코딩한다. (여기서 인코딩이란 URI의 문자들을 이스케이프 처리하는 것을 의미 / 단, 알파벳, 0~9의 숫자, - _ . ! ~ * ‘ ( ) 문자는 이스케이프 처리에서 제외됨 )
- **decodeURIComponent** 함수는 매개변수로 전달된 URI 구성 요소를 디코딩한다. 



- encodeURIComponent 함수는 매개변수로 전달된 문자열을 URI의 구성요소인 쿼리 파라미터의 일부 간주한다. 따라서 쿼리 파라미터 구분자로 사용되는 =, ?, &를 인코딩한다.
- 반면 encodeURI 함수는 매개변수로 전달된 문자열을 완전한 URI 전체라고 간주한다. 따라서 쿼리 파라미터 구분자로 사용되는 =, ?, &를 인코딩하지 않는다.

```javascript
// URI의 쿼리 파라미터
const uriComp = 'name=이웅모&job=programmer&teacher';

// encodeURIComponent 함수는 매개변수로 전달된 문자열을 URI의 구성요소인 쿼리 파라미터의 일부 간주한다.
// 따라서 쿼리 파라미터 구분자로 사용되는 =, ?, &를 인코딩한다.
let enc = encodeURIComponent(uriComp);
console.log(enc);
// name%3D%EC%9D%B4%EC%9B%85%EB%AA%A8%26job%3Dprogrammer%26teacher

let dec = decodeURIComponent(enc);
console.log(dec);
// 이웅모&job=programmer&teacher

// encodeURI 함수는 매개변수로 전달된 문자열을 완전한 URI로 간주한다.
// 따라서 쿼리 파라미터 구분자로 사용되는 =, ?, &를 인코딩하지 않는다.
enc = encodeURI(uriComp);
console.log(enc);
// name=%EC%9D%B4%EC%9B%85%EB%AA%A8&job=programmer&teacher

dec = decodeURI(enc);
console.log(dec);
// name=이웅모&job=programmer&teacher
```



[문의]

- 쿼티 파라미터?