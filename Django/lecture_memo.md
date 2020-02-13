[2/11]

`poetry add pygments`

```
python = "^3.7"
django-extensions = "^2.2.8"
djangorestframework = "^3.11.0"
notebook = "^6.0.3"
django = "^3.0.3"
```

---

`django-admin startproject config`

`mv config app`



https://www.django-rest-framework.org/tutorial/quickstart/

코드 스니펫을 만드는 것이다.



노트북 열고 기능 알아보기

```
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

LEXERS = []
for item in get_all_lexers():
    print(item)
    if item[1]:
        LEXERS.append(item)
```

```
('Python', ('python', 'py', 'sage', 'python3', 'py3'), ('*.py', '*.pyw', '*.jy', '*.sage', '*.sc', 'SConstruct', 'SConscript', '*.bzl', 'BUCK', 'BUILD', 'BUILD.bazel', 'WORKSPACE', '*.tac'), ('text/x-python', 'application/x-python', 'text/x-python3', 'application/x-python3'))
```

위와 같이 지원하는 언어들 등이 출력됨

지원하지 않는 언어는 실행하지 않기 위함



```
LANGUAGE_CHOICES = []
for item in LEXERS:
    cur_tuple = (item[1][0], item[0])
    print(cur_tuple)
    LANGUAGE_CHOICES.append(cur_tuple)
```

어떤 언어들이 choice에 들어가는지 알 수 있다.



> django choice
>
> ('FR', 'Freshman') 왼쪽 값 db 저장, 오른쪽 사용자 보여줌

> sort와 sorted 차이



```
STYLE_CHOICES = []
for item in get_all_styles():
    print(item)
    cur_tuple = (item, item)
    STYLE_CHOICES.append(cur_tuple)
```

style theme라고 생각할 수 있음



```
from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLE_CHOICES = sorted([(item, item) for item in get_all_styles()])


class Snippet(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100, blank=True, default='')
    code = models.TextField()
    linenos = models.BooleanField(default=False)
    language = models.CharField(choices=LANGUAGE_CHOICES, default='python', max_length=100)
    style = models.CharField(choices=STYLE_CHOICES, default='friendly', max_length=100)

    class Meta:
        ordering = ['created']
```



```
class Meta:
   ordering = ['created']
```

> 선택정렬, 거품정렬
>
> 정렬을 하는 필드에 따로 설정하지 않으면 created 순서로 항상 정렬된다. 정렬은 비싼 연산
>
> ordering에들어간 필드는 인덱스 처리 (필드에 들어간 정보가 오름차순인지 내림차순인지 미리 만들어놓는것)



인덱스를 만들어 놓는다.

snippet table에 인덱스를 만들어 놓는다.

created_date index table = row수 만큼 갖고 있다.

그럼 날짜 크기 비교해 정렬하지 않고 created_date index table 순서대로 꺼내올 수 있다.



RelatedField는 index가 무조건 잡혀있다.

ForeignKey랑 ManyToMany, OneToOne은 잡혀있어서 안잡아줘도 됨



단점

단 Snippet이 중간에 추가되어 새로운 숫자를 넣어야 하는 경우 언제 들어가야 할지 정렬해야한다. 추가하는데는 시간이 소요

created_date index table이라는 DB에 공간을 더쓴다. 



넣는 방법은 두가지이나. meta에넣는 걸 django가 권장

```
# DB 인덱스 설정 (Field.db_index)
# created = models.DateTimeField(auto_now_add=True, db_index=True)
```

```
    # DB 인덱스 설정 (Model.Meta)
    class Meta:
        ordering = ['created']
        indexes = [
            models.Index(fields=['created']),
        ]
```



fields=['created']라서 두개 필드를 묶어 인덱스를 만들 수 있다.



./manage.py makemigrations

./manage.py migrate

./manage.py runserver

./manage.py createsuperuser



접속

Linenos는 줄 번호를 보여줄 것이지



---

Serialize

메모리에 갖고 있는 비연속적인 데이터를 연속적인 데이터로 만드는 과정

​	파일과 문자열은 연속적인 데이터



Deserialize

연속적인 데이터를 파이썬이 사용하는 데이터 형태로 만드는 과정



Serializer가 위 두가지를 다해줌

하는 일 

- Custom Python object((CustomClass) Object 또는 Instance) -> (Serializer)-> Python data type -> (Renderer) -> String(JSON, xml, yaml)

곧바로 바꿀 순 없어서 위처럼 python 기본타입으로 바꾼다음 바꾼다. Renderer과정을 거침 외부에서 읽을 수 있는 형태로 바꿔주는 역할



Serializer은 인스턴스를 Python data type을 바꿈

장고가 가진 models.DateTimeField와 같은거를 Python data type 형태로 변환



serializer = SnippetSerializer(snippet)

선언할 때 Custom Python object 가지고 있음

snippet: Custom Python object

