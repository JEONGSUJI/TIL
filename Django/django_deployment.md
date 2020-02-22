# Django 배포하기



## 클라우드 서비스 모델의 종류

![](https://lhy.kr/images/django-eb/cloud.png)



- **On-premise (Traditional IT)**

사용자가 직접 인프라, 플랫폼, 애플리케이션을 관리하는 모델

규모있는 업체라면 직접 IDC를 구축하고, 일반적인 경우 IDC에 공간을 할당받아 물리서버를 설치하고 하드웨어, 운영체제, 서버 애플리케이션을 모두 관리한다.



- **IaaS (Infrastructure as a Service)**

대표적으로 AWS EC2가 있다.

하드웨어를 서비스로 제공하는 클라우드 모델이다. OS와 애플리케이션을관리한다.



- **PaaS (Platform as a Service)**

대표적으로 AWS Elastic Beanstalk가 있다.

하드웨어에 더해 애플리케이션을 운영하기 위한 OS와 관련된 기능들을 서비스로 제공한다. 개발자는 애플리케이션과 서비스로 제공되는 기능을 연결하는 로직을 작성해야한다.



- **SaaS (Software as a Servise)**

대표적으로 Google Apps, Office365가 있다.

애플리케이션 레벨까지 서비스로 제공된다. 개발자보다는 실 사용자에게 바로 제공된다.



(출처 : https://lhy.kr/cloud-model)



>  AWS EC2는 국내 서비스 CAFE24에도 동일한 기능이 있다. 하지만 CAFE24의 경우 구축 시 시간이 소요되며, 구축 시 오류가 나면 세팅비용이 별도로 나가는 단점이 있다. 하지만 AWS EC2는 인스턴스 생성 버튼으로 바로 생성이 되며, 원하는 시점에 생성하고 삭제할 수 있다는 장점이 있다.



> **+ 참고 사이트**
>
> - https://ide.goorm.io/
>
> 설치가 필요없는 클라우드 통합 개발환경



## 배포 환경 세팅

배포하기 전에 모든 프로젝트를 옮기는 것이 아닌 제일 간단한 프로젝트부터 올려서 세팅하는 것이 좋다.



### AWS

- 콘솔에 로그인 버튼을 클릭하여 로그인
- AWS 서비스 중 **`EC2`** 선택

- 보안 그룹 설정

  - `네트워크 및 보안` > `보안 그룹` 클릭
  - `보안 그룹 생성`버튼 클릭
  - 보안 그룹 이름 및 설명을 원하는대로 적고 VPC 기본값으로 한 뒤 `생성`버튼 클릭

- 인스턴스 설정

  - `인스턴스` > `인스턴스` 클릭

  - `인스턴스 시작` 버튼 클릭

  - (무료를 위해 왼쪽 메뉴 프리 티어만 체크 후)`Ubuntu Server 18.04 LTS (HVM), SSD Volume Type` 선택

  - 인스턴스 유형은 `프리 티어 사용 가능`이 적힌 메모리가 `1GiB`인 항목 체크 (기본값이라 별도 체크 불필요) 후 `다음: 인스턴스 세부정보 구성` 버튼 클릭

  - 3, 4, 5 건너 뛰고 6. 보안 그룹 구성을 클릭한 뒤 보안 그룹 할당에 `기존 보안 그룹 선택` 체크하여 위 보안 그룹 설정에서 지정해준 보안 그룹과 일치하는 보안그룹 체크 후 `검토 및 시작` 버튼 클릭

  - `시작하기`버튼 클릭

  - 기존 키 페어 선택 또는 새 키 페이 생성 창에서 `새 키 페어 생성`한 뒤 키 페어 이름을 지정한 후(ex. wps12th) `키 페어 다운로드` 후 `인스턴스 시작`

    (**키 페어 다운로드는 한번만 저장할 수 있다!**)

  - 다운로드 폴더에서 wps12th.pem을 키를 놓는 위치로 이동시키자. `.`으로 시작하는 숨김폴더라서 아래와 같이 적어주어야 한다.

    ```
    mv ~/Downloads/wps12th.pem ~/.ssh
    ```

    - `인스턴스 보기`버튼 클릭



### SSH 공개키

우선 SSH란 Secure Shell Protocol, 즉 네트워크 프로토콜 중 하나로 컴퓨터와 컴퓨터가 인터넷과 같인 Public Network를 통해 서로 통신을 할 때 보안적으로 안전하게 통신을 하기 위한 프로토콜이다. 대표적인 사용의 예는 데이터를 전송하거나 원격 제어할 때 사용된다.



우리는 AWS를 이용할 것인데, AWS의 인스턴스 서버에 접속하여 해당 머신에 명령을 내리기 위해서도 SSH를 통한 접속을 해야한다.



FTP나 Telnet과 같은 다른 컴퓨터와 통신을 위해 사용되는 프로토콜도 있는데 SSH를 사용하는 이유는 '보안'이다. FTP나 Telnet을 통해 민감한 정보를 주고 받는다면 정보를 직접 네트워크를 통해 넘기기 때문에 누구나 해당 정보를 열어볼 수 있어 보안에 상당히 취약하다. 하지만 SSH를 사용한다면 보안적으로 훨씬 안전한 채널을 구상한 뒤 정보를 교환하기 때문에 보안적인 면에서 훨씬 뛰어나다.



SSH는 다른 컴퓨터와 통신을 하기 위해 접속을 할 때 우리가 일반적으로 사용하는 비밀번호의 입력을 통한 접속을 하지 않는다. 기본적으로 SSH는 한 쌍의 Key를 통해 접속하려는 컴퓨터와 인증 과정을 거치게된다. 이 한 쌍의 Key는 Private key와 Public Key이다.



Public Key는 공개되어도 비교적 안전한 Key이다. Public Key를 통해 메시지를 전송하기 전 암호화를 하게 된다.



---

- 공개키 만들기

  - 사용자의 SSH 키들은 기본적으로 사용자의 `~/.ssh`디렉토리에 저장한다. 따라서 해당 디렉토리의 파일을 살펴보면 이미 공개키가 있는지 확인할 수 있다.

  ```
  $ cd ~/.ssh
  $ ls
  ```

  - `id_dsa`나 `id_rsa`라는 파일 이름이 보일 것이고, 같은 파일명의 `.pub`라는 확장자가 붙은 파일이 하나 더 있을 것이다. `.pub`는 공개키이고 다른 파일은 개인키이다.
  - (만약 이 파일들이 없다면) `ssh-keygen`이라는 프로그램으로 키를 생성해야 한다.

  ```
  $ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
  ```

  `.ssh/id_rsa` 키를 저장하고 싶은 디렉토리를 입력하고 암호를 두 번 입력한다. 이때 암호를 비워두면 키를 사용할 때 암호를 묻지 않는다
- 이제 사용자가 자신의 공개키는 Git 서버 관리자에게 보내야한다. 사용자는 `.pub` 파일의 내용을 복사하여 이메일을 보내기만 하면 된다.
  
  ```
  $ cat ~/.ssh/id_rsa.pub
  ```
  
  - 위 코드를 실행하여 나온 정보를 자신의 git 계정의 settings로 이동하면, SSH and GPG keys 탭을 클릭한 후 `New SSH key`버튼을 클릭한다.
  - Title에는 이름을 설정하고, Key에는 `$ cat ~/.ssh/id_rsa.pub`코드를 실행한 뒤 나온 데이터를 넣어주고 `Add SSH key`버튼을 클릭해준다.



> 참고 사이트
>
> - https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent



- wps12th.pem 권한변경하기

```
  chmod 400 ~/.ssh/wps12th.pem
```



> **chmod**	
>
> change mode의 축약어로 유닉스와 유닉스 계통 환경 안에서 쓰는 셸 명령어다.
>
> `$ ls -al`하면 `drwxr-xr-x`와 같이 모드가 나온다.
>
> rwx / rwx / rwx : 각각 Owner / Group / Everyone의 권한을 의미한다.
>
> `rwxr-xr-x`는 2진수로 `111101101`로 표시되고 `755`라고도 한다.



### EC2 SSH 접속하기

> SSH란 시큐어 셀, 텔넷에 보안 기능을 붙인 것이다.



SSH를 사용하여 인스턴스에 연결하려면 아래와 같은 코드를 입력해야 한다.

  ```
$ ssh -i /path/my-key-pair.pem ec2-user@ec2-198-51-100-1.compute-1.amazonaws.com
  ```



우리는 위 코드를 각자에 맞게 수정해 아래와 같이 입력하겠다.

```
ssh -i ~/.ssh/wps12th.pem ubuntu@[IPv4 퍼블릭 IP]
```



인스턴스 인바운드에 SSH(보안 텔넷)을 사용하기 위해 인바운드 규칙을 추가해주어야 한다. 

- AWS EC2에 `네트워크 및 보안` 탭에서 `보안 그룹`을 선택하고 인바운드 탭에 `편집` 버튼을 클릭한다.
- `규칙 추가`버튼을 클릭하고 유형: SSH / 소스: 위치무관으로 설정해준 뒤 `저장`한다.

- 인바운드 설정에 소스가 ::/0와 0.0.0.0/0 나오면 정상이다.



> 참고 사이트
>
> https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html



### runserver 실행하기 (Django 실행)

```python
$ sudo apt update
$ sudo apt dist-upgrade

$ sudo apt install python3.7
# keep the local version currently installed 선택
$ sudo apt install python3-pip
$ pip3 list
$ pip3 install django

$ mkdir projects
$ cd projects

$ mkdir django-sample
$ cd django-sample

$ exit
```

```python
$ ssh -i ~/.ssh/wps12th.pem ubuntu@[IPv4 퍼블릭 IP]
```

```python
$ cd ~/projects/django-sample/
$ django-admin startproject config .
$ python3 manage.py runserver 0:80
```



인스턴스 인바운드에 HTTP를 사용하기 위해 인바운드 규칙을 추가해주어야 한다. 

- AWS EC2에 `네트워크 및 보안` 탭에서 `보안 그룹`을 선택하고 인바운드 탭에 `편집` 버튼을 클릭한다.
- `규칙 추가`버튼을 클릭하고 유형: HTTP으로 설정해준 뒤 `저장`한다.

- 인바운드 설정에 소스가 ::/0와 0.0.0.0/0 나오면 정상이다.



브라우저 주소창에 `IPv4 퍼블릭 IP` 입력 시 `DisallowedHost at /`라고 나오면 정상이다.



```python
$ vim config/settings.py
```

`i` INSERT MODE로 `ALLOWED_HOSTS = ['IPv4 퍼블릭 IP', '*']`으로 수정하고 `ESC` 누른 뒤 `:wq`



```python
$ sudo python3 manage.py runserver 0:80
```

브라우저 주소창에 `IPv4 퍼블릭 IP` 입력 시 장고 로케트 화면 나오면 정상이다.



### screen으로 지속적으로 켜져있게 하기

shell에 대한 세션을 종료시켜도 몇 초는 유지가 된다. 단, shell이 종료되면 끝이기 때문에, shell이 종료되어도 작업표시줄처럼 작업을 지속시키도록 screen을 사용해보자.

- ssh 접속
- screen을 실행해서, 새 셸을 띄우기



```python
# ubuntu@ip환경에서 작업
$ cd ~/projects/django-sample
$ screen -S runserver
```

해당과 같이 입력하면 마치 새로운 터미널이 뜬 듯하게 보이는데 screen이 실행된 것이다.



```python
$ sudo python3 manage.py runserver 0:80
```

위 코드를 입력한 후 `ctrl+a+d`를 누르면 현재 작업을 유지하며 screen세션을 빠져나온다.



```python
$ screen -list
```

위 명령어를 입력하면 현재 실행되고 있는 screen을 알 수 있다.



```python
$ exit
```

위 코드를 실행하여 셸을 종료하여도 브라우저 주소창에 `IPv4 퍼블릭 IP` 입력 시 장고 로케트 화면이 잘 나오는 것을 확인할 수 있다.



실행되고 있는 runserver 종료하기

```python
$ ssh -i ~/.ssh/wps12th.pem ubuntu@[IPv4 퍼블릭 IP]
# ubuntu@ip환경에서 작업
screen -list
screen -R runserver
# runserver screen에 들어오게 되는데 진행중인 작업 취소 후
exit
screen -list		# 실행되고 있는 screen이 없는지 확인
```



> 참고 사이트
>
> https://lhy.kr/linux/linux-screen



### SCP, 시큐어 카피로 instagram 프로젝트 복사

로컬 호스트와 원격 호스트 간 또는 두 개의 원격 호스트 간에 컴퓨터 **파일을 안전하게 전송하는 수단**이다. 시큐어 셀 프로토콜 기반이다.



```python
# instagram project 한 단계 상위폴더로 경로 이동
$ scp -i ~/.ssh/wps12th.pem -r instagram ubuntu@54.180.115.96:/home/ubuntu/projects
```



```python
# 새로운 터미널을 열고 ubuntu@ip환경으로 이동
$ cd ~/projects/instagram
$ pip3 install -r requirements.txt
$ pip3 install Pillow

# manage.py가 있는 app으로 이동
$ cd app
$ sudo python3 manage.py runserver 0:80
```



> **settings.py language설정 오류가 나는 경우 참고**
>
> instagram 프로젝트는 python 3이하 버전으로 작업했기 때문에 settings.py에서 언어 설정을 해준 경우 충돌이 날 수 있다. 이 경우 `app/config` 경로로 이동 후 `vim settings.py`를 통해 언어설정을 변경해주면된다.



> 만약 `screen -S runserver`를 두번 실행한 경우 `screen -R runserver`을 입력해도 들어가지지 않는다. 해당의 경우는 `screen -list`로 보여지는 runserver앞 번호를 함께 입력해야 들어갈 수 있다. (ex. `screen -R 490.runserver`)



> 참고 사이트
>
> - [https://ko.wikipedia.org/wiki/%EC%8B%9C%ED%81%90%EC%96%B4_%EC%B9%B4%ED%94%BC](https://ko.wikipedia.org/wiki/시큐어_카피)
>
> - https://pillow.readthedocs.io/en/stable/installation.html



단, 위와 같은 경우 local에서 코드를 수정 후 다시 서버에 반영 해야 할 경우 문제가 된다. 그때마다 아래와 같은 코드를 입력해주게 되면

```python
$ scp -i ~/.ssh/wps12th.pem -r instagram ubuntu@[IPv4 퍼블릭 IP]:/home/ubuntu/projects
```

있던 파일 업로드 시에는 overwrite되어 상관없지만, local에서 파일을 지운 경우에는 반영이 되지 않는다.



### 새 소스코드 배포

- screen으로 실행되고 있던 서버 종료
- 서버에 있는 소스폴더를 통째로 삭제
- 로컬에 있는 소스폴더를 올리기
- screen을 이용해서 서버 실행



```python
$ ssh -i ~/.ssh/wps12th.pem ubuntu@[IPv4 퍼블릭 IP] rm -rf /home/ubuntu/projects/instagram

$ scp -i ~/.ssh/wps12th.pem -r ~/projects/wps12th/instagram ubuntu@[IPv4 퍼블릭 IP]:/home/ubuntu/projects
```



위 코드도 매번 소스코드를 업데이트 해야할 때마다 실행해주는 것도 힘드니 local instagram project에 deploy.sh 파일을 생성하여 `./deploy.sh` 코드만 입력하면 자동으로 실행되도록 해주자.



```python
# instagram/deploy.sh 파일 생성

#!/usr/bin/env sh
IDENTIFY_FILE="$HOME/.ssh/wps12th.pem"
HOST="ubuntu@[IPv4 퍼블릭 IP]"
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
${SSH_CMD} -C "screen -r runserver -X stuff 'sudo python3 /home/ubuntu/projects/instagram/app/manage.py runserver 0:80\n'"

echo "배포완료!"
```



```python
# instagram
# deploy.sh가 rw-r--r--이기 때문 rwxr--r--로 변경
chmod 744 deploy.sh
./deploy.sh
```



다음 시간에는 서버에 사람들이 올린 파일이 있을 경우 그건 서버에 저장되기 때문에 만약 우리가 로컬 코드를 실행시키면 덮어쓰기가 되는 문제가 생기는 문제를 해결하기 위해 다른 방법을 배워보도록 하자.