# Nginx - gunicorn setting

단계 단계를 밟아나가보자. 우선 gunicorn까지 세팅해본 뒤 문제가 없으면 Nginx를 세팅해보자.



[현재 세팅]

```
EC2 - Container(80:8000) - (screen)runserver - Django
```

[바꾸려는 형태]

```
EC2 - Container(80:8000) - gunicorn:8000 - Django
```



## gunicorn

- WSGI, 웹서버가 가져온 요청을 번역하는 역할을 한다.
- runserver 역할을 할 수 있음
- 외부 input 하나만 처리



## Nginx

```
EC2 - Container(80:80) - Nginx:80 - gunicorn:unixSocket통신 - Django
```

- 여러 input 처리 가능

EC2 - Container(80:80)는 HTTP요청

실제 데이터보다 상대방 컴퓨터까지 가기 위한 데이터가 더 크다.



localhost - Container(80:80) - Nginx:80 - gunicorn:unixSocket통신 - Django 이게 되면 EC2랑도 됨

Nginx 80번 열려있음 / webserver / 외부에서 오는 요청을 어딘가로 전달 / 정적 컨텐츠 서빙 /

Gunicorn(WSGi)

웹서버로 전달된 요청을 파이썬 애플리케이션에게 적절히 번역해서 전달 -> 파이썬 애플리케이션의 응답을 적절히 웹 서버에게 번역해서 전달 / 웹서버 역할도 탑재하고 있다.

소켓이란? 동일한 호스트 운영체제에서 실행되는 프로세스간 데이터를 교환하기 위한 데이터 통신 엔드포인트

Django(web application)

외부에서 오는 요청에 대한 동적 응답을 생성

runserver는 성능이 안좋음





```
# Dockerfile
```