serializer: snippet object를 Python data type으로 변환할 수 있는 Serializer객체

-> .data(snippet object를 Python data)



snippets안에 `serializers.py`만들기

```python
from rest_framework import serializers

from snippets.models import LANGUAGE_CHOICES, STYLE_CHOICES


class SnippetSerializer(serializers.Serializer):
    pk = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=False, allow_blank=True, max_length=100)
    code = serializers.CharField()
    linenos = serializers.BooleanField(required=False)
    language = serializers.ChoiceField(choices=LANGUAGE_CHOICES, default='python')
    style = serializers.ChoiceField(choices=STYLE_CHOICES, default='friendly')
```



notebook에서 확인하려했으나 되지 않아서 장고버전을 낮추기 위해 pyproject.toml 직접 수정

```
django = "<3"
```

poetry update



notebook에서

```
snippet = Snippet.objects.get_or_create(
    title='Sampel snippet',
    code=('class Post(models.Model):\n'
         'title=models.CharField()')
)[0]
```

```
snippet.code
```

`class Post(models.Model):\ntitle=models.CharField()`



```
from snippets.serializers import SnippetSerializer

serializer = SnippetSerializer(snippet)
```

```
serializer.data
```

`{'pk': 1, 'title': 'Sampel snippet', 'code': 'class Post(models.Model):\ntitle=models.CharField()'}`



----

```
Serialize
메모리에 갖고 있는 비연속적인 데이터를 연속적인 데이터로 만드는 과정
	파일, 문자열Deserialize
연속적인 데이터를 파이썬이 사용하는 데이터 형태로 만드는 과정Serialize과정
Custom Python object
-> (Serializer) -> Python data type 
-> (Renderer) -> JSONserializer = SnippetSerializer(snippet)
	snippet: 		Custom Python object
	serializer:		snippet object를 Python data type으로 변환할 수 있는 Serializer객체
		-> .data (snippet object를 Python data type으로 가져오는 property)Deserialize과정
JSON string
 -> (Parser) -> Python data type
 -> (Serializer) -> Custom object(Model instance)
						(create / update)Create (data)
	title, code, linenos, style, languageUpdate (instance, data)
	title, code
```

타 언어와 작업할 때 데이터를 그 언어로 받고 전달 받아 Python이 읽을 수 있는 형태로 바꿔주는 것 serializer



deserializer하는 데이터를 받았을 때 하고싶은 일

- db에 저장 / create
- 기존의 객체 업데이트 / update



deserializer 과정

JSON string -> (Parser) -> Python data -> (Serializer) ->  Custom object (Model instance)

다른 클래스의 인스턴스를 만들 수도 있음



create(data)

​	title, code, linenos, style, language

update(instance, data)

​	title, code

특정 필드 업데이트라 모두 안보내도됨



ModelSerializer를 사용하면 이전과 같이 중복되게 다 적어주지 않아도 된다.

Simple default implementations for the `create()` and `update()` methods. 이미 있어서 안만들어줘도 알아서 동작



```visual basic
@csrf_exempt
```

장고로 프론트 만들었을때만 가능해서 꺼줌 안그러면 오류난다.



postman



---

json {}이나 [] 형태로 와야 함



list/create는 url을 같이 쓴다.

```
get_object_or_404()
```

에서 rest_framework.generics는 





``` 
partial=True
```

주어진 부분만 업데이트





tutorial 2 x tutorial 3



Class-based view(APIView)기반으로 snippet list, detail 구현





---

[02/12]

```SAS
GenericAPIView
```

는 같은 부분은 지정해 놓고 다른 부분은 쓸 수 있게 해주는 것

기본 형태까지만 만드는 것



```
ListModelMixin
```

내부 함수를 보면 하는일이 list를 만든다.



```
    def get(self, request, *args, **kwargs):
        objects = self.queryset
        serializer = self.serializer_class(objects, many=Trues)
        return Response(serializer.data)
```

를

```
def get(self, request, *args, **kwargs):
    return self.list(request, *args, **kwargs)
```

https://docs.djangoproject.com/en/3.0/topics/http/urls/#including-other-urlconfs



APIView

mixins + GenericAPIView

Generic Class-based APIView

Viewset

​	Router(url pattern의 추상화)



아래로 갈 수록 추상화된 것



http://www.yes24.com/Product/Goods/16886031



---

[2/13]



./manage.py migrate snippets 0001 --fake



--fake옵션은 0002에 했던 내용을 그대로 놔두고 0001로 돌린것처럼 하라는 의미



http에 기본적으로 내장된 정보를 보내는 방법

username:password 가 오면 base64로 인코딩

basic_<여기에 들어감>



token방식은 기본방식은 브라우저의 쿠키를 이용했는데, ios나 안드로이드는 그럴 수 없어서 token이라는 방식을 이용해 직접 지정해주는 것이다.





로그인과정





