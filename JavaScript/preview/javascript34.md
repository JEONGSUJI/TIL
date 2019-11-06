# DOM (Document Object Model)



## **1. DOM이란?**

- 텍스트 파일로 만들어져 있는 웹 문서(HTML, XML, SVG)를 브라우저에 렌더링하려면 웹 문서를 브라우저가 이해할 수 있는 구조로 메모리에 올려야한다. 브라우저의 렌더링 엔진은 웹 문서를 로드한 후, 파싱하여 웹 문서를 브라우저가 이해할 수 있는 구조로 구성하여 메모리에 적재하는 것을 말한다.

- 모든 요소와 요소의 어트리뷰트, 텍스트를 각각의 객체로 만들고 이들 객체 부자 관계를 표현할 수 있는 트리 구조로 구성한 것이다.
- 자바스크립트를 통해 동적으로 변경할 수 있으며 변경된  DOM은 렌더링에 반영된다.
- DOM은 호스트 객체로 W3C의 공식 표준이며 플랫폼/프로그래밍 언어 중립적이다.
- DOM이 담당하는 2가지 기능
  - HTML 문서에 대한 모델 구성
    - 브라우저는 HTML 문서를 로드한 후 해당 문서에 대한 모델(객체의 트리로 구성되며 이를 DOM tree라 함)을 메모리에 생성한다.
  - HTML 문서 내의 각 요소에 접근 및 수정
    - DOM은 모델 내의 각 객체에 접근하고 수정할 수 있는 프로퍼티와 메소드를 제공한다.

![](https://poiemaweb.com/img/client-server.png)

> **DOM API(Application Programming Interface)**
>
> 웹 문서의 동적 변경을 위해 DOM은 프로그래밍 언어가 자신에 접근하고 수정할 수 있는 방법을 제공하는데 일반적으로 프로퍼티와 메소드를 갖는 자바스크립트 객체로 제공되는 것을 말한다.



결론: **정적인 웹페이지에 접근하여 동적으로 웹페이지를 변경하기 위한 유일한 방법은 메모리 상에 존재하는 DOM을 변경하는 것이고, 이때 필요한 것이 DOM에 접근하고 변경하는 프로퍼티와 메소드의 집합인 DOM API다.**



## 2. DOM tree

- 브라우저가 HTML 문서를 로드한 후 파싱하여 생성하는 모델로 객체의 트리로 구조화 되어있어 DOM tree라 부른다.



![](https://poiemaweb.com/img/dom-tree.png)



- DOM에서 모든 요소, 어트리뷰트, 텍스트는 하나의 객체이며 Document 객체의 자식이다.
- 요소의 중첩관계는 객체의 트리로 구조화하여 부자관계를 표현한다.
- DOM tree의 진입점(Entry point)는 document 객체이며 최종점은 요소의 텍스트를 나타내는 객체이다.



| DOM tree를 구성하는 노드        |                                                              |
| ------------------------------- | ------------------------------------------------------------ |
| 문서노드(Document Node)         | 트리의 최상위에 존재하며 각각 요소, 어트리뷰트, 텍스트 노드에 접근하려면 문서 노드를 통해야 한다. **DOM tree에 접근하기 위한 시작점**이다. |
| 요소노드(Element Node)          | HTML 요소를 표현한다. HTML 요소는 중첩에 의해 부자 관계를 가지며 이 부자 관계를 통해 정보를 구조화한다. 따라서 **요소노드는 문서의 구조를 서술**한다. 어트리뷰트, 텍스트 노드에 접근하려면 요소 노드를 먼저 찾고 접근해야한다. 모든 요소 노드는 요소별 특성을 표현하기 위해 HTMLElement 객체를 상속한 객체로 구성된다. |
| 어트리뷰트 노드(Attribute Node) | HTML 요소의 어트리뷰트를 표현한다. 어트리뷰트 노드는 해당 어트리뷰트가 지정된 요소의 자식이 아니라 해당 요소의 일부로 표현된다. 해당 요소 노드를 찾아 접근하면 어트리뷰트를 참조, 수정할 수 있다. |
| 텍스트 노드(Text Node)          | **HTML 요소의 텍스트를 표현**한다. 텍스트 노드는 요소 노드의 자식이며 자신의 **자식 노드를 가질 수 없다**. **DOM tree의 최종단**이다. |



- DOM을 통해 웹페이지를 조작하기 위해 필요한 수순

  1) 조작하고자하는 요소를 선택 또는 탐색

  2) 선택된 요소의 콘텐츠 또는 어트리뷰트를 조작 



