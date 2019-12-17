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

TIME_ZONE = 'Asia/Seouls'
```



##### INSTALLED_APPS 알아보기

현재 Django 인스턴스에서 활성화된 모든 Django 어플리케이션들의 이름이 담겨있다. 앱들은 다수의 프로젝트에서 사용될 수 있고, 다른 프로젝트에서 쉽게 사용될 수 있도록 패키징하여 배포할 수 있다.

- `django.contrib.admin` : 관리용 사이트
- `django.cotrib.auth` : 인증 시스템
- `django.contrib.contenttypes` : 컨텐츠 타입을 위한 프레임워크
- `django.contrib.sessions` : 세션 프레임워크
- `django.contrib.messages` : 메세징 프레임워크
- `django.contrib.staticfiles` : 정적 파일을 관리하는 프레임워크



위와 같은 기본 어플리케이션들 중 몇몇은 최소한 하나 이상의 데이터베이스 테이블을 사용하는데, 그러기 위해 데이터베이스에서 테이블을 미리 만들 필요하기 있다. 필요없다면 migrate전 주석처리 또는 삭제하면 된다.

```
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
    votes = models.IntergerField(default=0)
```

각 모델은 `django.db.models.Model`이라는 클래스의 서브클래스로 표현된다.

각 모델은 몇개의 클래스 변수를 가지고 있으며, 각각의 클래스 변수들은 모델의 데이터베이스 필드를 나타낸다.