[gunicorn](https://gunicorn.org/)



```
$ pip install gunicorn
```



poetry를 사용해보자

```
poetry init
```

no / no / yes



.toml이라는 파일이 생성된다.

toml plugin 설치

```
poetry add 'django<3' boto3 django-extensions django-secrets-manager django-storages Pillow psycopg2-binary requests
```

```
poetry add notebook --dev
```



requirements 폴더 제거



deploy-docker.sh

```
# docker build
echo "docker build"
# 이 과정에서 poery export를 사용해서 requirements.txt 생성
# > dev 패키지는 설치하지 않도록 한다. (공식문서 또는 사용법 보기)

poetry export -f requirements.txt > requirements.txt
```



Dockerfile

```
# 2. poetry export로 생성된 requirements.txt를 적절히 복사
COPY        ./requirements.txt /tmp/
RUN         pip install -r /tmp/requirements.txt
```

[공식문서](https://python-poetry.org/docs/cli/#export)



poetry.lock은 정확한 버전이 기록

pyproject.toml 



```
poetry add gunicorn
```



```
poetry export -f requirements.txt  > requirements.txt
docker build -t devsuji/wps-instagram -f Dockerfile .

docker run --rm -it -p 8001:8000 --name instagram devsuji/wps-instagram /bin/bash

gunicorn
gunicorn config.wsgie
pip install awscli
aws configure --profile wps-secrets-manager
// 나는 없어서 각각 입력해줌
aws configure get aws_access_key_id --profile wps-secrets-manager
aws configure get aws_secret_access_key --profile wps-secrets-manager
```



```
docker run --rm -it -p 8001:8000 --name instagram \ --env AWS_SECRETS_MANAGER_ACCESS_KEY_ID=${aws configure get aws_access_key_id --profile wps-secrets-manager} \ --env AWS_SECRETS_MANAGER_SECRET_ACCESS_KEY=${aws configure get aws_secret_access_key --profile wps-secrets-manager} \ devsuji/wps-instagram
```

이 코드를 외울 수 없으니 



docker-run.py 생성

```python
#!/usr/bin/env python
import subprocess

# 외부 shell에서 실행한 결과를 변수에 할당
access_key = subprocess.run(
    'aws configure get aws_access_key_id --profile wps-secrets-manager',
    stdout=subprocess.PIPE,
    shell=True,
).stdout.decode('utf-8').strip()
secret_key = subprocess.run(
    'aws configure get aws_secret_access_key --profile wps-secrets-manager',
    stdout= subprocess.PIPE,
    shell=True,
).stdout.decode('utf-8').strip()

print(access_key)
print(secret_key)

DOCKER_OPTIONS = [
    ('--rm', ''),
    ('-it', ''),
    ('-p', '8001:8000'),
    ('--name', 'instagram'),
    ('--env', f'AWS_SECRETS_MANAGER_ACCESS_KEY_ID={access_key}'),
    ('--env', f'AWS_SECRETS_MANAGER_SECRET_ACCESS_KEY={secret_key}'),
]

subprocess.run('docker stop instagram', shell=True)
subprocess.run('docker run {options} devsuji/wps-instagram'.format(
    options=' '.join([
        f'{key} {value}'for key, value in DOCKER_OPTIONS
    ]),
),shell=True)
```



```
chmod 744 docker-run.py
./docker-run.py
```





---

secrets.json만 가지고 작업하기

```
#!/usr/bin/env python
import secrets
import subprocess
import json

from app.config import settings
JSON_FILE = settings.secret_file

SECRET = json.load(open(JSON_FILE))
access_key = SECRET['AWS_ACCESS_KEY_ID']
secret_key = SECRET['AWS_SECRET_ACCESS_KEY']
DOCKER_OPTIONS = [
    ('--rm', ''),
    ('-it', ''),
    ('-p', '8001:8000'),
    ('--name', 'instagram'),
    ('--env', f'AWS_ACCESS_KEY_ID={access_key}'),
    ('--env', f'AWS_SECRET_ACCESS_KEY={secret_key}'),
]
subprocess.run('docker stop instagram', shell=True)
subprocess.run('docker run {options} devsuji/wps-instagram'.format(
    options=' '.join([
        f'{key} {value}' for key, value in DOCKER_OPTIONS
    ]),
), shell=True)
```



---

복습하며 재정리하기



**[docker-run-secrets.py]**

- 이 파일은 docker image를 만들다. 다음으로 docker 안에 secrets.json을 넣지 않고, `./docker-run-secrets.py`를 실행할 때 secrets.json을 넣어준다.
- 다음 내부에서 `./manage.py runserver 0:8000`을 해주면 `localhost:8001`에 접근 시 정상적으로 출력된다.

`0:8000`에서 0은 모든 곳에서 연결할 수 있도록 해주는 것이다.

```python
#!/usr/bin/env python
import subprocess

DOCKER_OPTIONS = [
    ('--rm', ''),
    ('-it', ''),
    ('-d', ''),
    ('-p', '8001:8000'),
    ('--name', 'instagram'),
]
DOCKER_IMAGE_TAG = 'devsuji/wps-instagram'

subprocess.run(f'docker build -t {DOCKER_IMAGE_TAG} -f Dockerfile .', shell=True)
subprocess.run(f'docker stop instagram', shell=True)

subprocess.run('docker run {options} {tag} /bin/bash'.format(
    options=' '.join([
        f'{key} {value}' for key, value in DOCKER_OPTIONS
    ]),
    tag=DOCKER_IMAGE_TAG,
), shell=True)

subprocess.run('docker cp secrets.json instagram:/srv/instagram', shell=True)

subprocess.run('docker exec -it instagram /bin/bash', shell=True)
```



### gunicorn 사용하기

runserver의 동작을 gunicorn이 할 수 있다.

내부에서 아래 코드를 수행해준다.

```python
$ gunicorn -b 0:8000 config.wsgi
```

> -b : bind
>
> config.wsgi : config에 wsgi를 사용하겠다고 말하는 것



### gunicorn과 nginx 연결하기

[config / instagram.nginx]

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

> proxy_pass가 gunicorn이랑 연결하는 역할을 할 것이다.



이 파일을 nginx 폴더에 넘겨줘야 한다.

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

RUN         cp /srv/instagram/.config/instagram.nginx /etc/nginx/sites-enabled/

CMD         python manage.py runserver 0:8000
```

> sites-enabled: nginx 설정 적는 폴더



```python
$ ./deploy-run-secrets.py

$ cd /etc/nginx/sites-enabled/
$ ls
# default  instagram.nginx
```



```python
# secrets이 들어간 container를 연다
$ ./docker-run-secrets.py

# 새로운 터미널 창을 열어서 실행중인 container list 확인
# ps는 container list를 의미한다
$ docker ps

$ docker exec -it instagram /bin/bash
# 내부에서 nginx / nginx -g 'daemon off;' 실행한다.
```

`localhost:8001`로 접속 시 화면이 정상 출력됨

