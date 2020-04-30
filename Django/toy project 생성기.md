# toy project 생성기

뭔가 다 배웠다는데, 뭘 배웠는지 모르겠고, 시작하려니 `mkdir toyproject`하고 멈춰있는 내 모습이 당황스러워 처음부터 복습해보기위해 기록하는 생성기입니다.



**[토이 프로젝트 아이템]**

미정 / Trello 클론한 프론트엔드 프로젝트 결과물을 가지고 백엔드를 구성하는 것과 다른 아이템 중 고민중



**[작업 순서]**

- 배포
  - Django 세팅
  - EC2 세팅
  - DOCKER 세팅
  - gunicorn
  - Nginx
- 모델링
- 프로젝트 작업 순차 진행

- 문서 작업



## 배포

### Django 세팅

poetry를 이용한 Django setting을 해보려고 합니다.



디렉토리 생성 후 가상환경을 만들 폴더로 이동하겠습니다. 폴더명은 `toyproject`로 하겠습니다.

```python
$ mkdir toyproject
$ cd toyproject
```



우선 Django 개발 환경을 설정하겠습니다. 환경명은 `toyproject-env`로 하겠습니다.

```python
$ pyenv virtualenv 3.7.5 <환경명>
$ pyenv local <환경명>
```



poetry를 활용하여 Django를 설치하겠습니다. poetry 설치방법은 생략하겠습니다.

```python
$ poetry init # no/no/yes
$ poetry add django
```



Django startproject를 해주겠습니다. project 명은 config라고 설정할 것이고, 외부 폴더명은 config에서 app으로 바꾸는 작업을 하겠습니다.

```python
$ django-admin startproject config
$ mv config app
```



추후 서버에서의 설정을 위해 poetry.lock 파일로부터 requirements.txt 생성해놓겠습니다.

```python
$ poetry export -f requirements.txt > requirements.txt
```



이제, pycharm을 실행하겠습니다.

```python
$ pycharm-community .
```



pycharm에서 Interpreter 설정을 해주겠습니다. 순서는 아래와 같습니다.

1) Pycharm > File > Settings > Project:toyproject > Project Interpreter

2) Project Interpreter: <No interpreter> 클릭

3) Show All  > '+' 버튼 클릭 > System Interperter

4) interpreter : 옆 '...' 버튼 클릭 후 `/Users/<home name>/.pyenv/versions/<env name>/bin/python` 경로 찾고 OK버튼 > OK 버튼 클릭



현재 목표는 배포과정을 모두 마치는 것이기 때문에 별도의 어플리케이션을 만드는 작업은 뒤로 미루겠습니다. 이제 migrate 작업을 진행합니다. manage.py가 있는 app 폴더로 이동해 진행합니다.

```python
$ ./manage.py migrate
```



runserver를 통해 admin에 접속해보겠습니다.

```python
$ ./manage.py runserver
```



이제 `http://127.0.0.1:8000/`에 접속하면 Django의 로케트 화면이 우리를 반겨주고 있음을 확인할 수 있습니다.



### EC2 세팅

AWS에서 EC2를 생성합니다. 생성방법과 공개키 생성 및 설정은 django_deployment.md 파일 내 배포 환경 세팅을 참고하세요.



#### SSH

EC2가 생성이 되었다면, 이제 SSH를 사용해 접속해보겠습니다.

```python
$ ssh -i ~/.ssh/[공개키이름].pem ubuntu@[IPv4 퍼블릭 IP]
```



인스턴스 인바운드에 SSH(보안 텔넷) 및 HTTP를 사용하기 위해 인바운드 규칙을 추가해주어야 합니다.

- AWS EC2에 `네트워크 및 보안` 탭에서 `보안 그룹`을 선택하고 인바운드 탭에 `편집` 버튼을 클릭한다.
- `규칙 추가`버튼을 클릭하고 유형: SSH / 소스: 위치무관으로 설정해준 뒤 `저장`한다.
- `규칙 추가`버튼을 클릭하고 유형: HTTP으로 설정해준 뒤 `저장`한다.
- 인바운드 설정에 소스가 ::/0와 0.0.0.0/0 나오면 정상이다.



우선 해당 서버에 필요한 환경을 설치한 후 runserver를 통해 접속이 되는지 확인해봅시다. 해당 서버에 접속한 상태로 아래 코드를 입력해 필요한 환경을 설치합니다.

```python
$ sudo apt update
$ sudo apt dist-upgrade

$ sudo apt install python3.7
# keep the local version currently installed 선택
$ sudo apt install python3-pip
$ pip3 list
$ pip3 install django

$ mkdir projects
$ cd projects

$ mkdir toyproject
$ cd toyproject

$ exit
```



다시 해당 서버에 접속해 runserver를 해봅시다.

```python
$ ssh -i ~/.ssh/[공개키이름].pem ubuntu@[IPv4 퍼블릭 IP]
```

```python
$ cd ~/projects/toyproject/
$ django-admin startproject config .
$ python3 manage.py runserver 0:80
```



브라우저 주소창에 `IPv4 퍼블릭 IP` 입력 시 `DisallowedHost at /`라고 나오면 정상입니다. settings.py를 열고 아래 설정을 추가해줘야합니다. 

```python
$ vim config/settings.py
```

