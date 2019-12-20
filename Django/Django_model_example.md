# Models Example

Models 실습 코드 정리



## 코드 실행 전 가상환경 세팅

```python
# 폴더 생성 후 이동
$ mkdir model_study
$ cd model_stydy

# pyenv는 이전 wps-django-document-env에서 사용했던것과 연결
$ pyenv local wps-django-document-env

# pycharm 실행
$ pycharm-community .

# 새로운 터미널에서 프로젝트 config 생성
# django 파일과 외부 파일 분리를 위해 뒤에 .을 찍지 않고 생성함
$ ./manage.py startproject config

# 외부 config 파일명 app으로 변경
$ mv config app

# manage.py가 위치한 app 폴더로 이동
$ cd app

# one_to_one app 생성
$ ./manage.py startapp one_to_one
```



## One-to-one relationships 예제

```python
# app > config > setting.py 연결

INSTALLED_APPS = [
    'one_to_one.apps.OneToOneConfig',
    ...
]
```



```python
# one_to_one > models.py 
from django.db import models

class Place(models.Model):
    address = models.CharField('주소', max_length=200)

    def __str__(self):
        return f'Place (address: {self.address})'

class Restaurant(models.Model):
    place = models.OneToOneField(Place, verbose_name='장소', on_delete=models.CASCADE)
    name = models.CharField('식당명', max_length=30)
    rating = models.IntegerField('평점', default=0)

    def __str__(self):
        return f'{self.name} {self.place} (평점:{self.rating})'
```



```python
$ ./manage.py makemigrations
$ ./manage.py migrate
```

```python
$ ./manage.py shell
```



```python
# shell에서 한줄 한줄 입력
from one_to_one.models import *

# Place 추가
place1 = Place.objects.create(address='seoul')
place2 = Place.objects.create(address='busan')

# Restaurant 추가
re1 = Restaurant.objects.create(place=place1, name='hahahoho', rating=3)

re2 = Restaurant.objects.create(place=place2, name='gogi', rating=5
                                
# 연결 확인
place1.restarant
# 출력 결과
<Restaurant: hahahoho Place (address: seoul) (평점:3)>

# 연결 확인
re1
# 출력 결과s
<Restaurant: hahahoho Place (address: seoul) (평점:3)>
```



- 생성된 one_to_one_place 테이블

![image-20191220171257990](/home/jungsuji/.config/Typora/typora-user-images/image-20191220171257990.png)



- 생성된 one_to_one_restaurant 테이블

![image-20191220171233409](/home/jungsuji/.config/Typora/typora-user-images/image-20191220171233409.png)`



## Many-to-one relationships 예제

```python
$ ./manage.py startapp many_to_many
```



```python
# app > config > setting.py 연결

INSTALLED_APPS = [
    'many_to_one.apps.ManyToOneConfig',
    ...
]
```



### 1)Manufacturer/Car 기본 model 예제

```python
# many_to_one > models.py

from django.db import models

class Manufacturer(models.Model):
    name = models.CharField('제조사명', max_length=20)

    def __str__(self):
        return self.name

class Car(models.Model):
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE)
    name = models.CharField('차량명', max_length=100)

    def __str__(self):
        return self.name
```

> `on_delete = models.CASCADE`는  해당 모델이 삭제될 시 연결되어있는 모델도 지운다는 의미이다.



```python
$ ./manage.py makemigrations
$ ./manage.py migrate
```

```python
$ ./manage.py shell
```



```python
# shell에서 한줄 한줄 입력
from many_to_one.models import *

# Manufacturer 추가
samsung = Manufacturer.objects.create(name='samsung')
hyundai = Manufacturer.objects.create(name='hyundai')

# Car 추가
sm3 = Car.objects.create(manufacturer=samsung, name='sm3') 
sm5 = Car.objects.create(manufacturer=samsung, name='sm5')
sm7 = Car.objects.create(manufacturer=hyundai, name='sm7')

# 연결 확인
sm3
# 출력 결과
<Car: sm3>

# 연결 확인
sm3.manufacturer
# 출력 결과
<Manufacturer: samsung>
    
# 연결 확인
hyundai.car._set.all()
# 출력 결과
<QuerySet [<Car: sm7>]>

# 연결 확인
Car.objects.filter(manufacturer=hyundai)
# 출력 결과
<QuerySet [<Car: sm7>]>

