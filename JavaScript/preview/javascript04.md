# 변수

## 변수란?

- 정의: 하나의 값을 저장할 수 있는 메모리 공간에 붙인 이름 또는 메모리 공간 자체를 말한다.
- 기억하고 싶은 데이터를 메모리에 저장하고, 저장된 데이터로 읽어들여 재사용하기 위해 제공하는 것이다.
- 데이터를 관리하기 위한 핵심 개념이다. 컴퓨터는 메모리를 사용해 데이터를 기억한다.

- 할당: 변수에 값을 저장하는 것
- 참조: 변수에 저장된 값을 읽어들이는 것, 변수이름과 매핑된 메모리 주소를 통해 메모리 공간에 접근하여 저장된 값을 반환한다.

> 메모리  
> 데이터를 저장할 수 있는 메모리 셀들의 집합체다. 셀 하나의 크기는 1byte, 컴퓨터는 셀 하나의 크기(1byte) 단위로 데이터를 저장하거나 읽어들인다. 컴퓨터는 모든 데이터를 2진수로 처리한다. 각각의 셀들은 고유의 메모리 주소를 가진다. 메모리 주소는 메모리 공간의 위치를 나타내며 0부터 시작해 메모리의 크기만큼 정수로 표현된다.

> 변수에 여러개의 값을 저장하는 방법  
> 변수에 여러개의 값을 저장하기 위해서는 여러개의 변수를 사용해야한다. 단, 배열이나 객체와 같은 자료 구조를 사용하면 관련이 있는 여러개의 값을 그룹화하여 하나의 값처럼 사용가능하다.

---

## 식별자

- 어떤 값을 구별하여 식별할 수 있는 이름이다.
- 변수 이름 뿐 아니라 변수, 함수, 클래스 등의 이름은 모두 식별자이다.
- 어떤 값이 저장되어있는 메모리 주소를 기억해야 한다.
- 네이밍 규칙을 준수해야 한다.

---

## 변수선언

- 변수를 생성하는 것이다.
- 변수 이름을 자바스크립트 엔진에 알려 등록하고 변수값을 저장하기 위한 메모리 영역의 확보를 명령하는 것이다.
- var, let, const 키워드를 사용한다.
- 변수 선언 후 값을 할당하지 않으면 <code>undefined</code>라는 값이 암묵적으로 할당되어 초기화 된다.
- 변수 선언 단계  
  1단계 선언단계 : 변수 이름을 등록하여 자바스크립트 엔진에 변수의 존재 알리기
  2단계 초기화단계 : 값을 저장하기 위한 메모리 공간을 확보하고 암묵적으로 undefined 할당
- 변수를 사용하려면 반드시 선언이 필요하다. 만약 선언없이 식별자에 접근하면 <code>ReferenceError</code>가 발생한다. ReferenceError는 식별자를 통해 값을 참조하려 했지만 자바스크립트 엔진이 등록된 식별자를 찾을 수 없을 때 발생하는 참조 에러이다.

> 키워드  
> 자바스크립트 코드를 실행하는 자바스크립트 엔진이 수행할 동작을 규정한 일종의 명령어를 말한다.

> 변수의 이름은 어디에 등록되는가?  
> 변수 이름을 비롯한 모든 식별자는 실행 컨텍스트에 등록된다. 실행 컨텍스트는 자바스크립트 엔진이 실행가능한 코드를 평가하고 실행하기 위한 환경을 제공하고 코드의 실행 결과를 실제로 관리하는 영역을 말한다. 자바스크립트 엔진은 실행 컨텍스트를 통해 식별자와 스코프를 관리한다.

---

## 변수 선언의 실행 시점과 변수 호이스팅

