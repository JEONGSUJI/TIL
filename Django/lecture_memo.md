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

