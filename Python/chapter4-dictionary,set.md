## 딕셔너리, 셋



### 딕셔너리

- Key-Value 형태로 항목을 가지는 자료구조
- 순서를 가지지 않는다. (= 순서를 보장하지 않는다.)

> 순서를 보장하는 OrderedDict라는 딕셔너리가 별도로 존재한다.



#### 딕셔너리 생성 방법

```python
empty_dict1 = {}
empty_dict2 = dict()
```

2가지이나, 코드의 가독성을 위해 한가지 방법을 택해서 사용하길 추천함



> **주의!**
>
> dict([1, 2, 3, 4])와 같은 형태는 허용하지 않는다. Key-Value 형태로 묶인 시퀀스 데이터가 와야한다.



#### 형 변환

dict 함수를 사용하여, 두 값의 시퀀스(리스트 또는 튜플)을 딕셔너리로 변환한다.

```python
fruits_info = [  ('apple', '사과'), ('banana', '바나나'), ]
fruits_dict = dict(fruits_info) // {'apple': '사과', 'banana': '바나나'}

sample = [ [1,2], [3,4], [5,6]]
dict(sample) // {1: 2, 3: 4, 5: 6}
```



#### 항목 찾기/추가/변경 [key]

```python
# 항목찾기
champion_dict['Lux']

# 항목 추가
champion_dict['suji'] = 'Suji'

# 항목 변경
champion_dict['suji'] = 'Suji Jung'
```



#### 항목이 없을 경우 기본값을 지정하고 찾기

```python
champion_dict.get('suji') # 있는 경우 반환한다.
champion_dict.get('Soraka') # 없을 경우 반환이 안된다.
champion_dict.get('Soraka', 'Hearler') # 'Soraka' 없을 경우 'Hearler' 문자열을 반환
```



그렇다면 type은 어떻게 나올까?

```python
type(champion_dict.get('suji')) // 있는 경우 str
type(champion_dict.get('Soraka')) // 없는 경우 특수 객체인 None이 반환된다. (None도 아무것도 없음을 나타내는 객체이다.)
```



#### 결합 (update)

```python
item_dict = {
    "Doran's ring" : 400,
    "Doran's Blade" : 450,
}

com_dict = {}
com_dict.update(champion_dict)
com_dict.update(item_dict)
com_dict
```

 서로 같은 키가 있을 경우, update에 주어진 딕셔너리의 값이 할당된다. 



```python
{
    'a': 'apple',
    'b': {
        'c': 'cherry',
        'd': [1, 2, 3, 4],
    }
}
```

위와 같이 트리구조로 딕셔너리를 선언할 수 있다.



#### 삭제(del)

```python
del com_dict['']
```

파이썬에서 del 뒤에 객체를 넣으면 삭제가 되게 만들어져있다.



#### 전체 삭제(clear)

```py
com_dict.clear()
```



#### in으로 키 검색

True, False를 반환한다.

```py
'Lux' in champion_dict
```



#### 키 또는 값 얻기

```python
# 모든 키 얻기
champion_dict.keys()

# 모든 값 얻기
champion_dict.values()

# 모든 키-값 얻기 (튜플로 반환)
champion_dict.items()
```



#### 복사

```python
sample = sample.copy()
```





### 셋

셋은 키만 있는 딕셔너리와 같으며, 중복된 값이 존재할 수 없다. 

빈 값으로 선언하는 방법이 없다. -> {} 만 사용 후 type 확인 시 dict가 나오기 때문이다.



#### 셋 생성

```python
empty_set = set()
champion = {'lux', 'ahri', 'ezreal'}
```



#### 형 변환

문자열, 리스트, 튜플, 딕셔너리를 셋으로 변환할 수 있으며, <u>중복된 값이 사라진다</u>.

순서도 변경된다.

딕셔너리를 셋으로 변환할 시 Key만 남는다.

