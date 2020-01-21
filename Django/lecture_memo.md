# 배포

cafe24가 비용은 더 저렴하지만, 구축에 시간 소요, 오류 시 세팅비용

ec2는 버튼 하나로도 쉽게 구현 가능



PaaS

Applications과 연결정도만 해주면 된다.



https://ide.goorm.io/

웹을 키면 개발 환경이 켜짐

제일 간단한 프로젝트부터 올려서 세팅




EC2 > 보안그룹 > 보안그룹 생성  > EC2 SecurityGroup /vpc 기본값(생성) > 


인스턴스 시작> 우분투 18.04 (프리티어만 체크 후 진행) > t2.micro > 세부정보 보안그룹 구성 / 기존보안그룹 EC2 SecurityGroup > 시작

새 키페어 생성 / 키페어 이름 : wps12th 열쇠는 한번만 저장할 수 있다. 키페어 다운로드

다운로드폴더에서 wps12th.pem을 키를 놓는 위치로 이동
`cd ~/.ssh`



id_rsa (열쇠) / id_rsa.pub (자물쇠) 없다면

자물쇠 정보를 새로 만드는 것에 넣어준다.



.으로 시작하는 폴더는 숨김폴더라서 이렇게 적어주어야함

```
mv ~/Download/wps12th.pem ~/.ssh
```

폴더에 있는지 확인



인스턴스 시작

Elastic IP : IP는 비싼 자원이라 유동적으로 제공된다. ip가 변경된다.

IPv4 주소 복사



내가 EC2 에 연결하고 싶다 > EC2 SSH 접속

https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html

>시큐어 셀(ssh) / 텔넷에 보안기능 붙인 것
>
>텔넷 보안 문제 있음 / 연결에 쓰이는 네트워크 프로토콜



```
정석코드 
ssh -i /path/my-key-pair.pem ec2-user@ec2-198-51-100-1.compute-1.amazonaws.com

ssh -i ~/.ssh/wps12th.pem ec2-user@54.180.115.96
```

i : identity / 어떤 유저 @ 어떤 계정



인스턴스 속성 / 인바운드 규칙 보기 (인바운드 들어올 수 있는 허용 조건이 보임)

인바운드 / 편집 / SSH / 소스: 위치무관 / 저장 ///22번 포트 열기

::/0와 0.0.0.0/0 나옴



```
ssh -i ~/.ssh/wps12th.pem ec2-user@자기 ip
```

이거 입력하면 터미널에 yes/no 나옴 yes

그럼 에러나옴



---

github ssh 설정

github setting > SSH and GPG keys

github에 자물쇠를 넘겨주는것임

https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh



```
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
$ ssh vi
```

생성 확인



#### Clone with SSH

remote에 접속할 때 우리가 가진 key로 접속을 시도해서 열 수 있다고 알면 보안연결하게됨



ls -al

사용자 사용자그룹



chmod 위키

8진법 숫자들 rwx / read / write / execute

rwx rwx rwx / owner group everyone

7 5 5 rwx r-x r-x 111 101 101



Permission 644가 rw- r-- r-- wps12th.pem



권한바꾸기 

chmod 400 ~/.ssh/wps12th.pem



r-- --- --- wps12th.pem

```
ssh -i ~/.ssh/wps12th.pem ubuntu@54.180.115.96
```





---

1. runserver 실행 (Django실행)

   - python

   - Django

     

```python
sudo apt update
sudo apt dist-upgrade
sudo apt install python3.7
sudo apt install python3-pip
pip3 list
mkdir projects
cd projects/
pwd				/home/ubuntu/projects
mkdir django-sample
cd django-sample
exit
cd ~/projects/django-sample/
django-admin startproject config .
pip3 list
pip3 install django
python3 manage.py runserver
sudo python3 manage.py runserver 0:80
    
    # 인바운드 규칙 http 추가 80번 포트 추가
    # IPv4 퍼블릭 IP 브라우저 입력시 DisallowedHost at /라고 나옴
    
vim config/settings.py
	# ALLOWED_HOSTS = ['IPv4 퍼블릭 IP', '*']
    # https://docs.djangoproject.com/en/3.0/ref/settings/
sudo python3 manage.py runserver 0:80
    # 장고 로케트 화면 나와야함
```



2. 외부에서 접근가능한지 확인
3. screen으로 지속적으로 켜져있게 하기
   - ssh접속
   - screen을 실행해서, 새 셸을 띄우기

