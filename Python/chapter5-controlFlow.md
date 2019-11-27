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

zip으로 묶은 시퀀스들 중, 가장 짧은 시퀀스가 완료되면 순회가 종료된다.

zip을 사용하면 여러 시퀀스로부터 튜플을 만들 수 있다.

zip으로 반환되는 것은 리스트가 아닌 zip클래스 형태의 iterable 객체이기 때문에, 리스트 형태로 사용하려면 list()함수를 사용해준다.

dict()함수를 사용할 경우 딕셔너리 객체가 만들어지게 된다.

```python
fruits = ['apple', 'banana', 'melon']
colors = ['red', 'yellow'. 'green', 'purple']
for fruit, color in zip(fruits, colors):
    print(fruit, color)
```



#### 숫자 시퀀스 생성 (range)

range()함수는 특정 범위의 숫자 스트림 데이터를 반환한다.

```python
range(start, stop, step)
```



#### while문 (반복문)

for문과 유사하나, while은 조건이 참인 경우 계속해서 반복한다. 따라서 무한 루프를 돌 것이 아니면 언젠가 끝나는 조건을 넣어줘야한다.

```python
while 조건:
    조건이 참인 경우 실행
    조건이 거짓이 될 경우까지 계속해서 반복
```



#### 컴프리헨션(Comprehension)

함축 또는 내포를 말한다.

iterable한 객체로부터 파이썬의 자료구조를 만드는 방법이다. 가독성과 사용성에서 이득을 얻을 수 있는 경우 항상 사용해준다.



##### 리스트 컴프리헨션

```python
[표현식 for 항목 in iterable객체]
```

만약, range와 for문을 사용할 경우 [1,2,3,4,5]를 만드는 방법

```python
number = []
for item in range(1,6):
    numbers.append(item)
```

리스트 컴프리헨션을 사용할 경우 [1,2,3,4,5]를 만드는 방법

```python
[item for item in range(1,6)]
```



실습) 만약 각 item에 2배의 값을 할당하고 싶다면?

```python
[item*2 for item in range(1,6)]
```



실습) 만약 1~5중 짝수만 해당하는 리스트를 만들고 싶다면?

```python
result = [item for item in range(1, 6) if item % 2 == 0]
```



##### 리스트 컴프리헨션의 중첩

```python
for color in colors:
    for fruit in fruits:
        result.append((color,fruit))
        
result
```

```python
[(color, fruit) for color in colors for fruit in fruits]
```



##### 셋 컴프리헨션

```python
{표현식 for 표현식 in iterable객체}
```



##### 딕셔너리 컴프리헨션

```python
{key: value for key, value in [('apple', '사과'), ('banana', '바나나')]}
```



#### 실습코드

for문을 2개 중첩하여 (0,0), (0,1), (0,2), (0,3), (1,0), (1,1)..... (6,3)까지 출력되는 반복문을 구현한다.

```python
# 방법 1
for i in range(0,7):
    for j in range(0,4):
        print((i, j)) # 이건 tuple 객체가 출력된 것이다.
       
# 방법 2
for i in range(7):
    for j in range(4):
        print(f'({i}, {j})')  # 문자열로 출력된 것이다.
```



리스트 컴프리헨션을 중첩하여 위 결과를 갖는 리스트를 생성한다.

```python
[(i,j) for i in range(7) for i in range(4)]
```



위 두 실습문제의 반복문에서 첫번째 문제는 튜플의 첫 번째 항목이 짝수일때만 출력하도록, 두번째 문제는 첫 번째 항목이 짝수일때만 리스트의 원소로 추가한다.

```python
# 방법 1
for i in range(7):
    for j in range(4):
        if i % 2 == 0:
            print((i, j))
            
# 방법 2
for i in range(0,7,2):
    for j in range(4):
        if i % 2 == 0:
            print((i, j))
```

```python
[(i,j) for i in range(7) for j in range(4) if i % 2 == 0]
```



1000에서 2000까지의 숫자 중, 홀수의 합을 구해본다.

```python
result = 0
for i in range(1000, 2001):
    if(i % 2 != 0):
        result += i
        
result
```



리스트 컴프리헨션을 사용하여 구구단 결과 문자열의 리스트를 만들고, 해당 리스트를 for문을 사용해 구구단 형태로 나오도록 출력해본다.

조건 1) 구구단 결과 문자열은 '3 x 7 = 21'과 같은 형태를 갖도록 한다

```python
[f'{i} x {j} = {i*j}' for i in range(2,10) for j in range(1,10)]
```

조건 2) 각 단마다 한 번 더 줄바꿈을 넣어준다.

```python
sample = []

for i in range(2,10):
    sample.append(f'---{i}단---')
    for j in range(1,10):
        sample.append(f'{i} * {j} = {i*j}')

sample
```

```python
result = [f'{i} x {j} = {i*j}' for i in range(2,10) for j in range(1,10)]

loop_count = 0;
for item in result:
    if loop_count % 9 == 0:
        print(f'{loop_count // 9 + 2}단')
    print(item)
    loop_count += 1
```



1에서 99까지의 정수 중, 7의 배수이거나 9의 배수인 정수인 리스트를 생성한다. 단, 7의 배수이며 9의 배수인 수는 한 번만 추가되어야 한다.

```python
for i in range(1,100):
    if i % 7 == 0 or i % 9 == 0:
        print(i)
        
# 리스트 컴프리헨션 방식
[i for i in range(1,100) if i % 7 == 0 or i % 9 == 0]
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



#### iterable

```python
gen_5 = (x for x in range(5))
list_5 = [x for x in range(5)]
```

위 두 코드를 비교해보자.

두 코드는 for~in 문으로 모두 순회가 되는 코드이다.

하지만 gen_5는 인덱스 연산이 되지 않고, list_5는 인덱스 연산이 가능하다.



gen_5와 같은 경우를 제네레이터라고 부른다.

반복가능한데 제네레이터와 반복가능한데 시퀀스인 것은 차이가 있다. 

반복가능한데 시퀀스인 것은 이미 메모리에 다 가지고 있는 반면 제네레이터는 메모리상에 데이터를 가지고 있는 것이 아니라 앞으로 어떤 데이터를 생성할 것인지에 대한 규칙만을 가지고 있다.