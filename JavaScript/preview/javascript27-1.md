# 스프레드 문법(Spread)

- ES6에서 새롭게 도입된 문법으로 **...은 하나로 뭉쳐 있는 여러 값들의 집합을 펼처서 개별적인 값들의 목록으로 만든다.**
- Spread 문법의 대상은 Array, String, Set, DOM data structure(NodeList, HTMLCollection), Arguments와 같이 for...of 문으로 순회할 수 있는 이터러블에 한정된다.
- 스프레드 문법의 결과는 값이 아니다. (스프레드 문법 ...이 피연산자를 연산하여 값을 생성하는 연산자가 아님) 따라서 스프레드 문법의 결과는 변수에 할당할 수 없다.
- 스프레드 문법은 아래와 같이 쉼표로 구분한 값의 목록을 사용하는 문에서 사용한다
  - 함수 호출문의 인수 목록
  - 배열 리터럴의 요소 목록
  - 객체 리터럴의 프로퍼티 목록



> **이터러블이란?**
>
> 이터러블 프로토콜을 준수한 객체를 말한다. 이터러블은 Well-known Symbol인 Symbol.iterator을 프로퍼티 키로 갖는 메소드를 직접 구현하거나 프로토타입 체인에 의해 상속한 객체를 말한다.



```javascript
console.log(...[1, 2, 3]); // 1 2 3
console.log(...'Hello'); // H e l l o
console.log(...new Map([['a', '1'], ['b', '2']])); // [ 'a', '1' ] [ 'b', '2' ]
console.log(...new Set([1, 2, 3])); // 1 2 3
```



```javascript
// 이터러블이 아닌 일반 객체는 스프레드 문법의 대상이 될 수 없다.
console.log(...{ a: 1, b: 2 });
// TypeError: Found non-callable @@iterator
```



## 1. 함수 호출문의 인수 목록에서 사용하는 경우

- 요소값들의 집합인 배열을 펼쳐서 개별적인 값들의 목록으로 만든 후, 이를 함수의 인수 목록으로 전달해야 하는 경우

**[스프레드 문법 전]**

```javascript
var arr = [1, 2, 3];

// apply 함수의 2번째 인수(배열)는 apply 함수가 호출하는 함수의 인수 목록이다. 배열이 펼쳐져서 인수로 전달되는 효과가 있다.
var maxValue = Math.max.apply(null, arr);

console.log(maxValue); // 3
```



**[스프레드 문법 사용]**

```javascript
const arr = [1, 2, 3];

// 스프레드 문법을 사용하여 배열 arr을 1, 2, 3으로 펼쳐서 Math.max에 전달
const maxValue = Math.max(...arr);

console.log(maxValue); // 3
```



> Math.max 메소드는 매개변수 개수를 확정할 수 없는 가변 인자 함수이다.  개수가 정해져 있지 않은 여러 개의 숫자를 인수로 전달받아 인수 중에서 최대값을 반환한다. 만약 숫자가 아닌 배열을 인수로 전달 시 NaN을 반환한다.



## 2. 배열 리터럴 내부에서 사용하는 경우

### 1) concat

- 기존의 배열 요소들을 새로운 배열의일부로 만들고 싶은 경우

**[스프레드 문법 전]**

```javascript
var arr = [1, 2].concat([3, 4]);
console.log(arr); // [1, 2, 3, 4]
```



**[스프레드 문법 사용]**

```javascript
const arr = [...[1, 2], 3, 4];
console.log(arr); // [1, 2, 3, 4]
```



### 2) push

**[스프레드 문법 전]**

```javascript
var arr1 = [1, 2];
var arr2 = [3, 4];

Array.prototype.push.apply(arr1, arr2);

console.log(arr1); // [1, 2, 3, 4]
```



**[스프레드 문법 사용]**

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];

arr1.push(...arr2);

console.log(arr1) // [1, 2, 3, 4]
```



### 3) splice

**[스프레드 문법 전]**

```javascript
var arr1 = [1, 4];
var arr2 = [2, 3];

Array.prototype.splice.apply(arr1, [1, 0].concat(arr2));

console.log(arr1); // [1, 2, 3, 4]
```



**[스프레드 문법 사용]**

```javascript
const arr1 = [1, 4];
const arr2 = [2, 3];

arr1.splice(1, 0, ...arr2);

console.log(arr1); // [1, 2, 3, 4]
```



### 4) 배열 복사

**[스프레드 문법 전]**

```javascript
var origin  = [1, 2];
var copy = origin.slice();

console.log(copy); // [1, 2]
console.log(copy === origin); // false
```



**[스프레드 문법 사용]**

```javascript
const origin = [1, 2];
const copy = [...origin];

console.log(copy); // [1, 2]
console.log(copy === origin); // false
```



### 5) 유사 배열 객체를 배열로 변환

**[스프레드 문법 전]**

```javascript
function sum() {
  var args = Array.prototype.slice.apply(arguments);

  return args.reduce(function (pre, cur) {
    return pre + cur;
  }, 0);
}

console.log(sum(1, 2, 3)); // 6
```



**[스프레드 문법 사용]**

```javascript
function sum() {
    const args = [...arguments];
    return args.reduce((pre, cur) => pre + cur, 0);
}

console.log(sum(1,2,3)); // 6
```



## 3. 객체 리터럴 내부에서 사용하는 경우 (제안)

- 스프레드 문법의 대상은 이터러블이어야 하지만 스프레드 프로퍼티 제안은 일반 객체를 대상으로도 스프레드 문법의 사용을 허용한다. 

  ```javascript
  const n = { x: 1, y: 2, ...{ a: 3, b: 4 } };
  console.log(n); // { x: 1, y: 2, a: 3, b: 4 }
  ```

  

**[스프레드 문법 전]**

```javascript
// 객체의 병합
// 프로퍼티가 중복되는 경우, 뒤에 위치한 프로퍼티가 우선권을 갖는다.
const merged = Object.assign({}, { x: 1, y: 2 }, { y: 10, z: 3 });
console.log(merged); // { x: 1, y: 10, z: 3 }

// 특정 프로퍼티 변경
const changed = Object.assign({}, { x: 1, y: 2 }, { y: 100 });
console.log(changed); // { x: 1, y: 100 }

// 프로퍼티 추가
const added = Object.assign({}, { x: 1, y: 2 }, { z: 0 });
console.log(added); // { x: 1, y: 2, z: 0 }
```



**[스프레드 문법 사용]**

```javascript
// 객체의 병합
// 프로퍼티가 중복되는 경우, 뒤에 위치한 프로퍼티가 우선권을 갖는다.
const merged = { ...{ x: 1, y: 2 }, ...{ y: 10, z: 3 } };
console.log(merged); // { x: 1, y: 10, z: 3 }

// 특정 프로퍼티 변경
const changed = { ...{ x: 1, y: 2 }, y: 100 };
// changed = { ...{ x: 1, y: 2 }, ...{ y: 100 } }
console.log(changed); // { x: 1, y: 100 }

// 프로퍼티 추가
const added = { ...{ x: 1, y: 2 }, z: 0 };
// added = { ...{ x: 1, y: 2 }, ...{ z: 0 } }
console.log(added); // { x: 1, y: 2, z: 0 }
```



[의문]

- Map과 Set은 이터러블이라는데 그게 무언인가?

