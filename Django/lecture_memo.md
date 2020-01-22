**AWS**

인바운드는 외부에서 들어오는 트래픽에서 동작, 요청을 보낸 사람 쪽

인바운드 규칙이 없으면 아무것도 받지 않겠다고 하는 것이다.

아웃바운드는 특정 사이트에 못들어가게하는것, 우리 것에서 미국으로 가는 것은 제한하겠다 이런 기능

중국 ip 차단을 인바운드 규칙을 통해서 하기도 한다.

ALLOWED_HOSTS : 이 요청이 어디를 향해서 왔냐? Django까진 도달했지만 Django에서 거를 수 있다. 요청을 받은 사람 쪽

퍼블릭 DNS(IPv4)으로 접근할 수 있다.



ln -s original destination 로 바로가기 링크 만들 수 있다.

lrwxrwxrwx에서 l은 링크이다.

---



### 데이터 베이스 세팅

데이터베이스를 공유해야한다.

데이터베이스 서버를 따로 둔다.

현재는 우리 프로젝트 안에 모든 것이 포함되어있다.



Django

​	runserver		# webserver역할

​	sqlite				# DB역할



실제로는 이 두가지가 밖으로 나와야한다.



#### RDS

AWS라는 서비스 중 RDS를 사용해 DB를 밖으로 꺼낼 것이다.

RDS는 EC2 위에서 돌아간다. 이것도 1년동안 무료다.

https://console.aws.amazon.com/rds/



사라지면 큰일나서 프리티어로 써도 알아서 데이터가 백업된다. 데이터베이스를 지역을 나눠서 하는것도 서비스가 된다.



db인스턴스 > 데이터베이스 생성 > PostgreSQL

프리티어로 하기!

설정 : wps-jsj / 마스터 사용자 이름 마스터 암호는 절대 까먹지 말기



엔드포인트 및 포트

```python
# config > settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'instagram',
        'USER': 'wps',
        'PASSWORD: 'wjdtnwl',
        'HOST': 'wps-jsj.cem8vmssrn1f.ap-northeast-2.rds.amazonaws.com',
        'PORT':'5432',
    }
}
```

local에 postgresql 설치해야 한다.

```
$ sudo apt install postgresql-client
psql 치면 could not connect to server
```



psql로 rds에 접근하기

```
psql --host=wps-jsj.cem8vmssrn1f.ap-northeast-2.rds.amazonaws.com --username=jsj --dbname=postgres
```

접근이 안되는 이유는 5432 포트 설정이안됨



EC2로 돌아와서 보안그룹 생성 RDS SecurityGroup / PostgreSQl / 위치무관



DB 인스턴스 수정: wps-jsj

- 기존에 있던 보안그룹 제거하고 RDS SecurityGroup 설정

- 퍼블릭 액세스 가능성 `예`로 변경

- `계속`버튼 클릭 > `즉시적용` 체크 후 저장

```
$ psql --host=wps-jsj.cem8vmssrn1f.ap-northeast-2.rds.amazonaws.com --username=jsj --dbname=postgres
```

password: Jsuji1~

```
CREATE DATABASE instagram OWNER=jsj TEMPLATE template0 LC_COLLATE 'C';
```

ORDERING이 제대로 되게 하기 위해서 



```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'jsj',
        'USER': 'instagram',
        'PASSWORD': 'Jsuji192625!',
        'HOST': 'wps-jsj.cem8vmssrn1f.ap-northeast-2.rds.amazonaws.com',
        'PORT':'5432',
    }
}
```



기본적으로 장고랑 포스트그래를 연결하는 라이브러리를 설치해야함

```
Django ORM -> SQL -> Python -> psyconpg2 -> PostgreSQL
```

psyconpg2이 그 라이브러리임.



```
$ pip install psycopg2-binary
```

```
$ ./manage.py migrate
$ ./manage.py makemigrations
$ ./manage.py createsuperuser
$ ./manage.py runserver
```

그 다음 로그인 하고 포스트 추가하기



```
(wps-instagram-env) jungsuji@jungsuji:~/projects/wps12th/instagram$ pip freeze > requirements.txt
```



```
./deploy.sh
```



이제 server에서 local에서 각각 post를 올려보자.

그러면 media 폴더에서 이미지 참조해서



storage- FileSystem를 aws의 s3로 보내야함.

https://console.aws.amazon.com/s3/home

버킷만들기 -> 하나의 저장소 역할을 한다.



버킷이름 wps-instagram-jsj해서 만들기

https://docs.djangoproject.com/en/3.0/topics/files/



저장소로 FileSystem을 사용 

