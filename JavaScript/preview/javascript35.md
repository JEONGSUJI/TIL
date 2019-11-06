# 동기식 처리 모델 vs 비동기식 처리 모델



## 동기식 처리 모델(Synchronous processing model)

- 직렬적으로 태스크를 수행한다. 즉, 태스크는 순차적으로 실행되며 어떤 작업이 수행 중이면 다음 작업은 대기한다.
- 서버에서 데이터를 가져와 화면에 표시하는 작업 수행 시, 서버에 데이터를 요청하고 데이터가 응답될 때까지 이후 태스크들은 블로킹된다.

![](https://poiemaweb.com/img/synchronous.png)



## 비동기식 처리 모델(Asynchronous processing model, Non-Blocking processing model)

- 병렬적으로 태스크를 수행한다. 즉, 태스크가 종료되지 않은 상태라 하더라도 대기하지 않고 다음 태스크를 실행한다.
- 서버에서 데이터를 가져와 화면에 표시하는 태스크를 수행할 때, 서버에 데이터를 요청한 이후 서버로부터 데이터가 응답될 때까지 대기하지 않고 즉시 다음 태스크를 수행한다. 이후 서버로부터 데이터가 응답되면 이벤트가 발생하고 이벤트 핸들러가 데이터를 가지고 수행할 태스크를 계속해 수행한다.

(참고 : DOM 이벤트 핸들러와 Timer 함수(setTimeout, setInterval), Ajax 요청은 비동기식 처리 모델로 동작한다.)



![](https://poiemaweb.com/img/asynchronous.png)



```javascript
function func1() {
  console.log('func1');
  func2();
}

function func2() {
  setTimeout(function() {
    console.log('func2');
  }, 0);

  func3();
}

function func3() {
  console.log('func3');
}

func1();
```

- 위 예제의 출력 결과는 func1, func3, undefined(완료값), func2이다. 이는 setTimeout 메소드가 비동기 함수이기 때문이다. setTimeout의 콜백함수는 즉시 실행되지 않고 지정 대기 시간만큼 기다리다가 'tick' 이벤트가 발생하면 태스크 큐로 이동한 후 Call Stackd이 비어졌을 때 Call Stack으로 이동되어 실행된다.

![](https://poiemaweb.com/img/settimeout.png)

![작동예시](https://poiemaweb.com/img/event-loop.gif)



> **태스크(task)란?**
>
> 자바스크립트의 런타임 환경에서는 처리해야 하는 일