# 모듈(Module)



## 1. 모듈이란?

### 1) 모듈의 정의

- 애플리케이션을 구성하는 개별적 요소로서 **재사용 가능한 코드 조각**을 말한다. 모듈은 세부 사항을 캡슐화하고 공개가 필요한 API만을 외부에 노출한다.

- 일반적으로 모듈은 파일 단위로 분리되어 있으며 애플리케이션은 필요에 따라 명시적으로 모듈을 로드하여 재사용한다. 즉, 모듈은 애플리케이션에 분리되어 개별적으로 존재하다가 애플리케이션의 로드에 의해 비로소 애플리케이션의 일원이된다.
- 모듈은 기능별로 분리되어 작성되므로 코드의 단위를 명확히 분리하여 애플리케이션을 구성할 수 있으며 재사용 성이 좋아 개발 효율성과 유지보수성을 높일 수 있다.



### 2) 자바스크립트에서의 모듈  

- C언어는 #include, JAVA는 import 등 대부분의 언어는 모듈 기능을 가지고 있는데, 자바스크립트는 모듈 기능이 없다. 클라이언트 사이드 자바스크립트는 script 태그를 사용하여 외부의 스크립트 파일을 가져올 수는 있지만, 파일마다 독립적인 파일 스코프를 갖지 않고 하나의 전역 객체에 바인딩되기 때문에 전역 변수가 중복되는 등의 문제가 발생할 수 있어 모듈화를 구현할 수 없다.

- 자바스크립트를 클라이언트 사이드에 국한하지 않고 범용적으로 사용하고자 하는 움직임이 생기면서 모듈 기능은 반드시 해결해야 하는 핵심 과제가 되었다. 이 상황에서 제안된 것이 CommonJS와 AMD(Asynchronous Module Definition)이다. 자바스크립트의 모듈화는 크게 CommonJS와 AMD 진영으로 나뉘게 되었고 브라우저에서 모듈을 사용하기 위해서는 CommonJS 또는 AMD를 구현한 모듈 로더 라이브러리를 사용해야하는 상황이 되었다.
- 서버 사이드 자바스크립트인 Node.js는 사실상 모듈 시스템의 표준인 CommonJS를 채택 후 기본적으로 commonJS 방식을 따르고 있다.



- 이러한 상황에서 ES6에서는 클라이언트 사이드 자바스크립트에서도 동작하는 모듈 기능을 추가하였다. script 태그에 type="module" 어트리뷰트를 추가하면 로드된 자바스크립트 파일은 모듈로서 동작한다. 모듈의 파일 확장자는 mjs를 권장한다.



- 하지만 아직까지는 브라우저가 지원하는 ES6 모듈 기능보다는 Webpack 등의 모듈 번들러를 사용하는 것이 일반적이다. 그 이유는 다음과 같다.
    - IE를 포함한 구형 브라우저는 ES6 모듈을 지원하지 않는다.
    - 브라우저의 ES6 모듈 기능을 사용하더라도 트랜스파일링이나 번들링이 필요하다.
    - 아직 지원하지 않는 기능과 몇가지 이슈가 있다.



## 2. 모듈의 특징

### 1) 파일 스코프

- 모듈은 파일 스코프를 갖는다.

- 모듈 내에서 var 키워드로 선언한 변수는 더이상 전역 변수가 아니며 window 객체의 프로퍼티도 아니다.



모듈이 아닌 코드로는 index.html에 foo.js와 bar.js를 script 태그로 불러오게 되면, foo.js와 bar.js는 하나의 전역 객체를 공유하며 하나의 전역 스코프를 갖는다. 각각의 js에 x를 선언한 경우 전역 변수는 중복되며 변수 x의 값은 script 태그를 마지막에 사용한 bar.js에 덮어 써진다.



하지만 모듈 코드로 index.html에 foo.js와 bar.js를 script 태그로 불러온 경우 파일 스코프를 가진다. 따라서 모듈 내에서 선언한 변수는 스코프가 다르기 때문에 모듈 외부에서 참조할 수 없다.



### 2) export 키워드

- 모듈은 독립적인 파일 스코프를 갖기 때문에 모듈 안에 선언한 모든 것들은 기본적으로 해당 모듈 내부에서만 참조할 수 있다. **만약 모듈 안에 선언한 항목을 외부에 공개하여 다른 모듈들이 사용할 수 있게 하고 싶다면 export해야 한다. 선언된 변수, 함수, 클래스 모두 export 할 수 있다.**



- 모듈을 공개하려면 선언문 앞에 export 키워드를 사용한다. 여러개를 export 할 수 있는데 이때 각각의 export는 이름으로 구별할 수 있다.

```javascript
export const pi = Math.PI;

export function square(x) {
    return x + x;
}

export class Person {
    constructor(name){
        this.name = name;
    }
}
```



- 선언문 앞에 매번 export 키워드를 붙이는 것이 싫다면 export 대상을 모아 하나의 객체로 구성하여 한번에 export를 할 수도 있다.

```javascript
const pi = Math.PI;

function square(x) {
    return x + x;
}

class Person {
    constructor(name){
        this.name = name;
    }
}

export { pi, square, Person};
```



### 3) import 키워드

- export한 모듈을 로드하려면 export한 이름으로 import 한다.

```javascript
// bar.js
// 같은 폴더 내의 foo.js 모듈을 로드한다고 가정했을 때
// from 뒤에는 불러올 파일을 작성하는데 확장자인 js는 생략가능하다. 단, 브라우저 환경에서는 생략 불가능
import { pi, square, Person } from './foo';

console.log(pi);
```



- 각각의 이름을 지정하지 않고 하나의 이름으로 한꺼번에 import 할 수도 있다.

(이때 import되는 항목은 as 뒤에 지정한 이름의 변수에 할당된다.)

```javascript
import * as foo from './foo';

console.log(foo.pi);
```



- 이름을 변경하여 import 할 수도 있다.

```javascript
import { pi as PI, square as sq, Person as P} from './foo';

console.log(PI);
```



- 모듈에서 하나만을 export 할 때는 default 키워드를 사용할 수 있다. 단, default를 사용하는 경우 var, let, const는 사용할 수 없다.

```javascript
// foo.js
function (x) {
    return x * x;
}

export default;
```

```javascript
export default function (x) {
    return x * x;
}
```

- default 키워드와 함께 export한 모듈은 {} 없이 임의의 이름으로 import 한다.

```javascript
import square from './foo';
```