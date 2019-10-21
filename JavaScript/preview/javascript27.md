# RegExp 정규표현식



## 1. 정규표현식(Regular Expression)

- **문자열에서 특정 내용을 찾거나 대체 또는 발췌하는데 사용한다.**

- 반복문과 조건문을 사용한 복잡한 코드도 정규표현식을 이용하면 간단하게 표현할 수 있으나, 정규표현식은 주석이나 공백을 허용하지 않고 여러가지 기호를 혼합하여 사용하기 때문에 가독성이 좋지 않다.

- 정규 표현식 리터럴

```javascript
const myRegExp = /^[0-9]+$/;
```

![](https://poiemaweb.com/img/regular_expression.png)



- 정규표현식을 사용하는 자바스크립트 메소드

  - RegExp.prototype.exec
  - RegExp.prototype.test
  - String.prototype.match
  - String.prototype.replace
  - String.prototype.search
  - String.prototype.split

  ```javascript
  const targetStr = 'This is a pen.';
  const regexr = /is/ig;
  
  // RegExp 객체의 메소드
  console.log(regexr.exec(targetStr)); // ['is', index: 2, input: 'This is a pen.']
  console.log(regexr.test(targetStr)); // true
  
  // String 객체의 메소드
  console.log(targetStr.match(regexr)); // ['is', 'is' ]
  console.log(targetStr.replace(regexr, 'IS')); //ThIS IS a pen
  
  // String.prototype.search는 검색된 문자열의 첫번째 인덱스를 반환한다.
  console.log(targetStr.search(regexr)); // 2
  console.log(targetStr.split(regexr)); // ['Th', '', 'a pen.']
  ```



### 1) 플래그

- 플래그의 종류

| Flag |   Meaning   |            Description             |
| :--: | :---------: | :--------------------------------: |
|  i   | Ignore Case |   대소문자를 구별하지 않고 검색    |
|  g   |   Global    |    문자열 내의 모든 패턴을 검색    |
|  m   | Multi Line  | 문자의 행이 바뀌더라도 검색을 계속 |

- 플래그의 특징
  - 옵션이므로 선택적으로 사용
  - 플래그를 사용하지 않은 경우 문자열 내 검색 매칭 대상이 1개 이상이더라도 첫번째 매칭한 대상만을 검색하고 종료함

- 사용예시

```javascript
const targetStr = 'Is this all there is?';

// 플래그 미사용, 문자열 is를 대소문자를 구별하여 한번만 검색
let regexr = /is/;

console.log(targetStr.match(regexr));

// 플래그 i, g 사용 : 대소문자 구별하지 않고 대상 문자열 끝까지 검색
regexr = /is/ig;

console.log(targetStr.match(regexr));
console.log(targetStr.match(regexr).length);
```



### 2) 패턴

- 패턴에는 검색하고 싶은 문자열을 지정한다.

- 패턴의 특징

  - 문자열의 따옴표는 생략한다. (포함할 경우 따옴표도 검색함)

  - 특별한 의미를 가지는 메타문자 또는 기호로 표현할 수 있다.

    | 패턴          | 의미                                                         |
    | :------------ | ------------------------------------------------------------ |
    | /.../;        | 임의의 문자 3개                                              |
    | /./g;         | 임의의 한문자를 반복 검색                                    |
    | /A/;          | 'A'를 검색                                                   |
    | /A/ig;        | 'A'를 대소문자 구분없이 반복 검색                            |
    | /A+/g;        | 'A'가 한번이상 반복되는 문자열을 반복 검색                   |
    | /A\|B/g;      | 'A' 또는 'B'를 반복 검색 // \|를 사용하면 or의 의미          |
    | /A+\|B+/g;    | 'A'또는 'B'가 한번 이상 반복되는 문자열을 반복 검색          |
    | /[AB]+/g;     | 'A'또는 'B'가 한번 이상 반복되는 문자열을 반복 검색          |
    | /[A-Z]+/g;    | 'A' - 'Z'가 한번 이상 반복되는 문자열을 반복 검색            |
    | /[A-Za-z]+/g; | 'A' ~ 'Z' 또는 'a' ~ 'z'가 한번이상 반복되는 문자열 반복 검색 |
    | /[0-9]+/g;    | '0'~'9'가 한번 이상 반복되는 문자열을 반복 검색              |
    | /[0-9,]+/g;   | '0'~'9' 또는 ','가 한번 이상 반복되는 문자열을 반복 검색     |

    - '|' 를 사용하면 or의 의미
    - '+' 를 사용하면 분해하지 않은 단어 레벨로 추줄하기 위해 사용, 앞선 패턴을 한번 이상 반복하게 함
    - '[]' 범위를 지정하려면 []내에 -를 사용
    - '\d'는 숫자를 의미한다. '\D'는 숫자가 아닌 문자로 '\d'와 반대로 동작
    - '\w' 알파벳과 숫자를 의미한다. '\W'는 알파벳과 숫자가 아닌 문자를 의미한다. '\w'와 반대로 동작
    - [^] 부정을 의미한다. [] 바깥의 ^는 문자열의 처음을 의미
    - \s : 여러 가지 공백 문자 (스페이스, 탭 등)  \t\r\n\v\f 



### 3) 자주 사용하는 정규표현식

| /^문자열/;            | ^: 문자열의 처음을 의미       |
| --------------------- | ----------------------------- |
| /문자열$/;            | $: 문자열의 끝을 의미         |
| /^\d+$/;              | 슷자인지 검색한다.            |
| /^[\s]+/;             | 여러 가지 공백 문자           |
| /^[A-Za-z0-9]{4,10}$/ | 영문자, 숫자만 허용, 4~10자리 |



- 아이디로 사용 가능한지 검사 (영문자, 숫자만 허용, 4~10자리)

```javascript
const id = 'abc123';

// {4,10}: 4~ 10자리
const regexr = /^[A-Za-z0-9]{4,10}$/;

console.log(regexr.test(id)); // true
```



- 메일 주소 형식에 맞는지 검사

```javascript
const email = 'ungmo2@gmail.com';

const regexr = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9A-Za-z]*\.[a-zA-Z]{2,3}$/;

console.log(regexr.test(email)); // true
```



- 핸드폰 형식에 맞는지 검사

```javascript
const cellphone = '010-1234-5678';

const regexr = /^\d{3}-\d{3,4}-\d{4}$/;

console.log(regexr.test(cellphone)); // true
```



- 특수문자가 있는지 검사

```javascript
// A-Za-z0-9 이외의 문자가 있는지 검사
let regexr = /[^A-Za-z0-9]/gi;

// 아래 방식도 동작, 장점은 특수 문자를 선택적으로 검사할 수 있다.
regexr = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

// 특수 문자 제거
console.log(targetStr.replace(regexr, '')); // abc123
```



## 2. Javascript Regular Expression



### 1) RegExp Constructor

- RegExp 객체를 생성하기 위해서 리터럴 방식과 RegExp 생성자 함수를 사용할 수 있다.

```javascript
new RegExp(pattern[, flags])

new RegExp('ab+c', 'i');
new RegExp(/ab+c/, 'i');
new RegExp(/ab+c/i);
```



### 2) RegExp Method

#### RegExp.prototype.exec(target: string):RegExpExecArray | null

- 문자열을 검색하여 매칭 결과를 반환한다. 반환값은 배열 또는 null이다.
- exec 메소드는 g 플래그를 지정하여도 첫번째 매칭 결과만을 반환한다.



#### RegExp.prototype.test(target: string): boolean

- 문자열을 검색하여 매칭 결과를 반환한다. 반환값은 true 또는 false다.