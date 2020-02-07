# Docker

Docker를 배우기 전에, 왜 Docker가 필요한지 이해해보자.



```
Request 	-> 	runserver 	-> 	Django
Response 	<- 	runserver 	<- 	Django
```

Process는 실행하고 있는 상태를 말한다.

Request가 오면 runserver가 실행되고 Django에게 전달한다.

Django는 response를 runserver를 통해 전달한다.



| runserver                 | Django                                 |
| ------------------------- | -------------------------------------- |
| Process                   | Process가 아닌 일종의 아주 커다란 함수 |
| debug message를 알려준다. | Django는 DB와 storage와 연결되어있다.  |



HttpRequest / Web server가 처리하는 것

- 동적응답 : 동적응답을 받기 위해 무언가 실행되고 있어야 함
- 정적응답 : Files할 때 성능이 좋음



```
WebServer 	-> 	WSGI 	-> 		APP
(Nginx 등)	(gunicorn,uWSGI 등) (Django 등)
```

- Web server는 모든 언어에 범용적이라 Python은 WSGI를 중간에 둔다.

- WSGI 역할
  - 외부에 요청을 전달, 응답을 번역함
  - 웹서버와 python app 사이에 통신을 중계함



아무튼 위와같은 환경세팅을 우리가 해야하는데, 복잡하고 어렵다.

그래서 개발 단계에서 Docker라는 걸 사용해 대신한다.



---

