# Django Rest framework - 00.Quickstart

[rest-framework 공식문서](https://www.django-rest-framework.org/tutorial/quickstart/)와 [번역된 참고 문서](https://github.com/KimDoKy/DjangoRestFramework-Tutorial/blob/master/REST Framework Tutorial.md)를 보고 실습하며 작성한 글 입니다.



우리는 관리자가 시스템의 사용자와 그룹을 보고 편집할 수 있도록 간단한 API를 만들 것이다.



## Project setup

`tutorial`이라는 새로운 Django 프로젝트를 생성한 다음 `quickstart`라는 새로운 앱을 시작하자.

```python
# project directory 생성
$ mkdir restapi_tutorial
$ cd restapi_tutorial

# 패키지 종속성을 로컬로 격리하기위한 가상환경 만들기
$ pyenv virtualenv 3.7.5 instagram-env
$ pyenv local instagram-env

# Django 및 Django REST 프레임워크를 가상환경에 설치
$ pip install django
$ pip install djangorestframework

# 위 코드가 입력 시 `pyenv: pip: command not found`라는 오류가 출력되어 아래 코드를 실행 후 위 코드 재실행함
# $ pip install --upgrade pip

# single application으로 새 프로젝트 생성
$ django-admin startproject tutorial .
$ cd tutorial
$ django-admin startapp quickstart
$ cd ..
```



---

project의 layout은 아래와 같이 보여야한다.

```python
$ pwd
<some path>/restapi_tutorial

$ find .
.
./manage.py
./tutorial
./tutorial/__init__.py
./tutorial/quickstart
./tutorial/quickstart/__init__.py
./tutorial/quickstart/admin.py
./tutorial/quickstart/apps.py
./tutorial/quickstart/migrations
./tutorial/quickstart/migrations/__init__.py
./tutorial/quickstart/models.py
./tutorial/quickstart/tests.py
./tutorial/quickstart/views.py
./tutorial/settings.py
./tutorial/urls.py
./tutorial/wsgi.py
```

응용 프로그램이 프로젝트 디렉토리 내에 생성되었음을 나타내는데 이는 비정상적으로 보일 수 있다. 프로젝트의 네임 스페이스를 사용하면 외부 모듈(quickstart의 범위를 벗어난 주제)과 이름이 충돌하지 않는다.



이제 아래 코드를 입력해 데이터베이스를 동기화하자

```python
$ python manage.py migrate
```



그리고 `password123`이라는 비밀번호를 사용하여 admin이라는 초기 사용자를 만든다. 나중에 해당 사용자로 인증한다.

```python
$ python manage.py createsuperuser --email admin@example.com --username admin
```

데이터베이스를 설정하고, 초기 사용자가 생성되어 준비가 되면 앱의 디렉토리를 열어 코딩을 시작하자.



```python
$ pycharm-community .
```



## Serializers

웹 API를 만들려면 ~~우선 Snippet 클래스의~~ 인스턴스를 `json` 같은 형태로 직렬화(serializing)하거나 반직렬화(deserializing)할 수 있어야 한다.

Django REST 프레임워크에서는 Django 폼과 비슷한 방식으로 serializser를 작성한다. 

serializers를 정의하겠다. 데이터 표현에 사용할 `tutorial/quickstart/serializers.py`라는 새 모듈을 만들어 보겠다.



```python
# rest/serializers.py

from django.contrib.auth.models import User, Group
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']
```

이 경우 `HyperlinkedModelSerializer`와 함께 하이퍼 링크 관계를 사용하고 있다. 기본키 및 다양한 다른 관계를 사용할 수도 있지만 하이퍼 링크는 RESTful한 디자인이다.





## Views

그렇다. 우리는 그때 몇 가지 견해를 쓰는 것이 좋다. `tutorial/quickstart/views.py`를 열고 입력하자.

```python
from django.contrib.auth.models import User, Group
from rest_framework import viewsets

from tutorial.quickstart.serializers import UserSerializer, GroupSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited
    """

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
```

여러 개의 뷰를 작성하는 대신 모든 일반적인 동작을 `ViewSets`라는 클래스로 그룹화한다. 필요한 경우 이러한 뷰를 개별 뷰로 쉽게 세분화 할 수 있지만 ViewSets를 사용하면 뷰 논리를 깔끔하게 정리하고 간결하게 유지할 수 있다.





## URLs

이제 API URL을 연결해 보겠습니다. `tutorial / urls.py`로 ...

```python
from django.urls import include, path
from rest_framework import routers
from tutorial.quickstart import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
```

뷰 대신 ViewSets를 사용하므로 라우터 클래스에 ViewSets를 등록하여 API에 대한 URL conf를 자동으로 생성 할 수 있다.  다시 API URL에 대한 더 많은 제어가 필요한 경우 일반 클래스 기반보기를 사용하고 URL conf를 명시적으로 작성하면 된다. 마지막으로 브라우징 가능한 API와 함께 사용하기위한 기본 로그인 및 로그아웃 보기가 포함된다. 선택 사항이지만 API에 인증이 필요하고 탐색 가능한 API를 사용하려는 경우 유용하다.



## Pagination

페이지 매김을 사용하면 페이지 당 반환되는 개체 수를 제어 할 수 있다. 이를 활성화하려면 `tutorial / settings.py`에 다음 줄을 추가하자.

```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}
```



## Settings

INSTALLED_APPS에 'rest_framework'를 추가하자. 설정 모듈은 `tutorial/settings.py`에 있다.

```python
INSTALLED_APPS = [
    ...
    'rest_framework',
]
```



## Testing our API

이제 빌드한 API를 테스트 할 준비가 되었다. 터미널에서 서버를 시작하자.

```python
$ python manage.py runserver
```



- curl과 같은 도구를 사용하여 터미널에서 API에 액세스 할 수 있다.

```
bash: curl -H 'Accept: application/json; indent=4' -u admin:password123 http://127.0.0.1:8000/users/
{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "email": "admin@example.com",
            "groups": [],
            "url": "http://127.0.0.1:8000/users/1/",
            "username": "admin"
        },
        {
            "email": "tom@example.com",
            "groups": [                ],
            "url": "http://127.0.0.1:8000/users/2/",
            "username": "tom"
        }
    ]
}
```



- httpie 명령 줄 도구를 사용하여 API에 액세스 할 수 있다.

```
bash: http -a admin:password123 http://127.0.0.1:8000/users/

HTTP/1.1 200 OK
...
{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "email": "admin@example.com",
            "groups": [],
            "url": "http://localhost:8000/users/1/",
            "username": "paul"
        },
        {
            "email": "tom@example.com",
            "groups": [                ],
            "url": "http://127.0.0.1:8000/users/2/",
            "username": "tom"
        }
    ]
}
```



- URL `http://127.0.0.1:8000/users/`...로 이동하여 브라우저를 통해 직접 API에 액세스 할 수 있다.



브라우저를 통해 작업하는 경우 오른쪽 상단의 컨트롤을 사용하여 로그인 해야 한다. REST 프레임 워크가 함께 사용되는 방법에 대해 더 깊이 이해하려면  [the tutorial](https://www.django-rest-framework.org/tutorial/1-serialization/)로 이동하거나 [API guide](https://www.django-rest-framework.org/tutorial/#api-guide)를 찾아보자.