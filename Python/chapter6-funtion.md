## 함수

반복적인 작업을 하는 코드를 재사용이 가능하게 정의해 놓은 것

(def = define)

```python
def 함수명(매개변수[parameters]):
    동작
```

함수도 메모리에 들어가면 객체이다.

우리가 정의한 함수는 빌트인 함수와 달리 정의된 위치가 나온다.



#### 함수의 정의, 실행

```python
# 실행 시 'call funtion!'을 print하는 함수 정의
def call_function():
    print('call function!')
    
# 함수 자체는 function객체를 참조하는 변수
call_function // <function __main__.call_function()>

# 함수를 실행시키기 위해 ()를 사용한다.
```



#### 리턴값이 있는 함수 정의

```python
def return_true():
    return True

return_true()
True
```

함수의 결과로 Bool 값을 갖는 데이터를 리턴하여 if문이나 while문의 조건으로 사용 가능하다.



#### 매개변수를 사용하는 함수 정의

```python
def print_argument(something):
    print(something)
```



#### 매개변수(parameter)와 인자(argument)의 차이

매개변수란 함수 내부에서 함수에게 전달되어 온 변수를 말한다. 함수를 호출할 때 전달하는 변수는 인자로 부른다.

```python
# 함수 정의때는 매개변수
def func(매개변수1, 매개변수2):
    
# 함수 호출 시에는 인자
func(인자1, 인자2)
```



#### 리턴값이 없는 경우

함수에서 리턴하는 값이 없을 경우 아무것도 없다는 뜻을 가진 None 객체를 반환한다.



#### 위치 인자(Positional arguments)와 키워드 인자(Keyword arguments)

위치인자와 키워드인자를 동시에 쓴다면, 위치인자가 먼저 와야 한다.

```python
def student(name, age, gender):
	return {'name': name, 'age': age, 'gender': gender}

# 위치 인자(Positional arguments)
# 매개변수의 순서대로 인자를 전달하여 사용하는 경우
student('hanyeong.lee', 31, 'male')

# 키워드 인자(Keyword arguments)
# 매개변수의 이름을 지정하여 인자로 전달하여 사용하는 경우
student(age=31, name='hanyeong.lee', gender='male')
```



#### 기본 매개변수값 지정

인자가 제공되지 않을 경우, 기본 매개변수로 사용할 값을 지정할 수 있다.

```python
def student(name,age, gender='male'):
    return('name': name, 'age':age, 'gender':gender)

student('hanyeong.lee', 31)
```



#### 기본 매개변수값의 정의 시점

기본 매개변수값은 함수가 실행될 때 마다 계산되지 않고, 함수가 정의되는 시점에 계산되어 계속해서 사용된다.

```python
def return_list(value, result=[]):
    # 1. return_list(value)
    # 1개의 value를 받으며 호출
    # 2. return_list(value, result)
    # value와 list를 받아서 호출
    
    # result라는 list에 value를 추가해서
    result.append(value)
    
    # result list를 리턴
    return result
```

