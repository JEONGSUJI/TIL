# 이벤트



## 1. Introduction

- 이벤트란 어떤 사건을 의미하는데, DOM 요소와 관련이 있다.
- 이벤트가 발생하는 시점이나 순서를 사전에 인지할 수 없으므로 일반적인 제어 흐름과는 다르게 이벤트가 발생하면 누군가 이를 감지하고 그에 대응하는 처리를 호출해 주어야한다. 브라우저는 이벤트를 감지하고 이벤트 발생 시 통지해 준다. 이 과정을 통해 웹페이지는 상호작용이 가능하다.

- 이벤트가 발생하면 그에 맞는 반응이 필요하기 때문에 <u>이벤트는 일반적으로 함수에 연결</u>되며 그 함수는 <u>이벤트가 발생되면 실행</u>된다. 이러한 함수를 **이벤트 핸들러**라고 한다.



## 2. 이벤트 루프(Event Loop)와 동시성(Concurrency)

- 브라우저는 단일 쓰레드에서 이벤트 드리븐 방식으로 동작한다.
  - <u>단일 쓰레드</u>는 쓰레드가 하나뿐이라는 의미로 하나의 작업만을 처리할 수 있다는 것을 의미한다.
  - <u>이벤트 드리븐 방식</u>이란 어떤 사건 발생 시 지체없이 그 내용을 전달해 주는 것을 말한다.
- 하지만 실제 동작하는 웹 어플리케이션은 많은 task가 동시에 처리되는 것처럼 느껴지는데, 자바스크립트의 동시성을 지원하는 것이 바로 **이벤트 루프(Event Loop)**이다.



### 1) 브라우저의 환경

### ![](https://poiemaweb.com/img/event-loop.png)

- 자바스크립트 엔진은 크게 2가지 영역으로 나뉜다.
  - **Call Stack(호출 스택)**
    - 작업 요청(함수 호출) 시 요청된 작업은 순차적으로 Call Stack에 쌓이게되고 순차적으로 실행된다. 자바스크립트 엔진은 단 하나의 Call Stack을 사용한다.
  - **Heap**
    - 동적으로 생성된 객체 인스턴스가 할당된다.

- 자바스크립트 엔진은 단순히 작업 요청 시 Call Stack을 사용하여 요청된 작업을 순차적으로 실행한다.
- 동시성을 지원하기 위해 필요한 비동기 요청 처리는 구동하는 환경인 브라우저 또는 Node.js가 담당한다.



- **Event Queue(Task Queue)**
  - 비동기 처리 함수의 콜백 함수, 비동기식 이벤트 핸들러, Timer 함수의 콜백함수가 보관되는 영역으로 이벤트 루프에 의해 특정 시점에 순차적으로 Call Stack으로 이동되어 실행된다.
- **Event Loop(이벤트 루프)**
  - Call Stack 내에서 현재 실행중인 task가 있는지 그리고 EventQueue에 task가 있는지 반복하여 확인한다.  만약 Call Stack이 비어있다면 Event Queue 내의 task가 Call Stack으로 이동하고 실행된다. 



## 3. 이벤트의 종류

3. 이벤트의 종류

### 1) UI Event

| Event    | Description                                                  |
| :------- | :----------------------------------------------------------- |
| **load** | 웹페이지의 로드가 완료되었을 때                              |
| unload   | 웹페이지가 언로드될 때(주로 새로운 페이지를 요청한 경우)     |
| error    | 브라우저가 자바스크립트 오류를 만났거나 요청한 자원이 존재하지 않는 경우 |
| resize   | 브라우저 창의 크기를 조절했을 때                             |
| scroll   | 사용자가 페이지를 위아래로 스크롤할 때                       |
| select   | 텍스트를 선택했을 때                                         |



### 2) Keyboard Event

| Event     | Description            |
| :-------- | :--------------------- |
| keydown   | 키를 누르고 있을 때    |
| **keyup** | 누르고 있던 키를 뗄 때 |
| keypress  | 키를 누르고 뗏을 때    |



