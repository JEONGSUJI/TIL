# Number 래퍼 객체

Number 객체는 원시 타입 number를 다를 때 유용한 프로퍼티와 메소드를 제공하는 레퍼 객체이다.



- 원시 타입이 wrapper 객체의 메소드를 사용할 수 있는 이유는?

원시 타입으로 프로퍼티나 메소드를 호출할 때 원시 타입과 연관된 wrapper 객체로 일시적으로 변환하여 프로토타입 객체를 공유하게 되기 때문이다.



## 1. Number Constructor

```javascript
new Number(value);
```

- Number 객체는 Number() 생성자 함수를 통해 생성할 수 있다.

- 만일 인자가 숫자로 변환될 수 없다면 NaN을 반환한다.
- Number() 생성자 함수를 new 연산자를 붙이지 않아 생성자로 사용하지 않으면 Number 객체를 반환하지 않고 원시 타입 숫자를 반환한다.



## 2. Number Property

정적 프로퍼티로 Number 객체를 생성할 필요없이 Number.propertyName의 형태로 사용한다.



### 1) Number.EPSILON

JavaScript에서 표현할 수 있는 가장 작은 수이다.

부동 소수점 산술 연산 비교는 정확한 값을 기대하기 어렵기 때문에 Number.EPSILON을 사용하여 비교 기능을 갖는 함수를 작성하여야 한다.



### 2) Number.MAX_VALUE

JavaScript에서 사용 가능한 가장 큰 숫자를 반환한다.

MAX_VALUE보다 큰 숫자는 Infinity이다.



### 3) Number.MIN_VALUE

JavaScript에서 사용 가능한 가장 작은 숫자를 반환한다.

MIN_VALUE는 0에 가장 가까운 양수 값이다.



### 4) Number.POSITIVE_INFINITY

양의 무한대 Infinity를 반환한다.



### 5) Number.NEGATIVE_INFINITY

음의 무한대 -Infinity를 반환한다.



### 6) Number.NaN

숫자가 아님을 나타내는 숫자값이다.

Number.NaN 프로퍼티는 window.NaN 프로퍼티와 같다.



## 3. Number Method

### 1) Number.isFinite()

매개변수에 전달된 값이 정상적인 유한수인지를 검사한다.

결과는 Boolean으로 반환한다.

전역함수와 달리 인수를 변환하지 않기 때문에 숫자가 아닌 인수가 주어졌을 때 반환값은 언제나 false이다.



> **전역함수 isFinite()와 Number.isFinite()의 차이**
>
> 전역함수의 경우 인수를 숫자로 변환하여 검사를 수행하지만 Number.isFinite()는 인수를 변환하지 않는다.



### 2) Number.isInteger()

매개변수에 전달된 값이 정수인지 검사한다.

결과는 Boolean으로 반환한다.



### 3) Number.isNaN()

매개변수에 전달된 값이 NaN인지 검사한다.

결과는 Boolean으로 반환한다.



### 4) Number.isSafeInteger()

매개변수에 전달된 값이 안전한 정수값인지 검사한다.

안전한 정수값은   -(2<sup>53</sup> - 1)와 2<sup>53</sup> - 1  사이의 정수값이다.

결과는 Boolean으로 반환한다.



### 5) Number.prototype.toExponential()

대상을 지수 표기법으로 변환하여 문자열로 반환한다.

지수 표기법이란 매우 큰 숫자를 표기할때 주로 사용하며 e앞에 있는 숫자에 10에 n승이 곱하는 형식으로 수를 나타내는 방식이다.

```javascript
// 주의사항
77.toString(); // SyntaxError
1.23.toString(); // '1.23'

// 권장
(77).toString(); // '77'
77 .toString(); // '77'
```



### 6) Number.prototype.toFixed()

매개변수로 지정된 소숫점자리를 반올림하여 문자열로 반환한다.



### 7) Number.prototype.toPrecision()

매개변수로 지정된 전체 자릿수까지 유효하도록 나머지 자릿수를 반올림하여 문자열로 반환한다.

지정된 전체 자릿수로 표현할 수 없는 경우 지수 표기법으로 결과를 반환한다.



### 8) Number.prototype.toString()

숫자를 문자열로 변환하여 반환한다.



### 9) Number.prototype.valueOf()

Number 객체의 원시 타입 값을 반환한다.