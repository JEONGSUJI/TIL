# 전역 객체



## 1. 전역 객체란?

- 전역 객체는 코드가 실행되기 이전 단계에 자바스크립트 엔진에 의해 생성되는 특수한 객체이다. 
- 클라이언트 사이드 환경에서는 **window**, 서버 사이드 환경에서는 **global** 객체를 의미한다.

- 내부에 포함되는 것들
  - 모든 표준 빌트인 객체(Object, String, Number, Boolean, Function, Array, RegExp, Date, Math, Promise)
  - 환경에 따른 호스트 객체(클라이언트 web API 또는 Node.js의 호스트 API)
    - 클라이언트 web APi : DOM, BOM, Canvas, XMLHttpRequest, Fetch, requestAnimationFrame, SVG, Web Storage, Web Component, Web worker
  - 프로퍼티로 var 키워드로 선언한 전역변수와 전역 함수
- 특징
  - 개발자가 의도적으로 생성할 수 있다.
  - 전역 객체의 프로퍼티를 참조할 때 window를 생략할 수 있다
  - var 키워드로 선언한 전역 변수, 선언하지 않은 변수에 값을 할당한 암묵적 전역 변수, 전역 함수는 전역 객체의 프로퍼티가 된다.



## 2. 전역 프로퍼티(Global property)







function Circle(radius){

​	this.radius = radius;

​	this.getDiameter = function () {

​		return 2 * this.radius;

​	};

}



const circle1 = new Circle(5);



[의문]

- 전역 객체의 프로퍼티를 참조할 때 window를 생략할 수 있다고 하는데 global은 생략가능한가?