## 3. DOM Query / Traversing (요소에의 접근)



### 1) 하나의 요소 노드 선택(DOM Query)

- <code>**document.getElementById(id)**</code>
  - **id 어트리뷰트 값으로 요소 노드를 한개 선택한다.** (복수개 선택된 경우, 첫번째 요소만 반환)
  - return : HTMLElement를 상속받은 객체
  - 모든 브라우저에서 동작한다.

- <code>**document.querySelector(cssSelector)**</code>
  - **CSS 셀렉터를 사용하여 요소 노드를 한개 선택한다.** (복수 개 선택된 경우, 첫번째 요소만 반환)
  - return: HTMLElement를 상속받은 객체
  - IE8 이상의 브라우저에서 동작



### 2) 여러 개의 요소 노드 선택 (DOM Query)

- <code>**document.getElementsByClassName(class)**</code>

  - class 어트리뷰트 값으로 요소 노드를 모두 선택한다. 공백으로 구분하여 여러 개의 class를 지정할 수 있다.

  - return : HTMLCollection (live)

    - 반환값이 복수인 경우, HTMLElement의 리스트를 담아 반환하기 위한 객체로 배열과 비슷한 사용법을 가지고 있지만 배열은 아닌 유사배열이다. 

    - 또한 HTMLCollection은 실시간으로 Node의 상태 변경을 반영하기 때문에 loop가 필요한 경우 주의가 필요하다.

      - 해결방법 

        1) 반복문을 역방향으로 돌린다.

        2) while 반복문을 사용한다. 이때 elems에 요소가 남아 있지 않을 때까지 무한반복하기 위해 index는 0으로 고정시킨다.

        3) (권장) HTMLCollection을 배열로 변경한다.

        4) querySelectorAll 메소드를 사용하여 HTMLCollection이 아닌 NodeList(non-live)를 반환하게 한다.

  - IE9 이상의 브라우저에서 동작

  

- <code>**document.getElementsByTagName(tagName)**</code>
  - 태그명으로 요소 노드를 모두 선택한다.
  - return: HTMLCollection (live)
  - 모든 브라우저에서 동작



- <code>**document.querySelectorAll(selector)**</code>
  - 지정된 CSS 선택자를 사용하여 요소 노드를 모두 선택한다.
  - return : NodeList(non-live)
  - IE8 이상의 브라우저에서 동작



### 3) DOM Traversing (탐색)



#### **[부모 노드 관련]**

<code>**parentNode**</code>

- 부모 노드를 탐색한다.
- return: HTMLElement를 상속받은 객체
- 모든 브라우저에서 동작



<code>**firstChild, lastChild**</code>

- 자식 노드를 탐색한다.
- return : HTMLElement를 상속받은 객체
- IE9 이상의 브라우저에서 동작



> **주의사항**
>
> ```javascript
> const elem = document.querySelector('ul');
> 
> // first Child
> elem.firstChild.className = 'blue';
> // last Child
> elem.lastChild.className = 'blue';
> ```
>
> 위 예제는 예상대로 동작하지 않는데, 이유는 <u>IE를 제외한 대부분의 브라우저들은 요소 사이의 공백 또는 줄바꿈 문자를 텍스트 노드로 취급하기 때문</u>이다. 
>
> ```html
> <ul>
>     <li id="one" class="red">Seoul</li>
>     <li id="two" class="red">London</li>
>     <li id="three" class="red">Newyork</li>
>     <li id="four">Tokyo</li>
> </ul>
> ```
>
> **이를 회피하기 위한 방법**
>
> 1)  아래와 같이 HTML의 공백을 제거
>
> ```html
> <ul><li
>   id='one' class='red'>Seoul</li><li
>   id='two' class='red'>London</li><li
>   id='three' class='red'>Newyork</li><li
>   id='four'>Tokyo</li></ul>
> ```
>
> 2) jQuery:.prev()와 jQueryL:.next()를 사용
>
> 3) firstElementChild, lastElementChild를 사용 (IE9 이상 정상 작동)
>
> ```javascript
> const elem = document.querySelector('ul');
> 
> // first Child
> elem.firstElementChild.className = 'blue';
> // last Child
> elem.lastElementChild.className = 'blue';
> ```



#### **[자식 노드 관련]**

