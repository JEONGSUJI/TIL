# 엄격 모드



## 1. strict mode란?

- 잠재적인 오류를 발생시키기 어려운 개발 환경을 만들고 그 환경에서 개발할 수 있도록 지원하기 위해 ES5부터 strict mode가 추가되었다.
- 자바스크립트 언어의 문법을 보다 엄격히 적용하여 기존에는 무시되던 오류를 발생시킬 가능성이 높거나 자바스크립트 엔진의 최적화 작업에 문제를 일으킬 수 있는 코드에 대한 명시적인 에러를 발생시킨다.



> ESLint와 같은 **린트 도구**를 사용해도 strict mode와 유사한 효과를 얻을 수 있다. 린트 도구는 정적 분석 기능을 통해 소스 코드를 실행하기 전에 소스 코드를 스캔하여 문법적 오류만이 아니라 잠재적 오류까지 찾아내고 오류의 이유를 리포팅해주는 유용한 도구이다.



## 2. strict mode의 적용

- strict mode를 적용하려면 전역의 선두 또는 함수 몸체의 선두에 <code>'use strict';</code>를 추가한다. 
- 전역의 선두에 추가하면 스크립트 전체에 strict mode가 적용되고, 함수 몸체의 선두에 추가하면 해당 함수와 중첩된 내부 함수에 strict mode가 적용된다. 코드의 선두에 strict mode를 위치시키지 않으면 제대로 동작하지 않는다.



## 3. 전역에 strict mode 적용은 피하자

## 4. 함수 단위로 strict mode를 적용하는 것도 피하자

- 전역에 적용한 strict mode는 스크립트 단위로 적용된다. html 문서 내 <script> 태그로 구분해 특정 <script> 태그 내에만 strict mode를 적용하면 해당에만 적용되는데, strict mode 스크립트와 non-strict mode 스크립트를 혼용하는 것은 오류를 발생시킬 수 있다.
- 즉시 실행함수로 스크립트 전체를 감싸서 스코프로 구분하고 즉시 실행 함수의 선두에 strict mode를 적용하자.



## 5. strict mode가 발생시키는 에러



### 1) 암묵적 전역 변수

- 선언하지 않은 변수를 참조하면 ReferenceError 발생



### 2)  변수, 함수, 매개변수의 삭제

- delete 연산자로 변수, 함수, 매개변수를 삭제하면 SyntaxError 발생



### 3) 매개변수 이름의 중복

- 중복된 함수 매개변수 이름을 사용하면 SyntaxError가 발생한다.



### 4) with 문의 사용

- with 문을 사용하면 SyntaxError가 발생한다.



## 6. strict mode 적용에 의한 변화



### 1) 일반 함수의 this

- strict mode 에서 함수를 일반함수로서 호출하면 this에 undefined가 바인딩된다. 생성자 함수가 아닌 일반 함수 내부에서는 this를 사용할 필요가 없기 때문이다. 에러는 발생하지 않는다.



### 2) arguments 객체

- strict mode에서는 매개변수에 전달된 인수를 재할당하여 변경하여도 arguments 객체에 반영되지 않는다.

```javascript
(function (a){
    `use strict`;
    // 매개변수에 전달된 인수를 재할당하여 변경
    a = 2;
    
    // 변경된 인수가 arguments 객체에 반영되지 않는다.
    console.log(arguments); // { 0:1, length: 1}
}(1));
```