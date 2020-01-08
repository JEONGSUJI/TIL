# Django Instagram

Django를 활용하여 Instagram을 만드는 과정을 적어보겠습니다.



## 초기 환경 세팅

```python
instagram
	ㄴ app 					# 루트폴더 지정!
    						# 폴더에서 마우스 오른쪽 버튼 클릭 Mark Directory as > Source Root
		ㄴ config
		ㄴ members 			# ./manage.py startapp members
		ㄴ posts				# ./manage.py startapp posts
		manage.py
		requirements.txt
	.gitignore
```



```python
$ mkdir instagram
$ cd instagram

$ pyenv virtualenv 3.7.5 instagram-env
$ pyenv local instagram-env

$ django-admin startproject config
$ mv config app				# 외부 config 폴더명을 app으로 변경

$ pip install 'django<3.0'
$ pip freeze > requirements.txt

pycharm에서 interpreter 설정

$ cd app
$ ./manage.py startapp member
$ ./manage.py startapp posts
```



```python
# config / settings.py 내 아래 코드 추가

AUTH_USER_MODEL = 'members.User'

INSTALLED_APPS = [
    'members.apps.MembersConfig',
    'posts.apps.PostsConfig',
]
```



## 기본 모델 구성하기

```python
# members > models.py

from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass
```



> **AbstractUser**  
>
> 이 함수를 사용하면 기존의 `auth_user` 테이블에 있던 열들을 전부 유지한 채 새로운 열을 추가할 수 있다. 위 코드를 통해 앞으로는 `auth_user`의 역할을 `User`가 대신하게 될 것이다.



```python
# posts > models.py

from django.db import models
from members.models import User

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    like_users = models.ManyToManyField(User, through='PostLike', related_name='like_posts_set',)
    created = models.DateTimeField(auto_now_add=True)
    
class PostImage(models.Model):
    post = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField()
    
class PostComment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    
class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
```

```python
$ ./manage.py makemigrations
$ ./manage.py migrate
```



### Post 모델 admin 등록

```python
# members > admin.py

from django.contrib import admin

from posts.models import Post, PostImage, PostComment, PostLike

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    pass

@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    pass

@admin.register(PostComment)
class PostCommentAdmin(admin.ModelAdmin):
    pass

@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    pass
```





## 이미지 파일 경로 설정하기



### 이미지 추가하기

```python
$ ./manage.py createsuperuser
```

`localhost:8000/admin` 접속 후 `Post images`에 add하여 이미지 추가해보면 소스폴더 근처 어딘가에 이미지가 추가된 것이 보일텐데 우리가 원하는 경로에 이미지를 저장해보자



### 이미지 저장경로 지정하기

```python
# posts > models.py

class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='posts/image')			# 추가
```



```python
# config/settings.py

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
MEDIA_ROOT = os.path.join(ROOT_DIR, '.media')
```

위와 같이 설정하면 이미지를 올렸을 때 app 폴더와 동일 위치에  .media 폴더가 생성되고, 우리가 upload_to에서 추가로 경로 설정해준 것과 같이 내부 폴더가 생성된 뒤 이미지가 들어간다.



```python
# config/setting.py

MEDIA_URL = '/media/'
```

> http scheme + HOST + MEDIA _URL + FileField의 실제값
>
> http:// + localhost:8000 + /media/ + posts/images/이미지명.확장자명
>
> DB엔 posts/image/sample.jpeg 들어감



하지만 위와 같이 처리해도 admin에서 image 클릭 시 image가 보여지지 않는다.



```python
# config/urls.py

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += static(
    # prefix='/media/',
    # URL 앞부분이 /media/이면
    prefix=settings.MEDIA_URL,
    # document_root위치에서 나머지 path에 해당하는 파일을 리턴
    document_root=settings.MEDIA_ROOT,
)
```

> 참고: howto/static-files/

위와 같이 코드를 추가해주면 admin 사이트에서 이미지를 클릭했을때 이미지가 나온다 (링크를 설정해준 것)



## Admin 개선

### 언어 및 시간 설정 변경

```python
# config/setting.py

LANGUAGE_CODE = 'ko-kr'

TIME_ZONE = 'Asia/Seoul'
```



미션

