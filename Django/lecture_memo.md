### json으로 secret key

```
json_str = '{"a": "apple"}'
import json
json.loads(json_str)
json_data = json.loads{json_str}
```



```python
# settings.py
import json
secrets_path = os.path.jsoin(ROOT_DIR, 'secrets.json')
json_data = json.load(open(secrets_path))
# json_data = json.load(open(secrets_path).read())

AWS_ACCESS_KEY_ID = json_data['AWS_ACCESS_KEY_ID']
```

https://docs.python.org/2/library/json.html



Sercert값 저장 방법

- 저장하는 별도의 파일을 지정 (https://github.com/LeeHanYeong/django-json-secrets)
- 환경변수에 지정
- 외부 서비스에 저장하고 api 호출



```
$ env
```

가 우리 컴퓨터에 저장된 환경변수이다.

```
$ os.environ
```

을 사용하면 외부 환경변수 값을 가져올 수 있다.



AWS SECRETS MANAGER라는 서비스를 사용할 수도 있다.

https://github.com/LeeHanYeong/django-secrets-manager



---



Request -> runserver -> Django

Django는 일종의 아주 커다란 함수이다.

Django는 DB와 storage와 연결되어있음



Django -> runserver -> Request

(Response)



Process는 실행하고 있는 상태를 말한다.

runserver는 프로세스/ Django는 프로세스 아니고 function

function: input을 받아 결과를 만들고 output을 만들어 냄

runserver는 성능이 좋진 않다? debug 메세지를 알려줌



HTTPrequet/ Web server가 처리하는 것

- 동적응답 : 동적응답을 받기 위해 무언가 실행되고 있어야 함
- 정적응답 : Files할 때 성능이 좋음



`WebServer(Nginx) -> WSGI(fumucorn,uWSGI) -> APP(Django)`

Web server는 범용적이라 Python은 WSGI를 중간에 둔다.

역할은 외부에 요청을 전달, 응답을 번역해주는 역할

웹서버와 python app 사이에 통신을 중계하는 역할



아무튼 이 세팅을 우리가 해야하는데, 복잡함

그래서 개발 단계에서 Docker라는 걸 사용하는게 편함



설치

https://docs.docker.com/install/linux/docker-ce/ubuntu/



```
pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]

```



도커란 무엇인가?

강사님은 도커가 없으면 배포를 상상할 수 없다.

https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html



*도커는 컨테이너를 관리하는 플랫폼*

도커는 컨테이너 기반의 오픈소스 가상화 플랫폼

컨테이너 : 만든 서버 한대



이미지는 하나로 여러 컨테이너를 만들어 사용할 수 있다.



ubuntu에서 sudo 안쓰고 login하는 방법

https://docs.docker.com/install/linux/linux-postinstall/



```python
$ docker login
$ docker run ubuntu
```

```
# 컨테이너가 켜짐
docker run --rm -it ubuntu /bin/bash
# rm은 나가면 container 없어짐
```

```
# 현재 실행되고있는 컨테이너
docker ps
```

```
docker run --rm -it python:3.7-slim /bin/bash
```



Django를 설치하고 runserver해보면 8000번으로 브라우저에 접속해도 표시되지 않는다.



Host

Docker- container가 생성이 됨

	- container1 (Python 3.7-slim)

Host가 가진 포트를 container와 연결해줘야한다.

```
-p Host-container
```



Docker에서 요청을 보내면 LAN카드로 보내고 runser가 된다.



runserver: 0.0.0.0:8000



```
docker run --rm -it -p 8001:8000 python:3.7-slim /bin/bash
pip install django
django-admin startproject mysite
cd mysite
python manage.py runserver 0:8000
```

localhost:8001 접속 시 나옴



instagram에 Dockerfile 생성

```dockerfile
# python:3.7-slim에 사용하는걸 모두 쓰겠다.
FROM        python:3.7-slim
# RUN 마다 컨테이너 하나가 생김
RUN         apt -y update && apt -y dist-upgrade
```



```
$ docker build -t instagram -f Dockerfile .
```



```dockerfile
FROM        python:3.7-slim

RUN         apt -y update && apt -y dist-upgrade
RUN         pip install django

WORKDIR     /srv
RUN         mkdir sample
WORKDIR     /srv/sample
RUN         django-admin startproject mysite
WORKDIR     /srv/sample/mysite

CMD         python manage.py runserver 0:8000
```

```
$ doccker build -t instagram -f Dockerfile .
$ docker run --rm -it -p 8001:8000 instagram
```





```
FROM        python:3.7-slim

RUN         apt -y update && apt -y dist-upgrade

COPY        . /srv/instagram
```

```
dockebuild -t instagram -f Dockerfile .
docker run --rm -it -p 8001:8000 instagram /bin/bash
```



Using cache: 옛날에 했던 기록을 가져다쓴다.

container는 레이어 구조라서 자주 변경되지 않아도 될 부분은 위에 적어준다.

```
FROM        python:3.7-slim

RUN         apt -y update && apt -y dist-upgrade

# requirements를 /tmp에 복사 후, pip install실행
COPY        ./requirements.txt /tmp/
RUN         pip install -r /tmp/requirements.txt

# 소스코드 복사 후 runserver
COPY        . /srv/instagram
WORKDIR     /srv/instagram/app
CMD         python manage.py runserver 0:8000
```





```
docker tag instagram devsuji/wps-instagram
docker push devsuji/wps-instagram
```





```
docker rmi
```

image는 i를 붙여서 rmi라고 명령한다.



생활코딩 Docker 추가자료

pyrasis.com/Docker/Docker-HOWTO#section-3

