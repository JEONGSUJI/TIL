[2/11]

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



---

[2/18]



인스타그램

url 구분

localhost:8000/api/ -> apiview

localhost:8000/ -> Django VIew



config.urls

​	api/ <- 별도의 urlpatterns 사용

---

Request <-HttpRequest

​	FILES

​	POST

​	GET

합쳐진게 -> .data



---

[2/20]

Back-end 문서화

Client가 보기 쉽고 고생하지 않도록 작성하는 것이 중요하다.



직접 작성하는 방법과, 자동화 툴을 사용하는 방법이있다.



localhost 할 때 0:8000으로  runserver



별도 instagram-front 폴더 생성



- jquery를 다운로드하고 jquery.js에 저장
- html에서 불러오기
- `python -m http.server 3001` 임시로 서버열기



django-cors-headers

자바스크립트가 다른 서버에 접근하는게 막혀있음 CORS에러? 때문에 위를 설치해줘야함

그리고 setting에 middleware에 추가되어있어야함