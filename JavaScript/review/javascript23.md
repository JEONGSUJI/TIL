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