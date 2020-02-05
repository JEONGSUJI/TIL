EC2



---

배포를 하려면 docker를 사용해야한다.

EC2는 의존성이 틀어질 수 있기 때문에, docker로 환경을 모두 저장하는 image를 만드는 방법 사용 



- Dockerfile 생성 후 아래 코드 작성

  image를 생성하는 것 (image가 있어야 여러개를 만들어 사용할 수 있음)

```dockerfile
FROM        python:3.7-slim

RUN         apt -y update && apt -y dist-upgrade && apt -y autoremove

# requirements를 /tmp에 복사 후, pip install실행
# 2. poetry export로 생성된 requirements.txt를 적절히 복사
COPY        ./requirements.txt /tmp/
RUN         pip install -r /tmp/requirements.txt

# 소스코드 복사 후 runserver
COPY        . /srv/instagram
WORKDIR     /srv/instagram/app
CMD         python manage.py runserver 0:8000
```



- image를 만든다.

```
docker build -t asd -f Dockerfile .
```

-t로 이름정하고, -f Dockerfile 파일위치



- container가 생성되어 해당 image를 실행한다.

```
docker run --rm -it asd
```



- docker안에 secret key를 가지고 있지 않으면서 실행되도록 처리

  환경변수로 처리

  ```python
  docker run --env asd=asd --rm -it devsuji/wps-instagram bin/bash
  ```

  위 코드를 실행하면 asd

  이는 이미지에 포함되지 않음

  환경변수는 run할 때 넣어준다.

  `local-docker.py`

  

 dockerignore에 secret.json을 넣고 실행



```
docker image
```



none을 지운다.

```
docker system prune
```



---

**[20/02/04]**

Host 내 secret.json을 image를 Container로 실행(image run) -> Host의 secrets.json 복사 -> runserver



이걸 EC2에서 하고 싶다면 Host에서 이미지 build, push하고 EC2에서 이미지 pull, run(bash) -> Host에서 EC2로 가서 Container로 secrets.json전송 -> Container에서 runserver



docker-run-secrets.py

```python
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
    ('-p', '80:8000'),
    ('--name', 'instagram'),
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


def ssh_run(cmd):
    run(f"ssh -o StrictHostKeyChecking=no -i {IDENTITY_FILE} {TARGET} -C {cmd}", ignore_error=ignore_error)


# 1. 호스트에서 도커 이미지 build, push
def local_build_push():
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
    run(f'scp -i -f {IDENTITY_FILE} {SECRETS_FILE} {TARGET}:/tmp', ignore_error=True)
    ssh_run(f'sudo docker cp /tmp/secrets.json instagram:/srv/instagram')


# 4. Container에서 runserver실행
def server_runserver():
    ssh_run(f'sudo docker exec -it -d instagram '
            f'python /srv/instagram/app/manage.py runserver 0:8000')


if __name__ == '__main__':
    try:
        local_build_push()
        server_init()
        server_pull_run()
        copy_secrets()
        server_runserver()
    except subprocess.CalledProcessError as e:
        print('deploy-docker-secrets Error!')
        print(' cmd:', e.cmd)
        print(' returncode:', e.returncode)
        print(' output:', e.output)
        print(' stdout:', e.stdout)
        print(' stderr:', e.stderr)
```



```
chmod 744 deploy-docker-secrets.py
```

```
sudo docker ps
```



1. 로컬
   - docker image build
   - docker image push
2.  EC2에서 우분투 초기 설정 및 도커 설치
   - apt update
   - apt upgrade
   - apt install docker.io
3. EC2에서 실행중인 컨테이너 종료, pull, run
   - docker stop
   - docker pull
   - docker run (bash)
4. 로컬의 secrets.json => EC2 => Container
   - scp로 로컬 -> EC2
   - docker cp로 ec2 -> container
5. ec2에서 실행중인 container 내부에 runserver명령을 전달
   - docker exec <Container name> <명령어>