- <code>**hasChildNodes()**</code>
  - **자식 노드가 있는지 확인하고 Boolean 값을 반환한다.**
  - return: Boolean 값
  - 모든 브라우저에서 동작한다.



- <code>**childNodes()**</code>
  - **자식 노드의 컬렉션을 반환한다. 텍스트 요소를 포함한 모든 자식 요소를 반환한다.**
  - return: NodeList (non-live)
  - 모든 브라우저에서 동작한다.



- <code>**children()**</code>
  - **자식 노드의 컬렉션을 반환한다. 자식 요소 중에서 Element type 요소만을 반환한다.**
  - return: HTMLCollection (live)
  - IE9 이상의 브라우저에서 동작



#### **[형제 노드 관련]**

- <code>**previousSibling, nextSibling**</code>
  - 형제 노드를 탐색한다. **text node를 포함한 모든 형제 노드를 탐색한다.**
  - return: HTMLElement를 상속받은 객체
  - 모든 브라우저에서 동작



- <code>**previousElementSibling, nextElementSibling**</code>
  - 형제 노드를 탐색한다. **형제 노드 중에서 Element type 요소만을 탐색한다**
  - return: HTMLElement를 상속받은 객체
  - IE9 이상의 브라우저에서 동작



## 4. DOM Manipulation (조작)



### 1) 텍스트 노드에의 접근/수정

- 요소의 텍스트는 텍스트 노드에 저장되어 있다. 텍스트 노드에 접근하려면 아래와 같은 수순이 필요하다.

  

  1) 해당 텍스트 노드의 부모 노드를 선택한다. 텍스트 노드는 요소 노드의 자식이다. (nodeName, nodeType을 통해 노드의 정보를 취득할 수 있다.)

  2) firstChild 프로퍼티를 사용하여 텍스트 노드를 탐색한다.

  3) 텍스트 노드의 유일한 프로퍼티(nodeValue)를 이용하여 텍스트를 취득한다.

  4) nodeValue를 이용하여 텍스트를 수정한다.

  

> **nodeValue**
>
> - 노드의 값을 반환한다.
> - return: 텍스트 노드의 경우는 문자열, 요소 노드의 경우 null 반환
> - IE6 이상의 브라우저에서 동작한다.



### 2) 어트리뷰트 노드에의 접근/수정

- 어트리뷰트 노드를 조작할 때 다음 프로퍼티 또는 메소드를 사용할 수 있다.



<code>**className**</code>

- **class 어트리뷰트의 값을 취득 또는 변경한다.** className 프로퍼티에 값을 **할당하는 경우, class 어트리뷰트가 존재하지 않으면 class 어트리뷰트를 생성하고 지정된 값을 설정**한다.
- class 어트리뷰트의 값이 여러 개일 경우, 공백으로 구분된 문자열이 반환되므로 String 메소드 split(' ')를 사용하여 배열로 변경하여 사용한다.
- 모든 브라우저에서 동작한다.

```javascript
[...elems].forEach(elem => {
  // class 어트리뷰트 값을 취득하여 확인
  if (elem.className === 'red') {
    // class 어트리뷰트 값을 변경한다.
    elem.className = 'blue';
  }
});
```



<code>**classList**</code>

- add, remove, item, toggle, contains, replace 메소드를 제공한다.
- IE10 이상의 브라우저에서 동작한다.

```javascript
[...elems].forEach(elem => {
  // class 어트리뷰트 값 확인
  if (elem.classList.contains('blue')) {
    // class 어트리뷰트 값 변경한다.
    elem.classList.replace('blue', 'red');
  }
});
```



<code>**id**</code>

- id 어트리뷰트의 값을 취득 또는 변경한다. id 프로퍼티에 값을 할당하는 경우, id 어트리뷰트가 존재하지 않으면 id 어트리뷰트를 생성하고 지정된 값을 설정한다.
- 모든 브라우저에서 동작한다.



<code>**hasAttribute(attribute)**</code>

- 지정한 어트리뷰트를 가지고 있는지 검사한다.
- return : Boolean
- IE8 이상의 브라우저에서 동작한다.

```jav
  // value 어트리뷰트가 존재하지 않으면
  if (!input.hasAttribute('value')) {
    // value 어트리뷰트를 추가하고 값으로 'hello!'를 설정
    input.setAttribute('value', 'hello!');
  }
```



<code>**getAttribute(attribute)**</code>

- 어트리뷰트의 값을 취득한다.
- return: 문자열
- 모든 브라우저에서 동작한다.

