# Models

모델은 데이터에 대한 정보를 나타내는 최종 소스이다. 그것은 갖고있는 데이터의 필수 필드와 행동(함수)를 포함한다.

일반적으로, 각각의 모델은 데이터베이스의 테이블에 매핑된다.



기본사항

- 각각의 모델은 `django.db.models.Model`의 서브클래스이다.
- 모델의 각 속성은 데이터베이스의 필드를 나타낸다.
- 이것들을 이용해서, 장고는 데이터베이스 액세스 API를 제공한다.



예를 들어, `first_name`과 `last_name`을 가진 `Person`을 정의하는 모델을 정의해보겠다.

```python
from django.db import models

class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
```

위 코드에서 `first_name`과 `last_name`은 모델의 필드이다.

각각의 필드는 클래스 속성을 나타내며, 데이터베이스 컬럼에 매핑된다.

위 `Person`모델은 아래와 같은 데이터테이블을 만든다.

```python
CREATE TABLE myapp_person (
	'id' serial NOT NULL PRIMARY KEY,
    'first_name' varchar(30) NOT NULL,
    'last_name' varchar(30) NOT NULL
)
```



> **추가 정보**
>
> - 테이블의 이름은 `myapp_person`으로 만들어지지만, 재정의 할 수 있다.
> - `id`필드는 자동으로 추가되지만, 오버라이드 할 수 있다.
> - 이 예제에서 쓰인 `CREATE TABLE` SQL은 `PostgreSQL`문법이지만, 장고에서는 지정된 데이터 베이스에 맞는 SQL을 사용한다.





## Using models

모델을 정의하면, 장고에게 이 모델을 사용할 것임을 알려야한다.

방법은 `settings.py`에서 `INSTALLED_APPS` 설정에 `models.py`를 포함하고 있는 모듈의 이름을 추가해주면 된다.

```python
# settings.py

INSTALLED_APPS = [
    'myapp',
]
```

위 코드를 추가했다면, 터미널에 아래 코드를 실행해 마이그레이션을 만들어준다.

```python
$ manage.py makemigrations
$ manage.py migrate
```





## Fields

모델에서 가장 중요한 부분이며, 반드시 필요한 부분이다. 필드는 데이터베이스의 필드를 정의한다. 또한 필드는 클래스 속성으로 사용된다.

```python
from django.db import models

class Musician(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    instrument = models.CharField(max_length=100)
    
class Album(models.Model):
    artist = models.ForeignKey(Musician, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    release_date = models.DateField()
    num_stars = models.IntegerField()
```



#### Field types

각각의 필드는 적절한 필드 클래스의 인스턴스여야 한다.

필드 클래스는 아래의 몇가지 사항을 정의한다.

- 데이터베이스 컬럼의 데이터 형
- form field를 렌더링 할 때 사용할 기본 HTML 위젯
- Django admin에서 자동으로 만들어지는 form의 검증 형태

장고는 매우 다양한 내장 필드 타입을 제공한다. 또한 장고에서 제공하지 않는 자신만의 필드를 쉽게 만들 수 있다.



> 내장 필드 타입 참고
>
> https://docs.djangoproject.com/en/1.10/ref/models/fields/#model-field-types



#### Field options

각 필드는 고유의 인수를 가진다. 예를들어, `CharField`는 `max_length`인수를 반드시 가져야하며, 데이터베이스에서 VARCHAR필드의 사이즈를 지정한다.



**[모든 필드에 사용 가능한 공통 인수]**

**null**

- True일 경우, 장고는 빈 값을 NULL로 데이터베이스에 저장한다. 기본값은 False이다.

**blank**

- True일 경우, 필드는 빈 값을 허용한다. 기본값은 False이다.

- False일 경우, 필드는 반드시 채워져야한다.

null은  데이터베이스에 NULL값이 들어가는 것을 허용하는 것이며, blank는 데이터베이스에 빈 문자열 값을 허용하는 것이다.

**choices**

- 반복가능한 튜플의 묶음을 선택목록으로 사용한다. 이 인수가 주어지면, 기본 폼 위젯은 select box로 대체되어 선택값을 제한한다.
- choices는 다음과 같이 나타낸다.
- 각 튜플의 첫 번째 요소는 데이터베이스에 저장되는 값이며, 두번쩨 요소는 기본양식이나 위젯에 표시되는 값이다.
- 모델 인스턴스에서 표시되는 값을 액세스하기 위해서는`get_FOO_display()`함수를 사용한다.

```python
class Person(models.Model):
    SHIRT_SIZES = (
    	('S', 'Small'),
    	('M', 'Medium'),
    	('L', 'Large'),
	)
	shirt_size = models.CharField(max_length=1, choices=SHIRT_SIZES)
```

