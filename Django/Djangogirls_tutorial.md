# 장고걸스 튜토리얼 (Django Girls Tutorial)

해당 글은 https://tutorial.djangogirls.org/ko/ 을 참고하였습니다. 다만,수강하는 강의 내용을 정리하기 위해 작성한 글으로 https://tutorial.djangogirls.org/ko/와 진행방식이 동일하지 않습니다.

참고) $로 시작된 코드는 터미널에서 입력해야하는 코드를 나타냅니다.



**웹사이트**란 동영상, 음악, 사진 파일처럼 하드 디스크에 저장된 파일 묶음과 같다. 웹 사이트가 일반 파일과 다른 점은 HTML이라는 프로그래밍 코드가 들어있다는 것이다.

다른 파일처럼 HTML도 하드 디스크 어딘가에 저장되어야 한다. 인터넷에서는 **서버**가 그 역할을 하는데, 데이터를 제공하는 일을 한다. 

**인터넷**은 수많은 기계들이 연결된 하나의 네트워크이다. 



주소창에 'https://djangogirls.org'처럼 url을 입력하면 웹사이트를 보여달라는 편지를 써서 보내는 것과 같다.

편지는 나와 가장 가까운 동네 우체국으로 가고, 받을 사람에게 가까운 다른 우체국, 다른 우체국으로 전달되어 주소지에 최종 도착하게 된다. 특별한 점은 같은 장소에서 많은 양의 편지(**데이터 패킷**)를 보내면, 각기 다른 우체국(**라우터**)을 통해 전달된다.

편지를 보낼 때 도로명과 도시 이름, 우편번호를 쓰는 대신 **IP주소**라는 것을 써야한다. 컴퓨터는 먼저 DNS에 해당 URL의 IP주소가 무엇인지 물어본다. 우선 편지를 보낼때도 규칙을 지켜야 제대로 배달되는데 주소와 우표, 수령인이 읽을 수 있는 언어로 작성되어야 한다. 이처럼 데이터 패킷에도 같이 적용되어야 웹사이트를 볼 수 있다. 우리는 **HTTP(Hypertext Transfer Protocol: 하이퍼텍스트 전송 프로토콜)**이라는 프로토콜을 사용한다.

장고는 각 사용자에게 맞춤형 편지를 보낼 수 있게 도와준다.




## 장고란 무엇인가?

Django는 파이썬으로 만들어진 무료 오픈소스 웹 애플리케이션 프레임워크로 쉽고 빠르게 웹사이트를 개발할 수 있도록 돕는 구성요소로 이루어져있다.

편지(**request**)가 도착했는지 확인해주는 메일박스(**port**)가 있다고 가정해보자. 이것은 웹서버가 해주는 일인데, 웹 서버는 받은 편지를 읽고 웹 페이지와 함께 답장을 준다. 무언가 주고 싶을때는 내용이 있어야하는데 이를 장고가 특정 콘텐츠를 만들 수 있는 역할이 있어 수행할 수 있다.

누군가가 서버에 웹사이트를 요청하면, 장고에게 전달되고 장고 **urlresolver**는 웹페이지의 주소를 가져와 무엇을 할지 확인한다. 패턴 목록을 가져와 url과 맞는지 처음부터 하나씩 대조해 식별한다. 만약 일치하는 패턴이 있으면, 장고는 해당 요청을 관련된 함수(**view**)에 넘겨준다.



## 가상환경 및 Django 설치하기

가상환경 (Virtual environment, virtualenv)은 프로젝트 기초 전부를 Python/Django와 분리해준다.



- 디렉토리를 새로 생성 후 가상환경을 만들 폴더로 이동한다.

```python
$ mkdir djagnogirls
$ cd djagnogirls
```

- 가상환경을 만들 폴더로 이동했다면, 아래와 같은 코드를 실행한다.

```python
$ pyenv virtualenv 3.7.5 <환경명>
$ pyenv local <환경명>
```

- Pycharm Interpreter 설정

```python
$ charm .

# 만약, 위 코드가 실행이 되지 않는다면
$ pycharm-community .
```

1) Pycharm > File > Settings > Project:django_repractice > Project Interpreter

2) Project Interpreter: <No interpreter> 클릭

3) Show All  > '+' 버튼 클릭 > System Interperter

4) interpreter : 옆 '...' 버튼 클릭 후 `/Users/<home name>/.pyenv/versions/<env name>/bin/python` 경로 찾고 OK버튼 > OK 버튼 클릭



- 이미 pycharm-community가 실행되고 있는 터미널은 그대로 두고 새로운 터미널 열기



- Django 설치하기

```python
$ pip install 'django<3.0'
```

+. `pip list`로 Django 확인하기

```python
$ django-admin startproject <명칭> .
# 나는 config라는 명칭을 붙여 입력해주었다.
```

