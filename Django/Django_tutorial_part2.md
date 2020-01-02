# django tutorial

이 문서는 장고 튜토리얼(https://docs.djangoproject.com/ko/2.2/intro/tutorial01/)을 바탕으로 작성된 문서입니다.



## part2, 첫번째 장고 앱 작성하기



### 데이터베이스 설치

##### TIME_ZONE 및 언어 설정

```python
# configs/settings.py

from django.utils.translation import gettext_lazy as _

LANGUAGES = [
    ('ko', _('Korean')),
]
LANGUAGE_CODE = 'ko'

TIME_ZONE = 'Asia/Seoul'
```

>위 방법은 django 버전이 3.0 이상인 경우 적용하는 방법
>



##### INSTALLED_APPS 알아보기

현재 Django 인스턴스에서 활성화된 모든 Django 어플리케이션들의 이름이 담겨있다. 앱들은 다수의 프로젝트에서 사용될 수 있고, 다른 프로젝트에서 쉽게 사용될 수 있도록 패키징하여 배포할 수 있다.

- `django.contrib.admin` : 관리용 사이트
- `django.cotrib.auth` : 인증 시스템
- `django.contrib.contenttypes` : 컨텐츠 타입을 위한 프레임워크
- `django.contrib.sessions` : 세션 프레임워크
- `django.contrib.messages` : 메세징 프레임워크
- `django.contrib.staticfiles` : 정적 파일을 관리하는 프레임워크



위와 같은 기본 어플리케이션들 중 몇몇은 최소한 하나 이상의 데이터베이스 테이블을 사용하는데, 그러기 위해 데이터베이스에서 테이블을 미리 만들 필요하기 있다. 필요없다면 migrate전 주석처리 또는 삭제하면 된다.

```python
$ python manage.py migrate
```



### 모델 만들기

모델이란 부가적인 메타데이터를 가진 데이터베이스의 구조를 말한다.



#### Question과 Choice라는 두개의 모델만들기

Question은 질문과 발행일을 위한 두개의 필드를 가지고, Choice 모델은 Question 모델과 연관됨

```python
# polls/models.py
from django.db import models


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
```

각 모델은 `django.db.models.Model`이라는 클래스의 서브클래스로 표현된다.

각 모델은 몇개의 클래스 변수를 가지고 있으며, 각각의 클래스 변수들은 모델의 데이터베이스 필드를 나타낸다.

데이터베이스의 각 필드는 Field 클래스의 인스턴스로서 표현된다. 각각의 Field 인스턴스 이름은 기계가 읽기 좋은 형식의 데이터베이스 필드 이름이다. 이 필드명을 Python 코드에서 사용할 수 있으며, 데이터베이스에서는 컬럼명으로 사용할 것이다.

`ForeignKey`를 사용한 관계설정을 통해 위 코드에서는 각각의 Choice가 하나의 Question에 관계된다는 것을 Django에게 알려준다.

Django는 다대일, 다대다, 일대일과 같은 모든 일반 데이터베이스의 관계들을 지원한다.



### 모델의 활성화

모델 코드가 Django에게는 상당한 양의 정보를 제공한다. 이 정보를 가지고 앱을 위한 데이터베이스 스키마를 생성하고, Question과 Choice객체에 접근하기 위한 Python 데이터베이스 접근 API를 생성한다.



앱을 현재 프로젝트에 포함시키기 위해서는 앱의 구성 클래스에 대한 참조를 INSTALLED_APPS 설정에 추가해야한다.

PollsConfig 클래스는 polls/apps.py 파일 내 존재하으로 점으로 구분된 경로를 추가하면 아래와 같다.

```python
# mysite/settings.py
INSTALLED_APPS = [
    'polls.apps.PollsConfig',
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'django_extensions',
]
```



이제 Django는 polls 앱이 포함된 것을 알았으니 다른 명령을 내리자.

```python
$ python manage.py makemigrations polls
$ python manage.py migrate
```

makemigrations를 실행시킴으로서, 모델을 변경시킨 사실과 이 변경사항을 migration으로 저장시키고 싶다는 것을 알려주는 Django에게 알려준다.

migration은 Django가 모델의 변경사항을 저장하는 방법으로써, 디스크상의 파일로 존재한다. migrate 명령은 아직 적용되지 않은 마이그레이션을 모두 수집해 이를 실행하며 이 과정을 통해 모델에서의 변경 사항들과 데이터베이스의 스키마의 동기화가 이루어진다.



> **추가정보**
>
> - 테이블 이름은 앱의 이름과 모델의 이름(소문자)이 조합되어 자동으로 생성된다.
> - 기본 키가 자동으로 추가된다.
> - 관례에 따라, Django는 외래 키 필드명에 '_id' 이름을 자동으로 추가한다.



> **모델의 변경을 만드는 세 단계 요약**
>
> 1. models.py에서 모델을 변경한다.
> 2. python manage.py makemigrations 또는 ./manage.py makemigrations를 통해 이 변경 사항에 대한 마이그레이션을 만든다.
> 3. python manage.py migrate 또는 ./manage.py migrate 명령을 통해 변경사항을 데이터베이스에 적용한다.



### API 가지고 놀기

Python 쉘을 실행하는 명령어 입력하기

```python
$ ./manage.py shell_plus
```

위 코드는 manage.py에 설정된 DJANGO_SETTINGS_MODULE 환경변수를 통해 config/settings.py 파일에 대한 Python 임포트 경로를 Django에게 제공하여 Django가 접근할 수 있는 Python 모듈 경로를 그대로 사용할 수 있다.



위 쉘은 알아보기가 조금 어려워 아래 코드를 실행해 shell를 활용하기로 한다.

```python
$ pip install django-extensions notebook
$ pip freeze > requirements.txt
$ ./manage.py shell
```



쉘 창에서 아래와 같이 입력해준다.

```python
>>> from polls.models import Choice, Question  # Import the model classes we just wrote.

# No questions are in the system yet.
>>> Question.objects.all()
<QuerySet []>

# Create a new Question.
# Support for time zones is enabled in the default settings file, so
# Django expects a datetime with tzinfo for pub_date. Use timezone.now()
# instead of datetime.datetime.now() and it will do the right thing.
>>> from django.utils import timezone
>>> q = Question(question_text="What's new?", pub_date=timezone.now())

# Save the object into the database. You have to call save() explicitly.
>>> q.save()

# Now it has an ID.
>>> q.id
1

# Access model field values via Python attributes.
>>> q.question_text
"What's new?"
>>> q.pub_date
datetime.datetime(2012, 2, 26, 13, 0, 0, 775217, tzinfo=<UTC>)

# Change values by changing the attributes, then calling save().
>>> q.question_text = "What's up?"
>>> q.save()

# objects.all() displays all the questions in the database.
>>> Question.objects.all()
<QuerySet [<Question: Question object (1)>]>
```



위 코드에서 마지막에 <Question: Question object (1)>은 이 객체를 표현하는데 별로 도움이 되지 않는다. polls/models.py 파일의 Question 모델을 수정하여, `__str__()`메소드를 추가하자. 

`__str__()`는 객체의 표현을 대화식 프롬프트에서 편하게 보려는 이유말고도, Djangor가 자동으로 생성하는 관리 사이트에서도 객체의 표현이 사용되기 때문이다.



```python
# polls/models.py

from django.db import models

class Question(models.Model):
    # ...
    def __str__(self):
        return self.question_text

class Choice(models.Model):
    # ...
    def __str__(self):
        return self.choice_text
```



커스텀 메소드도 추가해보자

```python
# polls/models.py
import datetime

from django.db import models
from django.utils import timezone


class Question(models.Model):
    # ...
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
```



다시 쉘으로 돌아가서 다음의 코드를 입력해보자

```python
>>> from polls.models import Choice, Question

# Make sure our __str__() addition worked.
>>> Question.objects.all()
<QuerySet [<Question: What's up?>]>

# Django provides a rich database lookup API that's entirely driven by
# keyword arguments.
>>> Question.objects.filter(id=1)
<QuerySet [<Question: What's up?>]>
>>> Question.objects.filter(question_text__startswith='What')
<QuerySet [<Question: What's up?>]>

# Get the question that was published this year.
>>> from django.utils import timezone
>>> current_year = timezone.now().year
>>> Question.objects.get(pub_date__year=current_year)
<Question: What's up?>

# Request an ID that doesn't exist, this will raise an exception.
>>> Question.objects.get(id=2)
Traceback (most recent call last):
    ...
DoesNotExist: Question matching query does not exist.

# Lookup by a primary key is the most common case, so Django provides a
# shortcut for primary-key exact lookups.
# The following is identical to Question.objects.get(id=1).
>>> Question.objects.get(pk=1)
<Question: What's up?>

# Make sure our custom method worked.
>>> q = Question.objects.get(pk=1)
>>> q.was_published_recently()
True

# Give the Question a couple of Choices. The create call constructs a new
# Choice object, does the INSERT statement, adds the choice to the set
# of available choices and returns the new Choice object. Django creates
# a set to hold the "other side" of a ForeignKey relation
# (e.g. a question's choice) which can be accessed via the API.
>>> q = Question.objects.get(pk=1)

# Display any choices from the related object set -- none so far.
>>> q.choice_set.all()
<QuerySet []>

# Create three choices.
>>> q.choice_set.create(choice_text='Not much', votes=0)
<Choice: Not much>
>>> q.choice_set.create(choice_text='The sky', votes=0)
<Choice: The sky>
>>> c = q.choice_set.create(choice_text='Just hacking again', votes=0)

# Choice objects have API access to their related Question objects.
>>> c.question
<Question: What's up?>

# And vice versa: Question objects get access to Choice objects.
>>> q.choice_set.all()
<QuerySet [<Choice: Not much>, <Choice: The sky>, <Choice: Just hacking again>]>
>>> q.choice_set.count()
3

# The API automatically follows relationships as far as you need.
# Use double underscores to separate relationships.
# This works as many levels deep as you want; there's no limit.
# Find all Choices for any question whose pub_date is in this year
# (reusing the 'current_year' variable we created above).
>>> Choice.objects.filter(question__pub_date__year=current_year)
<QuerySet [<Choice: Not much>, <Choice: The sky>, <Choice: Just hacking again>]>

# Let's delete one of the choices. Use delete() for that.
>>> c = q.choice_set.filter(choice_text__startswith='Just hacking')
>>> c.delete()
```



### 관리자 생성하기

```python
$ python manage.py createsuperuser
# 원하는 Username과 pw를 입력하고 엔터를 누르면 계정이 생성된다.
```



### 개발 서버 시작

서버를 동작시키는 명령어 입력

```python
$ python manage.py runserver
```

`http://127.0.0.1:8000/admin/에 접속해 위에 생성한 관리자로 로그인하면 관리자 사이트에 접속이 된다.



### 관리 사이트에서 poll app을 변경가능하도록 만들기

접속해보면 poll app이 관리 인덱스 페이지에서 보이지 않는다.

관리자 사이트에 Question객체가 관리 인터페이스를 가지고 있다는 것을 알려줘야한다.

```python
# polls/admin.py
from django.contrib import admin
from .models import Question
admin.site.register(Question)
```

위 코드를 실행하면 Django가 알아채고 관리 인덱스 페이지에 이를 표시하게 된다. 관리자 페이지에서 질문을 수정하거나 추가하는 등의 행위를 테스트해볼 수 있다.



> **요약**
>
> - 이 서식은 Question 모델에서 자동으로 생성되었다.
> - 모델의 각 필드 유형들은 적절한 HTML 입력 위젯으로 표현된다.
> - 각각의 DateTimeField는 JavaScript로 작성된 단축 기능과 연결된다.