joinc.co.kr/w/man/2/fork

반환값이 returncode로 들어온다.

---



로컬 Docker에서

docker run --rm -it -p 8001:8000 <이미지> /bin/bash

docker run --rm -it -p 8001:8000 devsuji/wps-instagram /bin/bash

gunicorn을 사용해서 외부의 8000번 포트와 장고를 연결시키기

gunicorn이 8000번 포트에서 동작하면서 (runserver역할) 

요청과 응답을 Django apllication을 통해 만들어줌

---

Host:8001 -> 80:Container -> Nginx:80 -> /run/instagram.sock -> config.wsgi (/srv/instagram/app)
Host -> Container -> WebServer -> WSGI -> Application
WSGI
	gunicorn -b /run/instagram.sock config.wsgi  (실행한곳: /srv/instagram/app/)
WebServer
	nginx -g "daemon off;" <- Nginx를 Foreground모드로 실행
		-> .config/instagram.conf를 Nginx가 읽을 수 있는 설정파일 모음이 있는곳으로 복사해줘야 함
instagram/
	app/ <- Root를 기준으로 config.wsgi
		config/
			wsgi.py
				application <- WSGI
config/wsgi.py
config.wsgi



---

0205



projects/

​	secrets.json <- gitignore

​	-> settings.py에서 불러와서 사용



secrets.json이 docker image에서도 제외해야한다.

-> .dockerignore에 해당 내용 저장



secrets.json이 없으면 runserver가 안된다. 그래서 넘겨줘야한다.



- runserver전에 Host와 Container를 킨다.

secrets.json이 없는 상태로 docker run으로 bash를 실행 -> background로 들어감 (docker image에 secrets.json이 포함되지 않게 하기 위함)

- secrets.json 전송
- bash 실행하여 이미 실행하고 있는 컨테이너에 exec를 사용하여 전달

docker-run-secerts.py

```python
#!/usr/bin/env python
import subprocess

DOCKER_OPTIONS = [
    ('--rm', ''),
    ('-it', ''),
    # background로 실행하는 옵션 추가
    ('-d', ''),
    ('-p', '8001:80'),
    ('--name', 'instagram'),
]
DOCKER_IMAGE_TAG = 'devsuji/wps-instagram'

# poetry export로 docker build시 사용할 requiremnets.txt 작성
subprocess.run(f'poetry export -f requirements.txt > requirements.txt', shell=True)

# secrets.json이 없는 이미지를 build
subprocess.run(f'docker build -t {DOCKER_IMAGE_TAG} -f Dockerfile .', shell=True)

# 이미 실행되고 있는 name-instagram인 container를 종료
subprocess.run(f'docker stop instagram', shell=True)

# secrets.json이 없는 이미지를 docker run으로 bash를 daemon(background)모드로 실행
subprocess.run('docker run {options} {tag} /bin/bash'.format(
    options=' '.join([
        f'{key} {value}' for key, value in DOCKER_OPTIONS
    ]),
    tag=DOCKER_IMAGE_TAG,
), shell=True)

# secrets.json을 name=instagram인 container에 전송
subprocess.run('docker cp secrets.json instagram:/srv/instagram', shell=True)

# 실행중인 name=instagram인 container에서 bash를 실행(foreground 모드)
subprocess.run('docker exec -it instagram /bin/bash', shell=True)
```