### 3) Mouse Event

| Event     | Description                                                  |
| :-------- | :----------------------------------------------------------- |
| **click** | 마우스 버튼을 클릭했을 때                                    |
| dbclick   | 마우스 버튼을 더블 클릭했을 때                               |
| mousedown | 마우스 버튼을 누르고 있을 때                                 |
| mouseup   | 누르고 있던 마우스 버튼을 뗄 때                              |
| mousemove | 마우스를 움직일 때 (터치스크린에서 동작하지 않는다)          |
| mouseover | 마우스를 요소 위로 움직였을 때 (터치스크린에서 동작하지 않는다) |
| mouseout  | 마우스를 요소 밖으로 움직였을 때 (터치스크린에서 동작하지 않는다) |



### 4) Focus Event

| Event              | Description               |
| :----------------- | :------------------------ |
| **focus**/focusin  | 요소가 포커스를 얻었을 때 |
| **blur**/foucusout | 요소가 포커스를 잃었을 때 |



### 5) Form Event

| Event      | Description                                                  |
| :--------- | :----------------------------------------------------------- |
| **input**  | input 또는 textarea 요소의 값이나 contenteditable 어트리뷰트를 가진 요소의 값이 변경되었을 때 |
| **change** | select box, checkbox, radio button의 상태가 변경되었을 때    |
| submit     | form을 submit할 때 (버튼 또는 키)                            |
| reset      | reset 버튼을 클릭할 때 (최근에는 사용 안함)                  |



### 6) Clipboard Event

| Event | Description            |
| :---- | :--------------------- |
| cut   | 콘텐츠를 잘라내기할 때 |
| copy  | 콘텐츠를 복사할 때     |
| paste | 콘텐츠를 붙여넣기할 때 |



## 4. 이벤트 핸들러 등록

### 1) 인라인 이벤트 핸들러 방식

```html
<!DOCTYPE html>
<html>
<body>
  <button onclick="myHandler()">Click me</button>
  <script>
    function myHandler() {
      alert('Button clicked!');
    }
  </script>
</body>
</html>
```

- 사용을 권장하지 않는다. HTML과 Javascript는 관심사가 다르므로 분리하는 것이 좋다.



### 2) 이벤트 핸들러 프로퍼티 방식

- HTML과 Javascript가 뒤섞이는 인라인 이벤트 핸들러 방식의 문제를 해결할 수 있는 방식이다.
- 이벤트 핸들러 프로퍼티에 하나의 이벤트 핸들러만을 바인딩할 수 있다는 단점이 있다.

```html
<!DOCTYPE html>
<html>
<body>
  <button class="btn">Click me</button>
  <script>
    const btn = document.querySelector('.btn');

    // 이벤트 핸들러 프로퍼티 방식은 이벤트에 하나의 이벤트 핸들러만을 바인딩할 수 있다
    // 첫번째 바인딩된 이벤트 핸들러 => 실행되지 않는다.
    btn.onclick = function () {
      alert('① Button clicked 1');
    };

    // 두번째 바인딩된 이벤트 핸들러
    btn.onclick = function () {
      alert('① Button clicked 2');
    };

    // addEventListener 메소드 방식
    // 첫번째 바인딩된 이벤트 핸들러
    btn.addEventListener('click', function () {
      alert('② Button clicked 1');
    });

    // 두번째 바인딩된 이벤트 핸들러
    btn.addEventListener('click', function () {
      alert('② Button clicked 2');
    });
  </script>
</body>
</html>
```



### 3) addEventListner 메소드 방식

- addEventListner 메소드를 이용해 대상 DOM 요소에 이벤트를 바인딩하고 해당 이벤트가 발생했을 때 실행될 콜백 함수(이벤트 핸들러)를 지정한다.

