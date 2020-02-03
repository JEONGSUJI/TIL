# RDS, S3, IAM을 활용한 이미지 파일 보존

이전 django_deployment의 방법은 이미지 파일과 같은 사용자가 올린 정보가 보존되지 않는다는 문제가 있었다.

이 문제는 django에 config > settings.py에 기본적으로 DATABASE 정보가 설정되어있는데 현재는 sqlite라는 단일 파일이 생성되어 관리됨을 알 수 있다.

장고에서 기본 설정으로 sqlite를 사용하는 이유는 별도의 설정이 불필요하기 때문이다. 실제로 우리가 서비스를 한다면 설치형 데이터베이스를 사용하게 된다.



## 데이터 베이스 세팅

위 문제를 해결하기 위해 데이터 베이스를 공유해야한다.  데이터베이스 서버를 따로 둬야 한다.



| Django    | 역할      | AWS  |
| --------- | --------- | ---- |
| runserver | WebServer | EC2  |
| sqlite    | DB        | RDS  |
| storage   | 저장소    | S3   |

DB를 밖으로 꺼내야한다. 따라서 AWS에 RDS를 사용해보자.



## RDS

RDS는 EC2 위에서 돌아간다. 이것도 1년동안 정해진 용량이 무료이다.

사라지면 큰일나기 때문에 RDS를 프리티어로 사용해도 데이터가 일정 백업되고, 데이터 베이스를 지역을 나눠서 하는 것도 서비스가 된다.

> 참고 사이트: https://console.aws.amazon.com/rds/



### RDS 생성하기

- `데이터베이스 생성` 버튼 클릭
- 엔진 옵션 `PostgreSQL` 클릭
- 템플릿 `프리 티어` 선택
- 설정 `DB 인스턴스 식별자`, `마스터 사용자 이름`, `마스터 암호`, `암호 확인`을 적절히 입력한다.

(마스터 사용자 이름, 마스터 암호는 잊어버리면 안되니 잘 기억하자!)

- `데이터베이스 생성` 버튼 클릭



### PostgreSQL 설치

이제 `PostgreSQL`을 기본 DB로 사용하기 위해 local에 `PostgreSQL`을 설치해야 한다.

```python
$ sudo apt install postgresql-client
$ psql # could not connect to server Error가 뜬다.
```



### PostgreSQL 5432 포트 설정

- AWS EC2에서 `네트워크 및 보안` > `보안그룹`
- `보안 그룹 생성` 버튼 클릭

- 보안 그룹 이름 `RDS SecurityGroup` / 설명 `RDS SecurityGroup`입력
- `규칙 추가` 버튼 클릭 유형: PostgreSQl / 소스: 위치무관 선택



### RDS 보안그룹 수정

- 생성했던 RDS를 클릭한다.
- 내부 오른쪽 상단에 `수정` 버튼을 클릭한다.
- 네트워크 및 보안 내 보안그룹을 기존 default를 지우고, 위에서 생성한 `RDS SecurityGroup`를 선택한다.
- 퍼블릭 액세스 가능성 `예`로 변경한다.
- `계속` 버튼을 클릭하고 `즉시 적용`체크 후 저장한다.



### psql로 RDS에 접근하기

```python
$ psql --host=[퍼블릭 DNS(IPv4)] --username=[마스터 사용자 이름] --dbname=postgres
```

password로 `마스터 암호`를 입력한다.



```python
$ CREATE DATABASE instagram OWNER=jsj TEMPLATE template0 LC_COLLATE 'C';
```

ORDERING이 제대로 되게 하기 위해서 위 조건을 추가한다.



### psyconpg2 라이브러리 설치

기본적으로 Django랑 postgreSQL을 연결하는 라이브러리를 설치해야한다. Django에서 PostgreSQL을 가려면 psyconpg2가 연결해주는 역할을 한다.

```
Django ORM -> SQL -> Python -> psyconpg2 -> PostgreSQL
```



```python
$ pip install psycopg2-binary
```

```python
$ ./manage.py migrate
$ ./manage.py makemigrations
$ ./manage.py createsuperuser
$ ./manage.py runserver
```