- Model : Post의 `__str__`을 적절히 작성한다.
- Admin : 작성자, 글, 작성시간이 보여지게 한다. (list_display)
- 상세화면에서 PostImage, PostComment를 바로 추가할 수 있도록 한다. (inlines, TabularInline)



### post화면에서 모두 수정가능하도록 화면 변경

```python
# post/admin.py 해당 영역 수정 및 추가

from django.contrib import admin

from .models import Post, PostImage, PostComment, PostLike

class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1
    
class PostCommentInline(admin.TabularInline):
    model = PostComment
    extra = 1
    
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    pass
	list_display = ('author', 'content', 'created')
    list_display_links = ('author', 'content')
    inlines = [
        PostImageInline,
        PostCommentInline,
    ]  
```



```python
# posts/models.py 해당하는 영역 추가

class Post(models.Model):
    
    def __str__(self):
        return '{author} | {created}'.format(
        author = self.author.username,
    	created = self.created,    
	)
```



> **extra** : 여분으로 표시할 개수를 의미한다.
>
> **TabularInline** : StackedInline 대신 TabularInlined을 사용하면, 관련된 객체는 좀 더 조밀하고 테이블 기반 형식으로 표시된다.
>
> **inlines** : 동일한 페이지에서 수정할 수 있도록 한다.
>
> 기본적으로 Django는 각 객체의 str()을 표시한다. 그러나 개별 필드를 표시할 수 있는 경우 **list_display** admin 옵션을 사용해 객체의 변경 목록 페이지에서 열로 표시할 필드 이름의 튜플을 보여줄 수 있다.



> 참고 : https://docs.djangoproject.com/en/2.2/ref/contrib/admin/
>



### 유저모델 추가하기

```python
# members/admin.py

from django.contrib import admin

from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass
```

admin 페이지 내 유저 모델 관리자에서 한명 추가하고 브라우저 보안탭에서 로그인해보면 로그인이 되지 않는다. 왜냐하면 비밀번호가 해시함수로 한번 처리 되지 않았기 때문이다. (터미널에서 createsuperuser를 사용하면 해시함수로 비밀번호가 처리되는데, 유저 모델 관리자에서는 해당 작업이 자동으로 처리되지 않기 때문이다.)

이 문제를 해결하기 위해서는 makepassword 내장함수를 사용해서 해시함수 처리를 한 뒤 다시 유저 모델 관리자에서 비밀번호를 변경해주어야 로그인이 가능해진다.



> 참고
>
> https://docs.djangoproject.com/en/2.2/topics/auth/
>
> https://docs.djangoproject.com/en/2.2/topics/auth/default/
>



> **쿠키 기반 사용자 세션**
>
> 쿠키 기반으로 사용자의 <u>연결을 유지하는 것</u>(세션)을 말한다. 다시말하면, 세션을 유지하기 위해 쿠키라는 저장공간을 사용하는 것을 말한다.
>
> client는 server에 요청을 보내면, server는 client에 응답을 보내는데 이는 1회성으로 응답이 끝나면 사라진다.



> **쿠키(Cookie)의 특징**
>
> - 쿠키는 도메인마다 다르게 가지고 있으며, 키와 값으로 구성되어있다.
> - 쿠키에 담긴 값은 client가 server에 요청 시 무조건 담아서 server에 보낸다.
> - 브라우저에만 존재한다.



> **인증과정**
>
> 1) client가 server에 ID/PW를 보낸다.
>
> 2) 받은 ID/PW를 가지고 USER를 찾는다. (server에는 Usertable에 유저가 저장되어있다.)
>
> 3) 만약 2번에서 받은 ID/PW가 정상적인 정보 전달이면 <u>세션을 유지할 테이블</u>을 만들어준다.
>
> 4) 응답에 세션 value를 보내준다. 이는 client 쿠키에 키와 값으로 저장된다.
>
> 위 과정이 끝나고 난 뒤 client에서 server에 요청을 보낼때는 쿠키의  키:값도 함께 보낸다. 보내는 중간에 인증검사가 이루어진다. sessionId가 일치하면 value가 세션테이블 있는지 확인하고 있다면 로그인 정보를 유지한다. 그래서 네이버에서 다른 화면으로 가도 로그인 정보가 유지될 수 있는 것이다.