+. '.'은  현재 디렉터리에 장고를 설치하라고 스크립트에 알려주는 축약어



> **[설치된 폴더 설명]**
>
> **manage.py** : 사이트 관리를 도와주는 역할을 한다. 이 스크립트로 다른 설치 작업 없이 컴퓨터에서 웹 서버를 시작할 수 있다.
>
> **settings.py** : 웹사이트 설정이 있는 파일이다.
>
> **urls.py** : urlresolver가 사용하는 패턴 목록을 포함하고 있다.



- shell_plus / jupyter notebook

```python
$ pip install django_extensions
$ pip install jupyter notebook
```



- DB Browser 설치, 변경되는 DB를 확인하기 위해 sqlitebrowser 설치

```python
$ sudo apt-get install sqlitebrowser
```

- sqlitebrowser로 db.sqlite3 파일열어 확인하기 11개의 테이블이 있다면 정상



- 어플리케이션 만들기

```python
$ python manage.py startapp <애플리케이션명>
# 나는 blog라는 애플리케이션명을 입력해주었다.
```



- blog 애플리케이션을 사용하겠다고 장고에 알려주는 코드를 추가해야한다.

```python
# config/settings.py

INSTALLED_APPS = [
    'blog',
    'django_extensions', 		# shell_plus를 사용하겠다고 알려주는 코드
]
```



- git에 올리는 경우 .gitignore추가

```python
$ touch .gitignore
```



## 블로그 글 모델 만들기

```python
# blog/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone

# models.Model에서 models는 Post가 장고 모델임을 의미한다. 이 코드 때문에 장고는 Post가 데이터베이스에 저장되어야 한다고 알게됨
class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(
            default=timezone.now)
    published_date = models.DateTimeField(
            blank=True, null=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title
```



- 데이터베이스에 모델을 위한 테이블 만들기

장고 모델에 몇가지 변화가 생겼음을 알려줘야한다.

```python
# migrations 파일 생성
$ ./manage.py makemigrations
```

+. 아래와 같이 출력되면 정상

```python
Migrations for 'blog':
  blog/migrations/0001_initial.py
    - Create model Post
```

단, 위 코드는 알려주는 것일 뿐 저장은 되지 않기 때문에  저장을 하라는 명령어를 실행해줘야한다.

- 변경사항 저장하기

```python
# 변경사항에 대해 데이터베이스를 저장
$ ./manage.py migrate
```

- sqlitebrowser로 db.sqlite3 파일열어 확인하기 12개의 테이블이 있다면 정상



> 참고) migration 관련 명령어
>
> migrate, makemigrations와 같은 명령어는 models.py에 정의된 모델의 생성/변경 내역을 히스토리 관리, 데이터 베이스에 적용 등과 같은 기능을 제공하여 손쉽게 데이터베이스의 구조를 바꿀 수 있다.
>
> 
>
> 마이그레이션 파일 생성
>
>  `python manage.py makemigrations <app-name>`
>
> 마이그레이션 적용
>
> `python manage.py migrate <app-name>`
>
> 마이그레이션 적용 현황
>
> `python manage.py showmigrations <app-name>`
>
> 지정 마이그레이션의  SQL 내역
>
> `python manage.py sqlmigrate <app-name> <migration-name>`

- 웹서버 시작하기

```python
$ python manage.py runserver

# 또는
$ ./manage.py runserver
```



## 장고 관리자

```python
# blog/admin.py 코드 수정

from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    pass
```

- localhost:8000/admin/ 입력 시 admin 페이지가 나오는지 확인



- 로그인을 위해 슈퍼 사용자 설정

```python
$ python manage.py createsuperuser
```

(입력 시 관리자 id와 password를 설정하도록 터미널창이 실행된다. Email address 입력은 필수가 아니다.)

- localhost:8000/admin/ 에 설정한 슈퍼유저 id/pw 입력 후 admin page 접속



- 게시글 추가하기

Blog > Posts Add하여 게시글 여러개 작성하기

(추가 시 Author에 슈퍼유저 id를 선택한 후 작성해야함)



## 장고 urls

인터넷의 모든 페이지는 고유한 URL을 가지고 있다. 애플리케이션은 사용자가 URL을 입력하면 어떤 내용을 보여줘야 하는지 알고 있다. 장고는 **URLconf**를 사용한다. **URLconf**는 장고에서 URL과 일치하는 뷰를 찾기위한 패턴들의 집합이다.



- config/urls.py 코드를 보면 이미 장고가 넣어놓은 내용을 확인할 수 있다.

(코드를 보면 `path('admin/', admin.site.urls)`처럼 정규표현식을 사용한 것을 볼 수 있다. 이는 무수히 많은 URL이 admin URL에 포함될 수 있어 일일이 모두 쓸 수 없기 때문이다.)