### settings.py 설정 변경

이제 instagram project에 pycharm을 열고 기본적으로 설정되어있는 DATABASES 설정을 변경해야한다.

```python
# config > settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': '[DB 인스턴스 식별자]',
        'USER': '[마스터 사용자 이름]',
        'PASSWORD': '[마스터 암호]',
        'HOST': '[퍼블릭 DNS(IPv4)]',
        'PORT':'5432',
    }
}
```



이제 Instagram을 실행하고 login하고 포스트 추가하기

```
$ pip freeze > requirements.txt
```



```
./deploy.sh
```



이제 server에서 local에서 각각 post를 올려보자.

local에서 올리면 server에서 올린 이미지는 깨지고, server에서 올리면 local에서 올린 이미지가 깨진다. 이것은 정상적인 작동이다. 현재는 media 폴더를 참조하도록 되어있기 때문이다.



그러면 media 폴더에서 이미지 참조해서 storage-FileSystem를 S3로 보내야한다.



### S3 버킷 만들기

https://console.aws.amazon.com/s3/home

버킷이 하나의 저장소 역할을 한다.

- `버킷 만들기` 버튼 클릭

- 버킷 이름 입력하고 다음을 클릭하고 생성한다.

  

Django에 Managing files 문서를 찾아보면 MEDIA_ROOT와 MEDIA_URL 설정을 어떻게 해야할지 알 수 있다.

https://docs.djangoproject.com/en/3.0/topics/files/imageFIle



기본적으로 Django는 **FileSystem**을 사용했다.

우리가 instagram에서 했던 방식은 아래 4가지를 변경했다.

- MEDIA_URL
- MEDIA_ROOT
- config.urls
- django.conf.urls.static() import static



하지만 우리가 지금 원하는 것은 저장소로 **S3**를 사용하고 싶다.

> S3: Simple Storage Service의 약자



> **내구성과 가용성**
>
> 내구성: 한번 올려놓은 자료를 잃어버리지 않을 가능성을 의미한다. (AWS는 세군데에 나눠서 저장하기 때문에 잃어버릴리가 없다.)
>
> 가용성: 24시간 접근할 수 있는 것을 말한다.



> Python 기본 FileSystem / python에서 file을 연다.
>
> ```python
> f = open('경로')
> f.read()
> f.close()
> ```
>
> Cloud 서비스
>
> ```python
> from dropbox import d_open
> f = d_open('경로') # 경로 : 클라우드 드라이브의 경로
> response = f.read() # requests 사용한다던가하여, http요청에 대해 응답을 가져와 파일 객체처럼 취급할 수 있게 하기
> File객체 (DropboxSystemStorage가 제공하는 Python의 File 사용법과 매우 유사한 객체)
> ```
>
> Django 기본
>
> ```python
> f = FileSystemStorage.open('경로')
> f.read()
> f.close()
> f -> File객체 (FileSystemStorage가 제공하는 Python의 File사용법과 매우 유사한 객체)
> ```



>  참고 사이트 
>
> - https://docs.djangoproject.com/en/3.0/topics/files/#storage-objects
> - https://www.dropbox.com/developers/documentation/http/documentation#file_requests-get
> - https://django-storages.readthedocs.io/en/latest/



### django-storages

위 부연설명을 이제 마치고 진짜 django-storages를 설정해보자.

```python
$ pip install django-storages
$ pip install boto3
```



Django FileStorage로 S3Boto3Storage(AWS의 S3)를 사용하기

```python
# config/settings.py

DEFAULT_FILE_STORAGE =  'storages.backends.s3boto3.S3BotoStorage'
AWS_ACCESS_KEY_ID = '[AWS_ACCESS_KEY_ID]'
AWS_SECRET_ACCESS_KEY = '[AWS_SECRET_ACCESS_KEY]'
AWS_STORAGE_BUCKET_NAME = '[AWS_STORAGE_BUCKET_NAME]'
AWS_AUTO_CREATE_BUCKET = True
```

우선 이를 생성하기 위해 IAM 설정이 필요하다.



### IAM