> **추가) 자동로그인 정보**
>
> 로그인 상태 유지 혹은 자동로그인에 체크를 하게되면, ID/PW + 자동로그인할 것인지에 대한 정보고 같이 보내지게 된다. 이는 expire Date를 넘겨주어 timeout이 지정된다.



기타적으로 로그인 인증과 관련된 django 내부 코드에 *`**credentials`*로  적힌 이유는 인증 방법이 여러개이기 때문이다.



## index, login_view의 url, template, view 연결



[미션]

- settings.TEMPLATES의 DIRS에 instagram/app/templates 경로를 추가

- Template: templates/index.html <h1>Index!</h1> URL: '/' , name='index'
- Template: templates/members/login.html POST요청을 처리하는 form 내부에는 input 2개를 가지며, 각각 username, password로 name을 가짐
- URL: /members/login/  (members.urls를 사용, config.urls에 include하여 사용) 
- name: members:login (url namespace를 사용) 
- POST요청시, 예제를 보고 적절히 로그인 처리한 후, index로 돌아갈 수 있도록 한다
- 로그인에 실패하면 다시 로그인페이지로 이동



**settings.TEMPLATES의 DIRS에 instagram/app/templates 경로추가**

app/templates 폴더를 생성합니다.

다음으로는 해당 경로를 연결해주기 위해 config > settings.py로 이동합니다.

```python
# config/settings.py

TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')

# 아래 코드 부분에 
TEMPLATES = [
	{
        'DIRS': ['TEMPLATES_DIR'],
    }
]
```



**Template: templates/index.html에 <h1>Index</h1> 코드 추가**

```html
<!-- templates/index.html -->

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>INDEX!</h1>
</body>
</html>
```



**URL: '/', name='index' 설정**

```python
# config/urls.py

urlpatterns = [
    path('', index, name='index')
]
```



> **왜 URL은 '/'인데, path에는 ''인가요?**
>
> path('/')로 입력하게되면, localhost:8000//으로 접속하겠다고 설정하는 것과 같습니다.



```python
# config > views.py

from django.shortcuts import render

def index(request):
    return render(request, 'index')
```



**Template: templates/members/login.html 만들기**

위에 만들어 놓은 templates 폴더에 members 폴더를 생성하고 그 내부에 login.html을 만들어 줍니다.



**POST요청을 처리하는 form, 내부에는 input 2개를 가지며, 각각username, password로 name을 가짐**

```html
# templates > index.html

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>LOGIN!</h1>
    <form method="POST">
        <input type="text" name="username">
        <input type="password" name="password">
        <button type="submit">로그인</button>
    </form>
</body>
</html>
```



**URL: /members/login/ (members.url 사용, config.urls에 include하여 사용)**

```python
# config > urls.py 아래 항목 추가

urlpatterns = [
    path('members/', include('members.urls')),
]
```

> include 함수를 사용하여, config > urls.py와 members > urls.py와 연결시켜준다.



**name: members:login (url namespace를 사용)**

```python
from django.urls import path

from members.views import login_view

app_name = 'members'

urlpatterns = [
    path('login/',login_view, name='login')
]
```



**POST 요청시, 예제를 보고 적절히 로그인 처리 한 후, index로 돌아갈 수 있도록 한다.**

우선 해결에 앞서 `localhost:8000/members/login`에 접속하면 login.html을 render하도록 해보자.

```python
# members > urls.py

from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect


def login_view(request):
    return render(request, 'members/login.html')
```



```python
# members > views.py

from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect


def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            return redirect('index')

        else:
            return redirect('index')

    else:
        return render(request, 'members/login.html')
```





## Login_view 기능 구현

```python
# members/views.py

from django.contrib.auth import authenticate, login
from django.shortcut import render, redirect

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        print('username:', username)
        print('password:', password)
        user = authenticate(request, username=username, password=password)
        print('user:', user)
        
        if user:
            login(request, user)        
            return redirect('index')
        else:
            return redirect('members:login')
        
	return render(request, 'members/login.html')
```



```python
# templates/index.html

<h1>Index!</h1>
<div>{{ request.user }}</div>
<div>{{ request.user.is_authenticated }}</div> 
```



```python
# templates/members/login.html

<!doctype html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Login</h1>
    <form action="" method="POST">
        {% csrf_token %}
        <input name="username" type="text">
        <input name="password" type="password">
        <button type="submit">로그인</button>
    </form>
</body>
</html> 
```



