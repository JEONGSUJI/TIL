# Ajax 비동식 처리 모델과 Ajax



## 1. Ajax(Asynchronous JavaScript and XML)

- 브라우저에서 웹페이지를 요청하거나 링크를 클릭하면 브라우저와 서버와의 통신에 의해 화면 갱신이 발생한다.

![](https://poiemaweb.com/img/req_res.png)

- 서버는 요청받은 페이지를 반환하는데 이때 HTML에서 로드하는 CSS나 JavaScript 파일들도 같이 반환된다.



|                        동기 통신 방식                        |                     비동기 통신 방식                      |
| :----------------------------------------------------------: | :-------------------------------------------------------: |
| ![](https://poiemaweb.com/img/traditional-webpage-lifecycle.png) | ![](https://poiemaweb.com/img/ajax-webpage-lifecycle.png) |

- **Ajax는 자바스크립트를 이용해서 <u>비동기적</u>으로 서버와 브라우저가 데이터를 교환할 수 있는 통신 방식을 의미한다.**서버로부터 웹페이지가 반환되면 화면 전체를 갱신해야하는데 페이지 일부만을 갱신하고도 동일한 효과를 볼 수 있도록 하는 것이다.




## 2. JSON (JavaScript Object Notation)

- **JSON**은 <u>클라이언트와 서버 간 데이터 교환을 위한 규칙, 데이터 포맷을 말한다. 순수한 텍스트로 구성된 규칙이 있는 데이터 구조이다.</u>

- JSON은 순수히 데이터 포맷으로 오직 프로퍼티만 담을 수 있다.

- **JSON 장점**

  - 일반 텍스트 포맷보다 효과적인 데이터 구조화가 가능하다.
  - XML 포맷보다 가볍고 사용하기 간편하며 가독성도 좋다.

  주의)  <u>키는 반드시 큰따옴표로 둘러싸야 한다.</u>



### 1) JSON.stringify

- **JSON.stringify 메소드는 JavaScript 값이나 객체를 JSON 형식의 문자열로 변환한다.**

<code>JSON.stringify(value[, replacer[, space]])</code>

- 매개변수
  - value : JSON 문자열로 변환할 값
  - replacer : 문자열화 동작방식을 변경하는 함수
  - space : 가독성을 목적으로 JSON 문자열 출력에 공백을 삽입하는데 사용되는 String, Number 객체

- 반환 값 : 주어진 값과 대응하는 JSON 문자열



### 2) JSON.parse

- **JSON.parse 메소드는  JSON데이터를 가진 문자열을 객체로 변환한다.**
- 배열의 요소가 객체인 경우 배열의 요소까지 객체로 변환한다.

<code>JSON.parse(text[, reviver])</code>

> 서버로부터 브라우저로 전송된 JSON 데이터는 문자열인데, 이 문자열을 객체로서 사용하려면 객체화하여야 한다. 이를 역직렬화(Deserializing)이라 한다



## 3. XMLHttpRequest

브라우저는 XMLHttpRequest 객체를 이용하여 Ajax 요청을 생성하고 전송한다. 서버가 브라우저의 요청에 대해 응답을 반환하면 같은 XMLHttpRequest 객체가 그 결과를 처리한다.

```javascript
// XMLHttpRequest 객체의 생성
const xhr = new XMLHttpRequest();
xhr.open('GET', '/users');
xhr.send();
```



### 1) Ajax request

#### 	a) XMLHttpRequest.open

- XMLHttpRequest 객체의 인스턴스를 생성하고 해당 메소드를 사용하여 서버로의 요청을 준비한다.

​		<code>XMLHttpRequest.open(method, url[, async])</code>

  - 매개변수
    		- method : HTTP method
    		- url : 요청을 보낼 URL
    		- async : 비동기 조작여부, (default = true)



#### 	b) XMLHttpRequest.send

- XMLHttpRequest.send 메소드로 준비된 요청을 서버에 전달한다.

  <code>XMLHttpRequest.send()</code>

  - <u>GET 메소드</u>의 경우, URL의 일부분인 쿼리문자열로 데이터를 서버에 전송
  - <u>POST 메소드</u>의 경우, 데이터(페이로드)를 Request Body에 담아 전송

- XMLHttpRequest.send 메소드는 **request body**에 담아 전송할 인수를 전달할 수 있다. 

- 단, 요청 메소드가 GET인 경우 send 메소드의 인수는 무시되고 request body는 null로 설정된다.

![](https://poiemaweb.com/img/HTTP_request+response_message.gif)



#### 	c) XMLHttpRequest.setRequestHeader

- XMLHttpRequest.setRequestHeader 메소드는 HTTP Request Header의 값을 설정한다.

  <code>XMLHttpRequest.setRequestHeader()</code>

- setRequestHeader 메소드는 반드시 XMLHttpRequest.open 메소드 호출 이후에 호출한다.

  - **Content-type**

    <code> xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); </code>

    - request body에 담아 전송할 데이터의 MIME-type의 정보를 표현

    | 타입                        | 서브타입                                           |
    | :-------------------------- | :------------------------------------------------- |
    | text 타입                   | text/plain, text/html, text/css, text/javascript   |
    | Application 타입            | application/json, application/x-www-form-urlencode |
    | File을 업로드하기 위한 타입 | multipart/formed-data                              |

  - **Accept**

    <code> xhr.setRequestHeader('Accept', 'application/json'); </code>

    - HTTP 클라이언트가 서버에 요청할 때 서버가 샌드백할 데이터의 MIME-type을 Accept로 지정할 수 있다.

    - 만약 Accept 헤더를 설정하지 않으면 send 메소드가 호출될 때 Accept 헤더가 */ * 로 전송된다.

### 2)  Ajax response

#### 	a)  XMLHttpRequest.onreadystatechange

- 해당 메소드는 Response가 클라이언트에 도달하여 발생된 이벤트를 감지하고 콜백 함수를 실행하여 준다.

- 이때 이벤트는 Request에 어떠한 변화가 발생한 경우 즉  XMLHttpRequest.readyState 프로퍼티가 변경된 경우 발생한다.

  

  #### b)  XMLHttpRequest.readyState

- response가 클라이언트에 도달했는지를 추적할 수 있는 프로퍼티이다.

| Value | State            | Description                                           |
| :---: | :--------------- | :---------------------------------------------------- |
|   0   | UNSENT           | XMLHttpRequest.open() 메소드 호출 이전                |
|   1   | OPENED           | XMLHttpRequest.open() 메소드 호출 완료                |
|   2   | HEADERS_RECEIVED | XMLHttpRequest.send() 메소드 호출 완료                |
|   3   | LOADING          | 서버 응답 중(XMLHttpRequest.responseText 미완성 상태) |
|   4   | DONE             | 서버 응답 완료                                        |



## 4. Web Server

- 웹서버는 브라우저와 같은 클라이언트로부터 HTTP 요청을 받아들이고 HTML 문서와 같은 웹페이지를 반환하는 컴퓨터 프로그램이다.



## 5. Load HTML

### 3) Load JSONP

- **동일출처원칙**: 요청에 의해 웹페이지가 전달된 서버와 동일한 도메인의 서버로부터 전달된 데이터는 문제없이 처리할 수 있지만 보안상의 이유로 다른 도메인으로의 요청은 제한된다.

  - **웹서버의 프록시 파일**

    서버에 원격 서버로부터 데이터를 수집하는 별도의 기능을 추가하는 것이다. 이를 프록시라 한다.

  - **JSONP**

    script 태그의 원본 주소에 대한 제약은 존재하지 않는데 이것을 이용해 다른 도메인의 서버에서 데이터를 수집하는 방법이다.

    자신의 서버에 함수를 정의하고 다른 도메인의 서버에 얻고자 하는 데이터를 인수로 하는 함수 호출문을 로드하는 것이다.

    ![comparison_between_ajax_and_jsonp](https://poiemaweb.com/img/comparison_between_ajax_and_jsonp.png)

  - **Cross-Origin Resource Sharing**

    - HTTP 헤더에 추가적으로 정보를 추가하여 브라우저와 서버가 서로 통신해야 한다는 사실을 알게하는 방법이다.
    - W3C 명세에 포함되어 있지만 최신 브라우저에서만 동작하며 서버에 HTTP 헤더를 설정해 주어야 한다.