```
$ p = Person(name='Fred Flintstone', shirt_size='L')
$ p.save
$ p.shirt_size
$ p.get_shirt_size_display()
```

**default**

- 필드에 기본값으로 설정된다.

**help_text**

- 폼 위젯에서 추가적으로 보여줄 도움말 텍스트이다. 폼을 사용하지 않아도, 문서화에 많은 도움이 된다.

**primary_key**

- True일 경우, 해당 필드는 모델의 primary key로 사용된다.
- primary_key필드는 읽기 전용이다. 기존 개체의 primary_key값을 변경한 후 저장하면, 이전 객체와는 별개의 새로운 객체가 생성된다.
- 어떤 필드에도 `primary_key=True`를 설정하지 않으면, 장고는 자동으로 `IntegerField`를 생성해 primary key로 사용한다. 그러므로 반드시 `primary_key=True`를 어떤 필드에 추가할 필요는 없다.

**unique**

- True일 경우, 이 필드의 값은 테이블 전체에서 고유해야한다.

>모든 필드에 사용가능한 공통 인수 링크 :  
>
>https://docs.djangoproject.com/en/1.10/ref/models/fields/#common-model-field-options





### Automatic primary key fields

기본적으로 장고는 각 모델에 다음 필드를 제공한다.

```python
id = models.AutoField(primary_key=True)
```

이것은 auto-increment primary key이다.

만약 임의의 primary key를 지정하고 싶다면, 필드 중 하나에 `primary_key=True`를 지정하면 된다. 장고는 primary_key 필드를 추가했을 경우, id컬럼을 추가하지 않는다.

각각의 모델은 정확히 하나의 `primary_key=True`필드를 가져야한다.



### Verbose field names

`Foreignkey`, `ManyToManyField`, `OneToOneField`를 제외한 모든 필드에서 자세한 필드명은 첫번째 인수이다. 만약 Verbose name이 주어지지 않을 경우, 장고는 자동으로 해당 필드의 이름을 사용해서 Verbose name을 만들어 사용한다.

```python
# 아래의 예에서 verbose name은 person's first name이다.
first_name = models.CharField("person's first name", max_length=30)

# 아래의 예에서 verbose name은 first name이다.
first_name = models.CharField(max_length=30)
```

`ForeignKey`, `ManyToManyField`,`OneToOneField`는 첫번째 인자로 모델 클래스를 가져야 하므로, `verbose_name`인수를 사용한다.

```python
poll = models.ForeignKey(
    Poll,
    on_delete=models.CASCADE,
    verbose_name="the related poll",
)
sites = models.ManyToManyField(Site, verbose_name="list of sites")
place = models.OneToOneField(
    Place,
    on_delete=models.CASCADE,
    verbose_name="related place",
)
```



## Relationships

관계형 데이터베이스의 강력함은 테이블간의 관계에 있다. 장고는 데이터베이스의 관계 유형 중 가장 일반적인 3가지를 제공한다.



### Many-to-one relationships

- Many-to-one 관계를 정의하기 위해 `django.db.models.ForeignKey`를 사용한다.
- 다른 필드 타입과 비슷하게, 모델의 클래스 속성으로 정의한다.
- `ForeignKey`는 관계를 정의할 모델의 클래스를 인수로 가져야한다.

```python
from django.db import models

class Manufacturer(models.Model):
    pass

class Car(models.Model):
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE)
```

위 코드를 보면 Car 모델은 Manufacturer을 ForeignKey로 갖는다.

Manufacturer은 여러개의 Car를 가질 수 있지만, Car는 오직 하나의 Manufacturer을 가진다. 

- recursive relationships와 relationshipts tod models not yet defined를 만들 수 있다.



> **ForeignKey**
>
> https://docs.djangoproject.com/en/1.10/ref/models/fields/#foreign-key-arguments



### Many-to-many relationships

- many-to-many 관계를 정의하기 위해서는, `ManyToManyField`를 사용한다.

- `ManyToManyField`는 관계를 정의할 모델 클래스를 인수로 가져야한다.

```python
from django.db import models

class Topping(models.Model):
    pass

class Pizza(models.Model):
    toppings = models.ManyToManyField(Topping)
```

위 코드를 보면 Pizza 모델은 여러개의 Topping 객체를 가질 수 있다. Topping은 여러개의 Pizza에 올라갈 수 있으며, Pizza 역시 여러개의 Topping을 가질 수 있다.

- recursive relationships와 relationshipts to models not yet defined를 만들 수 있다.

- 어떤 모델이 `ManyToManyField`를 갖는지는 중요하지 않지만, 오직 관계되는 둘 중 하나의 모델에만 존재해야한다.



#### Extra fields on many-to-many relationships

두 모델 사이의 관계와 데이터를 연결해야할 수도 있다.