- URL 만들어보기

views.py에 post_list라는 함수를 만들어 HttpResponse를 통해 임의의 html을 출력해보자.

뷰(view)는 애플리케이션의 '**로직**'을  넣는 곳이다. 뷰는 모델에서 필요한 정보를 받아와서 템플릿에 전달하는 역할을 한다.

```python
# views.py

from django.http import HttpResponse

def post_list(request):
    return HttpResponse('<html><body><h1>장고</h1></body></html>')
```

위에 입력한 코드는 post_list라는 함수 접근했을때, 장고를 반환해준다는 의미이다.



'localhost:8000/post-list' 라는 특정 url로 가면 실행되도록 해야하기 위해서는 urls.py에 아래 코드를 추가하여 연결해주어야한다.

```python
# urls.py

from blog.views import post_list  # 추가한 부분

urlpatterns = [
    path('admin/', admin.site.urls),
    path('post-list/', post_list), # 추가한 부분
]
```



코드를 저장한 후 'localhost:8000/post-list'에 접속하면 '장고'가 반환된 것을 확인할 수 있다.



- html 파일을 리턴하도록 수정하기

앞서 작성한 코드는 HttpResponse에 값을 넣어 return을 해줬는데, 이제 직접적인 입력이 아닌 작성된 html 파일을 반환하도록 해보자.

우선 templates이라는 폴더를 생성하고, 내부에 post-list.html을 생성하여 아래와 같이 입력해보자.

(폴더 경로 참고: https://tutorial.djangogirls.org/ko/html/)

```html
<!-- # post-list.html -->

<!--html:5[tab]-->
<!doctype html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Post List!</h1>
    <div>
        <p>published: 12.11.2019, 14:38</p>
        <h2><a href="">My First Post</a></h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium explicabo fuga, illum iste nihil odit saepe. A corporis deserunt eos, neque nulla obcaecati optio praesentium quae, quasi, quis saepe.</p>
    </div>
    <div>
        <p>published: 12.11.2019, 14:39</p>
        <h2><a href="">My Second Post</a></h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium explicabo fuga, illum iste nihil odit saepe. A corporis deserunt eos, neque nulla obcaecati optio praesentium quae, quasi, quis saepe.</p>
    </div>
</body>
</html> 
```



html 파일을 return 해주기 위해서는 해당 파일 경로를 찾아가야한다.

(참고:  `os.path.abspath(__file__)`, `os.path.dirname`, `os.path.join`을 활용한다.)



> `os.path.abspath(__file__)` : 현재 파일의 절대 경로를 return
>
> `os.path.dirname(A)` : A의 상위 폴더로 접근
>
>  `os.path.join(A, B)`: A와 B의 경로를 잇는다.



위 코드를 활용해 html 내용을 return 하려면

```python
# view.py

import os

def post_list(request):
    cur_file_path = os.path.abspath(__file__)
    blog_file_path = os.path.dirname(cur_file_path)
    root_file_path = os.path.dirname(blog_file_path)

    templates_file_path = os.path.join(root_file_path, 'templates')
    post_list_html_path = os.path.join(templates_file_path, 'post-list.html')

    f = open(post_list_html_path, 'rt')
    html = f.read()
    f.close()

    return HttpResponse(html)
```

위와 같이 path 경로를 찾아 open, read한 후 return해줘야한다.



파일의 경로를 일일이 지정하는 것은 번거롭기 때문에 settings.py에 DIR 설정을 해준다

```python
# settings.py

BASE_DIR = on.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = on.path.dirname(os.path.join(BASE_DIR, 'templates')) # 추가한 코드

# 중간 코드 생략

TEMPLATES = [
	{
        'DIRS': [TEMPLATES_DIR,], # 추가한 코드
    }
]
```



> 참고) post_list.html을 찾아서 그 파일을 text로 만들어서 HttpResponse형태로 돌려주는 기능을 하는 shortcut함수
> ```python
> from django.shortcuts import render
> from django.template import loader
> 
> content = loader.render_to_string('post_list.html', None, request)
> return HttpResponse(content)
> ```



설정을 마쳤다면, 위 import os가 적혀있는 코드 영역을 모두 지우고 아래 코드를 입력해주면 정상적으로 결과가 출력된다.

```python
# views.py

def post_list(request):
	return render(request, 'post_list.html')
```



## 장고 ORM과 쿼리셋 (QuerySets)

장고를 데이터베이스에 연결, 데이터를 저장하는 방법을 알아보자



우선 쿼리셋이란, 전달받은 모델의 객체 목록을 말한다. 쿼리셋은 데이터베이스로부터 데이터를 읽고, 필터를 걸거나 정렬할 수 있다.



- 모든 객체 조회하기

