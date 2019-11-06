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
- 첫번째 인자에는 문자열 또는 정규 표현식이 전달되는데, 문자열의 경우 첫번째 검색 결과만이 대체되지만 정규표현식을 사용하면 다양한 방식으로 검색할 수 있다.
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



### 6) String.prototype.split(separator: string | RegExp, limit?:number): string[]

- 첫번째 인수로 전달한 문자열 또는 정규표현식을 대상 문자열에서 검색하여 문자열을 구분한 후 분리된 각 문자열로 이루어진 배열을 반환한다.
- 원본 문자열은 반환되지 않는다.
- 인수가 없는 경우, 대상 문자열 전체를 단일 요소로 하는 배열을 반환한다.

```javascript
// {string | RegExp} [separator] - 구분 대상 문자열 또는 정규표현식
// {number} [limit] - 구분 대상수의 한계를 나타내는 정수
str.split([separator[, limit]])
```

```javascript
const str = 'How are you doing?';

console.log(str.split('')) // [ 'How', 'are', 'you', 'doing?' ]
console.log(str.split(' ', 3)); // [ 'How', 'are', 'you' ]
```



### 7) String.prototype.substring(start: number, end=this.length): string

- 첫번째 인수로 전달한 start 인덱스에 해당하는 문자부터 두번째 인자에 전달된 end 인덱스에 해당하는 문자의 바로 이전문자까지 모두 반환한다.
- 이때 첫번째 인수 < 두번째 인수의 관계가 성립된다.

![](https://poiemaweb.com/img/substring.png)

```javascript
// {number} start - 0 ~ 해당문자열 길이 -1 까지의 정수
// {number} [end=this.length] - 0 ~ 해당문자열 길이까지의 정수
str.substring(start[, end])
```



- 첫번째 인수 > 두번째 인수 : 두 인수는 교환된다.

```javascript
const str = 'Hello World';
console.log(str.substring(4, 1)); // ell
// console.log(str.substring(1, 4)); // ell 와 동일
```

- 두번째 인수가 생략된 경우 : 해당 문자열의 끝까지 반환한다.

```javascript
console.log(str.substring(4)); // o World
```

- 인수 < 0 또는 NaN인 경우 : 0으로 취급된다.

```javascript
console.log(str.substring(-2)); // Hello World
```

- 인수 > 문자열의 길이(str.length) : 인수는 문자열의 길이(str.length)으로 취급된다.

```javascript
console.log(str.substring(1, 12)); // ello World
console.log(str.substring(11)); // ''
console.log(str.substring(20)); // ''
console.log(str.substring(0, str.indexOf(' '))); // 'Hello'
console.log(str.substring(str.indexOf(' ') + 1, str.length)); // 'World'
```



### 8)  String.prototype.slice(start?: number, end?: number): string

-  String.prototype.substring과 동일하다. 
- 단, String.prototype.slice는 음수의 인수를 전달할 수 있다. 

```javascript
const str = 'hello world';

// 인수 < 0 또는 NaN인 경우 : 0으로 취급된다.
console.log(str.substring(-5)); // 'hello world'
// 뒤에서 5자리를 잘라내어 반환한다.
console.log(str.slice(-5)); // 'world'

// 2번째부터 마지막 문자까지 잘라내어 반환
console.log(str.substring(2)); // llo world
console.log(str.slice(2)); // llo world

// 0번째부터 5번째 이전 문자까지 잘라내어 반환
console.log(str.substring(0, 5)); // hello
console.log(str.slice(0, 5)); // hello
```



### 9) String.prototype.toLowerCase(): string

- 대상 문자열의 모든 문자를 소문자로 변경한다. 



### 10) String.prototype.toUpperCase(): string 

- 대상 문자열의 모든 문자를 대문자로 변경한다. 



### 11) String.prototype.trim(): string

-  대상 문자열 양쪽 끝에 있는 공백 문자를 제거한 문자열을 반환한다. 

```javascript
const str = '   foo  ';

console.log(str.trim()); // 'foo'

// String.prototype.replace
console.log(str.replace(/\s/g, ''));   // 'foo'
console.log(str.replace(/^\s+/g, '')); // 'foo  '
console.log(str.replace(/\s+$/g, '')); // '   foo'

// String.prototype.{trimStart,trimEnd} : Proposal stage 3
console.log(str.trimStart()); // 'foo  '
console.log(str.trimEnd());   // '   foo'
```



### 12) String.prototype.repeat(count: number): string 

- 인수로 전달한 숫자만큼 반복해 연결한 새로운 문자열을 반환한다.
- count가 0이면 빈 문자열을 반환하고 음수면 RangeError를 발생시킨다.

```javascript
console.log('abc'.repeat(2));   // 'abcabc'
console.log('abc'.repeat(2.5)); // 'abcabc' (2.5 → 2)
console.log('abc'.repeat(-1));  // RangeError: Invalid count value
```



### 13) String.prototype.includes(searchString: string, position?: number): boolean

-  인수로 전달한 문자열이 포함되어 있는지를 검사하고 결과를 불리언 값으로 반환한다. 
- 두번째 인수는 옵션으로 검색할 위치를 나타내는 정수이다. 

```javascript
const str = 'hello world';

console.log(str.includes('hello')); // true
console.log(str.includes(' '));     // true
console.log(str.includes('wo'));    // true
console.log(str.includes('wow'));   // false
console.log(str.includes(''));      // true
console.log(str.includes());        // false

// String​.prototype​.indexOf 메소드로 대체할 수 있다.
console.log(str.indexOf('hello')); // 0
```