```javascript
 // value 어트리뷰트 값을 취득
  console.log(input.getAttribute('value')); // hello!
```



<code>**setAttribute(attribute, value)**</code>

- 어트리뷰트와 어트리뷰트 값을 설정한다.
- return : undefined
- 모든 브라우저에서 동작한다.

```javascript
  // value 어트리뷰트가 존재하지 않으면
  if (!input.hasAttribute('value')) {
    // value 어트리뷰트를 추가하고 값으로 'hello!'를 설정
    input.setAttribute('value', 'hello!');
  }
```



<code>**removeAttribute(attribute)**</code>

- 지정한 어트리뷰트를 제거한다.
- return: undefined
- 모든 브라우저에서 동작한다.

```javascript
 // value 어트리뷰트를 제거
  input.removeAttribute('value');
```



### 3)  HTML  콘텐츠 조작(Manipulation)

- HTML 콘텐츠를 조작하기 위해 아래의 프로퍼티 또는 메소드를 사용할 수 있다. 마크업이 포함된 콘텐츠를 추가하는 행위는 크로스 스크립팅 공격에 취약하므로 주의가 필요하다.



<code>**textContent**</code>

- **요소의 텍스트 콘텐츠를 취득 또는 변경한다.이때 마크업은 무시된다.** 
- textContent를 통해 새로운 텍스트를 할당하면 텍스트를 변경할 수 있다.
- 순수한 텍스트만 지정해야 하며 마크업을 포함시키면 문자열로 인식되어 그대로 출력된다.
- IE9 이상의 브라우저에서 동작한다.



<code>**innerText**</code>

- innerText 프로퍼티를 사용하여도 요소의 텍스트 콘텐츠에만 접근할 수 있다.

- 사용하지 않는 것이 좋은데, 그 이유는 아래와 같다.

  - 비표준이다.
  - CSS에 순종적이다. 예를 들어 CSS에 의해 비표시로 지정되어 있다면 텍스트가 반환되지 않는다.
  - CSS를 고려해야 하므로 textContent 프로퍼티보다 느리다.

  

<code>**innerHTML**</code>

- **해당 요소의 모든 자식 요소를 포함하는 모든 콘텐츠를 하나의 문자열로 취득할 수 있다. 이 문자열은 마크업을 포함한다.**

- innerHTML 프로퍼티를 사용하여 마크업이 포함된 새로운 콘텐츠를 지정하면 새로운 요소를 DOM에 추가할 수 있다.
  - 단, 마크업이 포함된 콘텐츠 추가는 크로스 스크립팅 공격에 취약

```javascript
const one = document.getElementById('one');

// 마크업이 포함된 콘텐츠 취득
console.log(one.innerHTML); // Seoul

// 마크업이 포함된 콘텐츠 변경
one.innerHTML += '<em class="blue">, Korea</em>';

// 마크업이 포함된 콘텐츠 취득
console.log(one.innerHTML); // Seoul <em class="blue">, Korea</em>
```



### 4) DOM 조작 방식

innerHTML 프로퍼티를 사용하지 않고 새로운 콘텐츠를 추가할 수 있는 방법은 DOM을 직접 조작하는 것이다. 한 개의 요소를 추가하는 경우 사용한다.

1.  요소 노드 생성 createElement() 메소드를 사용하여 새로운 요소 노드 생성(createElement() 메소드의 인자로 태그 이름을 전달한다)
2. 텍스트 노드 생성 createTextNode() 메소드를 사용하여 새로운 텍스트 노드를 생성한다. 경우에 따라 생략될 수 있지만, 생략하는 경우 콘텐츠가 비어있는 요소가 된다.
3. 생성된 요소를 DOM에 추가 appendChild() 메소드를 사용하여 생성된 노드를 DOM tree에 추가한다. 또는 removeChild() 메소드를 사용하여 DOM tree에서 노드를 삭제할 수도 있다.



<code>**createElement(tagName)**</code>

- **태그 이름을 인자로 전달하여 요소를 생성한다.**
- return : HTMLElement를 상속받은 객체
- 모든 브라우저에서 동작한다.



<code>**createTextNode(text)**</code>

- **텍스트를 인자로 전달하여 텍스트 노드를 생성한다.**
- return : Text 객체
- 모든 브라우저에서 동작한다.



<code>**appendChild(Node)**</code>

