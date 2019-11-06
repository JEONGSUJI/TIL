# 날짜와 시간을 위한 Date 객체

Date 객체는 날짜와 시간을 위한 메소드를 제공하는 빌트인 객체이면서 생성자 함수이다.

Date 생성자 함수로 생성한 Date 객체는 내부적으로 숫자값을 갖는다. 이 값은 1970년 1월 1일 00:00(UTC)를 기점으로 현재 시간까지의 밀리초를 나타낸다.



## 1. Date Constructor

Date 객체는 생성자 함수이다. Date 생성자 함수는 날짜와 시간을 가지는 인스턴스를 생성한다. 생성된 인스턴스는 기본적으로 현재 날짜와 시간을 나타내는 값을 가진다.



현재 날짜와 시간이 아닌 다른 날짜와 시간을 다루고 싶은 경우, Date 생성자 함수에 명시적으로 해당 날짜와 시간 정보를 인수로 지정한다.



### Date 생성자 함수로 객체를 생성하는 방법

### 1) new Date()

- 인수를 전달하지 않으면 현재 날짜와 시간을 가지는 인스턴스를 반환한다.

- 인수에 milliseconds를 넣는 경우 1970년 1월 1일 00:00(UTC)을 기점으로 인수로 전달된 밀리초만큼 경과한 날짜와 시간을 가지는 인스턴스를 반환한다. 

- 인수에 dateString, 날짜와 시간을 나타내는 문자열을 전달하면 지정된 날짜와 시간을 가지는 인스턴스를 반환한다. 단, 인수로 전달한 문자열은 Date.parse 메소드에 의해 해석 가능한 형식이어야 한다.

- 인수에 year, month[, day, hour, minute, second, millisecond]를 넣고 해당을 의미하는 숫자를 전달하면 지정된 날짜와 시간을 가지는 인스턴스를 반환한다. 지정하지 않은 옵션 정보는 0 또는 1으로 초기화된다.

| 인수        | 내용                                                         |
| :---------- | :----------------------------------------------------------- |
| year        | 1900년 이후의 년                                             |
| month       | 월을 나타내는 **0 ~ 11**까지의 정수 (주의: 0부터 시작, 0 = 1월) |
| day         | 일을 나타내는 1 ~ 31까지의 정수                              |
| hour        | 시를 나타내는 0 ~ 23까지의 정수                              |
| minute      | 분을 나타내는 0 ~ 59까지의 정수                              |
| second      | 초를 나타내는 0 ~ 59까지의 정수                              |
| millisecond | 밀리초를 나타내는 0 ~ 999까지의 정수                         |



### 2) Date 생성자 함수를 new 연산자없이 호출

인스턴스를 반환하지 않고 결과값을 문자열로 반환한다.



## 2. Date 메소드

### 1) Date.now()

1970년 1월 1일 00:00:00(UTC)를 기점으로 현재 시간까지 경과한 밀리초를 숫자로 반환한다.



### 2) Date.parse()

1970년 1월 1일 00:00:00(UTC)를 기점으로 인수로 전달된 지정 시간까지의 밀리초를 숫자로 반환한다.

```javascript
let d = Date.parse('Jan 2, 1970 00:00:00 UTC'); // UTC
console.log(d); // 86400000
```



### 3) Date.UTC()

 1970년 1월 1일 00:00:00(UTC)을 기점으로 인수로 전달된 지정 시간까지의 밀리초를 숫자로 반환한다. 

- Date.UTC 메소드는 `new Date(year, month[, day, hour, minute, second, millisecond])`와 같은 형식의 인수를 사용해야 한다.  



### 4) Date.prototype.getFullYear()

년도를 나타내는 4자리 숫자를 반환한다.



### 5) Date.prototype.setFullYear()

년도를 나타내는 4자리 숫자를 설정한다.

```javascript
 dateObj.setFullYear(year[, month[, day]]) 
```



### 6) Date.prototype.getMonth()

월을 나타내는 **0~11의 정수를 반환한다.** 1월은 0, 12월은 11이다.



### 7) Date.prototype.setMonth()

```javascript
dateObj.setMonth(month[, day])
```



### 8) Date.prototype.getDate()

날짜를 나타내는 정수를 반환한다.



### 9) Date.prototype.setDate()

날짜를 나타내는 정수를 설정한다.



### 10) Date.prototype.getDay()

요일(0~6)을 나타내는 정수를 반환한다.

|  요일  | 반환값 |
| :----: | :----: |
| 일요일 |   0    |
| 월요일 |   1    |
| 화요일 |   2    |
| 수요일 |   3    |
| 목요일 |   4    |
| 금요일 |   5    |
| 토요일 |   6    |



### 11) Date.prototype.getHours()

시간(0~23)을 나타내는 정수를 반환한다.



### 12) Date.prototype.setHours()

 시간(0 ~ 23)를 나타내는 정수를 설정한다. 

```javascript
dateObj.setHours(hour[, minute[, second[, ms]]])
```



### 13) Date.prototype.getMinutes()

분(0~59)을 나타내는 정수를 반환한다.



### 14) Date.prototype.setMinutes()

 분(0 ~ 59)를 나타내는 정수를 설정한다. 분 이외 초, 밀리초도 설정할 수 있다. 

```javascript
dateObj.setMinutes(minute[, second[, ms]])
```



### 15) Date.prototype.getSeconds()

초(0~59)를 나타내는 정수를 반환한다.



### 16) Date.prototype.setSeconds()

```javascript
dateObj.setSeconds(second[, ms])
```



### 17) Date.prototype.getMiliseconds()

밀리초(0~999)를 나타내는 정수를 반환한다.



### 18) Date.prototype.setMiliseconds()

 밀리초(0 ~ 999)를 나타내는 정수를 설정한다. 



### 19) Date.prototype.getTime()

1970년 1월 1일 00:00:00(UTC)를 기점으로 현재 시간까지 경과된 밀리초를 반환한다. 



### 20) Date.prototype.setTime()

1970년 1월 1일 00:00:00(UTC)를 기점으로 현재 시간까지 경과된 밀리초를 설정한다. 

```javascript
dateObj.setTime(time)
```



### 21) Date.prototype.getTimezoneOffset()

 UTC와 지정 로케일(Locale) 시간과의 차이를 분단위로 반환한다. 



### 22) Date.prototype.toDateString()

사람이 읽을 수 있는 형식의 문자열로 날짜를 반환한다.



### 23) Date.prototype.toTimeString()

사람이 읽을 수 있는 형식의 문자열로 시간을 반환한다.