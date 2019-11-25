## 문자열



컴퓨터의 모든 데이터는 2진수다. 파이썬3에서는 문자열에서 기본적으로 유니코드를 사용하며, 불변한다.

(ASCII / UNICODE // UTF-8은 가변형이다)



#### 문자열 표현

- 작은 따옴표 또는 큰 따옴표를 사용
- 세 개의 작은 따옴표 또는 큰 따옴표 : 여러줄에 걸친 문자열을 나타낼 때 사용



#### 문자열 더하기

```python
notice = ''
notice += '공지사항'
```



#### 형변환

내장함수 str을 사용한다.

```python
str(147) // '147'
```



#### 이스케이프 문자

특수문자, 또는 특별한 역할을 하는 의미를 나타내는 문자를 뜻한다.

- \a : 비프음 발생

- \t : 탭

- \n : 줄바꿈
- \\\ : 역슬래시 입력
- \\' : 작은 따옴표 입력
- \\" : 큰 따옴표 입력



#### 인덱스 연산

문자열에서 문자를 추출하기 위해 대괄호와 오프셋을 지정할 수 있다. 가장 왼쪽은 0이며, 가장 오른쪽은 -1로 시작한다.

```python
lux = '빛으로 강타해요!'
lux[0] // '빛'
lux[-1] // '!'
```



문자열은 불변이므로 인덱싱한 부분에 새 값을 대입할 수 없다.



#### 슬라이스 연산

<code>[start : end : step]</code>형식을 사용한다.

- <code>[:]</code> : 처음부터 끝까지
- <code>[start:]</code>: start 오프셋부터 마지막까지
- <code>[:end]</code>: 처음부터 end오프셋까지
- <code>[start : end]</code>: start 오프셋부터 end 오프셋까지
- <code>[start : end : step]</code>: start 오프셋부터 end 오프셋까지, step만큼 뛰어넘은 부분



#### 길이

내장함수 len을 사용



#### 문자열 나누기(split)

문자열의 내장함수 split을 사용하여 split 함수에 인자로 주어진 구분자를 기준으로 하나의 문자열을 리스트 형태로 반환해준다. 인자가 없다면 defalut는 공백문자가 적용된다.

```python
girlsday = "민아, 소진, 유라, 혜리"
girlsday.split(',') // ['민아', '소진', '유라', '혜리']
```



#### 문자열 결합(join)

split 함수와 반대의 역할을 한다.

```python
girlsday = ', '.join(girlsday)
```



#### 대소문자 다루기

![image-20191125175101046](C:\Users\JUNGSUJI\AppData\Roaming\Typora\typora-user-images\image-20191125175101046.png)



#### 문자열 포맷

1) 옛 스타일 (%)

**string % data**



변환타입

- %s: 문자열
- %d: 10진수 / %x: 16진수 / %o: 8진수

- %f: 10진 부동소수점수 / %e: 지수로 나타낸 부동소수점수 / %g: 10진 부동소수점수 혹은 지수로 나타낸 부동소수점 수
- %%: 리터럴 %

```py
'%s' % 42 // '42'
'%d x %d : %d' % (3, 4, 12) // '3 x 4 : 12'
```



#### 정렬

```python
%[정렬기준(-,없음)][전체글자수].[문자길이 또는 소수점 이후 문자길이][변환타입]
```



#### 새스타일 ({}, format)

```python
{}.format(변수)

# 기본형태
'{} {} {}'.format(d, f, s)
'37 3.14 Fastcampus'

# 각 인자의 순서를 지정
'{1} {2} {0}'.format(d, f, s)
'3.14 Fastcampus 37'

# 각 인자에 이름을 지정
>>> '{d} {f} {s}'.format(d=50, f=1.432, s='WPS')
'50 1.432 WPS'

# 딕셔너리로부터 변수 할당
>>> dict = {'d': d, 'f': f, 's': s}
>>> '{0[d]} {0[f]} {0[s]} {1}'.format(dict, 'WPS')
'37 3.14 Fastcampus WPS'

# 타입 지정자 입력
>>> '{:d} {:f} {:s}'.format(d, f, s)
'37 3.140000 Fastcampus'

# 이름과 타입지정자를 모두 사용
>>> '{digit:d} {float:f} {string:s}'.format(digit=700, float=1.4323, string='Welcome')
'700 1.432300 Welcome'

# 필드길이 10, 우측정렬
>>> '{:10d}'.format(d)
'        37'
>>> '{:>10d}'.format(d)
'        37'

# 필드길이 10, 좌측정렬
>>> '{:<10d}'.format(d)
'37        '

# 필드길이 10, 가운데 정렬
>>> '{:^10d}'.format(d)
'    37    '

# 필드길이 10, 가운데 정렬, 빈 공간은 ~로 채움
>>> '{:~^10d}'.format(d)
'~~~~37~~~~'
```



#### f 표현법

```python
f'{변수 또는 표현식}'
```



---

공식문서

 https://docs.python.org/3/library/stdtypes.html#string-methods 