8001 응답 안함



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
        proxy_pass      http://unix:/run/instagram.sock;
    }
}
```

nginx가 처리할 것이다. nginx를 켜서 80번에 응답할 수 있도록 해줄 것이다.



내부에서 `nginx -g "daemon off"`로 실행

502 bad Gateway 에러가 출력된다.



socker은 한 컴퓨터 안에서 통신을 중계

socker을 이용해서 django랑 연결할 수 있는 wsgi인 gunicorn을 사용할 것이다.



더이상 명령어를 칠 수 없기에 터미널을 하나 더 켜줌 (-d때문)

gunicorn을 켜기

`docker ps` 해당 코드로 현재 실행되고있는 container를 확인

`docker exec -it instagram /bin/bash`

`gunicorn`코드로 gunicorn이 있는지 확인하자.

`gunicorn -b unix:/run/instagram.sock config.wsgi`

wsgi는 이미 django config안에 있었음

unix:/run/instagram.sock에 데이터가 들어오면 처리하겠다.



캐시를 지우면(shift+control+r) css가 안나온다. 안나오는게 맞음

config> uris.py에서 static은 runserver에서만 된다. 성능이 느리기 때문이다.



static file이 왜 그렇게 쓰이는지 알아보자.

runserver할 때 되었던 이유는 static file이 있는데가 굉장히 많음



site-packages에 설치된다. 여기도 static 폴더가 있다.

STATICFILES.DIRS에 있는 내용과 INSTALLED_APPS에 apps가 가진 static폴더 모두 포함이다. 그래서 성능이 매우 느리다.



이런 많은 static폴더를 nginx가 static을 한군데로 합친다.

그리곤 nginx에서 static/라고 요청이 오면 합친 곳으로 보낸다.

그래서 runserver에서만 지원한다.



모으는 작업을 해보자.



`./manage.py`하면 실행할 수 있는 명령어가 모두 출력됨



static에 collectstatic이 있다. 이게 그 static을 모으는 역할을해준다. 어딘지 모을것인지 설정해줘야한다.



settings.py에 아래 내용 추가

```python
# 각 application들의 static/폴더, STATICFILES_DIRS의 폴더들이 가진 정적파일들을 모을 폴더
STATIC_ROOT = os.path.join(ROOT_DIR, '.static')
```



gitignore에도 추가

```gitignore
/.static
```



`./manage.py collectstatic`실행



선택사항이지만 .dockerignore에 static 파일 추가

```
/.static
```

docker 빌드 과정에서 넣어주자.



아래 코드 실행

```
./docker-run-secrets.py
```



instagram.nginx

```
# http://localhost/static
location /static {
alias           /srv/instagram/.static/;
}
```



그래도 css 파일 경로를 들어가면 404 Not Found가 뜬다.



css 파일 경로 클릭 시 나오게 해보자.



collectstatic을 사용한다.

```python
docker exec -it intagram /bin/bash
./manage.py collectstatic
```



Dockerfile에 자동으로 collectstatic을 하도록 해주자.

```
RUN         python manage.py collectstatic --noinput-0
```

근데 secrets.json이 없어서 안되니까 패스



---

갑자기 파일정리..

docker-run-secerts.py

```
# ./docker-run-secrets.py <cmd> 뒤에 <cmd>내용을 docker run <cmd>처럼 실행해주기
# 지정하지 않으면 /bin/bash를 실행
```

python argparse를 참고



argparse_sample.py 파일 생성해 테스트

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("cmd", type=str, nargs=argparse.REMAINDER)
args = parser.parse_args()
print(args.cmd)
```



docker-run-secerts.py에 적용

