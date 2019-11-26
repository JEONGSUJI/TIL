## 시퀀스 타입

시퀀스는 데이터에 순서를 붙여 나열한 것이다.

파이썬에 내장된 시퀀스 타입에는 문자열, 리스트, 튜플이 있다.

문자열은 인용부호(작은따옴표, 큰따옴표)를 사용하며, 리스트는 대괄호[], 튜플은 괄호()를 사용하여 나타낸다.

시퀀스 타입의 객체는 <u>인덱스 연산을 통해 내부 항목에 접근할 수 있다</u>.



### 리스트

리스트는 순차적인 데이터를 나타내는데 유용하며, 문자열과는 달리 내부 항목을 변경할 수 있다.

```python
empty_list = []
empty_list2 = list()
```

둘 중 무엇을 사용해도 상관없으나 코드의 가독성을 위해 하나로 통일해 사용하는 것이 좋다.



#### 1) 다른 데이터를 리스트로 변환

list 함수를 사용한다.

```python
list('League of legends')
```



#### 2) 인덱스 연산

 sample_list2를 이용해서 실습. 5월, 7월을 인덱스연산을 통해 추출하기

```python
may = sample_list2[4]
july = sample_list2[6]
```



#### 3) 내부항목 변경

sample_list에 3번째 요소인 'c'를 대문자 'C'로 바꾸기

```python
sample_list[2] = 'C'
```



#### 4) 슬라이스 연산

sample_list2를 이용, 1월부터 3월씩 건너뛴 결과를 quarters에 할당

```python
quarters = sample_list2[0::3]
```



sample_list2를 이용, 끝에서부터 3번째 요소까지를 last_three에 할당

```python
last_three = sample_list2[-1:-4:-1]
```



sample_list2를 이용, 끝에서부터 처음까지(거꾸로) 2월씩 건너뛴 결과를 reverse_two_steps에 할당

```python
reverse_two_steps = sample_list2[::-2]
```



#### 5) 리스트 항목 추가 (append)

```python
sample_list.append('e')
```



#### 6) 리스트 병합 (extend, +=)

```python
fruits = ['apple', 'banana', 'melon']
colors = ['red', 'green', 'blue']
fruits.extend(colors)

#또는
fruits = ['apple', 'banana', 'melon']
colors = ['red', 'green', 'blue']
fruits += colors
```



> **주의**!
>
> extend 대신 append를 사용하면 fruits = ['apple', 'banana', 'melon', ['red', 'green', 'blue']] 이렇게 객체로 들어감



#### 7) 특정 위치에 리스트 항목 추가 (insert)

fruits리스트의 1번째 위치에 'mango'를 추가해보기

```python
fruits.insert(1, 'mango') // ['apple', 'mango', 'banana', 'melon']
```



fruits리스트의 100번째 위치에 'pineapple'을 추가해보자

```python
fruits.insert(100, 'pineapple')
```

> 100번째 위치에 추가하라고 해도 ['apple', 'mango', 'banana', 'melon', 'pineapple'] 와 같이 희소배열이 만들어지지 않고 마지막 위치에 추가된다.



#### 8) 삭제

##### 특정 위치 리스트 항목 삭제 (del)

파이썬 구문 del을 사용

> del은 리스트 함수가 아닌, 파이썬 구문이므로 <u>del<리스트>[오프셋]</u> 형식을 사용한다.

```python
del fruits[0]
```



##### 값으로 리스트 항목 삭제 (remove)

```python
fruits.remove('mango')
```



##### 리스트 항목 추출 후 삭제(pop)

```python
fruits.pop()
```



##### 값으로 리스트 항목 오프셋 찾기 (index)

```python
fruits.index('red')
```



#### 9) 존재여부 확인 (in)

```python
'red' in fruits
```



#### 10) 값 세기 (count)

```python
fruits.append('red')
fruits.append('red')
fruits.count('red') // 3
```



#### 11) 정렬하기 (sort, sorted)

sort는 리스트 자체를 정렬한다.

sorted는 리스트의 정렬 복사본을 반환한다.



#### 12) 리스트 복사 (copy)

① copy함수

```python
color2 = colors1.copy()
```



② list함수

```python
color3 = list(color1)
```



③ 슬라이스 연산[:]

```python
color4 = color1[:]
```



### 튜플

리스트와 비슷하나, 정의 후 내부 항목의 삭제나 수정이 불가능하다.



#### 튜플 생성

튜플을 정의할 때는 괄호가 없어도 무관하나, 괄호로 묶는 것이 좀 더 튜플임을 구분하기 좋다.

 튜플의 요소가 1개일 때는 요소의 뒤에 쉼표를 붙여야한다.

```python
empty_tuple = ()

colors = 'red',
fruits = 'apple', 'banana'
```



#### 튜플 언패킹

```py
f1, f2 = fruits
```

값의 교환



#### 형 변환

tuple 함수를 사용 (튜플 생성에는 사용 불가능)

리스트를 튜플로 변환



#### 튜플을 사용하는 이유

리스트보다 적은 메모리를 사용한다.

정의 후에는 내부 값이 변하지 않는다.



문자열 'Fastcampus'를 리스트, 튜플 타입으로 형변환하여 새 변수에 할당한다.

```python
fc_list = list('Fastcampus')
fc_tuple = tuple('Fastcampus')
```



위에서 할당한 리스트, 튜플 변수를 이용해 다시 문자열을 만든다.

```python
''.join(fc_list)
''.join(fc_tuple)
```