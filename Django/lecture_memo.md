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