예를 들면, 음악가가 속한 음악 그룹을 트래킹하는 경우 사람과 그룹으로 멤버를 이루는 관계에서 ManyToManyField로 이 관계를 나타내고자 한다. 하지만, 어떤 사람이 그룹으로 가입할 때 가입하는 날짜와 같은 세부사항이 추가로 존재하는 경우를 생각해보자.

이런 경우 장고에서는 many-to-many 관계를 관리하는 데 사용되는 모델을 지정할 수 있다. 그리고 중간 모델에 추가 필드를 넣을 수 있다. `ManyToManyField`의 `through` 인수에 중간 모델을 가리키도록 하여 연결할 수 있다.

```python
from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=128)
    
class Group(models.Model):
    name = models.CharField(max_length=128)
    members = models.ManyToManyField(Person, through="Membership")
    
class Membership(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    date_joined = models.DateField()
    invite_reason = models.CharField(max_length=64)
```

- 중간 모델을 설정할 때, 명시적으로 many-to-many 관계에 참여하는 모델들의 `ForeignKey`를 지정한다.

- 중간 모델 제한 사항
  - 중간모델은 원본모델에 대해 단 하나의 `ForeignKey`필드를 가져야한다. 여러개여도 안되며, 없어도 안된다. 아니면 반드시 `ManyToMany`필드에서 `through_fields`옵션으로 관계에 사용될 필드 이름을 지정해 주어야한다. (하지 않을 경우 Validation 에러가 발생한다.)
  - 자기 자신에게 many-to-many 관계를 가지는 모델의 경우에는 중간 모델에 동일한 모델에 대한 `ForeignKey`필드를 2개 선언할 수 있다. 3개 이상의 `ForeignKey`필드를 선언할 경우에는 앞에서 언급한 것과 같이 through_fields 옵션을 설정해주어야 한다.
  - 자기자신에게 many-to-many관계를 가지고 중간모델을 직접 선언하는 경우에는 ManyToMany 필드의 symmetrical옵션을 False로 설정해 주어야한다.



- 일반적인 many-to-many 필드와는 달리 add(), create(), set() 명령어를 사용할 수 없다. 왜냐하면 Person과 Group관계를 설정할 때 중간 모델의 필드값을 명시해주어야 하기 때문이다.
- 중간모델을 직접 지정한 경우에는 중간 모델을 직접 생성하는 방법밖에 없다. 하지만 clear()함수는 사용가능하다



### One-to-one relationships

one-to-one 관계를 정의하려면 `OneToOneField`를 이용하면 된다. 다른 관계 필드와 마찬가지로 모델 클래스의 어트리뷰트로 선언하면 된다.

일대일 관계는 다른 모델을 확장하여 새로운 모델을 만드는 경우 유용하게 사용할 수 있다.

자기자신이나 아직 선언되지 않은 모델에 대해서도 관계를 가질 수 있다.



---

on_delete = models.CASCADE

해당 이 지워지면 종속되어있는애들도 다지움



```python
Student.objects.create(name='박종현', age=30, school='asd') 

Instructor.objects.create(name='이한영', age=32,academy='패캠')

CommonInfo.objects.create(name='name', age=123) # 이건 안됨

from inheritance.abstract.models import CommonInfo

CommonInfo.objects.create(name='name', age=123)
```



# Many To One

- 일대다 관계에서는 일이 _set을 가진다. 다는 일을 알지만 일은 다를 알지 못하기 때문이다.

- 일은 ForignKey를 설정한 변수로 접근할 수 있다.



$ Manufacturer.objects.create(name = '삼성')

위 코드로 만들 수 있고

$ samsung = Manufacturer.objects.get(name = '삼성')

위 코드로 접근할 수 있다.

$ samsung

위 코드로 실행하면 `<Manufacturer:삼성>`이 나온다.

$ Car.

---

recursive.py

```
instructor = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='student_set'
```

SET_NULL 말고 다양한 속성이 있다.

related_name 은 연결할 때 이름을 정해준다는 것이다.

---



# Many To Many

manytomany는 모두 _set을 가진다(?)

```
ManyToManyField(Topping)
```

과 같이 ()에 오는 애들이 _set을 가진다.

_set앞에는 class명이 소문자로 들어온다.

또는 related_name='student_set'



many to many recursive는 모두 참조할 수 있기 떄문에 _set이 없다.



---

extra_field는 



---

부모입장에서 전체 테이블을 가져오고 싶고, 쿼리를 따로 하고싶을때 multitable



multitable보다는 abstract를 써라. multitable은 여러테이블을 거쳐와야함(join)

파이썬 로직만 추가하고싶을때 proxy를 사용한다.



migration 없는 상태로 돌리는 코드

```
./manage.py migrate proxy zero
```

