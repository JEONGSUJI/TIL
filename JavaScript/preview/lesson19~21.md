# 20. 전역객체



자바스크립트엔진이 브라우저 실행되자마자 만들고 그래서 표준 빌트인 객체를 갖고 있다.



window === self === globalThis  // tru 환경에 따른 window의 별명



let, const는 전역 객체에 포함되는게 아니라  개념적인 블록(전역 렉시컬 환경의 선언적 환경 레코드에 존재한다. 



빌트인 전역 함수

- 인스턴스와 상관없이 범용적으로 사용되는 함수라서 prototype에 넣지 않고 전역에 있다.





# 21. this



함수를 정의하는 방식과 호출하는 방식은 일치하지 않는다.

foo(); 일반함수 호출 / new foo(); 생성자 함수로 호출 / O.foo(); 메서드로 호출/ foo.call(x); -> 간접호출



단, this는 함수를 어떻게 호출했느냐에 따라 동적으로 결정한다.



콜백함수와 중첩함수도 this가 window를 가리킨다????



| Function.prototype.apply/call/bind 메소드에 의한 간접 호출 | Function.prototype.apply/call/bind 메소드에 인자로 전달한 객체 |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
|                                                            |                                                              |



this 왜쓰는가?

- 



this 바인딩은 함수 호출 방식에 의해 동적으로 결정된다.

함수가 호출될 때 결정된다. 왜냐면 함수 호출 방식에 의해 동적으로 결정되기 때문이다.



바인딩 : 식별자와 값을 연결하는 것



메소드에서 this 안쓰면 정적 메소드로 하라고 오류남

정적메소드는 this를 안쓴다.



정적메소드가 아닌 프로퍼티 메소드랑 인스턴스 메소드들은 this를 쓴다.

왜냐면 this가 인스턴스를 가리킨다.



렉시컬 스코프(정적 스코프) 함수 정의가 왔다갔다 하지 않기 때문이다.



 위 예제처럼 전역 함수는 물론이고 중첩 함수를 **일반 함수로 호출하면 함수 내부의 this에는 전역 객체가 바인딩된다.** 다만, this는 객체의 프로퍼티나 메소드를 참조하기 위한 자기 참조 변수이므로 객체를 생성하지 않는 일반 함수에서 this는 의미가 없다. 따라서 아래 예제처럼 strict mode가 적용된 일반 함수 내부의 this에는 undefined가 바인딩된다. 



중첩함수가 왜 외부함수 내에서 호출했을까?

- 명백한 실수



- 외부함수가 가리키는 this와 중첩함수가 가리키는 this가 동일해야하는데 중첩함수 내에 this는 전역객체가 된다.



- 콜백함수 내부에 this도 전역객체가 바인딩된다.

  왜? 콜백함수는 일반함수가 호출하기 때문이다. 문맥이 틀려서 그렇다.



어떻게 해결할까?



1. 변수를 하나 만들어서 this 바인딩을 변수에 할당한다.

   (외부변수 this를 that에 할당)

   2. 콜백함수나 중첩함수에 that을 활용해 입력



```javascript
var value = 1;

const obj = {
  value: 100,
  foo() {
    // 콜백 함수에 명시적으로 this를 바인딩한다.
    setTimeout(function () {
      console.log(this.value); // 100
    }.bind(this), 100);
  }
};

obj.foo();
```

여기서 bind는 setTimeout 함수 외부에 있는것과 같다.

그래서 얘가 가리키는 것은 obj이다.



콜백함수를 호출하는 것이 아니라 bind는 this만을 bind함



bind = function.prototype





## 2.2. 메소드 호출 코드 다시 보기





## 2.4. Function.prototype.apply/call/bind 메소드에 의한 간접 호출



apply, call, bind

- Funtion.prototype에 소속되어있다.

- 그래서 인스턴스로 호출해야한다.



 console.log(getThisBinding.apply(thisArg)); 는 apply를 호출한거다.

근데 apply 내부에서 호출하려면 this()로 호출했을 것이다.



call 하고 apply는 두번째 인수부터 어떻게 주느냐의 차이다.

,로 구분된 걸로 주면 call // 가변인자함수 // arguments

[]로 구분해서 주면 apply 근x데 배열이 들어가는게 아니고 배열을 풀어서 넘긴다.



어떨때 call을 쓰고 apply를 쓰나?

- 배열로 갖고 있으면 apply 아니면 call



첫번째 인자로 준 것을 this로 사용하게끔한다.



// arguments 객체를 배열로 변환

// slice: 배열의 특정 부분에 대한 복사본을 생성한다. 

 const arr = Array.prototype.slice.apply(arguments);  

// const arr = Array.prototype.slice.call(arguments); 

두번째 인수가 없기 때문에 call을 쓰나 apply를 쓰나 상관없다??????



30. String/Number(23~27)

26. 배열