- **인자로 전달한 노드를 마지막 자식 요소로 DOM 트리에 추가한다.**
- return: 추가한 노드
- 모든 브라우저에서 동작한다.



<code>**removeChild(Node)**</code>

- **인자로 전달한 노드를 DOM 트리에 제거한다.**
- return : 추가한 노드
- 모든 브라우저에서 동작한다.



### 5) insertAdjacentHTML()

<code>**insertAdjacentHTML(position, string)**</code>

- 인자로 전달한 텍스트를 HTML로 파싱하고 그 결과로 생성된 노드를 DOM 트리의 지정된 위치에 삽입한다.
- 첫번째 인자는 삽입 위치, 두번째 인자는 삽입할 요소를 표현한 문자열이다.
  - 첫번째 인자로 올 수 있는 값
    - 'beforebegin'
    - 'afterbegin'
    - 'beforeend'
    - 'afterend'
- 모든 브라우저에서 동작한다.

![](https://poiemaweb.com/img/insertAdjacentHTML-position.png)



### 6) innerHTML vs. DOM 조작 방식 vs. insertAdjacentHTML()



#### **innerHTML**

- 장점
  - DOM 조작 방식에 비해 빠르고 간편하다.
  - 간편하게 문자열로 정의한 여러 요소를 DOM에 추가할 수 있다.
  - 콘텐츠를 취득할 수 있다.
- 단점
  - XSS 공격에 취약점이 있기 때문에 사용자로부터 입력받은 콘텐츠(untrusted data: 댓글, 사용자 이름 등)를 추가할 때 주의하여야 한다.
  - 해당 요소의 내용을 덮어 쓴다. 즉, HTML을 다시 파싱한다. 이것은 비효율적이다.



#### DOM 조작방식

- 장점
  - 특정 노드 한 개(노드, 텍스트, 데이터 등)를 DOM에 추가할 때 적합하다.

- 단점
  - innerHTML보다 느리고 더 많은 코드가 필요하다.



#### insertAdjacentHTML()

- 장점
  - 간편하게 문자열로 정의된 여러 요소를 DOM에 추가할 수 있다.
  - 삽입되는 위치를 선정할 수 있다.
- 단점
  - XSS공격에 취약점이 있기 때문에 사용자로부터 입력받은 콘텐츠 (untrusted data: 댓글, 사용자 이름 등)를 추가할 때 주의하여야 한다. 



---

#### 결론

- innerHTML과 insertAdjacentHTML()은 크로스 스크립팅 공격(XSS: Cross-Site Scripting Attacks)에 취약하다. 따라서 untrusted data의 경우, 주의해야 함

- 텍스트를 추가 또는 변경시 textContent, 새로운 요소의 추가 또는 삭제시에는 DOM 조작 방식을 사용하도록 한다. 



## 5. style

style 프로퍼티를 사용하면 inline 스타일 선언을 생성한다. **특정 요소에 inline 스타일을 지정하는 경우 사용한다.**

```javascript
const four = document.getElementById('four');

// inline 스타일 선언을 생성
four.style.color = 'blue';

// font-size와 같이 '-'으로 구분되는 프로퍼티는 카멜케이스로 변환하여 사용한다.
four.style.fontSize = '2em';
```



-  style 프로퍼티의 값을 취득하려면 window.getComputedStyle을 사용한다.
- window.getComputedStyle 메소드는 인자로 주어진 요소의 모든 CSS 프로퍼티 값을 반환한다. 

```javascript
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>style 프로퍼티 값 취득</title>
  <style>
    .box {
      width: 100px;
      height: 50px;
      background-color: red;
      border: 1px solid black;
    }
  </style>
</head>
<body>
  <div class="box"></div>
  <script>
    const box = document.querySelector('.box');

    const width = getStyle(box, 'width');
    const height = getStyle(box, 'height');
    const backgroundColor = getStyle(box, 'background-color');
    const border = getStyle(box, 'border');

    console.log('width: ' + width);
    console.log('height: ' + height);
    console.log('backgroundColor: ' + backgroundColor);
    console.log('border: ' + border);

    /**
     * 요소에 적용된 CSS 프로퍼티를 반환한다.
     * @param {HTTPElement} elem - 대상 요소 노드.
     * @param {string} prop - 대상 CSS 프로퍼티.
     * @returns {string} CSS 프로퍼티의 값.
     */
    function getStyle(elem, prop) {
      return window.getComputedStyle(elem, null).getPropertyValue(prop);
    }
  </script>
</body>
</html>
```