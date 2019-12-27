# django tutorial

이 문서는 장고 튜토리얼(https://docs.djangoproject.com/ko/2.2/intro/tutorial01/)을 바탕으로 작성된 문서입니다.



## part1, 첫번째 장고 앱 작성하기

간단한 설문조사 Polls 어플리케이션을 만드는 과정을 따라합니다.

사람들이 설문 내용을 보고 직접 투표할 수 있는 개방된 사이트와 관리자가 설문을 추가, 변경, 삭제할 수 있는 사이트로 구성되어있습니다.



### [가상환경 및 Django 설치](https://github.com/JEONGSUJI/TIL/blob/master/Django/Djangogirls_tutorial.md) 

[코드 요약]

```python
$ mkdir django_tutorial_study
$ cd django_tutorial_study
$ pyenv virtualenv 3.7.5 polls-env
$ pyenv local polls-env
$ pip install 'django<3.0'
$ pip freeze > requirements.txt
$ pycharm-community .

# shell_plus를 jupyter notebook으로 사용하고자 할 경우 선택적으로 추가
$ pip install django-extenstions notebook
```

Project Interpreter 설정 완료하기



### 프로젝트 만들기

[코드 요약]

```python
$ django-admin startproject config .
# 맨 뒤에 '.'을 붙이지 않으면 폴더가 하나 더 생성된다.
```



위 코드를 실행하면 아래와 같은 폴더 경로가 생긴다.

```
mysite/
    manage.py
    mysite/
        __init__.py
        asgi.py
        settings.py
        urls.py
        wsgi.py
```

- `manage.py`:  Django 프로젝트와 다양한 방법으로 상호작용하는 커맨드라인 유틸리티
- `mysite/`: 디렉토리 내부에는 프로젝트를 위한 실제 Python 패키지들이 저장된다.
- `__init__.py`: Python에게 이 디렉토리를 패키지처럼 다루라고 알려주는 용도의 빈 파일
- `settings.py`: 현재 Django 프로젝트의 환경 및 구성을 저장한다.
- `urls.py`: 현재 Django project의 URL 선언을 저장한다.
- `wsgi.py`: 현재 프로젝트를 서비스하기위한 WSGI 호환 웹 서버의 진입점이다.
- `asgi.py`: django-channels를 사용할 때 알아야하는 개념이다. Asynchronous Server Gateway Interfase의 줄임말이다.



### 개발서버 실행

```python
$ python manage.py migrate
$ python manage.py runserver
```

브라우저에서 `localhost:8000`에 접속하면 Django 개발 서버가 실행된 화면을 확인할 수 있다.

개발 서버는 순수 Python으로 작성된 경량 웹 서버이다.



> **포트 변경**
>
> 기본적으로 runserver 명령은 내부 IP의 8000번 포트로 개발서버를 띄운다. 서버의 포트를 변경하고 싶다면 `python manage.py runserver 8080`를 입력하면 된다.



> **프로젝트와 앱**
>
> 앱: 특정한 기능을 수행하는 웹 어플리케이션. 프로젝트: 이런 특정 웹사이트를 위한 앱들과 각 설정들을 한데 묶어놓은 것
>
> 프로젝트는 다수의 앱을 포함할 수 있고, 앱은 다수의 프로젝트에 포함될 수 있다.



### 앱 생성하기

```python
$ python manage.py startapp polls
```



위 코드를 실행하면 아래와 같은 폴더 경로가 생긴다.

```
polls/
    __init__.py
    admin.py
    apps.py
    migrations/
        __init__.py
    models.py
    tests.py
    views.py
```



### 첫 번째 뷰 작성하기

```python
# polls/views.py

from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello")
```

Django에서 가장 간단한 형태의 뷰이다. 뷰를 호출하려면 연결된 URL이 있어야 하는데, 이를 위해 URLconf가 사용된다.



```python
# polls.urls.py 생성 후 아래 코드 추가

from django.urls import paths

from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
```



다음으로는 URLconf에서 polls.urls모듈을 바라보게 설정한다.

```python
from django.contrip import admin
from django.urls import path, include

urlpattens = [
    path('admin/', admin.site.urls),
    path('polls/', include('polls.urls'))
]
```



- **include()함수**

  다른 URLconf들을 참조할 수 있도록 도와준다. Django가 이 함수를 만나면 URL의 그 시점까지 일치하는 부분을 잘라내고, 남은 문자열 부분을 후속 처리를 위해 include된 URLconf로 전달한다. 이 함수덕에 '/polls/', 'fun_polls/', '/content/polls/' 와 같은 경로들을 잘 찾아갈 수 있다.



위 함수가 작성이 모두 되었다면 `runserver`를 했을 때 우리가 index 뷰에 정의한 문자('Hello')가 출력될 것이다.



> **path() 인수 살펴보기**
>
> - `route` : URL 패턴을 가진 문자열이다. `urlpatterns`의 첫번째 패턴부터 시작해, 일치하는 패턴을 찾을 때까지 요청된 URL을 각 패턴과 리스트의 순서대로 비교한다. 
> - `view` : 일치하는 패턴을 찾으면 `HttpRequest` 객체를 첫번째 인수로 하고, 경로로 부터 캡처된 값을 키워드 인수로하여 특정한 view 함수를 호출한다.
> - `kwargs`: 임의의 키워드 인수들은 목표한 view에 사전형으로 전달된다.
> - `name` : URL에 이름을 지으면, 템플릿을 포함한 Django 어디서나 참조할 수 있다.