`i` INSERT MODE로 `ALLOWED_HOSTS = ['IPv4 퍼블릭 IP', '*']`으로 수정하고 `ESC` 누른 뒤 `:wq`



```python
$ sudo python3 manage.py runserver 0:80
```

브라우저 주소창에 `IPv4 퍼블릭 IP` 입력 시 장고 로케트 화면 나오면 정상입니다.



지금까지 서버에서 한 작업은 우리가 이전에 Django 프로젝트를 위해 설정한 작업과는 무관했습니다. 이제 우리가 이전에 Django 프로젝트를 위해 설정한 작업을 옮기고 배포해봅시다.



#### SCP

SCP, 시큐어 카피로 이제 toyproject를 복사해봅시다. SCP는 로컬 호스트와 원격 호스트 간 또는 두개의 원격 호스트 간에 컴퓨터 파일을 안전하게 전송하는 수단입니다.

toyproject가 있는 폴더의 <u>한 단계 상위 폴더 경로로 이동한 후 scp 명령어를 작성</u>해야합니다.

```python
$ scp -i ~/.ssh/[공개키이름].pem -r toyproject ubuntu@[IPv4 퍼블릭 IP]:/home/ubuntu/projects
```



새로운 터미널을 다시 해당 서버에 접속해 runserver를 해봅시다.

```python
$ cd ~/projects/toyproject
$ pip3 install -r requirements.txt

# manage.py가 있는 app 디렉터리로 이동
$ cd app
$ sudo python3 manage.py runserver 0:80
```



이제 브라우저에서 `[IPv4 퍼블릭 IP]`에 접속하면 Django의 로케트 화면이 우리를 반겨주고 있음을 확인할 수 있습니다.



매번 로컬에서 소스코드를 업데이트 해야할 때마다 실행해주는 것도 힘드니 local toyproject에 deploy.sh 파일을 생성하여 `./deploy.sh` 코드만 입력하면 자동으로 실행되도록 해봅시다.



```python
# instagram/deploy.sh 파일 생성

#!/usr/bin/env sh
IDENTIFY_FILE="$HOME/.ssh/[공개키이름].pem"
HOST="ubuntu@[IPv4 퍼블릭 IP]"
ORIGIN_SOURCE="$HOME/projects/wps12th/toyproject"
DEST_SOURCE="/home/ubuntu/projects/toyproject"
SSH_CMD="ssh -i ${IDENTIFY_FILE} ${HOST}"

echo "==runserver 배포=="
# 기존 폴더 삭제
echo "1. 기존 폴더 삭제"
${SSH_CMD} sudo rm -rf ${DEST_SOURCE}

# 로컬에 있는 파일 업로드
echo "2. 로컬 파일 업로드"
scp -q -i "${IDENTIFY_FILE}" -r "${ORIGIN_SOURCE}" ${HOST}:${DEST_SOURCE}

echo "Screen 설정"
# 실행중이던 screen 종료
${SSH_CMD} -C 'screen -X -S runserver quit'

# screen 실행
${SSH_CMD} -C 'screen -S runserver -d -m'

# 실행중인 세션에 명령어 전달
${SSH_CMD} -C "screen -r runserver -X stuff 'sudo python3 /home/ubuntu/projects/toyproject/app/manage.py runserver 0:80\n'"

echo "배포완료!"
```



터미널 창에서 `./deploy.sh`를 실행하기 위해서 권한을 바꿔줘야 합니다.

```python
# deploy.sh가 rw-r--r--이기 때문 rwxr--r--로 변경
chmod 744 deploy.sh
./deploy.sh
```



자, 이제 드디어 배포단계의 자동화 1단계를 마쳤습니다.



### DOCKER 세팅



#### 우선 왜 Docker를 써야할까요?

**Docker는 컨테이너 기반의 오픈소스 가상화 플랫폼입니다.** 컨테이너는 다양한 프로그램, 실행환경을 컨테이너로 추상화하고 동일한 인터페이스를 제공해 프로그램의 배포 및 관리를 단순하게 해주기 때문입니다.

아래와 같이 환경세팅을 해야하는데 복잡하고 어려워서 DOCKER를 사용해 대신합니다.

```
WebServer 	-> 	WSGI 	-> 		APP
(Nginx 등)	(gunicorn,uWSGI 등) (Django 등)
```



추가적으로 알아두면 좋을 특징은 아래 글을 확인하세요. 더 자세한 글은 [초보를 위한 Docker 안내서](https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html)를 참고하세요. 아래는 요약입니다.

서버를 관리하는 것은 복잡하고 어렵습니다. 하나의 서버에 여러 개의 프로그램을 설치할 때 서로 사용하는 라이브러리의 버전이 다르거나 동일 포트를 사용하는 경우 설치는 매우 까다로워집니다. DevOps의 등장으로 배포는 더 자주 이루어지고 관리는 더 복잡해졌습다. 새로운 툴은 계속해서 등장하고, 클라우드의 발전으로 설치해야 할 서버가 수백대 이상이 되는 상황에서 Docker가 등장했습니다.

**Container는 격리된 공간에서 process가 동작하는 기술입니다.** 기존의 가상머신은 주로 OS를 가상화해서 사용했는데, 무겁고 느려 운영환경에선 사용하기 어려웠습니다. 이를 개선하기 위해 프로세스를 격리하는 방식이 등장했습니다. 