> 아래 설명글 참고 자료 : 초보를 위한 Docker 안내서
>
> - [도커란 무엇인가?](https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html)
> - [설치하고 컨테이너 실행하기](https://subicura.com/2017/01/19/docker-guide-for-beginners-2.html)
> - [이미지 만들고 배포하기](https://subicura.com/2017/02/10/docker-guide-for-beginners-create-image-and-deploy.html)



## Docker란 무엇인가?

서버를 관리한다는 것은 복잡하고 어려우며 고급 개발자들의 섬세한 작업이 필요한 영역이다. (예로 하나의 서버에 여러개의 프로그램을 설치할 때는 서로 사용하는 라이브러리의 버전이 다르거나 동일 포트를 사용하는 경우 설치는 매우 까다로워짐)

DevOps의 등장으로 개발주기가 짧아지면서 배포는 더 자주 이루어지는 등 관리가 더 복잡해졌다. 새로운 툴은 계속해서 나오고 클라우드의 발전으로 설치해야 할 서버가 수백, 수천대에 이르는 상황에서 Docker가 등장해 서버 관리 방식이 완전히 바뀌게 되었다.



**Docker는 컨테이너 기반의 오픈소스 가상화 플랫폼이다.**

컨테이너는 다양한 프로그램, 실행환경을 컨테이너로 추상화하고 동일한 인터페이스를 제공하여 프로그램의 배포 및 관리를 단순하게 해준다.



**Container는 격리된 공간에서 process가 동작하는 기술이다.**

기존의 가상화 방식은 주로 OS를 가상화했다. VMware나 VirtualBox 같은 가상머신은 호스트 OS위에 게스트 OS 전체를 가상화하여 사용하는 방식이다. 이 방식은 여러가지 OS를 가상화(리눅스에서 윈도우를 돌림)할 수 있고 비교적 사용법이 간단하지만, 무겁고 느려 운영환경에선 사용할 수 없었다.

전가상화든 반가상화든 추가적인 OS를 설치하여 가상화하는 방법은 성능문제가 있었고 이를 개선하기 위해 <u>프로세스를 격리</u>하는 방식이 등장한다.

리눅스에서는 이 방식을 리눅스 컨테이너라하고 단순히 프로세스를 격리시키기 때문에 가볍고 빠르게 동작한다. CPU나 메모리는 딱 프로세스가 필요한 만큼만 추가로 사용하고 성능적으로도 거의 손실이 없다.

하나의 서버에 여러개의 컨테이너를 실행하면 서로 영향을 미치지 않고 독립적으로 실행되어 마치 가벼운 VM을 사용하는 느낌을 준다.

- 실행중인 컨테이너에 접속하여 명령어를 입력할 수 있다.
- `apt-get`이나 `yum`으로 패키지를 설치할 수 있다.
- 사용자도 추가할 수 있다.
- 여러개의 프로세스를 백그라운드로 실행할 수 있다.
- CPU나 메모리 사용량을 제한할 수 있다
- HOST의 특정 port와 연결할 수 있다.
- HOST의 특정 directory를 내부 directory인 것 처럼 사용할 수 있다.



이러한 컨테이너라는 개념은 Docker가 처음 만든 것이 아니다. 도커가 등장하기 이전에 프로세스를 격리하는 방법으로 리눅스에서 cgroups와 namespace를 이용한 LXC 등이 있었다.



도커는 LXC를 기반으로 시작해서 0.9 버전에는 자체적인 libcontainer 기술을 사용하였고 추후 runC 기술에 합쳐졌다.



### 이미지(image)

**이미지는 컨테이너 실행에 필요한 파일과 설정값등을 포함하고 있는 것으로 상태값을 가지지 않고 변하지 않는다.**

컨테이너는 이미지를 실행한 상태라고 볼 수 있고 추가되거나 변하는 값은 컨테이너에 저장된다. 같은 이미지에서 여러개의 컨테이너를 생성할 수 있고, 컨테이너의 상태가 바뀌거나 컨테이너가 삭제되더라도 이미지는 변하지 않고 그대로 남아있다.

(ubuntu이미지는 ubuntu를 실행하기 위한 모든 파일을 가짐)

<u>말그대로 이미지는 컨테이너를 실행하기 위한 모든 정보를 가지고 있기 때문에 더이상 의존성 파일을 컴파일하고 이것저것 설치할 필요가 없다.</u>

도커 이미지는 Docker hub에 등록하거나 Docker Registry 저장소를 직접 만들어 관리할 수 있다.





### Docker 특징

#### 레이어 저장방식

![출처: https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html](https://subicura.com/assets/article_images/2017-01-19-docker-guide-for-beginners-1/image-layer.png)



도커 이미지는 컨테이너를 실행하기 위한 모든 정보를 가지고 있기 때문에 보통 용량이 수백 메가에 이른다. 처음 이미지를 다운받을때는 부담이 안되지만 기존 이미지에 파일 하나를 추가했다고 다시 수백메가를 다운로드 받는다면 매우 비효율적일 수 밖에 없다.

도커는 이런 문제를 해결하기 위해 **레이어**라는 개념을 사용하고 유니온 파일 시스템을 이용하여 여러개의 레이어를 하나의 파일 시스템으로 사용할 수 있게 해준다. 이미지는 여러개의 읽기 전용 레이어로 구성되고 파일이 추가되거나 수정되면 새로운 레이어가 생성된다.

이미지는 url 방식으로 관리하며 태그를 붙일 수 있다.



### Docker File

도커는 이미지를 만들기 위해 `Dockerfile`이라는 파일에 자체 DSL언어를 이용해 이미지 생성과정을 적는다.

서버에 어떤 프로그램을 설치하려고 의존성 패키지를 설정하고 설정파일을 만들었던 것을 Dockerfile로 관리하면된다.



### Docker Hub

Docker hub를 통해 공개 이미지를 무료로 관리해준다.





## 설치하고 컨테이너 실행하기

### 설치하기

[Docker ubuntu 설치 문서](https://docs.docker.com/install/linux/docker-ce/ubuntu/)를 참고! 아래는 코드만 요약함



#### SET UP THE REPOSITORY

```python
$ sudo apt-get update
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo apt-key fingerprint 0EBFCD88
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```



#### INSTALL DOCKER ENGINE - COMMUNITY

```python
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
$ apt-cache madison docker-ce
$ sudo docker run hello-world
```



> **ubuntu에서 sudo 안쓰고 login하는 방법**
>
> https://docs.docker.com/install/linux/linux-postinstall/
>
> ```python
> # 현재 접속중인 사용자에게 권한주기
> $ sudo usermod -aG docker $USER 
> # your-user 사용자에게 권한주기
> $ sudo usermod -aG docker your-user 
> ```



#### 설치 확인하기

```python
$ docker version
```



### 컨테이너 실행하기

```python
# 기본 format
$ docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
```



ubuntu 이미지로 docker container 실행하기

```python
$ docker run --rm -it ubuntu /bin/bash
```

> **자주 사용하는 옵션들**
>
> | 옵션  | 설명                                                   |
> | :---- | :----------------------------------------------------- |
> | -d    | detached mode 흔히 말하는 백그라운드 모드              |
> | -p    | 호스트와 컨테이너의 포트를 연결 (포워딩)               |
> | -v    | 호스트와 컨테이너의 디렉토리를 연결 (마운트)           |
> | -e    | 컨테이너 내에서 사용할 환경변수 설정                   |
> | –name | 컨테이너 이름 설정                                     |
> | –rm   | 프로세스 종료시 컨테이너 자동 제거                     |
> | -rmi  | image 삭제 시 i를 붙여 rmi                             |
> | -it   | -i와 -t를 동시에 사용한 것으로 터미널 입력을 위한 옵션 |
> | –link | 컨테이너 연결 [컨테이너명:별칭]                        |



### Docker login

- https://hub.docker.com/ 가입하기
- 터미널에 아래 명령어 입력

```python
$ docker login
# hub.docker.com에 가입한 id/pw 입력
$ docker run ubuntu
```



현재 실행되고있는 컨테이너 확인

```python
$ docker ps
```

```python
$ docker run --rm -it python:3.7-slim /bin/bash
```



Django를 설치하고 runserver를 하면 8000번에 접속하라고 출력되지만 브라우저에서 접속해도 표시되지 않는다. host가 가진 port와 container가 연결되지 않았기 때문이다.



### Host가 가진 port를 container와 연결

```python
# 기본 format
-p HostPort:containerPort
```



HostPort는 8001번 containerPort는 8000번을 사용하여 연결하는 코드를 작성해보자. 그리고 내부에서 django를 설치하고 startproject를 하여 runserver해보자.

```python
$ docker run --rm -it -p 8001:8000 python:3.7-slim /bin/bash
$ pip install django
$ django-admin startproject mysite
$ cd mysite
$ python manage.py runserver 0:8000
```

다시 `localhost:8001`접속 시 django 기본 페이지 출력됨



### instagram에 `Dockerfile`생성

container는 레이어 구조라서 자주 변경되지 않아도 될 부분은 위에 적어준다.

```dockerfile
# python:3.7-slim에 사용하는걸 모두 쓰겠다.
FROM        python:3.7-slim
# RUN 마다 컨테이너 하나가 생긴다.
RUN         apt -y update && apt -y dist-upgrade

# requirements를 /tmp에 복사 후, pip install실행
COPY        ./requirements.txt /tmp/
RUN         pip install -r /tmp/requirements.txt

# 소스코드 복사 후 runserver
COPY        . /srv/instagram
# WORKDIR는 cd의 의미이다.
WORKDIR     /srv/instagram/app
CMD         python manage.py runserver 0:8000
```



### docker build & run 하기

build 명령으로 이미지를 생성하자. `-t`는 `--tag`옵션으로 이미지 이름과 태그를 설정할 수 있다. 이미지 이름만 설정하면 태그는 latest로 설정된다. `-f`는 dockerfile 위치 설정이다.

```python
$ docker build -t instagram -f Dockerfile .
$ docker run --rm -it -p 8001:8000 instagram
```



> **`docker run --rm -it -p 8001:8000 instagram /bin/bash`와 `docker run --rm -it -p 8001:8000 instagram` 처럼 /bin/bash를 붙이는 것은 뭐가 다른가?**
>
> 뒤에 /bin/bash를 붙이면 CMD 명령 전까지 실행된다.



### docker hub에 push하기

https://hub.docker.com/ 에 create repository를 한 뒤

```python
$ docker tag instagram ID/reponame:tagname
$ docker push ID/reponame
```

(ID와 reponame은 hub.docker.com ID와 reponame 의미)



## EC2에 Docker배포

1. 로컬에서 이미지 생성, 실행 확인
2. DockerHub에 저장소 생성
3. 로컬 이미지에 태그 추가
   `docker tag <로컬이미지명> <저장소명>`
4. DockerHub에 이미지 Push
   `docker push <저장소명>`
5. EC2에 Docker설치
6. EC2에서 docker run명령어 실행
   `docker run --rm -it -p 80:8000 <저장소명>`

docker설치 및 run 명령어 실행하는 부분을 `deploy-docker.sh` 안에 적절히 작성하기



```python
# deploy-docker.sh

#!/usr/bin/env sh
IDENTITY_FILE="$HOME/.ssh/키페어명.pem"
USER="ubuntu"
HOST="[IPv4 퍼블릭 IP]"
TARGET=${USER}${HOST}
ORIGIN_SOURCE="$HOME/projects/fastcampus/12th/instagram/"
DOCKER_REPO="[DOCKER REPO]"  # 예)"abc/instagram"
SSH_CMD="ssh -i ${IDENTITY_FILE} ${TARGET}"

echo "==Docker 배포=="

# 서버 초기 설정
echo "apt update & upgrade & autoremove"
${SSH_CMD} -C 'sudo apt upgrade && sudo DEBIAN_FRONTEND=noninteractive apt dist-upgrade -y && apt -y autoremove'

echo "apt install docker.io"
${SSH_CMD} -C 'sudo apt -y install docker.io'

# pip freeze
echo "pip freeze"
"$HOME"/.pyenv/versions/3.7.5/envs/wps-instagram/bin/pip freeae > "${ORIGIN_SOURCE}"requirments.txt

# docker build
echo "docker build"
docker build -q -t ${DOCKER_REPO} -f Dockerfile "${ORIGIN_SOURCE}"

# docker pushs
echo "docker push"
docker push ${DOCKER_REPO}

echo "docker stop"
${SSH_CMD} -C "sudo docker stop instagram"

echo "docker pull"
${SSH_CMD} -C "sudo docker pull ${DOCKER_REPO}"

# screen에서 docker run
echo "screen settings"

# 실행중이던 screen 세션 종료
${SSH_CMD} -C 'screen -X -S docker quit'

# screen 실행
${SSH_CMD} -C 'screen -S docker -d -m'

# 실행중인 세션에 명령어 전달
${SSH_CMD} -C "screen -r docker -X stuff 'sudo docker run --rm -it -p 80:8000 --name=instagram [DOCKER REPO에 기입한 내용]'"
```



+ pycharm에서 `plugin ignore`와 `GitToolBox` 설치

+ `.dockerignore` 파일 생성

```
/.git
/.media
/secrets.json
```



image 중 none을 지우는 코드

```
docker system prune
```



>**추가자료**
>
>[생활코딩 Docker](pyrasis.com/Docker/Docker-HOWTO#section-3)
>
>[가장 빨리 만나는 Docker](http://pyrasis.com/private/2014/11/30/publish-docker-for-the-really-impatient-book)