https://lhy.kr/linux/linux-screen

shell에 대한 세션을 종료시켜도 몇 초는 유지가 됨

shell이 종료되어도 screen을 쓰면 작업표시줄처럼 작업을 지속 시킬 수 있다.

```
cd ~/projects/django-sample
screen -S runserver

sudo python3 manage.py runserver 0:80
# ctrl + a + d

screen -list
exit
```



>  시큐어 카피
>
> [https://ko.wikipedia.org/wiki/%EC%8B%9C%ED%81%90%EC%96%B4_%EC%B9%B4%ED%94%BC](https://ko.wikipedia.org/wiki/시큐어_카피)



```python
# jungsuji@jungsuji:~/projects/wps12th$
$ scp -i ~/.ssh/wps12th.pem -r instagram ubuntu@54.180.115.96:/home/ubuntu/projects
```



우선 실행되고 있는 runserver 끄기

```python
screen -S runserver
screen -R runserver
exit
screen -list

pip install -r requirements.txt

pip3 install Pillow

# app/config
vim settings.py

# app
sudo python3 manage.py runserver 0:80
```

https://pillow.readthedocs.io/en/stable/installation.html





> apt apt-get의 차이

local에서 코드를 반영해야 할 경우 문제가 된다.

그때마다

```
$ scp -i ~/.ssh/wps12th.pem -r instagram ubuntu@54.180.115.96:/home/ubuntu/projects
```

있던 파일 업로드시 오버라이트, / 있던 파일을 지우는 건 없다.



4. 새 소스코드 배포
   - screen으로 실행되고 있던 서버 종료
   - 서버에 있는 소스폴더를 통째로 삭제
   - 로컬에 있는 소스폴더 올리기
   - screen 이용해서 서버 실행



```
ssh -i ~/.ssh/wps12th.pem ubuntu@54.180.115.96 rm -rf /home/ubuntu/projects/instagram
scp -i ~/.ssh/wps12th.pem -r ~/projects/wps12th/instagram ubuntu@54.180.115.96:/home/ubuntu/projects
```



deploy.sh 파일 생성

```
#!/usr/bin/env sh
echo "==runserver 배포=="

# 기존 폴더 삭제
echo "기존 폴더 삭제"
ssh -i ~/.ssh/wps12th.pem ubuntu@54.180.115.96 sudo rm -rf /home/ubuntu/projects/instagram

# 로컬에 있는 파일 업로드
echo "로컬 파일 업로드"
scp -q -i ~/.ssh/wps12th.pem -r ~/projects/wps12th/instagram ubuntu@54.180.115.96:/home/ubuntu/projects

echo "Screen 설정"
# 실행중이던 screen 종료
ssh -i ~/.ssh/wps12th.pem ubuntu@54.180.115.96 -C 'screen -X -S runserver quit'

# screen 실행
ssh -i ~/.ssh/wps12th.pem ubuntu@54.180.115.96 -C 'screen -S runserver -d -m'

# 실행중인 세션에 명령어 전달
ssh -i ~/.ssh/wps12th.pem ubuntu@54.180.115.96 -C "screen -r runserver -X stuff $'sudo python3 /home/ubuntu/projects/instagram/app/manage.py runserver 0:80\n'"

echo "배포완료!"
```



```
#!/usr/bin/env sh
IDENTIFY_FILE="$HOME/.ssh/wps12th.pem"
HOST="ubuntu@54.180.115.96"
ORIGIN_SOURCE="$HOME/projects/wps12th/instagram"
DEST_SOURCE="/home/ubuntu/projects/instagram"
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
${SSH_CMD} -C "screen -r runserver -X stuff $'sudo python3 /home/ubuntu/projects/instagram/app/manage.py runserver 0:80\n'"

echo "배포완료!"
```





```
# instagram
chmod 744 deploy.sh		#deploy.sh가 rw-r--r--이기 때문 rwxr--r--로 변경
./deploy.sh
```



```
숙제
다시 실행되는 서버 만들기
가능하다면 HOST만 바꾸고 이 스크립트를 실행하면 전체 서버가 세팅되고 runserver된 화면 볼 수 있도록 하기
```



문제

서버에 사람들이 올린 파일이 있을 경우 그 건 서버에 저장되기 때문에 만약 우리가 로컬 코드를 실행시키면 덮어쓰기가 되는 문제가 생긴다.