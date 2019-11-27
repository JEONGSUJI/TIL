## 제어문

분기가 필요한 경우 사용한다.



### 조건문(if, elif, else)

if와 else는 조건이 참인지 거짓인지 판단하는 파이썬 선언문이며, elif는 else 내의 if를 중첩해야할 때 사용한다.

```python
if 조건:
    조건이 참인 경우
else:
    조건이 거짓일 경우
```



#### +. 생소한 elif 알아보기

```python
if 조건1:
	조건1이 참일 경우
else:
	조건1이 거짓일 경우
	
	if 조건2:
		조건1은 거짓이나, 조건2는 참일 경우
	else:
		조건1,2가 모두 거짓일 경우
```

위와 같은 코드를 아래와 같이 elif를 사용해 줄여쓸 수 있다.

```python
if 조건1:
    조건1이 참일 경우
elif 조건2:
    조건1은 거짓이나, 조건2가 참일 경우
else:
    조건1, 2가 모두 거짓일 경우
```

즉, else if가 elif라는 점을 알 수 있다.



### 조건 표현식

```python
참일경우 if 조건식 else 거짓일 경우
```

if문 자체는 표현식이 아니며, 표현식으로 쓸 수 없다. if문은 안쪽으로 들어가는 블럭을 정의해줘야한다.

하지만 조건 표현식을 사용하면 if문을 표현식처럼 사용할 수 있다.



실습)  `is_holiday`에 `True`또는 `False`값을 할당한 후, `if`문과 `조건표현식`을 사용해서 각각 'Good'과 'Bad'를 출력하는 코드

```python
is_holiday = True
'Good' if is_holiday else 'Bad'
```



### 중첩 조건표현식

```python
#조건이 2개일 경우
조건1이 참일경우 if 조건1 else 조건1은 거짓이나 조건2가 참일경우 if 조건2 else 조건1,2가 모두 거짓일 경우
```



실습)  `vacation`에 1에서 10중 아무 값이나 할당 후, `if, elif, else`문과 `중첩 조건표현식`을 사용해서 각각 `vacation`이 7이상이면 'Good', 5이상이면 'Normal', 그 이하면 'Bad'를 출력하는 코드를 짜본다. 

```python
vacation = 3
result = 'Good' if vacation >= 7 else 'Normal' if vacation >= 5 else 'Bad'
print(result)
```



### for문(조건에 따른 순회)

시퀀스형 데이터를 순회하고자 할 때 사용한다.

```python
for 항목 in 순회가능(iterable)객체:
    <항목을 사용한 코드>
```

> iterable한 객체에는 문자열, 튜플, 딕셔너리, 셋 등이 있다.



딕셔너리에서 키나 값을 순회할 때는, iterable한 객체의 위치에 dict.keys()나 dict.values()를 사용하고, 키와 값을 모두 순회할 때는 dict.items()를 사용한다.



#### 중첩

```python
for 항목1 in iterable객체1:
    iterable객체1을 순회하며 실행할 코드
    for 항목2 in iterable객체2:
        iterable객체1 내부에서 새로운 iterable객체2를 순회하며 실행할 코드
```



#### 중단하기(break)

데이터를 순회하던 중, 특정 조건에서 순회를 멈추고 반복문을 빠져나갈 때 사용한다.

```python
for 항목 in iterable객체:
    (반복문을 중단하고 싶을 때)break
```



실습) 1부터 100까지 반복하다가, 7과 9로 나누어지는 수가 나오면 break로 for문 중단, 순회할 range(start, end)를 사용

```python
for i in range(1, 101):
    if i % 7 == 0 and i % 9 == 0:
        print(i)
        break
```



#### 건너뛰기(continue)

데이터를 순회하던 중, 반복문을 중단하지 않고 다음 반복으로 건너뛸 때 사용한다.

```python
for 항목 in iterable객체:
    (현재의 반복을 중간에 그만두고 다음 반복으로 건너뛰고 싶을 때)continue
```



실습) 1부터 20까지 반복하다가, 3이나 5의 배수는 출력되지 않도록 하는 코드 만들기

```python
for i in range(1,21):
    if i % 3 == 0 or i % 5 == 0:
        continue
    print(i)
```



#### break확인(else)

for문으로 데이터를 순회하던 중, break문이 호출되지 않고 반복문이 종료되면 else문이 실행된다.

```python
for 항목 in iterable객체:
    pass
else:
    break가 한 번도 호출되지 않았을 경우의 코드
```



실습) 1부터 3000까지 7의 간격으로, i가 969로 나누어 떨어지면 해당 숫자를 출력하고 for문을 중단, 만약 for문을 전체 순회할 때 까지도 나누어 떨어지지 않는다면, for문이 종료된 후 "969로는 나누어지지 않음!"을 출력

조건: for-else문 없이!  // 힌트: for문 외부에 변수를 하나 두어야 함 (아래의 경우 flag변수) // 참: True, 거짓: False

```python
number = 257
is_break = None

for i in range(1, 3000, 7):
    if( i % number == 0):
        print(i)
        is_break = True
        break

if is_break is False:
    print(f'{number}로는 나누어지지 않음')
```



#### 여러 시퀀스 동시순회 (zip)

두 시퀀스 데이터를 묶어서 한번에 순회

매 순회마다 for문의 항목으로 tuple이 제공됨

```python
fruits = ['apple', 'banana', 'melon']
colors = ['red', 'yellow'. 'green', 'purple']
for fruit, color in zip(fruits, colors):
    print(fruit, color)
```





#### [기타 강의 내용]

#### immutable과 iterable

immutable은 불변을 의미하고, iterable은 반복가능, 순회가능을 의미한다.

immutable은 만약 아래와 같은 코드를 실행한 경우를 살펴보자.

```python
a = '안녕하세요'
a = '안녕'
```

객체는 불변이다. a에 할당된 string 객체가 변하는 것이 아닌 객체가 할당된 변수가 가리키는 곳이 변한다.



#### is와 ==

is는 객체 자체를 비교하고, ==은 두 객체가 서로 달라도 두 객체가 가진 값이 같은지 비교한다

is는 객체의 비교, 값을 비교하는 !=나 ==보다 연산에 이득