## index 및 login 페이지 레이아웃 및 CSS 구현 (Bootstrap활용)



### Bootstrap 다운로드 및 필요 파일 추가

https://getbootstrap.com/docs/4.3/getting-started/download/ 에서 다운로드

static 폴더 생성 > static 폴더 내 bootstrap 폴더 생성 > bootstrap 폴더 내 `bootstrap.css`와 `bootstrap.css.map` 파일 추가



### static 폴더 연결

```python
# config/settings.py

STATIC_DIR = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [
    STATIC_DIR,
]
```



### base.html 생성하여 템플릿 분리

미션

- base.html추가 상단에 {% load static %}
- 정적파일 불러올 때 {% static '경로' %}로 불러옴
- index.html과 login.html이 base.html을 extends하도록 함



```html
# templates/base.html

{% load static %}
<!doctype html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="{% static 'bootstrap/bootstrap.css' %}">
    <title>Instagram</title>
    {% block head %}{% endblock %}
</head>
<body>
    <div id="wrap">
        {% block content %}
        {% endblock %}
    </div>
</body>
</html> 
```



> **{% load static %}** : 템플릿 태그 모듈을 가져온다. 이미 만들어져있지만 사용하려고 한다면 적어주어야한다.



```python
# templates/index.html

{% extends 'base.html' %}
{% load static %}

{% block head %}
    <link rel="stylesheet" href="{% static 'css/index.css' %}">
{% endblock %}

{% block content %}
    <div class="container-fluid">
        <div class="mr-auto ml-auto mt-3 col-lg-4 col-md-6 col-sm-8 col-10">
            <div class="card text-center p-4">
                <h1>Instagram</h1>
                <p class="text-secondary">친구들의 사진과 동영상을 보려면 가입하세요</p>
                <button class="btn btn-primary btn-block">Facebook으로 로그인</button>
                <hr>
                <form action="">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="휴대폰 번호 또는 이메일 주소">
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="성명">
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="사용자 이름">
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="비밀번호">
                    </div>
                    <button class="btn btn-primary btn-block">가입</button>
                </form>
                <p class="text-secondary">가입하면 Instagram의 약관 데이터 정책 및 쿠키 정책에 동의하게 됩니다</p>
            </div>

            <div class="card text-center p-4 mt-3 mb-3">
                <span>계정이 있으신가요?</span>
                <a href="">로그인</a>
            </div>
        </div>
    </div>
{% endblock %} 
```



```python
# config/views.py

def index(request):
    return render(request, 'index.html')
```



```css
# static/css/index.css

body {
    background-color: rgb(250, 250, 250);
} 
```



### login 페이지 레이아웃 및 CSS 구현

```html
# members/login.html

{% extends 'base.html' %}
{% load static %}

{% block head %}
    <link rel="stylesheet" href="{% static 'css/index.css' %}">
{% endblock %}

{% block content %}
    <div class="container-fluid">
        <div class="mr-auto ml-auto mt-3 col-lg-4 col-md-6 col-sm-8 col-10">
            <div class="card text-center p-4">
                <h1>Instagram</h1>
                <form action="">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="휴대폰 번호 또는 이메일 주소">
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="비밀번호">
                    </div>
                    <button class="btn btn-primary btn-block">로그인</button>
                </form>
                <hr>
                <button class="btn btn-block btn-outline-primary mb-3">Facebook으로 로그인</button>
                <a href="">비밀번호를 잊으셨나요?</a>
            </div>

            <div class="card text-center p-4 mt-3 mb-3">
                <span>계정이 없으신가요?</span>
                <a href="">가입하기</a>
            </div>
        </div>
    </div>
{% endblock %} 
```



## index와 login 간 링크 구현



### 로그인 버튼 클릭 시 로그인 페이지로 이동

```python
# templates/index.html

<a href="{% url 'members:login' %}">로그인</a>
```



### 가입하기 버튼 클릭 시 index 페이지로 이동

```python
# members/login.html

<a href="{%url 'index' %}">가입하기</a>
```





## Login form 동작 fix

form에 입력한 값을 보내도록 처리하가 위해, method="POST"로 변경 후 각 항목에 name값 지정

