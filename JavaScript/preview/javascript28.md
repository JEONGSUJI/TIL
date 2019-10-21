# String 래퍼 객체



- String 객체는 원시 타입인 문자열을 다룰 때 유용한 프로퍼티와 메소드를 제공하는 래퍼 객체이다.
- 변수 또는 객체 프로퍼티가 문자열을 값으로 가지고 있다면 String 객체의 별도 생성없이 String 객체의 프로퍼티와 메소드를 사용할 수 있다

- **원시 타입이 wrapper 객체의 메소드를 사용할 수 있는 이유**는 원시 타입으로 프로퍼티나 메소드를 호출할 때 원시 타입과 연관된 **wrapper 객체로 일시적으로 변환**되어 프로토타입 객체를 공유하게 되기 때문이다.



## 1. String Constructor

- String 객체는 String 생성자 함수를 통해 생성할 수 있다. 이때 전달된 인자는 모두 문자열로 변환된다.

```javascript
new String(value);
```

```javascript
let strObj = new String(1);
console.log(strObj);

strObj = new String(undefined);
console.log(strObj);
```

- new 연산자를 사용하지 않고 String 생성자 함수를 호출하면 String 객체가 아닌 문자열 리터럴을 반환한다. (이때 형 변환이 발생할 수 있다.)



## 2. String Property

### 1) String.length

- 문자열 내의 문자 갯수를 반환한다.
- String 객체는 length 프로퍼티를 소유하고 있으므로 유사 배열 객체이다.



## 3. String  Method

### 1) String.prototype.charAt(pos:number):string

- 인수로 전달한 index를 사용하여 index에 해당하는 위치의 문자를 반환한다.
- index는 0 ~ (문자열 길이 -1) 사이의 정수이다.
- 지정한 index가 문자열의 범위 (0~ (문자열 길이-1)을 벗어난 경우 빈문자열을 반환한다.



### 2) String.prototype.concat(...strings: string[]):string

- 인수로 전달한 1개 이상의 문자열과 연결하여 새로운 문자열을 반환한다.
- concat 메소드를 사용하는 것 보다는 <code>+</code>, <code>+=</code> 할당 연산자를 사용하는 것이 성능상 유리하다.



### 3) String.prototype.indexOf(searchString:string, fromIndex=0): number

- 인수로 전달한 문자 도는 문자열을 대상 문자열에서 검색하여 처음 발견된 곳의 Index를 변환한다. 발견하지 못한 경우 -1을 반환한다.

```javascript
// searchString - 검색할 문자 또는 문자열
// [fromIndex=0] - 검색 시작 index (생략할 경우, 0)
str.indexOf(searchString[, fromeIndex])
```



### 4) String.prototype.lastIndexOf(searchString:string, fromIndex=this.length-1):number

- 인수로 전달한 문자 또는 문자열을 대상 문자열에서 검색하여 마지막으로 발견된 곳의 index를 반환한다. 발견하지 못한 경우 -1을 반환한다.
- 2번째 인수가 전달되면 검색 시작 위치를 fromIndex으로 이동하여 **역방향**으로 검색을 시작한다. 검색 범위는 0 ~ fromIndex며 반환값은 indexOf 메소드와 동일하게 발견된 곳의 Index이다.

```javascript
// searchString - 검색할 문자 또는 문자열
// [fromIndex=this.length-1] - 검색 시작 index (생략할 경우, 문자열 길이 -1 )
str.lastIndexOf(searchString[, fromIndex])
```

```javascript
const str = 'Hello World';s

console.log(str.lastIndexOf('World')); // 6
console.log(str.lastIndexOf('o', 5)); // 4
console.log(str.lastIndexOf('o', 8)); // 7
```



### 5) String.prototype.replace(searchValue:string | RegExp, replaceValue: string | replacer:(substring: string, ...args: any[]) => string): string): string

- 첫번째 인수로 전달한 문자열 또는 정규 표현식을 대상 문자열에서 검색하여 두번째 인수로 전달한 문자열로 대체한다.
- 원본 문자열은 변경되지 않고 결과가 반영된 새로운 문자열을 반환한다.
- 검색된 문자열이 여럿 존재할 경우 첫번째로 검색된 문자열만 대체된다.

```javascript
// searchValue - 검색 대상 문자열 또는 정규 표현식
// replacer - 치환 문자열 또는 치환 함수
str.replace(searchValue, replacer)
```

- 특수한 교체 패턴을 사용할 수 있다. ($& => 검색된 문자열)

```javascript
console.log(str.replace('world', '<strong>$&</strong>'));
// Hello <strong>world</strong>
```

