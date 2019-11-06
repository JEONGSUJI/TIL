# REST(Representational State Transfer) API

REST는 로이 필딩의 2000년 논문에서 처음 소개되었다. 웹이 HTTP의 설계 상 우수성을 제대로 사용하지 못하고 있는 상황을 보고 웹의 장점을 최대한 활용할 수 있는 아키텍쳐로서 REST를 소개하였고 이는 HTTP 프로토콜을 의도에 맞게 디자인하도록 유도하고 있다.

REST의 기본 원칙을 성실히 지킨 서비스 디자인을 **RESTful** 이라고 한다.



## 1. REST API 중심 규칙

1. URI는 정보의 자원을 표현해야 한다.
   - 리소스명은 동사보다는 명사를 사용한다.
2. 자원에 대한 행위는 HTTP Method로 표현한다.



## 2. HTTP Method

| Method | Action         | 역할                     |
| :----- | :------------- | :----------------------- |
| GET    | index/retrieve | 모든/특정 리소스를 조회  |
| POST   | create         | 리소스를 생성            |
| PUT    | update all     | **리소스의 전체를 갱신** |
| PATCH  | update         | **리소스의 일부를 갱신** |
| DELETE | delete         | 리소스를 삭제            |



## 3. REST API의 구성

- REST API는 자원, 행위, 표현의 3가지 요소로 구성된다.
- REST는 자체 표현 구조로 구성되어 REST API만으로 요청을 이해할 수 있다.

| 구성 요소       | 내용                    | 표현 방법             |
| :-------------- | :---------------------- | :-------------------- |
| Resource        | 자원                    | HTTP URI              |
| Verb            | 자원에 대한 행위        | HTTP Method           |
| Representations | 자원에 대한 행위의 내용 | HTTP Message Pay Load |



## 4. REST API EXAMPLE

- #### GET : 리소스에서 조회

 <code>$ curl -X GET http://localhost:5000/todos  </code>



- #### POST : 리소스에 새로운 것 생성

 <code> $ curl -X POST http://localhost:5000/todos -H "Content-Type: application/json" -d '{"id": 4, "content": "Angular", "completed": true}'  </code>



- #### PUT : 특정 리소스의 전체를 갱신

<code> $ curl -X PUT http://localhost:5000/todos/4 -H "Content-Type: application/json" -d '{"id": 4, "content": "React", "completed": false}' </code>



- #### PATCH : 특정 리소스의 일부를 갱신

<code> $ curl -X PATCH http://localhost:5000/todos/4 -H "Content-Type: application/json" -d '{"completed": true}' </code>



- #### DELETE : 특정 리소스 삭제

<code> $ curl -X DELETE http://localhost:5000/todos/4 </code>