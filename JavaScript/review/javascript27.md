# 수학 상수와 함수를 위한 Math 객체

Math 객체는 수학 상수와 함수를 위한 프로퍼티와 메소드를 제공하는 빌트인 객체이다. Math 객체는 생성자 함수가 아니다. 따라서 Math 객체는 정적 프로퍼티와 메소드만을 제공한다.



## 1. Math Property

### 1) Math.PI

 PI 값(π ≈ 3.141592653589793)을 반환한다. 



## 2. Math Method

### 1) Math.abs()

인수의 절댓값을 반환한다. 절댓값은 반드시 0 또는 양수이어야 한다.

```javascript
Math.abs(-1);       // 1
Math.abs('-1');     // 1
Math.abs('');       // 0
Math.abs([]);       // 0
Math.abs(null);     // 0

//NaN이 나오는 상황들
Math.abs(undefined);// NaN
Math.abs({});       // NaN
Math.abs('string'); // NaN
Math.abs();         // NaN
```



### 2) Math.round()

인수의 **소수점 이하를 반올림**한 정수를 반환한다.



### 3) Math.ceil()

인수의 **소수점 이하를 올림**한 정수를 반환한다.



### 4) Math.floor()

인수의 **소수점 이하를 내림**한 정수를 반환한다.



### 5) Math.sqrt()

인수의 **제곱근**을 반환한다.



### 6) Math.random()

임의의 부동 소수점을 반환한다.

반환된 부동 소수점은 0부터 1미만이다. 0은 포함되지만 1은 포함되지 않는다.

```javascript
Math.random();

const random = Math.floor((Math.random() * 10) + 1);
console.log(random);
```



### 7) Math.pow(base, exponent)

첫번째 인수를 밑(base), 두번째 인수를 지수(exponent)로하여 거듭제곱을 반환한다.



### 8) Math.max()

인수 중에서 가장 큰 수를 반환한다.



### 9) Math.min()

인수 중에서 가장 작은 수를 반환한다.