- 변수 선언은 소스 코드가 순차적으로 한 줄씩 실행되는 시점, 즉 런타임이 아니라 그 이전 단계인 구문 분석 단계에 먼저 실행된다.
- 자바스크립트 엔진은 소스 코드를 한 줄씩 순차적으로 실행하기 이전에 먼저 소스 코드 전체를 평가한다. 이때 모든 선언문(변수 선언문, 함수 선언문 등)을 찾아내어 식별자를 등록하고 초기화 한다.
- 그 후, 선언문을 제외한 소스코드를 한 줄씩 순차적으로 실행한다.
- 이처럼 변수 선언문이 코드의 선두로 끌어 올려진 것처럼 동작하는 자바스크립트의 고유의 특징을 *변수 호이스팅*이라 한다.
- 호이스팅은 모든 식별자(변수, 함수, 클래스 등)는 호이스팅 된다. 모든 선언문은 런타임 이전인 구문 분석 단계에 먼저 실행디기 때문이다.

---

## 값의 할당

- 변수에 값을 할당할때는 할당 연산자(=)를 사용한다.
- 주의  
  변수 선언은 소스 코드가 순차적으로 실행되기 이전, 즉 런타임 이전에 먼저 실행되지만 값의 할당은 소스 코드가 순차적으로 실행되는 시점인 런타임에 실행된다.  
  변수에 값을 할당할 때는 이전 값 undefined 가 저장되어 있던 메모리 공간을 지우고 그 메모리 공간에 할당 값을 새롭게 저장하는 것이 아닌 새로운 메모리 공간을 확보하고 그 메모리 공간에 할당 값을 저장한다.

---

## 값의 재할당

- 재할당은 변수에 저장된 값을 다른 값으로 변경한다.따라서 변수라고 부른다.
- 상수: 재할당을 할 수 없어서 변수에 저장된 값을 변경할 수 없는 경우를 말한다. 즉 상수는 한번만 할당할 수 있는 변수이다.

> 가비지 컬렉터  
> 할당, 재할당 될 때 그 이전에 값이 저장되어있던 메모리 공간은 가비지 컬렉터에 의해 메모리에서 자동으로 해제되나 언제 해체될지는 예측할 수 없다. 더 이상 사용되고 있지 않은 메모리란 어떤 식별자도 참조하고 있지 않은 메모리 영역을 말한다. 자바스크립트는 가비지 컬렉터를 내장하고 있는 매니지드 언어이다. 이를 통해 메모리 누수를 방지한다.

> 언매니지드 언어와 매니지드 언어  
> C 언어와 같은 언매니지드 언어는 개발자가 명시적으로 메모리를 할당하고 해제하기 위해 malloc()과 free()와 같은 저수준(low-level) 메모리 관리 기능을 제공한다. 언매니지드 언어는 메모리 관리를 개발자가 주도하므로 개발자의 역량에 의해 최적의 퍼포먼스를 확보할 수 있지만 그 반대의 경우, 치명적 오류를 생산할 가능성도 동시에 존재한다.  
> 자바스크립트와 같은 매니지드 언어는 메모리의 할당 및 해제를 위한 메모리 관리 기능을 언어 차원에서 담당하고 개발자의 직접적인 메모리 제어를 허용하지 않는다. 즉, 개발자가 명시적으로 메모리를 할당하고 해제할 수 없다. 더 이상 사용하지 않는 메모리의 해제는 가비지 컬렉터(Garbage Collector)가 수행하며 이 또한 개발자가 관여할 수 없다. 매니지드 언어는 개발자의 역량에 의존하는 부분이 상대적으로 작아져 어느 정도 일정한 생산성을 확보할 수 있는 장점이 있지만 퍼포먼스 면에서의 손실은 감수할 수 밖에 없다.

---

## 식별자 네이밍 규칙

- 식별자는 특수문자를 제외한 문자, 숫자, underscore( \_ ), 달러 기호(\$)를 포함할 수 있다.
- 단, 식별자는 특수문자를 제외한 문자, underscore( \_ ), 달러 기호(\$)로 시작해야 한다. 숫자로 시작하는 것은 허용하지 않는다.
- 예약어는 식별자로 사용할 수 없다
- 자바스크립트는 대소문자를 구별한다.
- 네이밍 컨벤션  
  camelCase / snake_case / PascalCase / typeHungarianCase
  가장 일반적인 것은 변수나 함수의 이름에는 카멜 케이스를 사용하고, 생성자 함수, 클래스의 이름에는 파스칼 케이스를 사용하는 것이다.

---