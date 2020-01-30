Dockerfile 최적화



plugin ignore와 GitToolBox 설치



.dockerignore 파일 생성

```
/.git
/.media
```



### poety

> https://lhy.kr/python-poetry

```
$ curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
```



Production(Deploy)

- django
- django-extensions
- django-storages
- Pillow
- psycopg2-binary
- requests



Dev (Production 추가)

- notebook



80 -> Host -> Container(Screen) -> Django

80 -> WebServer -> WSGI -> Django

​		(Nginx)		(gunicorn)





### aws secrets manager

https://github.com/LeeHanYeong/django-secrets-manager

보안 암호 생성

- 다른 유형의 암호

- 일반텍스트

  ```
  {
  	instagram:{
        "AWS_ACCESS_KEY_ID": "AKIA2OPSYRJP7N352TWY",
        "AWS_SECRET_ACCESS_KEY": "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",
        "client_id": "BSGbrKFgPs7p0wZLG3nY",
        "client_secret": "cy77SSUoKr",
        "DATABASES": {
          "default": {
              "ENGINE": "django.db.backends.postgresql",
              "NAME": "instagram",
              "USER": "jsj",
              "PASSWORD": "Jsuji192625!",
              "HOST": "wps-jsj.cem8vmssrn1f.ap-northeast-2.rds.amazonaws.com",
              "PORT":"5432"
          }
        }
      }
  }
  ```

- 다음
- 보안암호이름 (이것만 잘 기억하면된다.)
- 다음 / 다음

- sample code



### aws Iam

- 사용자 추가
- WPS_SecretsManager
- 프로그래밍 방식 엑세스
- 기존정책: Secretsmanager
- 비밀엑세스키 저장



home에서 `$mkdir ~/.aws`

```
$ vi config
```

```
[default]
region = ap-northeast-2
output = json
```

```
$ vi credentials
```

```
[wps-secrets-manager]
aws_access_key_id =
aws_secret_access_key =
```



base.txt

```
django-secrets-manager
```

```
pip install django-secrets-manager
```



```
// settings.py
from django_secrets import SECRETS
AWS_SECRETS_MANAGER_SECRETS_NAME = 'wps'
AWS_SECRETS_MANAGER_SECRETS_SECTION = 'instagram'
AWS_SECRETS_MANAGER_REGION_NAME = 'ap-northeast-2'
AWS_SECRETS_MANAGER_PROFILE = 'wps-secrets-manager'
```



이러면 

```
AWS_ACCESS_KEY_ID = json_data['AWS_ACCESS_KEY_ID']
```

이 코드를

```
AWS_ACCESS_KEY_ID = SECRETS['AWS_ACCESS_KEY_ID']
```

로 변경



boto3 : aws를 python에서 쓸 수 있게 도와주는 라이브러리



---

AWS



aws - boto3 - python

	- S3 / EC2 / SecretsManager => client
	- AccessKey, Secret - profile - `~/.aws/credentials`



```
import boto3

secret_name = 'wps'
region_name = 'ap-northeast-2'

# access_key_id, secret_access_key를 이용한 Session 생성
session = boto3.session.Session(
    aws_access_key_id='AKIA2OPSYRJP7N352TWY',
    aws_secret_access_key='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',
    region_name=region_name,
)

# profile을 아용한 session 생성
session = boto3.session.Session(
    profile_name='wps-secrets-manager',
    region_name=region_name,
)
```

```
# secretmanager를 사용하기 위한 Client생성
client = session.client(
    service_name='secretsmanager',
    region_name=region_name,
)
```

```
client.get_secret_value(SecretId='wps')
client.get_secret_value(SecretId='wps')['SecretString']
```

```
import json
secret_string = client.get_secret_value(SecretId='wps')['SecretString']
secerts = json.loads(secret_string)
secerts = secerts_data['instagram']
secerts
```

```
secerts['AWS_ACCESS_KEY_ID']
```



이제 jupyter에서 한 내용을 바탕으로 settings.py를 수정해보자

```
// settings.py
from django_secrets import SECRETS
AWS_SECRETS_MANAGER_SECRETS_NAME = 'wps'
AWS_SECRETS_MANAGER_SECRETS_SECTION = 'instagram'
AWS_SECRETS_MANAGER_REGION_NAME = 'ap-northeast-2'
AWS_SECRETS_MANAGER_PROFILE = 'wps-secrets-manager'

# django-secrets-manager의 SECRETS를 사용해서 비밀 값 할당

impoet boto3
region_name = 'ap-northeast-2'
session = boto.session.Session(
	profile_name='wps-secerts-manager',
	region_name=region_name,
)
client = session.client(
	servise_name='secretmanager',
	region_name=region_name,
)
secret_string = client.get_secret_value(SecretId='wps')['SecretString']
secerts = json.loads(secret_string)
secerts = secerts_data['instagram']

AWS_ACCESS_KEY_ID = SECRET['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = SECRET['AWS_SECRET_ACCESS_KEY']
```





---

환경변수

```
$ export AWS_SECRET_ACCESS_KEY=FSMr6m/AyVxvo6raE3Xvxp+boWFL6bgBsCaGw1Qq
$ export AWS_ACCESS_KEY_ID=AKIA2OPSYRJP7N352TWY
```

```
import os
a = os.environ['AWS_ACCESS_KEY_ID']
print(a)
```

```
import boto3

session = boto3.session.Session()
client = boto3.client(
    service_name='secretsmanager',
    region_name='ap-northeast-2'
)
```

```
client.get_secret_value(SecretId='wps')
```



```
# 로컬의 aws profile을 전달
scp -q -i "${IDENTITY_FILE}" -r "$HOME/.aws" ${HOST}:/home/ubuntu
```





---

장고가 동작을 하려면 시크릿 값이 필요하다.

시크릿 값이 지금 aws에 있는 상황

이걸 장고에서 어떻게 전달할 것인가



내 컴퓨터에는 키가 있다. 이 키가 있어야만 시크릿값을 불러올 수 있다. (profile / home폴더에 있었음)



문제는 ec2를 만들었는데, ec2 영역 뿐 아니라 이 안에서 docker container를 또 킨다.

여기에 요청할 때 80번 port 들어온걸 8000번 port으로 container에 보낸다.

container에서 run 할 때 시크릿이 필요한데, 그러려면 pc에 key가 필요하다.



- ec2안에 runserver없이 container만 생성 -> bin/bash

pc key값을 ec2로 전달 (SCP 명령어로 전달)



- 이제 container에 넣어야함 ec2 -> container (docker cp)

- container 8000 runserver 실행

이미 bash 실행 중이니까 `${SSH_CMD} -C "screen -r docker -X stuff 'sudo docker run --rm -it -p 80:8000 --name=instagram devsuji'"`해서 run



---

20/01/30

## Nginx - gunicorn setting

현재 세팅

EC2 - Container(80:8000) - (screen)runserver - Django 



바꾸려는 형태

EC2 - Container(80:8000) - gunicorn:8000 - Django

gunicorn은 WSGI, 웹서버가 가져온 요청을 번역

근데 얘도 runserver역할을 할 수 있음

외부 input 하나만 처리



EC2 - Container(80:80) - Nginx:80 - gunicorn:unixSocket통신 - Django

Nginx는 여러 input 처리 가능

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