리눅스 컨테이너는 단순히 프로세스를 격리시키기 때문에 가볍고 빠르게 동작합니다. CPU나 메모리는 딱 프로세스가 필요한 만큼만 추가로 사용하고 성능적으로도 거의 손실이 없습니다. 또한 하나의 서버에 여러개의 컨테이너를 실행하면 서로 영향을 미치지 않고 독립적으로 실행되어 마치 가벼운 VM을 사용하는 느낌을 줍니다.

**Docker 이미지는 컨테이너 실행에 필요한 파일과 설정값등을 포함하고 있는 것으로 상태값을 가지지 않고 변하지 않습니다.** 컨테이너는 이미지를 실행한 상태라고 볼 수 있고 추가되거나 변하는 값은 컨테이너에 저장됩니다. 말그대로 이미지는 컨테이너를 실행하기 위한 모든 정보를 가지고 있기 때문에 더이상 의존성 파일을 컴파일하고 이것저것 설치할 필요가 없습니다. 도커 이미지는 Docker hub에 등록하거나 Docker Registry 저장소를 직접 만들어 관리할 수 있습니다.

**Docker는 `Dockerfile`라는 파일에 자체 DSL언어를 이용해 이미지 생성과정을 적습니다.**

**Docker는 Docker Hub를 통해 공개 image를 무료로 관리해줍니다.**



