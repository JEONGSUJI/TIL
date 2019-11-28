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

    result.append(value)
    return result

return_list(apple) // ['apple']
return_list(melon) // ['apple', 'melon']
```

함수가 실행되는 시점에 기본 매개변수값을 계산하기 위해, 아래와 같이 바꿔준다.

```python
def return_list(value, result=None):
    if result is None:
        result = []
	result.append(value)
    return result

return_list(apple) // ['apple']
return_list(melon) // ['melon']
```



#### 위치인자 묶음

함수에 위치인자로 주어진 변수들의 묶음은 매개변수명으로 사용할 수 있다.

관용적으로 ***args**를 사용한다.

출력은 튜플형태로 정의되어 출력된다.

```python
def print_args(*args):
    print(args)
    
print_args(1,2,3,4,'a') // (1,2,3,4,'a') 
```



#### 키워드인자 묶음

함수에 키워드인자로 주어진 변수들의 묶음은 매개변수명으로 사용할 수 있다. 관용적으로**<code>* *kwargs</code>**를 사용한다.

```python
def print_kwargs(**kwargs):
    print(kwargs)
    
print_kwargs(a='apple', b='banana') // {'a': 'apple', 'b': 'banana'}
```



##### 위치인자 묶음과 키워드인자 묶음을 함께 쓸 수 있다.

```python
def print_all_args(*args, **kwargs):
    print(args)
    print(kwargs)

print_all_args(2,3,4,'a', apple='사과') // (2, 3, 4, 'a') {'apple': '사과'}
```



#### docstring

함수를 정의한 문서 역할을 한다. 함수 정의 후 몸체의 시작부분에 문자열로 작성하며, 여러줄로도 작성 가능하다.

```python
def print_args(*args):
... 'Print positional arguments'
    print(args)
    
help(print_args)
```



#### 함수를 인자로 전달

파이썬에서는 함수 역시 다른 객체와 동등하게 취급되므로, 함수에서 인자로 함수를 전달, 실행, 리턴하는 형태로 프로그래밍이 가능하다.



실습) 'call func'를 출력하는 함수를 정의하고, 함수를 인자로 받아 실행하는 함수를 정의하여 첫 번째에 정의한 함수를 인자로 전달해 실행해보자. 

```python
def call_func():
    print('call func')
    
def sam(f):
    f()
    
sam(call_func) // call func
```



#### 내부 함수

함수 안에서 또 다른 함수의 정의해 사용할 수 있다.

실습) 문자열 인자를 하나 전달받는 함수를 만들고, 해당 함수 내부에 전달받은 문자열을 대문자화해서 리턴해주는 내부 함수를 구현한다. 문자열을 전달받는 함수는 내부함수를 실행한 결과를 리턴하도록 한다. 

```python
def string(str):
    def UpperCase(str):
        return str.uppercase
```