https://console.aws.amazon.com/iam/

AWS에서 IAM을 설정하자.

- `사용자 추가` 버튼 클릭
- 사용자 이름 설정 / 엑세스 설정 `프로그래밍 방식 엑세스` 체크 후 `다음`
- 권한 설정에 `기존 정책에 직접 연결` 선택 / 필터 `s3fullac` 입력해 나오는 결과물에 체크 후 `다음`
- 보이는 `엑세스 키 id`와 `비밀 엑세스 키`는 한번만 볼 수 있기 때문에 저장해놓기!

이제 생성한 엑세스 키 id, 비밀 엑세스 키를 위 config/settings.py에 추가하자.



### +. Python에서 json 파일 다루기

`AWS_ACCESS_KEY_ID`와 `AWS_SECRET_ACCESS_KEY`는 보안상 별도 폴더를 만들어 올린 뒤 가져오는 구조로 해야한다.  이를 위해 project에 별도의 json파일을 생성하고 해당 파일은 gitignore에 추가한 뒤 가져오는 구조로 만들어야 한다.



참고 사이트: https://devpouch.tistory.com/33



#### SECRET KEY

```python
import json
json.loads(json_str)
json_data = json.loads{json_str}
```



```python
# settings.py
# secrets.json파일이 ROOT_DIR에 있는 경우

import json
secrets_path = os.path.join(ROOT_DIR, 'secrets.json')
json_data = json.load(open(secrets_path))

# 사용하고자 하는 곳에
sample = json_data['json에 입력한 key값']
```



> **참고 사이트**
>
> https://docs.python.org/ko/3.9/library/json.html 의 load



> **Secret값을 저장하는 방법**
>
> - 저장하는 별도의 파일을 지정
>
>   - [참고사이트](https://github.com/LeeHanYeong/django-json-secrets)
>
> - 환경변수에 지정
>
>   - ```python
>     $ env
>     ```
>
>     를 터미널에 입력하면 컴퓨터에 저장된 환경변수를 알 수 있다.
>
>   - ```python
>     $ os.environ
>     ```
>
>     를 터미널에 입력하면 외부 환경변수 값을 가져올 수 있다.
>
> - 외부 서비스에 저장하고 API 호출
>
>   - AWS SECRET MANAGER
>   - [참고사이트](https://github.com/LeeHanYeong/django-secrets-manager)



---

#### +. AWS 보안그룹의 `인바운드`, `아웃바운드`, DJANGO `ALLOWED_HOST`

AWS 보안그룹에서 `인바운드`는 외부에서 들어오는 트래픽에서 동작한다. 요청을 보낸 사람의 IP를 기준으로 필터한다. Client의 IP가 `인바운드`의 허용범위내에 없으면 거부한다. `인바운드` 규칙이 없으면 아무것도 받지 않겠다고 하는 것이다.

`아웃바운드`는 특정 사이트에 못들어가게 하는 것이다. 예를들면 우리 사이트에서 특정 사이트로 가는 것을 막는 기능이다. (중국 IP차단을 인바운드 규칙을 통해서 한다고 한다.)

Django에서 `ALLOWED_HOST`는 들어온 요청을 Django에서 거를 수 있는 것이다. 요청을 받은 사람 쪽에서 발생한다. 보낸 사람이 어디에 보냈느냐를 기준으로 필터한다. 보낸 사람의 IP는 신경쓰지 않는다.

>  예시) Client -> (Request) -> EC2(IP: 142.1.1.1, Domain: lhy.kr, pby.kr)
>  -> Request에 HOST라는 값이 전달 됨
>  -> EC2에 도달하는 Request를 만들기 위해서는, 
> 		142.1.1.1로 요청
> 		lhy.kr로 요청 <- 이거만 허용
> 		pby.kr로 요청
> Django가 거부하므로, SecurityGroup의 Inbound는 이미 통과한 상태



한 컴퓨터에 도메인 여러개 가능하다.



>기타 링크
>
>- ln -s original destination 로 바로가기 링크 만들 수 있다.
>
>- lrwxrwxrwx에서 l은 링크이다.