# 연결 확인
Car.objects.filter(manufacturer=samsung)
# 출력 결과
<QuerySet [<Car: sm3>, <Car: sm5>]>
```

- many_to_one_manufacturer 테이블

  ![image-20191220195528720](/home/jungsuji/.config/Typora/typora-user-images/image-20191220195528720.png)

- many_to_one_car 테이블

![image-20191220195602563](/home/jungsuji/.config/Typora/typora-user-images/image-20191220195602563.png)



### 2) WPSUser recursive 모델 예제

새로운 many_to_one 예제 실습을 위해 models 분기해보자.

- models.py 폴더 마우스 우클릭 후 Refactor > Convert to Python Package 클릭
- models 폴더 내 `default.py`와 `recursive.py` 생성
- models 내 `__init__.py`에 있던 내용 모두 잘라내어 `default.py`에 붙여넣기
- `__init__.py`에는 `default.py`와 `recursive.py`를 연결하도록 아래 코드 입력

```python
from .default import *
from .recursive import *
```



```python
# many_to_one > models > recursive.py

from django.db import models


class WPSUser(models.Model):
    instructor = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='student_set',null=True)
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name
```

> `on_delete = models.SET_NULL`는  해당 모델이 삭제될 시 연결되어있는 모델에는 NULL값을 넣어준다는 의미이다.

> `related_name='student_set'`은 자동 생성되는 wpsuser_set이 아닌 student_set으로 접근할 수 있도록 해준다는 의미이다. (연결할 때 이름을 정해준다)

> _set앞에는 class명이 소문자로 들어온다. 또는 위의 예처럼 related_name='student_set'로 이름을 임의로 지정할 수 있다.

```python
$ ./manage.py makemigrations
$ ./manage.py migrate
```

```python
$ ./manage.py shell
```



```python
# shell에서 한줄 한줄 입력
from many_to_one.models import *

user1 = WPSUser.objects.create(name='suji')

enbi, hongbin, hyojin = [WPSUser.objects.create(name=for_name) for for_name in 'enbi,hongbin,hyojin'.split(',')]

enbi.instructor = user1
enbi.save()

hyojin.instructor = user1
hyojin.save()

hongbin.instructor = enbi
hongbin.save()

# 연결 확인
user1.student_set.all()
# 출력 결과
<QuerySet [<WPSUser: enbi>, <WPSUser: hyojin>]>

# default.py에서 related_name을 지정해줬기에 user1.wpsuser_set.all()로 하면 출력되지 않음

# 연결 확인
enbi.student_set.all()
# 출력 결과
<QuerySet [<WPSUser: hongnin>]>

# 연결 확인
enbi.instructor
# 출력 결과
<WPSUser: suji>
    
# contains 사용해보기
suji = WPSUser.objects.get(name__contains='su')
```

- many_to_one_wpsuser 테이블

  ![image-20191220195630458](/home/jungsuji/.config/Typora/typora-user-images/image-20191220195630458.png)



## Many-to-many relationships

```python
$ ./manage.py many_to_many
```



```python
# app > config > setting.py 연결

INSTALLED_APPS = [
    'many_to_many.apps.ManyToManyConfig',
    ...
]
```



많은 many_to_many 예제 실습을 위해 models 분기하기

- models.py 폴더 마우스 우클릭 후 Refactor > Convert to Python Package 클릭
- models 폴더 내 `m2m_01_default.py` 생성
- models 내 `__init__.py`에 `from .m2m_01_default.py import *` 붙여넣기



### 1) Pizza/Topping 기본 모델 예제

```python
# many_to_many > models > m2m_01_default.py

from django.db import models