[Docker 설치과정](https://docs.docker.com/install/linux/docker-ce/ubuntu/)은 생략하겠습니다.

(설치과정 참고: django_deployment3.md 설치하고 컨테이너 실행하기)



#### `Dockerfile` 생성

이제 우리는 `Dockerfile`을 만들어보겠습니다.

toyproject 루트 폴더에 `Dockerfile`을 생성하고 아래 내용을 입력하세요.

```dockerfile
# python:3.7-slim에 사용하는걸 모두 쓰겠다.
FROM        python:3.7-slim
# RUN 마다 컨테이너 하나가 생긴다.
RUN         apt -y update && apt -y dist-upgrade && apt -y autoremove

# requirements를 /tmp에 복사 후, pip install실행
COPY        ./requirements.txt /tmp/
RUN         pip install -r /tmp/requirements.txt

# 소스코드 복사 후 runserver
COPY        . /srv/toyproject
# WORKDIR는 cd의 의미이다.
WORKDIR     /srv/toyproject/app
CMD         python manage.py runserver 0:8000
```



다음으로, pycharm에서 `plugin ignore`와 `GitToolBox` 설치하세요.

toyproject 루트 폴더에 `.dockerignore`를 생성하고 아래 내용을 입력해주세요.

```
/.git
/.media
/.static
/secrets.json
/deploy*.py
/deploy*.sh
```



Docker 설치 확인하기

```python
$ docker version
```



#### docker build & run 하기

bulid 명령으로 이제 docker image를 생성해봅시다. toyproject 폴더에서 실행해주세요.  `-t`는 `--tag`옵션으로 이미지 이름과 태그를 설정할 수 있습니다. 이미지 이름만 설정하면 태그는 latest로 설정됩니다. `-f`는 dockerfile 위치 설정입니다.

```python
$ docker build -t toyproject -f Dockerfile .
$ docker run --rm -it -p 8001:8000 instagram
```



> **만약 image가 잘못 만들어졌다면?**
>
> 만들어진 docker image 확인하기
>
> ```
> docker images
> ```
>
> docker image를 지우는 코드
>
> ```
> docker rmi [REPOSITORY]
> ```
>



#### secrets.json 생성하고 docker랑 연결하기

아직 hub.docker에 push하지 않았습니다.

현재 우리는 toyproject 안에 settings.py에 숨겨야 할 정보를 아직 숨기지 않았기 때문입니다. 

우선 Docker Image에 SECRET 값을 넣지 않기 위해 secrets.json을 루트 폴더에 만들고 settings.py에 불러오는 작업을 진행해보겠습니다.



루트폴더에 `secrets.json` 파일을 생성하고 아래와 같은 json 형식으로 입력해주세요.

```json
{
    "SECRET_KEY" : "각자 Settings.py에 적힌 것을 입력하세요"
}
```



settings.py에 아래 내용을 추가 및 수정해봅시다.

```python
# settings.py
# secrets.json파일이 ROOT_DIR에 있는 경우

ROOT_DIR = os.path.dirname(BASE_DIR)

# secrets.json 파일을 읽어옵니다.
import json
secrets_path = os.path.join(ROOT_DIR, 'secrets.json')
json_data = json.load(open(secrets_path))

# 사용하고자 하는 곳에 아래와 같이 코드를 입력합니다.
# 아래 코드는 SECERT_KEY 값에 secrets.json에 SECERT_KEY 키값을 넣음
SECRET_KEY = json_data['SECERT_KEY']
```



toyproject 루트 폴더에`docker-run-secret.py`를 생성한 뒤 docker image에 secrets.json이 들어가지 않도록 아래 내용을 작성해봅시다.

```python
#!/usr/bin/env python
import subprocess

DOCKER_OPTIONS = [
    ('--rm', ''),
    ('-it', ''),
    ('-d', ''),
    ('-p', '8001:8000'),
    ('--name', 'toyproject'),
]
DOCKER_IMAGE_TAG = 'devsuji/toyproject'

subprocess.run('poetry export -f requirements.txt > requirements.txt', shell=True)
subprocess.run(f'docker build -t {DOCKER_IMAGE_TAG} -f Dockerfile .', shell=True)
subprocess.run(f'docker stop toyproject', shell=True)

subprocess.run('docker run {options} {tag} /bin/bash'.format(
    options=' '.join([
        f'{key} {value}' for key, value in DOCKER_OPTIONS
    ]),
    tag=DOCKER_IMAGE_TAG,
), shell=True)

subprocess.run('docker cp secrets.json toyproject:/srv/toyproject', shell=True)

subprocess.run('docker exec -it toyproject /bin/bash', shell=True)
```

- 이 파일은 docker image를 만듭니다.

- 다음으로 docker 안에 secrets.json을 넣지 않고, `./docker-run-secrets.py`를 실행할 때 secrets.json을 넣어줍니다.

  > 실행 전 `chmod 744 docker-run-secrets.py` 로 해당 파일을 실행할 수 있도록 만들어줘야합니다.

- 그런 다음 내부에서 `./manage.py runserver 0:8000`을 해주면 `localhost:8001`에 접근 시 정상적으로 출력된다. (`0:8000`에서 0은 모든 곳에서 연결할 수 있도록 해주는 것이다.)



#### docker login 하기

https://hub.docker.com/ 가입하고, create repository를 합니다.

Docker login을 진행합니다.

docker image를 만든 project 터미널에 아래 명령어를 입력하세요.

```python
$ docker login
# hub.docker.com에 가입한 id/pw 입력
# 권한에 문제가 발생한다고 나타나는 경우 명령어 앞에 sudo를 붙여 입력
```



#### docker hub에 push하기

https://hub.docker.com/ 에 create repository 후 터미널에서 아래 명령어를 입력하세요.

```python
$ docker push ID/reponame
```

(ID와 reponame은 hub.docker.com ID와 reponame 의미)

push가 완료되면 hub.docker.com의 해당 repository에 Tags가 업데이트 되었다는 것을 확인할 수 있습니다.



#### docker pull하기

이제 서버가 접속되어있는 터미널로 가서 해당 이미지를 pull 해옵시다.

```python
$ docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

pull이 완료되면 `docker images` 명령어를 통해 확인할 수 있습니다.



### gunicorn 적용하기

[현재 세팅되어 있는 형태]

```
EC2 - Container(80:8000) - (screen)runserver - Django
```

`EC2 - Container(80:80)`는 HTTP요청입니다. 실제 데이터보다 상대방 컴퓨터까지 가기 위한 데이터가 더 큽니다. `Django(web application)`는 외부에서 오는 요청에 대한 동적 응답을 생성합니다.



[바꾸려는 형태]

runserver는 성능이 안좋기 때문에 gunicorn으로 변경하고자 합니다.

```
EC2 - Container(80:8000) - gunicorn:8000 - Django
```



#### gunicorn은?

웹서버로 전달된 요청을 파이썬 애플리케이션에게 적절히 번역해서 전달하고, 반대로 파이썬 애플리케이션의 응답을 적절히 웹 서버에게 번역해서 전달합니다.



#### gunicorn 설치하기

toyproject 폴더에 아래 명령어를 실행해 gunicorn을 설치합니다.

```python
$ poetry add gunicorn
```



> (생략)필요한 package들을 poetry add로 설치합니다.
>
> ```
> $ poetry add 'django<3' boto3 django-extensions django-secrets-manager django-storages Pillow psycopg2-binary requests
> ```
>
> notebook은 --dev 옵션을 주어 추가합니다.
>
> ```
> $ poetry add notebook --dev
> ```



#### gunicorn file 생성하기

toyproject 루트 폴더에 `.config` 디렉터리를 생성한 뒤 `gunicorn.py`를 생성 한 뒤 아래 내용을 적어줍시다.

```python
daemon = False
cmdir = '/src/toyproject/app'
bind = 'unix:/run/toyproject.sock'
accesslog = '/var/log/gunicorn/toyproject-access.log'
errorlog = '/var/log/gunicorn/toyproject-error.log'
capture_output = True
```



#### gunicorn 사용하기

runserver의 동작을 gunicorn이 할 수 있습니다. toyproject/app 위치로 터미널을 이동한 후 아래 코드를 실행해봅시다.

```python
$ gunicorn -b 0:8000 config.wsgi
```

출력되는 Listening at: http://0.0.0.0:8000 클릭 시 잘 작동됨을 브라우저에서 확인할 수 있습니다. 



#### gunicorn과 nginx 연결하기

toyproject 루트 폴더에 `.config` 디렉터리에 `toyproject.nginx` 파일을 생성합시다.

```nginx
server {
    # 80번 포트로 온 요청에 응답할 Block임
    listen 80;

    # HTTP요청의 Host 값 (URL에 입력한 도메인)
    server_name localhost;

    # 인코딩 utf-8설정
    charset utf-8;

    # root로부터의 요청에 대해 응답할 Block
    location / {
        # /run/gunicorn.sock 파일을 사용해서 Gunicorn과 소켓 통신하는 Proxy 구성
        proxy_pass      http://unix:/run/toyproject.sock;
    }
}
```

> proxy_pass가 gunicorn이랑 연결하는 역할을 할 것 입니다.



이 파일을 nginx 폴더에 넘겨줘야 하기에 dockerfile을 수정해봅시다.

```dockerfile
# python:3.7-slim에 사용하는걸 모두 쓰겠다.
FROM        python:3.7-slim
# RUN 마다 컨테이너 하나가 생긴다.
RUN         apt -y update && apt -y dist-upgrade && apt -y autoremove
RUN         apt -y install nginx

# requirements를 /tmp에 복사 후, pip install실행
# 2. poetry export로 생성된 requirements.txt를 적절히 복사
COPY        ./requirements.txt /tmp/
RUN         pip install -r /tmp/requirements.txt

# 소스코드 복사 후 runserver
COPY        . /srv/toyproject
WORKDIR     /srv/toyproject/app

# nginx 설정파일 복사
RUN         cp /srv/toyproject/.config/toyproject.nginx /etc/nginx/sites-enabled/

CMD         python manage.py runserver 0:8000
```

> sites-enabled: nginx 설정 적는 폴더



아래 코드를 실행해 확인해봅시다.

```
$ ./deploy-run-secrets.py

$ cd /etc/nginx/sites-enabled/
$ ls
# default  toyproject.nginx
```



```
# secrets이 들어간 container를 연다
$ ./docker-run-secrets.py

# 새로운 터미널 창을 열어서 실행중인 container list 확인
# ps는 container list를 의미한다
$ docker ps

$ docker exec -it toyproject /bin/bash
# 내부에서 nginx / nginx -g 'daemon off;' 실행한다.
```

> - `nginx` : 백그라운드 모드로 실행됩니다.
>
> - `nginx -g 'daemon off;'` : Nginx를 Foreground모드로 실행



아래 순서로 실행해봅시다.

- `./docker-run-secrets.py`를 실행

- 내부에서 `nginx`를 입력합니다.

- `localhost:8001`로 접속 시 502 Bad Gateway가 출력됩니다.

  이는 nginx가 연결되었다는 것입니다. 이제 gunicorn을 연결해봅시다.

- `gunicorn -b unix:/run/toyproject.sock config.wsgi `를 입력합니다.

- `localhost:8001`로 접속 시 이제 우주선을 볼 수 있습니다.



자, 여기까지는 로컬에서의 작업입니다. 이제 서버에서도 실행될 수 있도록 파일을 새로 작성해보겠습니다.



#### 서버에서 gunicorn과 nginx가 작동하도록 하기

toyproject 폴더에 `deploy-docker-secrets.py`를 생성 후 아래 코드를 작성합니다.

```python
#!/usr/bin/env python

# 1. Host에서 이미지 build, push
# 2. EC2에서 이미지 pull, run(bash)
# 3. Host -> EC2 -> Container로 secrets.json전송
# 4. Container에서 runserver
import os
import subprocess
from pathlib import Path

DOCKER_IMAGE_TAG = 'devsuji/toyproject'
DOCKER_OPTIONS = [
    ('--rm', ''),
    ('-it', ''),
    # background로 실행하는 옵션 추가
    ('-d', ''),
    ('-p', '80:80'),
    ('-p', '443:443'),
    ('--name', 'toyproject'),

    # Let's Encrypt volume
    ('-v', '/etc/letsencrypt:/etc/letsencrypt'),
]
USER = 'ubuntu'
HOST = '13.124.94.217'
TARGET = f'{USER}@{HOST}'
HOME = str(Path.home())
IDENTITY_FILE = os.path.join(HOME, '.ssh', 'project.pem')
SOURCE = os.path.join(HOME, 'projects', 'wps12th', 'toyproject')
SECRETS_FILE = os.path.join(SOURCE, 'secrets.json')


def run(cmd, ignore_error=False):
    process = subprocess.run(cmd, shell=True)
    if not ignore_error:
        process.check_returncode()


def ssh_run(cmd, ignore_error=False):
    run(f"ssh -o StrictHostKeyChecking=no -i {IDENTITY_FILE} {TARGET} -C {cmd}", ignore_error=ignore_error)


# 1. 호스트에서 도커 이미지 build, push
def local_build_push():
    run(f'poetry export -f requirements.txt > requirements.txt')
    run(f'docker build -t {DOCKER_IMAGE_TAG} .')
    run(f'docker push {DOCKER_IMAGE_TAG}')


# 서버 초기설정
def server_init():
    ssh_run(f'sudo apt update')
    ssh_run(f'sudo DEBIAN_FRONTEND=noninteractive apt dist-upgrade -y')
    ssh_run(f'sudo apt -y install docker.io')


# 2. 실행중인 컨테이너 종료, pull, run
def server_pull_run():
    ssh_run(f'sudo docker stop toyproject', ignore_error=True)
    ssh_run(f'sudo docker pull {DOCKER_IMAGE_TAG}')
    ssh_run('sudo docker run {options} {tag} /bin/bash'.format(
        options=' '.join([
            f'{key} {value}' for key, value in DOCKER_OPTIONS
        ]),
        tag=DOCKER_IMAGE_TAG,
    ))


# 3. Host에서 EC2로 secrets.json을 전송, EC2에서 Container로 다시 전송
def copy_secrets():
    run(f'scp -i {IDENTITY_FILE} {SECRETS_FILE} {TARGET}:/tmp', ignore_error=True)
    ssh_run(f'sudo docker cp /tmp/secrets.json toyproject:/srv/toyproject')


# # 4. Container에서 runserver실행
# def server_runserver():
#     ssh_run(f'sudo docker exec -it -d instagram '
#             f'python /srv/instagram/app/manage.py runserver 0:8000')

# 4. Container에서 collectstatic, supervisor실행
def server_cmd():
    ssh_run(f'sudo docker exec toyproject /usr/sbin/nginx -s stop', ignore_error=True)
    ssh_run(f'sudo docker exec toyproject python manage.py collectstatic --noinput')
    ssh_run(f'sudo docker exec -it -d toyproject '
            f'supervisord -c /srv/toyproject/.config/supervisord.conf -n')

# 5. server run
def server_run():
     ssh_run(f'sudo docker exec -it toyproject python3 manage.py collectstatic --noinput')
     ssh_run('sudo docker run {options} {tag} /bin/bash'.format(
        options=' '.join([
            f'{key} {value}' for key, value in DOCKER_OPTIONS
        ]),
        tag=DOCKER_IMAGE_TAG,
    ))


if __name__ == '__main__':
    try:
        local_build_push()
        server_init()
        server_pull_run()
        copy_secrets()
        server_cmd()
        # server_runserver()
    except subprocess.CalledProcessError as e:
        print('deploy-docker-secrets Error!')
        print(' cmd:', e.cmd)
        print(' returncode:', e.returncode)
        print(' output:', e.output)
        print(' stdout:', e.stdout)
        print(' stderr:', e.stderr)
```



이제 실행하기 위해 파일의 권한을 바꾸고 실행해봅시다.

```python
$ chmod 744 deploy-docker-secrets.py
$ ./deploy-docker-secrets.py
```



`Dockerfile` 수정

```dockerfile
# python:3.7-slim에 사용하는걸 모두 쓰겠다.
FROM        python:3.7-slim
# RUN 마다 컨테이너 하나가 생긴다.
RUN         apt -y update && apt -y dist-upgrade && apt -y autoremove
RUN         apt -y install nginx

# requirements를 /tmp에 복사 후, pip install실행
# 2. poetry export로 생성된 requirements.txt를 적절히 복사
COPY        ./requirements.txt /tmp/
RUN         pip install -r /tmp/requirements.txt

# 소스코드 복사 후 runserver
COPY        . /srv/toyproject
WORKDIR     /srv/toyproject/app

# nginx 설정파일 복사
RUN         rm /etc/nginx/sites-enabled/default
RUN         cp /srv/toyproject/.config/toyproject.nginx /etc/nginx/sites-enabled/

# 로그폴더 생성
RUN     mkdir /var/log/gunicorn

#CMD         python manage.py runserver 0:8000

CMD         /bin/bash
```



`instagram.nginx` 수정

```nginx
server_name default_name;
```



project폴더에서 아래 코드 실행

```
./deploy-docker-secrets.py
```



서버에서 아래 코드 실행

```python
$ sudo docker exec -it toyproject /bin/bash
# 내부에서 아래코드 수행
$ nginx
$ gunicorn -b unix:run/toyproject.sock config.wsgi
```

하면 ip주소로 접속 시 실행됩니다.



#### supervisiord 설치

supervisiord를 이용하면 여러개의 프로세스를 한번에 붙잡아 놓고 실행할 수 있습니다.

```python
$ poetry add supervisord
```



#### supervisord 폴더 추가

supervisiord를 이용하면 여러개의 프로세스를 한번에 붙잡아 놓고 실행할 수 있습니다. toyproject 루트 폴더에 `.config` 디렉터리에 `supervisord.conf` 파일을 생성합시다.

```conf
[supervisord]
logfile=/var/log/supervisor.log
user=root

[program:nginx]
command=nginx -g "daemon off;"

[program:gunicorn]
command=gunicorn -c /srv/instagram/.config/gunicorn.py config.wsgi
```



### 도메인 연결하기



#### HTTPS SSL 설치하기

[우리가 해야할 일]

- let's encrypt에서 인증서 발급 받기
- 인증서와 공개키, 개인키를 Nginx가 사용하도록 설정
- 인증서 자동 갱신되도록 체제 갖추기

(AWS ACM을 사용하면 위 우리가 해야할 일을 모두 해결할 수 있다. 하지만 AWS ACM을 사용하지 않고 해보자.)



let's encrypt를 이용해 https에 필요한 인증서를 발급 받아봅시다.

let's encrypt는 인증서 발급 기관입니다. certbot 프로그램을 이용하면 쉽게 발급 가능하지만 용량이 큽니다.



#### 도메인 구입하기

저는 hosting.kr에서 도메인을 구입했습니다.



아래 절차로 진행하시면 됩니다.

- 회원가입 후 구매할 도메인을 검색하여 구매를 진행 (도메인 개인정보보호 서비스도 신청하는 것이 좋음)

- 구매가 완료되면 `나의 서비스 > 도메인 관리`에 들어가서 `네임서버 주소변경`을 체크하고 신청하기 버튼을 클릭
- 연결할 IP주소를 입력하고 `적용하기`를 클릭



이제 해당 ip로 접속합니다.

```python
$ ssh -i ~/.ssh/project.pem ubuntu@[IPv4 퍼블릭 IP]
```



내부에서 아래 코드를 입력합니다.

```python
$ sudo docker run --rm -it --name certbot -v '/etc/letsencrypt:/etc/letsencrypt' -v '/var/lib/letsencrypt:/var/lib/letsencrypt' certbot/certbot certonly -d 'rarlaj.com,www.rarlaj.com' --manual
```

이메일 입력(도메인 기한 다되면 연락받을 이메일을 물어봄) > A > N > Y (도메인의 소유주를 입증하겠는지 물어봄)



위 코드를 입력했다면 아래와 같이 데이터가 출력됩니다.

```
Create a file containing just this data:

LPfxSGJHNPPq0BPTeGIFXPvBtOKye28ZgjRamiorj6I.huCS1h54W6cs1JM57stOXCpEMWyrdBw6AN_8uYSvxMI

And make it available on your web server at this URL:

http://rarlaj.com/.well-known/acme-challenge/LPfxSGJHNPPq0BPTeGIFXPvBtOKye28ZgjRamiorj6I
```

- instagram에 `.cert` 폴더를 만들고 `./well-known/acme-challenge/` 뒤에 나오는 영어들을 파일명으로 만듭니다, 확장자는 txt로 합니다. 
- 해당 파일에 `LPfxSGJHNPPq0BPTeGIFXPvBtOKye28ZgjRamiorj6I.huCS1h54W6cs1JM57stOXCpEMWyrdBw6AN_8uYSvxMI` 내용을 넣어주고 저장합니다.



지금 내 경우에는 `rarlaj.com`과 `www.rarlaj.com`을 둘 다 등록해놓기로 해놨기 때문에 enter를 입력하면 똑같은 구문이 한번 더 나옵니다. 그 경우에도 위에서처럼 폴더를 만들어주면 됩니다.

enter를 누르라는 메세지가 나오는데 아래 과정을 더 수행해야하니 이후 작업부터는 새로운 터미널을 열어 작업해야합니다.



`instagram.nginx`로 가서 아래와 같이 수정해줍니다.

```python
server {
    # 80번 포트로 온 요청에 응답할 Block임
    listen 80;

    # HTTP요청의 Host 값 (URL에 입력한 도메인)
    server_name rarlaj.com www.rarlaj.com;

    # 인코딩 utf-8설정
    charset utf-8;

    # root로부터의 요청에 대해 응답할 Block
    location / {
        # /run/gunicorn.sock 파일을 사용해서 Gunicorn과 소켓 통신하는 Proxy 구성
        proxy_pass      http://unix:/run/instagram.sock;
    }

    # http://localhost/static
    location /static/ {
        alias           /srv/instagram/.static/;
    }

    location /.well-known/acme-challenge/ {
        alias           /srv/instagram/.cert/;
    }
}
```

> *alias* 는 특정 URL이 서빙할 파일 경로를 변경하는 역할을 합니다.



- ./docker-run-secrets.py 실행하기

```python
$ ./docker-run-secrets.py
```



- 위에 나왔던 데이터에 `localhost:8001/.well-known/acme-challenge/LPfxSGJHNPPq0BPTeGIFXPvBtOKye28ZgjRamiorj6I`로 접근해서 파일이 다운로드 되는지 확인하기



- 재배포하기

````
./deploy-docker-secrets.py
````



이제 다시 데이터가 출력된 터미널로 돌아가 enter를 입력합시다. 완료되었다는 메세지가 뜨면 자신이 설정한 도메인 주소에 접속하면 정상적으로 출력되어야 합니다. (rarlaj.com / www.rarlaj.com) 



- key가 잘 전달 되었는지 확인하기 위한 작업을 아래 코드를 실행해 진행해봅시다.

```python
$ sudo su
$ cd /etc/letsencrypt/live/도메인주소/
$ ls -al
# README  cert.pem  chain.pem  fullchain.pem  privkey.pem
```



- nginx 설정에 넣어줍니다.

```nginx
server {
    listen 80;
    server_name rarlaj.com www.rarlaj.com;
    charset utf-8;

    location /.well-known/acme-challenge/ {
        alias           /srv/instagram/.cert/;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
server{
    listen 443 ssl;
    server_name rarlaj.com www.rarlaj.com;
    charset utf-8;

    location / {
        proxy_pass      http://unix:/run/instagram.sock;
    }
    location /static/ {
        alias           /srv/instagram/.static/;
    }
}
```



Host(EC2)에 현재 SECURITY GROUP은 80(HTTP)과 22(SSH)만 되어있는데, 443(HTTPS) 포트도 추가해줘야 합니다.

현재 설정되어 있는 상태로는 CONTAINER는 80번 포트가 열려있고 80번 포트로 접근 시 HOST로 갔다가 컨테이너 안까지 갑니다. 22번 포트로 접근 시 HOST까지만 접근했었습니다.

nginx에서 우리는 80, 443 블럭을 나눠 요청을 분리했습니다. 80번 포트로 요청이 오면 gunicorn(socket) 443로 전달되고 연결될 경우 연결합니다. (도메인에 대해 80번으로 요청함 -> HTTPS로 RETURN 443으로 접근)



현재 인증서가 etc/letscrypto/live/domain에 있기 때문에 --volume으로 전달해 사용할 수 있도록 합니다.



- deploy-docker-secerts에 추가 (최종 코드)

```sh
#!/usr/bin/env python

# 1. Host에서 이미지 build, push
# 2. EC2에서 이미지 pull, run(bash)
# 3. Host -> EC2 -> Container로 secrets.json전송
# 4. Container에서 runserver
import os
import subprocess
from pathlib import Path

DOCKER_IMAGE_TAG = 'devsuji/wps-instagram'
DOCKER_OPTIONS = [
    ('--rm', ''),
    ('-it', ''),
    # background로 실행하는 옵션 추가
    ('-d', ''),
    ('-p', '80:80'),
    ('-p', '443:443'),
    ('--name', 'instagram'),

    # Let's Encrypt volume
    ('-v', '/etc/letsencrypt:/etc/letsencrypt'),
]
USER = 'ubuntu'
HOST = '13.125.12.122'
TARGET = f'{USER}@{HOST}'
HOME = str(Path.home())
IDENTITY_FILE = os.path.join(HOME, '.ssh', 'wps12th.pem')
SOURCE = os.path.join(HOME, 'projects', 'wps12th', 'instagram')
SECRETS_FILE = os.path.join(SOURCE, 'secrets.json')


def run(cmd, ignore_error=False):
    process = subprocess.run(cmd, shell=True)
    if not ignore_error:
        process.check_returncode()


def ssh_run(cmd, ignore_error=False):
    run(f"ssh -o StrictHostKeyChecking=no -i {IDENTITY_FILE} {TARGET} -C {cmd}", ignore_error=ignore_error)


# 1. 호스트에서 도커 이미지 build, push
def local_build_push():
    run(f'poetry export -f requirements.txt > requirements.txt')
    run(f'docker build -t {DOCKER_IMAGE_TAG} .')
    run(f'docker push {DOCKER_IMAGE_TAG}')


# 서버 초기설정
def server_init():
    ssh_run(f'sudo apt update')
    ssh_run(f'sudo DEBIAN_FRONTEND=noninteractive apt dist-upgrade -y')
    ssh_run(f'sudo apt -y install docker.io')


# 2. 실행중인 컨테이너 종료, pull, run
def server_pull_run():
    ssh_run(f'sudo docker stop instagram', ignore_error=True)
    ssh_run(f'sudo docker pull {DOCKER_IMAGE_TAG}')
    ssh_run('sudo docker run {options} {tag} /bin/bash'.format(
        options=' '.join([
            f'{key} {value}' for key, value in DOCKER_OPTIONS
        ]),
        tag=DOCKER_IMAGE_TAG,
    ))


# 3. Host에서 EC2로 secrets.json을 전송, EC2에서 Container로 다시 전송
def copy_secrets():
    run(f'scp -i {IDENTITY_FILE} {SECRETS_FILE} {TARGET}:/tmp', ignore_error=True)
    ssh_run(f'sudo docker cp /tmp/secrets.json instagram:/srv/instagram')


# Container에서 runserver실행
# def server_runserver():
#     ssh_run(f'sudo docker exec -it -d instagram '
#             f'python /srv/instagram/app/manage.py runserver 0:8000')

# 4. Container에서 collectstatic, supervisor실행
def server_cmd():
    ssh_run(f'sudo docker exec instagram /usr/sbin/nginx -s stop', ignore_error=True)
    ssh_run(f'sudo docker exec instagram python manage.py collectstatic --noinput')
    ssh_run(f'sudo docker exec -it -d instagram '
            f'supervisord -c /srv/instagram/.config/supervisord.conf -n')

if __name__ == '__main__':
    try:
        local_build_push()
        server_init()
        server_pull_run()
        copy_secrets()
        server_cmd()
    except subprocess.CalledProcessError as e:
        print('deploy-docker-secrets Error!')
        print(' cmd:', e.cmd)
        print(' returncode:', e.returncode)
        print(' output:', e.output)
        print(' stdout:', e.stdout)
        print(' stderr:', e.stderr)
```



- nginx ssl 설정을 추가합니다

```nginx
server{
    listen 443 ssl;
    server_name rarlaj.com www.rarlaj.com;
    charset utf-8;

    # https 관련 설정
    ssl on;
    ssl_certificate     /etc/letsencrypt/live/rarlaj.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rarlaj.com/privkey.pem;

    location / {
        # 일반적으로 proxy로 요청을 넘겨줄 경우 필요한 설정들
        include         /etc/nginx/proxy_params;
        proxy_pass      http://unix:/run/instagram.sock;
    }
    location /static/ {
        alias           /srv/instagram/.static/;
    }
}
```



- AWS에 접속하여 EC2 > 보안그룹편집 > 인바운드 규칙 > 편집해서 https 추가



- 다시 배포합니다.

```
./deploy-docker-secrets.py
```



이제 작업이 완료되었습다. 다만 아래 코드를 입력해서 인증서 갱신을 하도록 합시다. letsencrypt는 3개월만 유효하기 때문입니다.

```
sudo docker run --rm -it --name certbot -v '/etc/letsencrypt:/etc/letsencrypt' -v '/var/lib/letsencrypt:/var/lib/letsencrypt' certbot/certbot renew --manual
```



위 코드를 매번 입력하기 번거로우니 `crontab -e` 명령어를 실행한 뒤 아래 코드를 입력해서 인증서 갱신을 하도록 합시다.

```
0 0 * * * sudo docker run --rm -it --name certbot -v '/etc/letsencrypt:/etc/letsencrypt' -v '/var/lib/letsencrypt:/var/lib/letsencrypt' certbot/certbot renew --manual
```



