# 도메인 연결하기

Http는 `Com1 - HTTP:80 - Com2` 이런 식으로 연결이 되는데, 내용이 다 나와 보안에 취약하다.



## 암호화의 방식

<u>1) 대칭키 기법</u>

- 원문 -> 키 -> 암호문 / 암호문 -> 키 -> 원문

- 키가 노출되어 암호화 취약

<u>2) 공개키 / 개인키 기법</u>

- 원문 -> 공개키(암호화) -> 개인키(복호화) -> 원문 / 원문 -> 개인키(암호화) -> 공개키(복호화) -> 원문
- 개인키 : 절대로 노출되면 안됨  / 공개키 : 노출되도 상관없음

A가 B와 통신하고 싶다고 가정

1. A가 자신의 공개키를 HTTP를 사용해 B에게 보냄
2. B는 A에게 HTTP를 사용해 자신의 공개키를 보냄
3. A는 B에게 보낼 메세지를 B의 공개키를 사용해서 암호화하여 보냄
4. B는 받은 메세지를 자신의 "개인키"로 복호화해서 읽는다.

<u>3) 해싱</u>

- 단방향, 같은 입력에서 같은 hash값이 나오지만 한방향으로만 접근가능)



## HTTPS SSL 설치하기

HTTP에 `공개키/개인키`가 추가된 것이 HTTPS이다.

2019년 6월 1일 부터 SSL 보안인증서(개인정보 암호화)설치가 의무화 되었다. 따라서 개인정보를 취급하는 모든 웹사이트는 SSL을 설치하여 HTTPS 를 사용해야 한다.