```python
# templates/members/login.html

<form method="POST">
	{% csrf_token %}
    <div class="form-group">
        <input name="username" type="text" class="form-control" placeholder="휴대폰 번호 또는 이메일 주소">
	</div>
    <div class="form-group">
    	<input name="password" type="password" class="form-control" placeholder="비밀번호">
	</div>
</form>
```



확인을 위해 request.user 출력하도록 처리

```python
# templates/index.html

	<div>{{request.user}}</div>
	<div>{{request.user.is_authenticated}}</div>
```





## Post_list url, view, template연결

미션

- 로그인 완료 후 이 페이지로 이동하도록 함 
- index에 접근할 때 로그인이 되어 있다면, 이 페이지로 이동하도록 함 
- 로그인이 되어있는지 확인: 
  - request.user.is_authenticated가 True인지 체크 
  - URL:      /posts/  (posts.urls를 사용, config.urls에서 include) 
  - ​              app_name: 'posts' 
  - ​               url name: 'post-list' 
  - ​              -> posts:post-list 
- Template: templates/posts/post-list.html   <h1>Post List</h1>



```python
# config/urls.py path 추가
	path('post/', include('posts.urls')) 
```



```python
# posts/urls.py
from django.urls import path

from . import views

app_name = 'posts'
urlpatterns = [
    path('', views.post_list, name="post-list"),
]
```



```html
# templates/posts/post-list.html

{% extends 'base.html' %}

{% block content %}
	<h1>Post List</h1>
{% endblock %}
```



```python
# posts/views.py

def post_list(request):
    return render(request, 'posts/post-list.html')
```



## 로그인이 되어있는 상태라면 바로 post_list로 이동하도록 처리



```python
# config/views.py

from django.shortcuts import render, redirect

def index(request):
    if request.user.is_authenticated:
        return redirect('posts:post-list')
    return render(request, 'index.html')
```



```python
# members/views.py 아래 부분 수정

	if user:
        login(request, user)
        return redirect('posts:post-list')
    else:
        return redirect('members:login')
```



## post_list에 QuerySet 전달 후 출력



```python
# posts/views.py

from .models import Post

def post_list(request):
    posts = Post.objects.order_by('-pk')
    context = {
        'posts': posts,
    }
    
    return render(request, 'posts/post-list.html', context)
```



```html
{% extends 'base.html' %}

{% block content %}
    <h1>Post List</h1>
    {% for post in posts %}
        <div>{{ post.author }}</div>
        <div>{{ post.created }}</div>
    {% endfor %}

    <div class="container-fluid">
        <div class="card" style="border-radius: 1px;">
            <div class="card-header p-3">lhy</div>
            <div class="card-body p-3">
                <div class="btn-container">
                    <button class="btn btn-sm btn-outline-primary">Like</button>
                    <button class="btn btn-sm btn-outline-primary">Comment</button>
                </div>

                <div>lhy님 외 35명이 좋아합니다</div>
                <ul class="comment-list">
                    <li>lhy 장고너무좋아요</li>
                    <li>pjh 진짜그렇네요!</li>
                </ul>
            </div>
        </div>
    </div>
{% endblock %} 
```



## PostLike 기능 구현

**[주어진 조건]**

pk가 pk인 Post와 (변수명 post사용)

request.user로 전달되는 User (변수명 user사용)에 대해

- PostLike(post=post, user=user)인 PostLike객체가 존재하는지 확인한다.

- 만약 해당 객체가 이미 있다면, 삭제한다.
- 만약 해당 객체가 없다면 새로 만든다.
- 완료 후 posts:post-list로 redirect한다.
- URL: /posts/<pk>/like/

```python
# posts/views.py

def post_like(request, pk):
     post = Post.objects.get(pk=pk)
     user = request.user
    
    post_like_qs = PostLike.objects.filter(post=post, user=user)
    
    if post_like_qs.exists():
        post_like_qs.delete()
	else:
        PostLike.objects.create(post=post, user=user)
	return redirect('posts:post-list')
```



**[주어진 조건]**

post_like에 POST요청을 보내는 Form구현 

- input을 갖지 않음 

- csrf_token만 추가 {# {% url %} #}

- 보내는 곳(action)에, url 태그를 적절히 활용 

  ex) /posts/1/like/ 

  ​      /posts/2/like/ 

- Post의 pk에 따라 위와 같은 URL을 동적으로 생성해야 함