```
Django view
로그인
- 클라이언트가 username/password를 로그인을 처리할 view에 전송
- 로그인을 처리하는 view는 받은 username/password(자격증명)을 이용해서 해당 유저가 있는지 확인
- 있다면, 그 유저를 특정할 수 있는 Session값을 django_sessions테이블에 생성
	해당 내용을 Set-Cookie헤더에 담아서(key: sessionid) 클라이언트에게 보내줌
- 클라이언트는 받은 sessionid쿠키를 로컬 영역에 저장
	이후 다시 요청을 보낼 때 마다 해당 쿠키를 담아서 보냄
DRF
- 클라이언트가 username/password를 토큰을 발급할 view에 전송
- 토큰발급을 처리하는 view는 받은 username/password(자격증명)을 이용해서 해당유저가 있는지 확인
- 있다면, 그 유저를 특정할 수 있는 Token을 authtoken테이블에 생성
	해당 내용을 Response에 담아서 JSON형태로 클라이언트에게 보내줌
- 클라이언트는 받은 token값을 로컬 영역에 저장
	이후 다시 요청을 보낼 때 마다, Header의 Authorization키에 Token <값>으로 담아 보냄
```





---

```
blog.lhy.kr -> DNS서비스 -> 15.123.12.12(Ubuntu)
					Dynamic DNS공유기 > 포트포워딩
blog.lhy.kr(15.123.12.12):80
blog.lhy.kr(15.123.12.12):22192.168.0.1
- 게임컴 (192.168.0.2)
- 스마트폰 (192.168.0.35)
- 태블릿
- 서버컴퓨터 (192.168.0.10)-고정-(MAC주소) <- 80번은 무조건 여기
```

---

```
로컬에서 docker run
1. build
	- poetry export
	- docker build
2. copy secrets
	- docker run (bash)
	- docker cp secrets.json
3. run
	- collectstatic
	- docker run (supervisor)배포해서 run까지 하려면?
1. (로컬) build, push
2. (서버) pull, run (bash)
3. (로컬) secrets를 서버로 copy
4. (서버) secrets를 container로 copy
5. (서버) run
	- collectstatic
	- docker run (supervisor)
```

---

```
EC2 - Container(80:8000) - (screen)runserver:8000 - DjangoEC2 - Container(80:8000) - Gunicorn:8000 - Django
EC2 - Container(80:80) - Nginx:80 - Gunicorn:UnixSocket - DjangoNginx(WebServer)
	외부에서 오는 요청을 어딘가로 전달
	정적 컨텐츠 서빙Gunicorn(WSGI)
	웹 서버로 전달된 요청을 파이썬 애플리케이션에게 적절히 번역해서 전달
	-> 파이썬 애플리케이션의 응답을 적절히 웹 서버에게 번역해서 전달Django(Web application)
	외부에서 오는 요청에 대한 동적 응답을 생성
```

---

```
저장소로 FileSystem을 사용
MEDIA_URL
MEDIA_ROOT
config.urls -> django.conf.urls.static import static저장소로 S3를 사용
Django기본 (FileSystem)
f = FileSystemStorage.open('경로')
f.read()
f.close()
f -> File객체 (FileSystemStorage가 제공하는 Python의 File사용법과 매우 유사한 객체)Cloud서비스
from dropbox import d_openf = DropboxStorage.open('경로') <- 파일시스템의 경로가 아닌, 클라우드 드라이브의 경로
f.read() 
 <- HTTP요청에 대해 응답을 가져와서 파일 객체처럼 취급할수 있게 하기
f -> File객체 (DropboxStorage가 제공하는 Python의 File사용법과 매우 유사한 객체)
```

---

```
SecurityGroup의 Inbound
> 보낸사람의 IP를 기준으로 필터
Client(IP)
 -> SecurityGroup (Client의 IP가 Inbound의 허용범위내에 없으면 거부)Django의 ALLOWED_HOSTS['lhy.kr']
> 보낸사람이 '어디에' 보냈느냐를 기준으로 필터 (보낸사람의 IP는 신경쓰지 않음)
Client -> (Request) -> EC2(IP: 142.1.1.1, Domain: lhy.kr, pby.kr)
 -> Request에 HOST라는 값이 전달 됨
 -> EC2에 도달하는 Request를 만들기 위해서는, 
		142.1.1.1로 요청
		lhy.kr로 요청 <- 이거만 허용
		pby.kr로 요청
Django가 거부하므로, SecurityGroup의 Inbound는 이미 통과한 상태
```

---

[https://medium.com/harrythegreat/oh-my-zsh-iterm2%EB%A1%9C-%ED%84%B0%EB%AF%B8%EB%84%90%EC%9D%84-%EB%8D%94-%EA%B0%95%EB%A0%A5%ED%95%98%EA%B2%8C-a105f2c01bec](https://medium.com/harrythegreat/oh-my-zsh-iterm2로-터미널을-더-강력하게-a105f2c01bec)