class Topping(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Pizza(models.Model):
    name = models.CharField(max_length=30)
    toppings = models.ManyToManyField(Topping)

    def __str__(self):
        return self.name
```



```python
$ ./manage.py makemigrations
$ ./manage.py migrate
```

```python
$ ./manage.py shell
```



```python
# shell에서 한줄 한줄 입력
from many_to_many.models import *

# Topping 추가
cheese = Topping.objects.create(name='cheese')
pineapple = Topping.objects.create(name='pineapple')
olive = Topping.objects.create(name='olive')

# Pizza 추가
cheese_pizza = Pizza.objects.create(name='cheese_pizza')
super_pizza = Pizza.objects.create(name='super_pizza')

# 연결
cheese_pizza.toppings.add(cheese)
super_pizza.toppings.add(cheese,pineapple,olive)

# 연결 확인
super_pizza.toppings.all()
# 출력 결과
<QuerySet [<Topping: cheese>, <Topping: pineapple>, <Topping: olive>]>

# 연결 확인
cheese.pizza_set.all()
# 출력 결과
<QuerySet [<Pizza: cheese>, <Pizza: super_pizza>]>
```

- many_to_many_pizza 테이블

![image-20191220195814878](/home/jungsuji/.config/Typora/typora-user-images/image-20191220195814878.png)

- many_to_many_topping 테이블

  ![image-20191220195843714](/home/jungsuji/.config/Typora/typora-user-images/image-20191220195843714.png)

- many_to_many_pizza_topping 테이블

  ![image-20191220195830578](/home/jungsuji/.config/Typora/typora-user-images/image-20191220195830578.png)



### 2)  Product recursive 예제

models.py 에 `m2m_02_recursive.py`파일 생성 후 `__init__.py`에 `from .m2m_02_recursive import *`추가



```python
# many_to_many > models > m2m_01_default.py
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=50)
    similar_products = models.ManyToManyField('self')

    def __str__(self):
        return self.name
```



```python
$ ./manage.py makemigrations
$ ./manage.py migrate
```

```python
$ ./manage.py shell
```



```python
from many_to_many.models import *

# Product 추가
pencil = Product.objects.create(name='pencil')
eraser = Product.objects.create(name='eraser')         ipad = Product.objects.create(name='ipad')             phone = Product.objects.create(name='phone')   

# 연결
pencil.similar_products.add(pencil)
pencil.similar_products.add(eraser)
pencil.similar_products.add(ipad)
pencil.similar_products.add(phone)

# 연결 확인
eraser.similar_products.all()
# 출력 결과
<QuerySet [<Product: pencil>]>

# 연결 확인
pencil.similar_products.all()
# 출력 결과
<QuerySet [<Product: pencil>, <Product: eraser>, <Product: ipad>]>
```

- many_to_many_product 테이블

  ![image-20191220204854446](/home/jungsuji/.config/Typora/typora-user-images/image-20191220204854446.png)

- many_to_many_similar_products 테이블

![image-20191220205017246](/home/jungsuji/.config/Typora/typora-user-images/image-20191220205017246.png)



### 3) extra_fields 예제

```python
# __init__.py에 추가
from .m2m_03_extra_field import * 
```



```python
from django.db import models


class Player(models.Model):
    name = models.CharField(max_length=30)
    clubs = models.ManyToManyField(
        'Club',through='Career',
    )

    def __str__(self):
        return self.name