- 사용 가능한 변수는 user(USER), post(POST)
- 좋아요 눌린 상태 : PostLike 객체가 존재하는 상태PostLike.objects.filter(user=user,post=post).exist()
- user와 post.like_users를 적절히 이용해서 현재 request.user가 이 Post의 like_users에 포함되는지를 검사해서 아래의 if/else/endif 구문이 동작하도록 작성해본다.
- Template에서의 메서드 콜    post.like_users.all() -> post.like_users.all    호출구문을 제외해야한다.in operator<변수> in <반복가능개체(QuerySet 등)>-> True, False를 반환



```python
# posts/urls.py에 아래 path 추가

urlpatterns = [
    path('<int:pk>/like/', post_like, name'post-like')
]
```



```python
# templates/posts/post-list.html

{% block content %}
	{% for post in posts %}
		<form action="{% url 'posts:post-like' pk=post.pk %}" method="POST">
			{% csrf_token %}
            
            {% if post in user.like_post__set.all %}
            	<div>좋아요 눌림</div>
            {% else %}
            	<div>좋아요 안눌림</div>
            {% endif %}
            
            <button type="submit">좋아요</button>
		</form>
	{% endfor %}
{% endblock %}
```



> {% if post in user.like_post__set.all %} 대신
>
> {% if user in post.like_users. all %}을 사용할 수 있다.



## Signup_view 구현

**[주어진 조건]**

- Template: index.html을 그대로 사용 
- action만 이쪽으로 URL: /members/signup/ 



- User에 name필드를 추가 
- email username name password 를 전달받아, 새로운 User를 생성
- 생성 시, User.objects.create_user() 메서드를 사용한다
- 이미 존재하는 username또는 email을 입력한 경우, "이미 사용중인 username/email입니다" 라는 메시지를 HttpResponse로 돌려줌
- 생성에 성공하면 로그인 처리 후 (위의 login_view를 참조) posts:post-list로 redirect처리



```python
# templates/members/index.html
# 기존 코드에 name 값 추가 / action 경로 설정 

<form action="{% url 'members:signup_view' %}" method="POST">
	{% csrf_token %}
    {{ form }}
    <div>{{request.user}}</div>
    <div>{{request.user.is_authenticated}}</div>
    <input type="email" name="email" class="form-control mt-3" placeholder="이메일 주소">
    <input type="text" name="username" class="form-control mt-3" placeholder="성명">
    <input type="text" name="name" class="form-control mt-3" placeholder="사용자 이름">
    <input type="password" name="password" class="form-control mt-3" placeholder="비밀번호">
    <button type="submit" class="btn btn-primary btn-md mt-3 btn-block">가입</button>
</form>
```

```python
# members/models.py

class User(AbstractUser):
	name = models.CharField('이름', max_length=100)
```

```python
# members/views.py

def signup_view(request):

    email = request.POST['email']
    username = request.POST['username']
    name = request.POST['name']
    password = request.POST['password']
    
    
    if User.objects.filter(username=username).exists():
		return HttpResponse('이미 사용중인 username입니다.')
    if User.objects.filter(email=email).exists():
        return HttpResponse('이미 사용중인 email입니다.')
    
    user = User.objects.create_user(email=email, username=username, name=name, password=password)
    
    login(request, user)
        
    return redirect('posts:post-list')
```



로그인이 되었는지 확인하기 위해 출력

```python
# posts/post-list.html

<div>User: {{ request.user }}</div>
<div>Authenticated: {{ request.user.is_authenticated }}</div>
```



## Logout view 구현

**[주어진 조건]**

- GET 요청으로 처리함
- 요청에 있는 사용자를 logout 처리
- django.contrib.auth.logout 함수를 사용한다.



- URL: /members/logout/
- Template: 없음



참고 : https://docs.djangoproject.com/en/3.0/topics/auth/default/#django.contrib.auth.logout



```python
# templates/posts/post-list.html
<a href={% url 'members:logout' %}>로그아웃</a>
```

```python
# members/urls.py
urlpatterns = [
    path('logout/', views.logout_view, name="logout")
]
```

```python
# members/views.py

def logout_view(request):
    logout(request)
    return redirect("members:login")
```



## Post_create 구현

### 기본구조 구현

**[주어진 조건]**

- URL: 			/posts/create/, name='post-create'
- Template:    /posts/post-create.html
- forms.          PostCreateForm을 사용