글을 조회하기 전 글을 불러온 뒤, 입력했던 모든 글들을 출력해보자.

```python
from blog.models import Post

Post.objects.all()
```

위 코드를 실행하면 <QuerySet [<Post: my post title>, <Post: another post title>]>과 같은 결과가 출력된다.



- post-list/접근 시 우리가 임의로 입력한 blog data로 표시하기

이제 모든 객체를 조회하는 방법을 알았으니, post-list에 우리가 작성한 데이터가 출력되도록 변경해보자.

```python
# views.py

from blog.models import Post

def post_list(request):
    posts = Post.objects.all()
    context = {
        'posts' : posts
    }
    
    return render(request, 'post-list.html', context)
```

```python
# templates/post-list.html 내 body 영역 수정

<body>
{% for post in posts %}
    <h1>{{post.title}}</h1>
    <div>
        <p>{{post.created_date}}</p>
        <p>{{post.text}}</p>
    </div>
{% endfor %}
</body>
```



>**템플릿 태그(template tags)**
>
>HTML에 파이썬 코드를 넣을 수 없다. 브라우저는 파이썬 코드를 이해할 수 없기 때문이다. 하지만 템플릿 태그는 파이썬을 HTML로 바꿔주어, 빠르고 쉽게 동적인 웹사이트를 만들 수 있게 도와준다.
>
>```python
>{% for post in posts %}		# for 사용법
>{% endfor %}
>
>{{ post }}					# 변수
>
>{% url 'post_detail' pk=post.pk %}
>
>{% if ... %} ... {% endif %} # if문 / 내용이 있는지 확인할 때 사용합니다.
>```



- 화면을 보기 좋게 바꾸기위해 bootstrap 적용해보기

bootstrap 사이트에서 download 한 후, static / bootstrap / bootstrap.css 와 bootstrap.css.map을 추가



```python
# settings.py

STATIC_URL = '/static/'

# 정적파일을 찾는 경로를 추가
STATICFILES_DIRS = [
    on.path.join(BASE_DIR,'static')
]
```



```html
# post_list.html
<head>
    <link rel="stylesheet" href="/static/bootstrap/bootstrap.css"
</head>
    
<body>
	<div id="wrap">
        <nav class="navbar navbar-expand navbar-dark bg-dark">
            <a href="#" class="navbar-brand">DjangoGirls</a>

            <div class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a href="#" class="nav-link">Post List</a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="container-fluid pt-2">
            {% for post in posts %}
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">{{ post.title }}</h5>                    
                    <p class="card-text">{{ post.text|linebreaksbr|truncatechars:250}}</p>
                    <div class="text-right">
                        <span>{{ post.created_date }}</span>
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</body>
```

다음과 같이 코드를 변경하면 부트스트랩이 적용된 화면으로 표시됩니다.



>linebreaksbr: 줄바꿈을 태그로 변환
>truncatechars: 글자 수 제한, 초과되는 글자는 말줄임표 처리



- post 클릭 시 해당 post[0]에 해당하는 detail 페이지를 출력해보기

```python
# blog/views.py

def post_detail(request):

    post = Post.objects.all()[0]

    context = {
        'post': post,
    }

    return render(request, 'post-detail.html', context)
```



- post_detail 링크 만들고 연결하기

```python
# urls.py

from blog.views import post_list, post_detail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('post-list/', post_list),
    path('post-detail/', post_detail),
]
```



- post_detail이 그에 맞는 post를 보여주도록 변경

```python
# urls.py

# 'post-detail/<int:pk>/'로 변경
path('post-detail/<int:pk>/', post_detail, name="post-detail"), 
```



```python
# views.py

def post_detail(request, pk):
    posts = Post.objects.filter(pk=pk)
    # Post.object.filter(pk=pk)는 넘어오는 결과값이 <QuerySet [<Post: 배포하기>]>라 아래 코드를 더 수행함
    post = posts[0]
    
    context = {
        'post': post,
    }
    
    return render(request, 'post-detail.html', context)
```

> **filter** : QuerySet을 반환한다.
>
> **get** : 정확하게 1개만 가져오고 싶을 때 사용한다.



> **QuerySet 객체의 특징**
>
> - 모델의 클래스의 인스턴스들이 여러개 담겨있다.
> - list처럼 사용 가능하다 (for문 순회 가능)
> - save()가 없다.



> **save()**
>
> - 변경사항 저장 / 저장할때는 하나의 row씩 저장한다.
> - blog.models.Post는 한 row를 나타낸다.
> - filter 후 update하는 것은 save와 동일한 동작이다.
> - update는 특정 필드 값만 변경한다.



- 위 코드를 실행한 뒤 없는 pk가 입력된 경우 오류화면이 출력되니 '없음' 문구를 try-except 구문을 사용해서 출력하기