```python
#!/usr/bin/env python

# 하는 일
# poetry export
# docker build
# docker stop
# docker run (bash, background mode)
# docker cp secrets.json
# docker run (bash)

# ./docker-run-secrets.py <cmd> 뒤에 <cmd>내용을 docker run <cmd>처럼 실행해주기
# 지정하지 않으면 /bin/bash를 실행
import subprocess
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("cmd", type=str, nargs=argparse.REMAINDER)
args = parser.parse_args()
print(args.cmd)

DOCKER_OPTIONS = [
    ('--rm', ''),
    ('-it', ''),
    # background로 실행하는 옵션 추가
    ('-d', ''),
    ('-p', '8001:80'),
    ('--name', 'instagram'),
]
DOCKER_IMAGE_TAG = 'devsuji/wps-instagram'

# poetry export로 docker build시 사용할 requiremnets.txt 작성
subprocess.run(f'poetry export -f requirements.txt > requirements.txt', shell=True)

# secrets.json이 없는 이미지를 build
subprocess.run(f'docker build -t {DOCKER_IMAGE_TAG} -f Dockerfile .', shell=True)

# 이미 실행되고 있는 name-instagram인 container를 종료
subprocess.run(f'docker stop instagram', shell=True)

# secrets.json이 없는 이미지를 docker run으로 bash를 daemon(background)모드로 실행
subprocess.run('docker run {options} {tag} /bin/bash'.format(
    options=' '.join([
        f'{key} {value}' for key, value in DOCKER_OPTIONS
    ]),
    tag=DOCKER_IMAGE_TAG,
), shell=True)

# secrets.json을 name=instagram인 container에 전송
subprocess.run('docker cp secrets.json instagram:/srv/instagram', shell=True)

# 실행중인 name=instagram인 container에서 bash를 실행(foreground 모드)
subprocess.run('docker exec -it instagram {cmd}'.format(
    cmd=' '.join(args.cmd) if args.cmd else '/bin/bash'
), shell=True)
```



secrets.json이 있어야만 실행되는 코드

```python
# collectstatic을 subprocess.run()을 사용해서 실행
subprocess.run('docker exec -it instagram python3 manage.py collectstatic --noinput', shell=True)
```

하고

```
./docker-run-secrets.py

gunicorn -b unix:/run/instagram.sock config.wsgi
nginx -g "daemon off;"
```

하면 캐시 지워도 css가 잘 나와야한다.



gunicorn과 nginx를 치지 말고 자동으로 되게 하자.

http://supervisord.org/



supervisiord를 이용하면 여러개의 프로세스를 한번에 붙잡아 놓고 실행할 수 있다.



File > Settings > Editor > File type > INI Config > *.conf 추가



.config / supervisord.conf 생성

```conf
[supervisord]
logfile=/var/log/supervisor.log
user=root

[program:nginx]
command=nginx -g "daemon off;"

[program:gunicorn]
command=gunicorn -b unix:/run/instagram.sock config.wsgi
```



```python
$ poetry add supervisor
```



```
supervisord -n
```

supervisord에서 실행하고 있는 코드 확인



```
supervisord -c ../.config/supervisord.conf -n
```

입력하면 http://localhost:8001/ 에서 화면이 잘 나옴



이제 ./docker-run-secrets.py만 실행해도 작동하도록 변경



docker-run-secerts.py

```python
#!/usr/bin/env python

# 하는 일
# poetry export
# docker build
# docker stop
# docker run (bash, background mode)
# docker cp secrets.json
# docker run (bash)

# ./docker-run-secrets.py <cmd> 뒤에 <cmd>내용을 docker run <cmd>처럼 실행해주기
# 지정하지 않으면 /bin/bash를 실행
import subprocess
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("cmd", type=str, nargs=argparse.REMAINDER)
args = parser.parse_args()
print(args.cmd)

DOCKER_OPTIONS = [
    ('--rm', ''),
    ('-it', ''),
    # background로 실행하는 옵션 추가
    ('-d', ''),
    ('-p', '8001:80'),
    ('--name', 'instagram'),
]
DOCKER_IMAGE_TAG = 'devsuji/wps-instagram'

# poetry export로 docker build시 사용할 requiremnets.txt 작성
subprocess.run(f'poetry export -f requirements.txt > requirements.txt', shell=True)

# secrets.json이 없는 이미지를 build
subprocess.run(f'docker build -t {DOCKER_IMAGE_TAG} -f Dockerfile .', shell=True)

# 이미 실행되고 있는 name-instagram인 container를 종료
subprocess.run(f'docker stop instagram', shell=True)

# secrets.json이 없는 이미지를 docker run으로 bash를 daemon(background)모드로 실행
subprocess.run('docker run {options} {tag} /bin/bash'.format(
    options=' '.join([
        f'{key} {value}' for key, value in DOCKER_OPTIONS
    ]),
    tag=DOCKER_IMAGE_TAG,
), shell=True)

# secrets.json을 name=instagram인 container에 전송
subprocess.run('docker cp secrets.json instagram:/srv/instagram', shell=True)

# collectstatic을 subprocess.run()을 사용해서 실행
subprocess.run('docker exec -it instagram python3 manage.py collectstatic --noinput', shell=True)

# 실행중인 name=instagram인 container에서 bash를 실행(foreground 모드)
subprocess.run('docker exec -it instagram {cmd}'.format(
    cmd=' '.join(args.cmd) if args.cmd else 'supervisord -c ../.config/supervisord.conf -n'
), shell=True)
```