![](https://poiemaweb.com/img/event_listener.png)

- 장점
  - 하나의 이벤트에 대해 하나 이상의 이벤틀 핸들러 추가 가능
  - 캡처링과 버블링 지원
  - HTML 요소 뿐만 아니라 모든 DOM 요소(HTML, XML, SVG)에 대해 동작하며, 브라우저는 웹 문서를 로드한 후 파싱하여 DOM을 생성

- 주의
  - IE 9 이상에서 동작하기 때문에 IE 8 이하에서는 attachEvent 메소드를 사용한다.



```html
<!DOCTYPE html>
<html>
<body>
  <script>
    addEventListener('click', function () {
      alert('Clicked!');
    });
  </script>
</body>
</html>
```

- 위와 같이 DOM 요소를 지정하지 않으면 전역객체인 window에 발생하는 click이벤트에 이벤트 핸들러를 바인딩한다.



```javascript
<!DOCTYPE html>
<html lang="ko">
<body>
  <label>User name<input type="text"></label>
  <em class="message"></em>

  <script>
  const input = document.querySelector('input[type=text]');
  const msg = document.querySelector('.message');

  input.addEventListener('blur', function(){
      if(input.value.length < 2){
        msg.innerHTML= '이름은 2자 이상';
      }else{
        msg.innerHTML= '';
      }
    });
  </script>
</body>
</html>
```

- **addEventListner 메소드의 두번째 매개변수는 이벤트가 발생했을 때 호출될 이벤트 핸들러이다. 이때 두번째 매개변수에는 함수 호출이 아니라 함수 자체를 지정해야한다.**



```javascript
function foo() {
  alert('clicked!');
}
// elem.addEventListener('click', foo()); 
// 이벤트 발생 시까지 대기하지 않고 바로 실행된다

elem.addEventListener('click', foo);      
// 이벤트 발생 시까지 대기한다
```



- 이벤트 핸들러 함수에 인수를 전달할 수 없는 문제가 생기는데 이를 우회하기 위한 방법은 이벤트 핸들러 내부에서 함수를 호출하면서 인수를 전달하는 것이다.

```javascript
<!DOCTYPE html>
<html>
<body>
  <label>User name <input type='text'></label>
  <em class="message"></em>

  <script>
    const MIN_USER_NAME_LENGTH = 2; // 이름 최소 길이

    const input = document.querySelector('input[type=text]');
    const msg = document.querySelector('.message');

    function checkUserNameLength(n) {
      if (input.value.length < n) {
        msg.innerHTML = '이름은 ' + n + '자 이상이어야 합니다';
      } else {
        msg.innerHTML = '';
      }
    }

    input.addEventListener('blur', function () {
      // 이벤트 핸들러 내부에서 함수를 호출하면서 인수를 전달한다.
      checkUserNameLength(MIN_USER_NAME_LENGTH);
    });

    // 이벤트 핸들러 프로퍼티 방식도 동일한 방식으로 인수를 전달할 수 있다.
    // input.onblur = function () {
    //   // 이벤트 핸들러 내부에서 함수를 호출하면서 인수를 전달한다.
    //   checkUserNameLength(MIN_USER_NAME_LENGTH);
    // };
  </script>
</body>
</html>
```



## 5. 이벤트 핸들러 함수 내부의 this



### 1) 인라인 이벤트 핸들러 방식

- 인라인 이벤트 핸들러 방식의 경우. 이벤트 핸들러는 **일반 함수로서 호출**되므로 핸들러 내부의 this는 **전역 객체 window**를 가리킨다.



### 2) 이벤트 핸들러 프로퍼티 방식

- 이벤트 핸들러 프로퍼티 방식에서 이벤트 핸들러는 **메소드**이므로 이벤트 핸들러 내부의 this는 **이벤트에 바인딩된 요소**를 가리킨다.
- 이것은 이벤트 **객체의 currentTarget 프로퍼티와 같다.**



### 3) addEventListener 메소드 방식

- addEventListener 메소드에서 지정한 이벤트 핸들러는 콜백 함수이지만 이벤트 핸들러 내부의 **this는 이벤트 리스너에 바인딩된 요소**를 가리킨다.
- 이벤트 **객체의 currentTarget 프로퍼티와 같다.**



## 6. 이벤트의 흐름

- 계층적 구조에 포함되어 있는 HTML 요소에 이벤트가 발생할 경우 연쇄적인 반응이 일어난다. 즉, 이벤트가 전파되는데 전파 방향에 따라 버블링과 캡쳐링으로 구분할 수 있다.
- **버블링(Event Bubbling)**: 자식 요소에서 발생한 이벤트가 부모 요소로 전파되는 것을 말한다.
- **캡쳐링(Event Captyring)**: 자식 요소에서 발생한 이벤트가 부모 요소부터 시작하여 이벤트를 발생시킨 자식요소까지 도달하는 것을 말한다.
- **addEventListener 메소드의 세번째 매개변수의 <u>true를 설정하면 캡처링으로 전파되는 이벤트를 캐치</u>하고 <u>false 또는 미설정하면 버블링으로 전파되는 이벤트를 캐치</u>한다.**

- **[주의]**
  - 버블링과 캡처링은 둘 중 하나만 발생하는 것이 아니라 캡처링부터 시작해 버블링으로 종료한다. 즉 이벤트 발생 시 캡처링과 버블링은 순차적으로 발생한다.
  - 캡처링은 IE8 이하에서 지원되지 않는다.

![](https://poiemaweb.com/img/eventflow.svg)



## 7. Event 객체

- event 객체는 이벤트를 발생시킨 요소와 발생한 이벤트에 대한 유용한 정보를 제공한다. **이벤트가 발생하면 event 객체는 동적으로 생성**되며 **이벤트를 처리할 수 있는 이벤트 핸들러에 암묵적으로 인자로 전달**된다.
- 그러나 이벤트 핸들러를 선언할 때, event 객체를 전달받을 첫번째 매개변수를 명시적으로 선언해야한다.



### 1) Event.target

- 실제로 이벤트를 발생시킨 요소를 가리킨다.

- 함수를 특정 노드에 한정하여 사용하지 않고 범용적으로 사용하기 위해 event 객체의 target 프로퍼티를 사용한다.



[이해가 되지 않는 코드]

```html
<!DOCTYPE html>
<html>
<body>
  <div class="container">
    <button id="btn1">Hide me 1</button>
    <button id="btn2">Hide me 2</button>
  </div>

  <script>
    const container = document.querySelector('.container');

    function hide(e) {
      // e.target은 실제로 이벤트를 발생시킨 DOM 요소를 가리킨다.
      e.target.style.visibility = 'hidden';
      // this는 이벤트에 바인딩된 DOM 요소(.container)를 가리킨다. 따라서 .container 요소를 감춘다.
      // this.style.visibility = 'hidden';
    }

    container.addEventListener('click', hide);
  </script>
</body>
</html>
```

 위 예제의 경우, this는 이벤트에 바인딩된 DOM 요소(.container)를 가리킨다. 따라서 container 요소를 감춘다. e.target은 실제로 이벤트를 발생시킨 DOM 요소(button 요소 또는 .container 요소)를 가리킨다. Event.target은 this와 반드시 일치하지는 않는다. 



### 2) Event.currentTarget

- 이벤트에 바인딩된 DOM 요소를 가리킨다. (addEventListener 앞에 기술된 객체를 가리킨다.)



### 3) Event.type

- 발생한 이벤트의 종류를 나타내는 문자열을 반환한다.



### 4) Event.cancelable

- 요소의 기본 동작을 취소시킬 수 있는지 여부(true, false)를 나타낸다.



### 5) Event.eventPhase

- 이벤트 흐름 상에서 어느 단계에 있는지를 반환한다.

| 반환값 | 의미        |
| :----- | :---------- |
| 0      | 이벤트 없음 |
| 1      | 캡쳐링 단계 |
| 2      | 타깃        |
| 3      | 버블링 단계 |



## 8. Event Delegation (이벤트 위임)

- **이벤트 위임은 다수의 자식 요소에 각각 이벤트 핸들러를 바인딩하는 대신 하나의 부모 요소에 이벤트 핸들러를 바인딩하는 방법이다.**
- 동적으로 li 요소가 추가되는 경우, 아직 추가되지 않은 요소는 DOM에 존재하지 않으므로 이벤트 핸들러를 바인딩 할 수 없기 때문에 이러한 경우 이벤트 위임을 사용한다.

- 이는 이벤트가 이벤트 흐름에 의해 이벤트를 발생시킨 요소의 부모 요소에도 영향(버블링)을 미치기 때문에 가능하다.



<code>Event.target</code>

- 실제로 이벤트를 발생시킨 요소를 알아내기 위해 사용

```php+HTML
<html>
<body>
  <ul class="post-list">
    <li id="post-1">Item 1</li>
    <li id="post-2">Item 2</li>
    <li id="post-3">Item 3</li>
    <li id="post-4">Item 4</li>
    <li id="post-5">Item 5</li>
    <li id="post-6">Item 6</li>
  </ul>
  <div class="msg">
  <script>
    const msg = document.querySelector('.msg');
    const list = document.querySelector('.post-list')

    list.addEventListener('click', function (e) {
      // 이벤트를 발생시킨 요소
      console.log('[target]: ' + e.target);
      // 이벤트를 발생시킨 요소의 nodeName
      console.log('[target.nodeName]: ' + e.target.nodeName);

      // li 요소 이외의 요소에서 발생한 이벤트는 대응하지 않는다.
      if (e.target && e.target.nodeName === 'LI') {
        msg.innerHTML = 'li#' + e.target.id + ' was clicked!';
      }
    });
  </script>
</body>
</html>
```



## 9. 기본 동작의 변경

이벤트 객체는 요소의 기본 동작과 요소의 부모 요소들이 이벤트에 대응하는 방법을 변경하기 위한 메소드를 가지고 있다.



### 1)  Event.preventDefault()

- 요소가 가지고 있는 기본 동작을 중단시키기 위한 메소드이다.



### 2) Event.stopPropagation()

- 어느 한 요소를 이용하여 이벤트를 처리한 후 이벤트가 부모 요소로 이벤트가 전파되는 것을 중단시키기 위한 메소드이다.



### 3) preventDefault & stopPropagation

- 기본 동작의 중단과 버블링 또는 캡처링의 중단을 동시에 실시하는 방법

```javascript
return false;
```

단 이 방법은 jQuery를 사용할 때와 아래와 같이 사용할 때만 적용된다.



[의문사항] 아래의 코드는 어떤 사항인가?

```html
<!DOCTYPE html>
<html>
<body>
  <a href="http://www.google.com" onclick='return handleEvent()'>go</a>
  <script>
  function handleEvent() {
    return false;
  }
  </script>
</body>
</html>
```



```html
<!DOCTYPE html>
<html>
<body>
  <div>
    <a href="http://www.google.com">go</a>
  </div>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.3/jquery.min.js"></script>
  <script>

  // within jQuery
  $('a').click(function (e) {
    e.preventDefault(); // OK
  });

  $('a').click(function () {
    return false; // OK --> e.preventDefault() & e.stopPropagation().
  });

  // pure js
  document.querySelector('a').addEventListener('click', function(e) {
    // e.preventDefault(); // OK
    return false;       // NG!!!!!
  });
  </script>
</body>
</html>
```



위 방법은 기본 동작의 중단과 이벤트 흐름의 중단 모두 적용되므로 이 두가지 중 하나만 중단하기 위해서는 preventDefault()나 stopPropagation() 메소드를 개별적으로 사용해야한다.