```python
# views.py

def post_detail(request, pk):
    try:
        posts = Post.objects.filter(pk=pk)
        post = posts[0]
    except:
        return HttpResponse('없음')
    
    context = {
        'post' : post,
    }
    
    return render(request, 'post-detail.html', context)
```



위 코드를 Django에서 제공하는 shortcut함수를 통해 더 간결하게 줄일 수 있다.

```python
def post_detail(request, pk):
    from django.shortcuts import render, get_object_or_404

    post = get_object_or_404(Post, pk=pk)

        context = {
            'post': post,
        }

    return render(request, 'post-detail.html', context)
```



- 템플릿 확장하기 / post-list.html과 post-detail.html 중첩되는 부분을 base.html로 분리

```html
<!-- # base.html -->

<!doctype html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="/static/bootstrap/bootstrap.css">
</head>
<body>
    <div id="wrap">
        <nav class="navbar navbar-expand navbar-dark bg-dark">
            <a href="#" class="navbar-brand">DjangoGirls</a>

            <div class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a href="#" class="nav-link">Post List</a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="container-fluid pt-2">
            {% block content %} {% endblock %}
        </div>
    </div>
</body>
</html>
```

```html
<!-- # post_list.html -->

{% extends 'base.html'%}
{% block content %}
    {% for post in posts %}
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">{{ post.title }}</h5>
                <p class="card-text">{{ post.text|linebreaksbr|truncatechars:250 }}</p>
                <div class="text-right">
                    <span>{{ post.created_date }}</span>
                </div>
            </div>
        </div>
	{% endfor %}
{% endblock %}
```

```python
<!-- # post-detail.html -->

{% extends 'base.html'%}
{% block content %}
<div class="card mb-3">
    <div class="card-body">
        <h5 class="card-title">{{ post.title }}</h5>
        <p class="card-text">{{ post.text|linebreaksbr|truncatechars:250}}</p>
        <div>{{ post.author }}</div>
        <div>{{ post.created_date }}</div>
        <div>{{ post.published_date }}</div>
        <div>{{ post.text }}</div>
    </div>
</div>
{% endblock %}
```



- url에 name을 설정하고, html영역에 링크 연결하기

```python
# urls.py

urlpatterns = [
    path('admin/', admin.site.urls),
    path('post-list/', post_list, name="post-list"),
    path('post-detail/<int:pk>/', post_detail, name="post-detail"),
]
```

```python
# base.html 링크 연결부분

<a href="{% url 'post-list' %}" class="nav-link">Post List</a>

# post-list.html 링크 연결부분
<a href="{% url 'post-detail' pk=post.pk %}"><h5 class="card-title">{{ post.title }}</h5></a>
```



> `post/<int:pk>/`는 URL 패턴을 나타낸다.
>
> - `post/`란 URL이 post 문자를 포함해야 한다는 것을 말한다.
> - `<int:pk>` 장고는 정수 값을 기대하고 이를 pk라는 변수로 뷰를 전송하는 것을 말한다.
> - `/`는 다음에 /가 한 번 더 와야한다는 의미이다.
>
> 브라우저에 `http://127.0.0.1:8000/post/5/`라고 입력하면, 장고는 `post_detail` *뷰*를 찾아 매개변수 `pk`가 `5`인 값을 찾아 view로 전달한다.



## Post Add 만들기

- 데이터베이스에 새 글 객체를 저장하는 방법

User 모델의 인스턴스를 가져와 me를 전달해주기 위해 User 모델을 불러오고 create해준다.

아래 jsj에 들어가는 것은 생성했던 어드민 id입력

```python
# shell_plus

from django.contrib.auth.models import User
me = User.objects.get(username='jsj')
Post.objects.create(author=me, title='Sample', text='Test')
```



```python
# templates/post_add.html

{% extends 'base.html' %}

{% block content %}
    <div>
        <form action="">
            <div class="form-group">
                <label for="">제목</label>
                <input type="text" class="form-control">
            </div>
            <div class="form-group">
                <label for="">내용</label>
                <textarea name="" id="" rows="10" class="form-control"></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block">작성</button>
        </form>
    </div>
{% endblock %} 
```

```python
# views.py
def post_add(request):
    return render(request, 'post_add.html')
```

```python
# urls.py
from blog.views import post_list, post_detail, post_add

urlpatterns = [
    # 기존 코드 아래 추가
	path('post-add/', post_add, name="post-add")
]
```

```python
# base.html 내 li 하나 더 추가
<li class="nav-item">
	<a href="{% url 'post-add' %}" class="nav-link">Post Add</a>
</li>
```



- post add에 내용을 작성하고 list에 추가하기