우리는 [let's encrypt](https://letsencrypt.org/)를 이용할 것이다. `let's encrypt`는 무료로 인증서를 발급해주는 기관이다.



[우리가 해야할 일]

- let's encrypt에서 인증서 발급 받기
- 인증서와 공개키, 개인키를 Nginx가 사용하도록 설정
- 인증서 자동 갱신되도록 체제 갖추기

(AWS ACM을 사용하면 위 우리가 해야할 일을 모두 해결할 수 있다. 하지만 AWS ACM을 사용하지 않고 해보자.)



let's encrypt는 인증서 발급 기관이다. certbot 프로그램을 이용하면 쉽게 발급 가능하지만 용량이 크다.

방법은 두가지 이다. 직접 설치하거나 Docker를 사용해서 실행하는 것이다. Docker를 사용해 실행하면 인증서랑 개인키 공개키가 나온다. 이것들이 저장될 영역을 `--volume` 옵션에 추가하면 EC2에 남게된다.



Docker에 설치하면 container가 날라가면 날라가니까 `docker run --volume` 을 사용해서 Host의 특정 영역과 Container의 특정 영역과 공유하도록 만들자.

위 내용을 더 자세히 설명하자면 Host(EC2)가 있다. 인증서 폴더를 두 Container에 공유 `--volume`할 것이다. 

첫번째 Container에는 certbot을 키고, 두번째 Container에는 Nginx를 킬 것이다.

`--volume`을 통해 컨테이너간 통신은 없지만 인증서 폴더만 공유된다. 같은 파일을 공유하고 있는 개념이다.

(+ dockerhub에 certbot 이미지가 있어서 Container에 실행만해주면된다.)



### 도메인 구입

- 한글판이 편하다면 www.hosting.kr
- 영어 사이트도 괜찮고, 저렴한걸 원한다면 www.namecheap.com



(아래 내용은 www.hosting.kr 기준 설명입니다.)

- 회원가입 후 구매할 도메인을 검색하여 구매를 진행한다. (도메인 개인정보보호 서비스도 신청하는 것이 좋다.)

- 구매가 완료되면 `나의 서비스 > 도메인 관리`에 들어가서 `네임서버 주소변경`을 체크하고 신청하기 버튼을 클릭한다.
- 연결할 IP주소를 입력하고 `적용하기`를 클릭한다.



- 이제 해당 ip로 접속한다.

```python
$ ssh -i ~/.ssh/wps12th.pem ubuntu@[IPv4 퍼블릭 IP]
```



- 내부에서 아래 코드를 입력한다.

```python
$ sudo docker run --rm -it --name certbot -v '/etc/letsencrypt:/etc/letsencrypt' -v '/var/lib/letsencrypt:/var/lib/letsencrypt' certbot/certbot certonly -d 'rarlaj.com,www.rarlaj.com' --manual
```

이메일 입력(도메인 기한 다되면 연락받을 이메일을 물어봄) > A > N > Y (도메인의 소유주를 입증하겠는지 물어봄)



```python
$ sudo docker run --rm -it --name certbot -v '/etc/letsencrypt:/etc/letsencrypt' -v '/var/lib/letsencrypt:/var/lib/letsencrypt' certbot/certbot renew --manual
```

한 글자라도 오타가나면 다시해야하는 번거로움이 있으니 위 코드는 유의해서 치자!



위 코드를 입력했다면 아래와 같이 데이터가 출력된다.

```
Create a file containing just this data:

LPfxSGJHNPPq0BPTeGIFXPvBtOKye28ZgjRamiorj6I.huCS1h54W6cs1JM57stOXCpEMWyrdBw6AN_8uYSvxMI

And make it available on your web server at this URL:

http://rarlaj.com/.well-known/acme-challenge/LPfxSGJHNPPq0BPTeGIFXPvBtOKye28ZgjRamiorj6I
```

- instagram에 `.cert` 폴더를 만들고 `./well-known/acme-challenge/` 뒤에 나오는 영어들을 파일명으로 만든다, 확장자는 txt로 한다. 
- 해당 파일에 `LPfxSGJHNPPq0BPTeGIFXPvBtOKye28ZgjRamiorj6I.huCS1h54W6cs1JM57stOXCpEMWyrdBw6AN_8uYSvxMI` 내용을 넣어주고 저장한다.



지금 내 경우에는 `rarlaj.com`과 `www.rarlaj.com`을 둘 다 등록해놓기로 해놨기 때문에 enter를 입력하면 똑같은 구문이 한번 더 나온다. 그 경우에도 위에서처럼 폴더를 만들어주면 된다.

enter를 누르라는 메세지가 나오는데 아래 과정을 더 수행해야하니 이후 작업부터는 새로운 터미널을 열어 작업해야한다.



`instagram.nginx`로 가서 아래와 같이 수정해준다.

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

> *alias* 는 특정 URL이 서빙할 파일 경로를 변경하는 역할을 한다



- ./docker-run-secrets.py 실행하기

```python
$ ./docker-run-secrets.py
```



- 위에 나왔던 데이터에 `localhost:8001/.well-known/acme-challenge/LPfxSGJHNPPq0BPTeGIFXPvBtOKye28ZgjRamiorj6I`로 접근해서 파일이 다운로드 되는지 확인하기



- 재배포하기

````
./deploy-docker-secrets.py
````



이제 다시 데이터가 출력된 터미널로 돌아가 enter를 입력하자. 완료되었다는 메세지가 뜨면 자신이 설정한 도메인 주소에 접속하면 정상적으로 출력되어야 한다. (rarlaj.com / www.rarlaj.com) 



- key가 잘 전달 되었는지 확인하기 위한 작업

```python
$ sudo su
$ cd /etc/letsencrypt/live/도메인주소/
$ ls -al
# README  cert.pem  chain.pem  fullchain.pem  privkey.pem
```



- nginx 설정에 넣어주기

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



Host(EC2)에 현재 SECURITY GROUP은 80(HTTP)과 22(SSH)만 되어있는데, 443(HTTPS) 포트도 추가해줘야한다.

현재 설정되어 있는 상태로는 CONTAINER는 80번 포트가 열려있고 80번 포트로 접근 시 HOST로 갔다가 컨테이너 안까지 간다. 22번 포트로 접근 시 HOST까지만 접근했었다.

nginx에서 우리는 80, 443 블럭을 나눠 요청을 분리했다. 80번 포트로 요청이 오면 gunicorn(socket) 443로 전달되고 연결될 경우 연결한다. (도메인에 대해 80번으로 요청함 -> HTTPS로 RETURN 443으로 접근)



현재 인증서가 etc/letscrypto/live/domain에 있기 때문에 --volume으로 전달해 사용할 수 있도록 한다.



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



- nginx ssl 설정 추가

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



- 다시 배포한다.

```
./deploy-docker-secrets.py
```



이제 작업이 완료되었다. 다만 아래 코드를 입력해서 인증서 갱신을 하도록 하자. letsencrypt는 3개월만 유효하기 때문이다.

```
sudo docker run --rm -it --name certbot -v '/etc/letsencrypt:/etc/letsencrypt' -v '/var/lib/letsencrypt:/var/lib/letsencrypt' certbot/certbot renew --manual
```



위 코드를 매번 입력하기 번거로우니 `crontab -e` 명령어를 실행한 뒤 아래 코드를 입력해서 인증서 갱신을 하도록 하자. letsencrypt는 3개월만 유효하기 때문이다.

```
0 0 * * * sudo docker run --rm -it --name certbot -v '/etc/letsencrypt:/etc/letsencrypt' -v '/var/lib/letsencrypt:/var/lib/letsencrypt' certbot/certbot renew --manual
```