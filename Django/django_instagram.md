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
$ mv config app								# 외부 config 폴더명을 app으로 변경

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
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
MEDIA_ROOT = os.path.join(ROOT_DIR, '.media')
```

위와 같이 설정하면 이미지를 올렸을 때 app 폴더와 동일 위치에  .media 폴더가 생성되고, 우리가 upload_to에서 추가로 경로 설정해준 것과 같이 내부 폴더가 생성된 뒤 이미지가 들어간다.



## Admin 개선

### 언어 및 시간 설정 변경

```python
# config/setting.py

LANGUAGE_CODE = 'ko-kr'

TIME_ZONE = 'Asia/Seoul'
```



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
> 기본적으로 Django는 각 객체의 str()을 표시한다. 그러나 개별 필드를 표시할 수 있는 경우 **list_display** admin 옵션을 사용해 객체의 변경 목록 페이지에서 열로 표시할 필드 이름의 튜플을 보여줄 수 있다.



## index, login_view의 url, template, view 연결



미션

- settings.TEMPLATES의 DIRS에 instagram/app/templates 경로를 추가

- Template: templates/index.html <h1>Index!</h1> URL: '/' , name='index'
- Template: templates/members/login.html POST요청을 처리하는 form 내부에는 input 2개를 가지며, 각각 username, password로 name을 가짐
- URL: /members/login/  (members.urls를 사용, config.urls에 include하여 사용) 
- name: members:login (url namespace를 사용) 
- POST요청시, 예제를 보고 적절히 로그인 처리한 후, index로 돌아갈 수 있도록 한다
- 로그인에 실패하면 다시 로그인페이지로 이동



```python
# config/settings.py

TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')

TEMPLATES = [
    {
        'DIRS': [TEMPLATES_DIR,]
    }
]
```



```python
# config/urls.py 해당 영역 추가

from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.index, name='index'),
	path('members/', include('members.urls')),
]
```



```python
# members/admin.py

from .models improt User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass
```



```python
# members/urls.py
from django.urls import path

from . import views

app_name = 'members'
urlpatterns = [
    path('login/', views.login_view, name='login'),
]
```



```python
# members/views.py

def login_view(request):
    return render(request, 'members/login.html')
```



```python
# templates/index.html

<h1>Index!</h1>
```



```python
# templates/members/login.html

<h1><Login!/h1>
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

