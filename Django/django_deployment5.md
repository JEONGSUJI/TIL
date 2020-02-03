# AWS Secrets Manager



## AWS SECRETS MANAGER란?

[AWS SECRETS MANAGER](https://aws.amazon.com/ko/secrets-manager/)는 데이터베이스 자격 증명, API KEY 및 기타 보안정보를 손쉽게 교체, 관리 및 검색할 수 있는 서비스이다.



- `새 보안 암호 저장`버튼 클릭
- 보안 암호 유형 선택: `다른 유형의 보안 암호` 선택
- 일반 텍스트를 선택하고 JSON 형태로 암호화하고자 하는 항목을 입력한다.

```json
{
	instagram: {
		"client_id": ["client_id"]
	}
}
```

- `다음`버튼 클릭 후 보안 암호 이름 입력 (**중요! 기억해야 할 정보**)
- `다음`버튼 > `다음`버튼을 클릭해 생성완료하기

> 강사님께서 SECRET MANAGER를 쉽게 사용할 수 있는 라이브러리를 개발하셨다고 함 [참고사이트](https://github.com/LeeHanYeong/django-secrets-manager)



### AWS IAM

- 사용자 추가
- WPS_SecretManager
- 프로그래밍 방식 엑세스
- 기존정책: Secretsmanager
- 비밀엑세스키 저장



### django-secrets-manager 설치

```python
$ pip install django-secrets-manager
```

```python
# settings.py
from django_secrets import SECRETS
AWS_SECRETS_MANAGER_SECRETS_NAME = 'wps'
AWS_SECRETS_MANAGER_SECRETS_SECTION = 'instagram'
AWS_SECRETS_MANAGER_REGION_NAME = 'ap-northeast-2'
AWS_SECRETS_MANAGER_PROFILE = 'wps-secrets-manager'
```

```python
# AWS_ACCESS_KEY_ID = json_data['AWS_ACCESS_KEY_ID'] 이 코드를
AWS_ACCESS_KEY_ID = SECRETS['AWS_ACCESS_KEY_ID']
```



> **[옛날 방식으로 배포하는 방법]**
>
> requirements 폴더를 만들고, requirements.txt 파일 내부에 base, dev, productions로 구분한 뒤 실행



Django가 동작하려면 secret값이 필요하다. 하지만 secret 값은 AWS에 있는 상황인데, 어떻게 Django에 secret 값을 전달할 것인가?

AWS와 Python을 연결해주는 것 중에는 **boto3**가 있다. (`AWS(S3, EC2, SecretsManager(client)) - boto3 - Python`)

**boto3**는 AWS를 Python에서 쓸 수 있게 도와주는 라이브러리이다.



- 로컬 시스템의 다음 위치에 있는 AWS 자격 증명 프로필 파일에서 자격증명을 설정한다.

```python
# Linux, macOS, Unix
$ mkdir ~/.aws
```

```python
# /.aws/config

[default]
region = ap-northeast-2
output = json
```

```python
# /.aws/credentials

[wps-secret]
aws_access_key_id = 'aws_access_key_id'
aws_secret_access_key = 'aws_secret_access_key'
```



### [ jupyter notebook으로 테스트 하기 ]

```python
import boto3

secret_name = 'wps'
region_name = 'ap-northeast-2'

# access_key_id, secret_access_key를 이용한 Session 생성
session = boto3.session.Session(
    aws_access_key_id=[aws_access_key_id]
    aws_secret_access_key=[aws_secret_access_key]
    region_name=region_name,
)

# profile을 아용한 session 생성
session = boto3.session.Session(
    profile_name='wps-secrets-manager',
    region_name=region_name,
)

# secretmanager를 사용하기 위한 Client생성
client = session.client(
    service_name='secretsmanager',
    region_name=region_name,
)

client.get_secret_value(SecretId='wps')
client.get_secret_value(SecretId='wps')['SecretString']

import json
secret_string = client.get_secret_value(SecretId='wps')['SecretString']
secerts = json.loads(secret_string)
secerts = secerts_data['instagram']
secerts['AWS_ACCESS_KEY_ID']
```



### settings.py 수정

이제 위 내용을 바탕으로 settings.py를 수정해보자.

```python
# settings.py

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



### 환경변수로 secret 값 처리하기

```python
$ export AWS_SECRET_ACCESS_KEY=[AWS_SECRET_ACCESS_KEY]
$ export AWS_ACCESS_KEY_ID=[AWS_ACCESS_KEY_ID]
```

```python
import os
a = os.environ['AWS_ACCESS_KEY_ID']
print(a)
```

```python
import boto3

session = boto3.session.Session()
client = boto3.client(
    service_name='secretsmanager',
    region_name='ap-northeast-2'
)
```

```python
client.get_secret_value(SecretId='wps')
```

```python
# 로컬의 aws profile을 전달
scp -q -i "${IDENTITY_FILE}" -r "$HOME/.aws" ${HOST}:/home/ubuntu
```



#### [작업 요약]

- 내 컴퓨터에 Key를 저장해놓았다. 이 Key가 있어야만 Secret 값을 불러올 수 있다.
- EC2를 생성했다. EC2 영역 뿐 아니라 이 안에서 docker container를 또 켰다.
- docker에서 요청할 때 80번 port 들어온 것을 8000번 port로 container에 보낸다.
- container에서 run할 때 Secret 값이 필요하다. 그러려면 PC에 있는 Key가 필요하기 때문에 전달해줘야한다.
- EC2안에 runserver없이 container만 생성한다. bin/bash로 PC Key 값을 EC2로 전달한다. (SCP 명령어로 전달한다.)
- 이제 container에 넣어야 한다. (EC2 -> docker container) `docker cp` 명령어로 전달한다.
- container 8000 runserver 실행하기
- 이미 bash 실행중이니까 `${SSH_CMD} -C "screen -r docker -X stuff 'sudo docker run --rm -it -p 80:8000 --name=instagram devsuji'"` 해서 run