```python
# templates/post_add.html
<form action="" method="POST">
	{% csrf_token %}
    <div class="form-group">
    	<label for="">제목</label>
        <input name="title" type="text" class="form-control">
    </div>
    <div class="form-group">
    	<label for="">내용</label>
        <textarea name="text" id="" rows="10" class="form-control"></textarea>
    </div>
    <button type="submit" class="btn btn-primary btn-block">작성</button>
</form>
```

method를 POST로 입력, {% csrf_token %} 추가하기

input과 textarea 내 name을 입력해주어야 url에서 뽑아낼 수 있다.

`http://localhost:8000/post-add/?title=제목영역&text=내용영역` 과 같이 내용이 url에 입력되는 것을 확인할 수 있다.



- post_add에서 form으로 전달된 데이터를 사용해 새 post 생성하기

우선, request로 들어오는 값을 확인하기 위해 pycharm에서 debug를 세팅이 필요하다. 화면 상단에 'Add Configuration' 버튼을 클릭한다.

![image-20191227170215174](/home/jungsuji/.config/Typora/typora-user-images/image-20191227170215174.png)

위와 같이 Script path와 Parameters를 setting한다.



![image-20191227165849961](/home/jungsuji/.config/Typora/typora-user-images/image-20191227165849961.png)



request.POST에 담긴 title, text 를 HttpResponse를 사용해서 적절히 리턴해주기

```python
# views.py

def post_add(request):
    if request.method == 'POST':
        author = request.user
        title = request.POST['title']
        text = request.POST['text']

        post = Post.objects.create(
            title=title,
            author=author,
            text=text,
        )

        result = f'title: {post.title}, created_date: {post.created_date}'
        return HttpResponse(result)


    else:
        return render(request, 'post-add.html')
```

if-else로 분기하는 이유는 메소드가 달라도 동일한 함수에서 처리가 되기 때문이다.



> 폼에 들어있는 값들이 올바른지를 확인하고 싶다면, (모든 필드에는 값이 있어야하고 잘못된 값이 있다면 저장하면 되지 않아야하기에) 이를 위해 `form.is_valid()`을 사용할 수 있다.



작성하기 버튼을 클릭 한 뒤 post-list화면으로 이동하게끔 설정해보자

```python
# views.py

def post_add(request):
    if request.method == 'POST':
        print('request', request)
        author = request.user
        title = request.POST['title']
        text = request.POST['text']

        post = Post.objects.create(
            title=title,
            author=author,
            text=text,
        )

        print('post',post)
        # result = f'title: {post.title}, created_date: {post.created_date}'
        # return HttpResponse(result)
        return redirect('post-list') # 추가된 부분

    else:
        return render(request, 'post_add.html')
```

이전에 작성한 return문에 해당하는 부분은 주석처리를 하고 redirect 메서드를 통해 post-list로 이동하게 한다.



추가된 후 post-list까지 이동은 문제가 없으나 추가한 글이 리스트의 최상단이 아닌 최하단에 위치하고있다. 이 순서를 바꿔보자

```python
# views.py

def post_list(request):
    # posts = Post.objects.all()
    posts = Post.objects.order_by('-pk')
    
    context = {
        'posts' = posts,
    }
    
    return render(request, 'post-list.html', context)
```

order_by를 사용하고 정렬 기준은 '-pk'로 입력해 내림차순 정렬해주었다.



## Post_delete 구현하기



우선 post_delete 함수를 만들어보자.

post_delete 함수가 실행되면 선택한 post를 delete해야한다. 그 이후 post-list 화면으로 돌아가도록 한다.

```python
# blog/views.py

def post_delete(request, pk):
    post = Post.objects.get(pk=pk)
    post.delete()

    return redirect('post-list')

# 또는
def post_delete(request, pk):
    post = Post.objects.filter(pk=pk)
    post.delete()
    
    return redirect('post-list')
```



추가한 post-delete함수에 url을 연결해주자.

```python
# config/urls.py urlspatterns 내 아래 코드 추가

path('post-detail/<int:pk>/delete/', post_delete, name="post-delete"),
```



settings.py도 'blog'로 기입했던 부분을 아래와 같이 변경해준다. (사실 blog 상태에서 수정하지 않아도, 에러가 발생하지 않는다.)

```python
# config/settings.py

INSTALLED_APPS = [
    'blog.apps.BlogConfig',
]
```



그 다음으로는 post_list.html로 가서 삭제버튼을 생성 후 url을 연결해주자.

```python
# templates/post_list.html 내 코드 추가

        <div class="text-left">
            <a href="{%url 'post-delete'%}" class="btn btn-danger btn-sm">삭제</a>
            <a href="#" class="btn btn-info btn-sm">수정</a>
        </div>
        
        # 위치 참고
        <div class="text-right">
            <span>{{ post.created_date }}</span>
        </div>
```

여기까지 코드를 작성하면 삭제버튼 클릭 시 list에서 해당 post가 사라진다.