gunicorn.py 생성

```
daemon = False
cmdir = '/src/instagram/app'
bind = 'unix:/run/instagram.sock'
accesslog = '/var/log/gunicorn/instagram-access.log'
errorlog = '/var/log/gunicorn/instagram-error.log'
capture_output = True
```

supervisord.conf 수정

```conf
[supervisord]
logfile=/var/log/supervisor.log
user=root

[program:nginx]
command=nginx -g "daemon off;"

[program:gunicorn]
command=gunicorn -c /srv/instagram/.config/gunicorn.py config.wsgi
```

Dockerfile 수정

```dockerfile
FROM        python:3.7-slim

RUN         apt -y update && apt -y dist-upgrade && apt -y autoremove
RUN         apt -y install nginx

# requirements를 /tmp에 복사 후, pip install실행
# 2. poetry export로 생성된 requirements.txt를 적절히 복사
COPY        ./requirements.txt /tmp/
RUN         pip install -r /tmp/requirements.txt

# 소스코드 복사 후 runserver
COPY        . /srv/instagram
WORKDIR     /srv/instagram/app

# nginx 설정파일 복사
RUN         cp /srv/instagram/.config/instagram.nginx /etc/nginx/sites-enabled/

# 로그폴더 생성
RUN     mkdir /var/log/gunicorn

# collectstatic
#RUN         python manage.py collectstatic --noinput

#CMD         python manage.py runserver 0:8000
CMD         /bin/bash
```



로컬에서 docker run하기 위해

1. docker build

   - poetry export
   - docker build

2. copy secrets

   - docker run (bash)
   - docker cp secrets.json

3. run

   - collectstatic

   - docker run (supervisor)



배포해서 run까지 하려면

1. (로컬) build, push
2. (서버) pull, run (bash)
3. (로컬) secrets를 서버로 copy
4. (서버) secrets를 container로 copy
5. (서버) run
   - collectstatic
   - docker run (supervisor)



중복되는 부분이 많아서 deploy-docker-secerts.pydp 5번만 수정하면 됨

```python
# 5. server run
def server_run():
    ssh_run(f'sudo docker exec -it instagram python3 manage.py collectstatic --noinput')
    ssh_run('sudo docker run {options} {tag} /bin/bash'.format(
        options=' '.join([
            f'{key} {value}' for key, value in DOCKER_OPTIONS
        ]),
        tag=DOCKER_IMAGE_TAG,
    ))
```





deploy-docker-secerts.py

```python
('-p', '80:80'),

...

# 4. Container에서 collectstatic, supervisor실행
def server_cmd():
    ssh_run(f'sudo docker exec instagram /usr/sbin/nginx -s stop', ignore_error=True)
    ssh_run(f'sudo docker exec instagram python manage.py collectstatic --noinput')
    ssh_run(f'sudo docker exec -it -d instagram '
            f'supervisord -c /srv/instagram/.config/supervisord.conf -n')
```



Dockerfile

```dockerfile
# nginx 설정파일 복사
RUN         rm /etc/nginx/sites-enabled/default
RUN         cp /srv/instagram/.config/instagram.nginx /etc/nginx/sites-enabled/
```



instagram.nginx

```nginx
server_name default_name;
```