class Club(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name

class Career(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)
    start_year = models.IntegerField()
    end_year = models.IntegerField(null=True)

    def __str__(self):
        return '{player}, {club}, ({start} ~ {end})'.format(
            player = self.player.name,
            club = self.club.name,
            start = self.start_year,
            end = f' {self.end_year}' if self.end_year else '',
        )
```



```python
$ ./manage.py makemigrations
$ ./manage.py migrate
$ ./manage.py shell
```



```python
from many_to_many.models import *

# Player 추가
son = Player.objects.create(name='son')

# Club 추가
club1 = Club.objects.create(name='a_team')
club2 = Club.objects.create(name='b_team')
club3 = Club.objects.create(name='c_team')

# 연결
Career.objects.create(player=son, club=club1, start_year=2010, end_year=2011)
Career.objects.create(player=son, club=club2, start_year=2011, end_year=2012)
Career.objects.create(player=son, club=club3, start_year=2012, end_year=2013)

# 연결 확인
son.career_set.all()
# 출력 결과
<QuerySet [<Career: son, a_team, (2010 ~  2011)>, <Career: son, b_team, (2011 ~  2012)>, <Career: son, c_team, (2012 ~  2013)>]>

# 연결 확인
club1.career_set.all()
# 출력 결과
<QuerySet [<Career: son, a_team, (2010 ~  2011)>]>

# 연결 확인
Club.objects.all()
# 출력 결과
 <QuerySet [<Club: a_team>, <Club: b_team>, <Club: c_team>]>
```

- many_to_many_player 테이블

![image-20191220205129583](/home/jungsuji/.config/Typora/typora-user-images/image-20191220205129583.png)

- many_to_many_club 테이블

![image-20191220205045660](/home/jungsuji/.config/Typora/typora-user-images/image-20191220205045660.png)

- many_to_many_career 테이블

![image-20191220205101165](/home/jungsuji/.config/Typora/typora-user-images/image-20191220205101165.png)



### 4) recursive_extra_field_model 예제

```python
# __init__.py에 추가
from .m2m_04_recursive_extra import *
```

```python
from django.db import models

class InstagramUser(models.Model):
    name = models.CharField(max_length=20)

    following = models.ManyToManyField(
        'self', through='Relation',related_name='followers', symmetrical=False,
    )

    def __str__(self):
        return self.name

class Relation(models.Model):
    me = models.ForeignKey(InstagramUser, related_name='me_relation_set', on_delete=models.CASCADE)
    counterpart = models.ForeignKey(InstagramUser, related_name='counterpart_relation_set', on_delete=models.CASCADE)
    create_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Relation (me : {self.me.name}, counterpart: {self.counterpart.name})'
```

```python
$ ./manage.py makemigrations
$ ./manage.py migrate
$ ./manage.py shell
```

```python
from many_to_many.models import *

suji = InstagramUser.objects.create(name = 'suji')
hyojin = InstagramUser.objects.create(name='hyojin')
rupy = InstagramUser.objects.create(name='rupy')

# 연결
Relation.objects.create(me=suji,counterpart=hyojin)
# 출력 결과
<Relation: Relation (me : suji, counterpart: hyojin)>

# 연결 확인
Relation.objects.all()[0].create_date
# 출력 결과
datetime.datetime(2019, 12, 20, 12, 5, 55, 358249, tzinfo=<UTC>)

# 확인
suji.me_relation_set.all() 
# 출력 결과
 <QuerySet [<Relation: Relation (me : suji, counterpart: hyojin)>]>
    
# 확인
hyojin.me_relation_set.all()
# 출력 결과
<QuerySet []>

# 확인
hyojin.counterpart_relation_set.all()
# 출력 결과
<QuerySet [<Relation: Relation (me : suji, counterpart: hyojin)>]>

# 확인
suji.counterpart_relation_set.all()
# 출력 결과
Out[23]: <QuerySet []>
```

- many_to_many_instagramuser 테이블

![image-20191220211341251](/home/jungsuji/.config/Typora/typora-user-images/image-20191220211341251.png)

- many_to_many_relation 테이블

![image-20191220211411943](/home/jungsuji/.config/Typora/typora-user-images/image-20191220211411943.png)



## inheritance 예제

``` python
$ ./manage.py startapp inheritance
```

```python
# app > config > setting.py 연결

INSTALLED_APPS = [
    'inheritance.apps.InheritanceConfig',
    ...
]
```

```python
# inheritance > models.py

from django.db import models

class CommonInfo(models.Model):
    name = models.CharField(max_length=20)
    age = models.PositiveIntegerField()

    class Meta:
        abstract = True

class Student(CommonInfo):
    school = models.CharField(max_length=30)

    def __str__(self):
        return f'{self.name} (학교: {self.school})'

class Instructor(CommonInfo):
    academy = models.CharField(max_length=20)

    def __str__(self):
                return f'{self.name} (학원 {self.academy})'
```

위 코드에서 `class Meta`에 `abstract=True` 지정해준 부분은 AbstractBaseClasses: 부모는 테이블이 없고, 자식은 테이블이 있음에 해당하는 내용이다. 

> 1. AbstractBaseClasses
>    부모는 테이블이 없고, 자식은 테이블이 있음
> 2. Multitable inheritance
>    부모와 자식 모두 테이블이 있음
> 3. Proxy model
>    부모는 테이블이 있고, 자식은 테이블이 없음



이 코드를 makemigrations해도 테이블에는 생성이되지 않으나, `class Student(CommonInfo)`에 CommonInfo를 상속받아 사용하기 때문에 name, age 필드를 갖는다.



```python
$ ./manage.py makemigrations
$ ./manage.py migrate
$ ./manage.py shell
```

```python
from inheritance.models import *

Student.objects.create(name='정수지', age=24, school='A대') 
# 출력 <Student: 정수지 (학교: A대)>

Instructor.objects.create(name='권효진', age=25,academy='패스트캠퍼스')
# 출력 <Instructor: 권효진 (학원 패스트캠퍼스)>

CommonInfo.objects.create(name='name', age=123) # 이건 안됨

from inheritance.abstract.models import CommonInfo

CommonInfo.objects.create(name='권은비', age=29)
```



- Instructor 테이블

![image-20191220213634254](/home/jungsuji/.config/Typora/typora-user-images/image-20191220213634254.png)

- Student 테이블

![image-20191220213645270](/home/jungsuji/.config/Typora/typora-user-images/image-20191220213645270.png)