```python
set('ezreal')
{'e', 'z', 'a', 'l', 'r'}
```



#### 집합 연산

| 연산자 | 설명                        |
| ------ | --------------------------- |
| \|     | 합집합(Union)               |
| &      | 교집합(Intersection)        |
| -      | 차집합(Difference)          |
| ^      | 대칭차집합(Exclusive)       |
| <=     | 부분집합(Subset)            |
| <      | 진부분집합(Proper subset)   |
| >=     | 상위집합(Superset)          |
| >      | 진상위집합(Proper superset) |

부분집합은 전체가 똑같아도 되는 것이고, 진부분집합은 전체가 똑같으면 안된다.

 ![ì§ë¶ë¶ì§í©ì ëí ì´ë¯¸ì§ ê²ìê²°ê³¼](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Set_subsetAofB.svg/200px-Set_subsetAofB.svg.png) <- 진부분집합 // ( A != B , A ⊂B)





[실습]

`apple`은 `사과`, `banana`는 `바나나`, `cherry`는 `체리`의 key-value를 갖는 `fruits`라는 이름의 사전을 만든다.

```python
fruits = {
    'apple' : '사과',
    'banana' : '바나나',
    'cherry' : '체리'
}
```



`fruits`를 `Set`으로 만들어 `fruits_set`변수에 할당한다.

```python
fruits_set = set(fruits)
```



`fruits_set`에 `durian`이 존재하는지 확인한다.

```python
'durian' in fruits_set
```



`fruits`사전에서 `apple`키에 해당하는 값을 출력한다.

```python
fruits['apple']
```



<code>girlgroups</code>라는 이름의 2차원 사전을 만들고 출력해본다.

- 최상위 키는 `girlsday`와 `redvelvet`이 있으며, 각각 자식으로 사전을 갖는다.
- `girlsday`키의 자식사전에는 `korean`과 `members`키가 있으며, 각각 `'걸스데이'`라는 문자열과 `['민아', '혜리', '소진', '유라']`라는 리스트를 갖는다.
- `redvelvet`키의 자식사전에도 `korean`과 `members`키가 있으며, 각각 `'레드벨벳'`이라는 문자열과 `['아이린', '슬기', '웬디', '조이', '예리']`라는 리스트를 갖는다.

```python
girlgroups = {
    'girlsday' : {
        'korean' : '걸스데이',
        'members' : ['민아', '혜리', '소진', '유라'],
    },
    'redvelvet' : {
        'korean' : '레드벨벳',
        'members' : ['아이린', '슬기', '웬디', '조이', '예리'],
    }
}
```



- `girlgroups`사전의 최상위 키 목록을 출력해본다.

```python
girlgroups.keys() // dict_keys(['girlsday', 'redvelvet'])
```



- `girlgroups['girlsday']`의 모든 키를 출력해본다.

```python
girlgroups['girlsday'].keys() // dict_keys(['korean', 'members'])
```



- `girlgroups['redvelvet']`의 모든 값을 출력해본다.

```python
girlgroups.items() // dict_items([('girlsday', {'korean': '걸스데이', 'members': ['민아', '혜리', '소진', '유라']}), ('redvelvet', {'korean': '레드벨벳', 'members': ['아이린', '슬기', '웬디', '조이', '예리']})])
```



- <code>x = {1,2,3,4,5,6,8}</code>, <code>y = {4,5,6,9,10,11}</code>, <code>z = {4,6,8,9,7,10,12}</code>일 때,

  - x,y,z의 교집합에 해당하는 숫자는?

  ```python
  x & y & z
  ```

  {4, 6}

  

  - y,z의 교집합이며 x에는 속하지 않는 숫자는?

  ```python
  (y & z) - x
  ```

  {9, 10}

  

  - x에만 속하고 y,z에는 속하지 않는 숫자는?

  ```python
  x - (y | z)
  ```

  {1, 2, 3}