삭제버튼을 클릭하면, 바로 삭제되는 것이 아니라 한번 물어봐주는 구조로 변경해보자.

삭제할 것인지 물어볼때 post의 제목과 생성된 일시도 표시되도록 해보자.

```python
# templates/post_delete.html

{% extends 'base.html' %}
{% block content %}
    <div class="card mb-3">
        <div class="card-body">
            <h3>정말로 이 글을 삭제하시겠습니까?</h3>
            <br>
            <ul>
                <li>제목: {{post.title}}</li>
                <li>작성날짜: {{post.created_date}}</li>
            </ul>
        </div>
        <form action="{% url 'post-delete' pk=post.pk %}" method="POST">
            {% csrf_token %}
            <div class="ml-2 mb-2">
                <button type="submit" class="btn btn-danger btn-sm">확인</button>
                <a href="{% url 'post-list'%}" class="btn btn-primary btn-sm">취소</a>
            </div>
        </form>
        <a href="{% url 'url-name-post-list'%}" class="btn btn-primary btn-sm" style="width:40%">취소</a>
    </div>
{% endblock %}
```



post_delete함수에서 POST로 들어왔을때와 POST가 아닌 GET 등으로 접근했을 때 처리를 나눠준다.

```python
# blog/views.py

def post_delete(request, pk):
    if request.method == 'POST':
        post = Post.objects.get(pk=pk)
        post.delete()

        return redirect('post-list')
    else:
        post = get_object_or_404(Post, pk=pk)
        context = {
            'post':post
        }
        return render(request, 'post_delete.html', context)
```

위 코드까지 완료하면, post-delete 기능이 성공적으로 구현된다.



## post_edit 구현하기

미리 만들어놓은 post_list.html에 수정버튼 클릭 시에 수정 화면으로 이동하도록 해보겠다.



우선 post_add.html을 복사하여, post_edit.html 만들자

```python
# templates/post_edit.html

{% extends 'base.html' %}
{% block content %}
<div>
    <form action="" method="POST">
        {% csrf_token %}
        <div class="form-group">
            <label for="title" >제목</label>
            <input type="text" class="form-control" name="title" id="title">
        </div>
        <div class="form-group">
            <label for="text">내용</label>
            <textarea id="text" name="text" rows="10" class="form-control"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block">수정</button>
    </form>
</div>
{% endblock %}
```



그럼 post_edit화면으로 이동할 수 있게 post_edit 함수를 구현해보자

해야할 작업은 다음과 같다. 우선 GET 접근 시 출력까지 확인해보도록 하겠다.

GET 접근 시, post_edit화면으로 이동하고 해당하는 post의 제목과 내용이 입력된 상태로 post_edit.html화면을 보여줌

POST 접근 시, 수정한 내용을 반영하여 기존의 post에 내용을 바꿔 저장하고 post-detail로 이동

```python
# blog/views.py

def post_edit(request, pk):
    if request.method == 'POST':
		pass

    else:
        post = Post.objects.get(pk=pk)
        context = {
            'post': post
        }
        return render(request, 'post_edit.html', context)
```



context를 보내주기 때문에 이제 post_edit 화면에서 기존의 내용을 출력해줄 수 있다. 다음과 같이 코드를 변경하자

```python
# templates/post_edit.html

{% extends 'base.html' %}
{% block content %}
<div>
    <form action="" method="POST">
        {% csrf_token %}
        <div class="form-group">
            <label for="title" >제목</label>
            <input type="text" class="form-control" name="title" id="title" value="{{post.title}}">
        </div>
        <div class="form-group">
            <label for="text">내용</label>
            <textarea id="text" name="text" rows="10" class="form-control">{{post.text}}</textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block">수정</button>
    </form>
</div>
{% endblock %}
```



다음으로 post_list.html 부분의 수정 버튼 코드를 아래와 같이 수정하자

```python
<a href="{% url 'post-edit' pk=post.pk %}" class="btn btn-info btn-sm">수정</a>
```



이제 수정버튼 클릭 시 path 경로를 설정하자

```python
# config/urls.py urlpatterns에 추가

path('post-detail/<int:pk>/edit/', post_edit, name="post-edit"),
```



GET 접근 시, post_edit화면으로 이동하고 해당하는 post의 제목과 내용이 입력된 상태로 post_edit.html화면을 보여줌까지 작업을 완료했다. 이제 POST 작업을 해보자.



앞선 작업은 위에서 다 처리했기에 views.py에 post_edit함수만 수정해주면 된다.

```python
def post_edit(request, pk):
    post = Post.objects.get(pk=pk)

    if request.method == 'POST':
        title = request.POST['title']
        text = request.POST['text']

        post.title = title
        post.text = text
        post.save()
        return redirect('post-detail', pk=pk)

    else:
        context = {
            'post': post
        }
        return render(request, 'post_edit.html', context)
```