참고 : https://docs.djangoproject.com/en/2.2/topics/forms/#building-a-form



```python
# posts/urls.py
path('create/', post_create, name="post-create")
```

```python
# posts/forms.py

class PostCreateForm(forms.Form):
    image = forms.ImageField()
    text = forms.CharField()
```

```python
# posts/views.py
from .forms import PostCreateForm

def post_create(request):
    form = PostCreateForm()
    context = {
        'form':form
    }
    
    return render(request, 'posts/post-create.html', context)
```

```python
# posts/post-create.html

<form action="">
	{{ form }}
    <button type="submit">작성</button>
</form>
```



### 기능 구현 1) 포스트 추가 기능

기능 구현을 확인하기 위해 html내 아래 내용 추가

```python
# posts/post-list.html 내 아래 내용 추가

<a href="{% url 'posts:post-create' %}">포스트 추가</a>
...
{% for post in posts %}
	<div>{{ post.author }}</div>
    <div>{{ post.created }}</div>
    <div>{{ post.content }}</div>
```

```python
# post/views.py

def post_list(request):
    if request.method == 'POST':
        image = request.FILES['image']
        text = request.POST['text']
        
        post = Post.objects.create(
        	author=request.user,
            content=text
        )
        
        post.postimage_set.create(image=image)
        
        return redirect('posts:post-list')
    else:
        form = PostCreateForm()
        context = {
            'form':form,
        }
        return render(request, 'posts/post-create.html', context)
```

```python
# posts/post-create.html

<form action="" method="POST" enctype="multipart/form-data">
	{% csrf_token %}
	{{ form }}
    <button type="submit">작성</button>
</form>
```



> 이미지 파일을 올리고자 할 때 `entype="multipart/form-data"`을 꼭 입력해주어야한다.



### 기능 구현 2) post-list 페이지에서 Post에 연결된 PostImage 출력 기능

```python
# posts/post-list.html

<div>
	{% for post_image in post.postimage_set.all %}
    	<div>{{post_image.image.url}}</div>
        <img srt="{{post_image.image.url}}" alt="">
	{% endfor %}
<div>
```



### 기능 구현 3) 포스트 추가 시 여러장의 사진을 한 번에 올릴 수 있도록 함



참고: https://docs.djangoproject.com/en/3.0/topics/http/file-uploads/



```python
# posts/forms.py

image = forms.ImageField(
	widget=forms.ClearableFileInput(
    	attrs={
            'multiple': True
        }
    )
)
```

```python
# posts/views.py

text = request.POST['text']
images = request.FILES.getlist('image')

post = Post.objects.create(author=request.user, content=text)

for image in images:
    post.postimage_set.create(image=image)
```



> **settings.py의 ALLOWED_HOSTS 설정**
>
> 기본적으로 ALLOWED_HOSTS는 [] 로 입력이 되어있지만 기본 설정이 'localhost', '127.0.0.1'이 들어있다고 생각하면된다.
>
> 그 밖의 ip주소가 입력되길 원한다면 이곳에 추가해주면 된다.



## Comment Create 기능 구현

[주어진 조건]

- URL: /posts/<int:post_pk>/comments/create/

- Template: 없음 (post-list.html내에 Form을 구현) 

- post-list.html 내부에서, 각 Post마다 자신에게 연결된 PostComment목록을 보여주도록 함 

- 보여주는 형식은 아래와 같이 처리

  ```
  <ul>
       <li><b>작성자명</b> <span>내용</span></li>
       <li><b>작성자명</b> <span>내용</span></li>
  </ul>
  ```



```python
# posts/urls.py path추가

path('<int:post_pk>/comments/create', views.comment_create, name="comment-create"),
```

```python
# posts/views.py

def comment_create(request, post_pk):
    if request.method == 'POST':
        post = Post.objects.gets(pk=post_pk)
        content = request.POST['content']
        
        post.postcomment_set.create(
        	author=request.user,
            content=content,
        )
        
        return 
```

```html
# templates/posts/post-list.html

<div>
    <form action="{% url 'posts:comment-create' post_pk=post_pk %}" method="POST">
    {% csrf_token %}
	<textarea name="content" cols="30" rows="3"></textarea>
	<button type="submit">작성</button>
    </form>
</div>
```