MEDIA_URL / MEDIA_ROOT / config.urls -> django.conf.urls.static() import static



우리가 원하는 건 저장소로 S3를 사용하고 싶다.

Simple Storage Service의 약자



내구성 : 한번 올려놓은 자료를 잃어버리지 않을 가능성

(세군데에 나눠서 저장해서 잃어버릴리가 없음)

가용성 : 24시간 접근할 수 있는 것



Managing files

https://docs.djangoproject.com/en/3.0/topics/files/



Python기본 FileSystem / python에서 file을 연다.

f = open('경로')

f.read()

f.close()



Cloud서비스

from dropbox import d_open

f = d_open('경로') <- 파일시스템의 경로가 아닌, 클라우드 드라이브의 경로

response = f.read() <- requests 사용한다던가 하여, http요청에 대해 응답을 가져와서 파일 객체처럼 취급할 수 있게 하기

File객체 (DropboxSystemStorage가 제공하는 Python의 File사용법과 매우 유사한 객체)



Django 기본

f = FileSystemStorage.open('경로')

f.read()

f.close()

f->File객체 (FileSystemStorage가 제공하는 Python의 File사용법과 매우 유사한 객체)

기본 탑재된 게



storage 역할

https://docs.djangoproject.com/en/3.0/topics/files/#storage-objects

```
>>> from django.core.files.base import ContentFile
>>> from django.core.files.storage import default_storage

>>> path = default_storage.save('path/to/file', ContentFile(b'new content'))
>>> path
'path/to/file'

>>> default_storage.size(path)
11
>>> default_storage.open(path).read()
b'new content'

>>> default_storage.delete(path)
>>> default_storage.exists(path)
False
```



https://www.dropbox.com/developers/documentation/http/documentation#file_requests-get

https://django-storages.readthedocs.io/en/latest/



```
pip install django-storages
pip install boto3
```

config/settings.py

```
# django-storages
# Django FileStorage로 S3Boto3Storage(AWS의 S3)를 사용
DEFAULT_FILE_STORAGE =  'storages.backends.s3boto3.S3BotoStorage'
AWS_ACCESS_KEY_ID = ''
AWS_SECRET_ACCESS_KEY = ''
AWS_STORAGE_BUCKET_NAME = 'wps-instagram-jsj'
```



USERNAME PASSWORD를 쓰면

이런 사용자가 있다는 것을 알수있다. 루트사용자

별도의 키를 만들고 S3만 접근(read/write)할 수 있도록 설정



https://console.aws.amazon.com/iam/

사용자추가

WPS_S3 / 액세스 유형  프로그래밍 방식 엑세스

기존정책에 직접 연결 검색: s3fullac

다음 저장 후

보이는 엑세스 키 id와 비밀 엑세스 키 는 한번만 볼 수 있기 때문에 저장해놓기 



해당 정보를 config/settings.py에 추가

```
DEFAULT_FILE_STORAGE =  'storages.backends.s3boto3.S3Boto3Storage'
AWS_ACCESS_KEY_ID = 'AKIA2OPSYRJP7N352TWY'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'wps-instagram-jsj'
AWS_S3_REGION_NAME = 'ap-northeast-2'
```



```
AWS_STORAGE_BUCKET_NAME = 'wps-instagram-jsj2'
AWS_AUTO_CREATE_BUCKET = True
```



JSON(Javascript Object Notation)



---

```
ssh -i ~/.ssh/wps12th.pem ubuntu@15.164.97.33
```

```
scp -i ~/.ssh/wps12th.pem -r instagram ubuntu@15.164.97.33:/home/ubuntu/projects
```

```
./deploy.sh
```





```
SecurityGroup의 Inbound
> 보낸사람의 IP를 기준으로 필터
Client(IP)
 -> SecurityGroup (Client의 IP가 Inbound의 허용범위내에 없으면 거부)
Django의 ALLOWED_HOSTS['lhy.kr']
> 보낸사람이 '어디에' 보냈느냐를 기준으로 필터 (보낸사람의 IP는 신경쓰지 않음)
Client -> (Request) -> EC2(IP: 142.1.1.1, Domain: lhy.kr, pby.kr)
 -> Request에 HOST라는 값이 전달 됨
 -> EC2에 도달하는 Request를 만들기 위해서는, 
		142.1.1.1로 요청
		lhy.kr로 요청 <- 이거만 허용
		pby.kr로 요청
Django가 거부하므로, SecurityGroup의 Inbound는 이미 통과한 상태
```

한 컴퓨터에 도메인 여러개가능

allowed 호스트 안적히면 거부하는 주체는 장고로 장고가  거부하는 것



db설정을 postgreSQL로 교체