위와 같이 get으로 해당 post를 얻고 request로 얻은 값을 기존 데이터에 덮어 써준 뒤 save() 함수를 통해 저장해주면 된다.



## post_publish 구현하기

[publish 미션] 

- pk에 해당하는 Post의 published_date를 업데이트
- 요청시점의 시간을 해당 Post의 published_date에 기록할 수 있도록 한다
- 완료후에는 post-detail로 이동
- 결과를 볼 수 있도록, 리스트 화면에서 published_date도 출력하도록 한다



[unpublish 미션]

- pk에 해당하는 Post의 published_date에 None을 대입 후 save()
- 완료후에는 post-detail로 이동
- 결과를 볼 수 있도록, 리스트 화면에서 published_date도 출력하도록 한다



우선 publish_date가 표시될 수 있도록 html을 먼저 수정해보자.

```python
# templates/post_list.html 해당 영역 코드 수정

<div class="text-right">
	<div>작성일 : {{ post.created_date }}</div>
    <div>발행일 : {{ post.published_date }}</div>
</div>
```



timezone.now() 함수를 사용해 발행하기 버튼을 클릭 시 해당 시간이 기록 되도록 하고, 반대로 발행 취소 버튼 클릭시에는 기록되어있던 시간 값을 None으로 바꾼다.

```python
# config/views.py

def post_publish(request, pk):
    post = Post.objects.get(pk=pk)
    post.published_date = timezone.now()
    post.save()
    return redirect('post-detail', pk=pk)


def post_unpublish(request, pk):
    post = Post.objects.get(pk=pk)
    post.published_date = None
    post.save()
    return redirect('post-detail', pk=pk)
```



```python
# config/settings.py urlspatterns에 아래 코드 추가

path('post-detail/<int:pk>/publish/', post_publish, name="post_publish"),
path('post-detail/<int:pk>/unpublish/', post_unpublish, name="post_unpublish"),
```



발행일이 없을때는 발행 버튼을 표시하고, 발행일이 있을때는 발행취소 버튼을 표시하도록 post_list.html을 수정해보자.

```python
{% extends 'base.html' %}
{% block content %}
{% for post in posts %}
<div class="card mb-3">
    <div class="card-body">
        <a href="{% url 'post-detail' pk=post.pk %}">
        	<h5 class="card-title">{{ post.title }}</h5>
        </a>
        <p class="card-text">{{ post.text|linebreaksbr|truncatechars:250}}</p>
        <div class="text-left">
            <a href="{% url 'post-delete' pk=post.pk %}" class="btn btn-danger btn-sm">
            	삭제
            </a>
            <a href="{% url 'post-edit' pk=post.pk %}" class="btn btn-info btn-sm">
            	수정
           	</a>
            {% if post.published_date %}
            <form action="{% url 'post-unpublish' pk=post.pk %}" method="POST">
                {% csrf_token %}
                <br>
                <button type="submit" class="btn btn-info btn-sm">발행취소</button>
            </form>
            {% else %}
            <form action="{% url 'post-publish' pk=post.pk %}" method="POST">
                {% csrf_token %}
                <br>
                <button type="submit" class="btn btn-info btn-sm">발행</button>
            </form>
            {% endif %}
        </div>
        <div class="text-right">
            <div>작성일 : {{ post.created_date }}</div>
            {% if post.published_date %}
                <div>발행일 : {{ post.published_date }}</div>
            {% endif %}
        </div>
    </div>
</div>
{% endfor %}
{% endblock %}
```



여기까지 djangogirls와 조금은 다르지만 tutorial 학습이 모두 끝났다:)



---

추가적으로 강의 진도와 별도로 장고걸스 튜토리얼 내용 정리



#### 필터링하기

쿼리셋의 중요한 기능은 데이터를 필터링하는 것이다.

이런 경우 `Post.objects.all()`에서 `all`대신 `filter`를 사용한다. 쿼리셋 안에 있는 괄호 안에는 원하는 조건을 넣어줄 것이다.

```python
# 작성자가 me인 것만 보고싶을 경우
Post.objects.filter(author=me)

# 결과
[<Post: Sample title>, <Post: Post number 2>, <Post: My 3rd post!>, <Post: 4th title of post>]

# title에 'title'이라는 글자가 들어간 글만 보고싶을 경우
Post.objects.filter(title__contains='title')

# 결과
[<Post: Sample title>, <Post: 4th title of post>]

# 게시일로 과거에 작성한 글을 필터링하기
from.django.utils import timezone
Post.objects.filter(published_data__lte=timezone.now())
```

> 장고 ORM은 필드 이름과 연산자 필터를 밑줄 2개('__')를 사용해 구분한다.