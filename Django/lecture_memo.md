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