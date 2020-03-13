# CI(Continuous Integration, 지속적 통합)



- 프로젝트 폴더 생성 후 기본 세팅



- 터미널에서 `python manage.py test`가 되는지 확인



- coverage를 사용할 것이다. 아래 코드를 실행한다.

(coverage는 test가 얼마나 되었는지 알려주는 것)

```
poetry add coverage
coverage run app/manage.py test
coverage report -m
```



- 우리 코드만 테스트 실행하도록 하기 위해 아래와 같이 작성

```
coverage run --source='.' app/manage.py test
coverage report -m
```



- manage.py는 우리가 test를 볼 필요가 없기 때문에 제외시키자.

.coveragerc를  INI 파일을 만들고(app 폴더 바깥)

```coveragerc
[run]
source =
    app

omit =
    app/manage.py
    app/config/asgi.py
    app/config/wsgi.py
```

다시 run하고 report해야한다.



> 커밋 `Coverage.py 패키지 및 설정파일 추가`



- startapp blog하기

```
./manage.py startapp blog
```



- `model.py`에 아래 코드 작성

```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField(blank=True)

    def __str__(self):
        return self.title
```



- 다시 coverage report -m 하기 (실행결과를 읽어서 보여주는 역할)



- settings.py에 app 추가

```
'blog.apps.BlogConfig',
```

다시 run하고 report하면 항목이 늘어나는 것을 확인할 수 있다.



- 기본도 제외하고 싶어서

```
[run]
source =
    app

omit =
    app/manage.py
    app/config/asgi.py
    app/config/wsgi.py

[report]
exclude_lines =
    def __str__
```



> 커밋 `blog app 추가, __str__함수는 coverage report에서 제외`



blog/views.py

```python
from django.shortcuts import render

from app.blog.models import Post


def post_list(request):
    posts = Post.objects.all()
    context = {
        'posts': posts,
    }
    return render(request, 'blog/post-list.html', context)
```



- blog url 설정하기

config / urls.py 에 아래 코드 추가하기

```
    path('posts/', post_list),
```

Missing에 표시되는 것은 어디부터 어디까지 줄이 연결이 안되었다는 뜻이다.



- 100 퍼센트 되도록 test 코드 작성

```
./manage.py makemigrations
```



blog/tests.py

```
from django.test import TestCase

class BlogTest(TestCase):
    def test_post_list(self):
        response = self.client.get('/posts/')
```



- ci 위치에서 실행

```
# coverage run --source='app' app/manage.py test
coverage run app/manage.py test blog
coverage report -m
```



- 코드 커버리지를 측정해주는 도구들 중 하나인 [codecov](codecov.io)에 계정을 만들고 

지금 우리가 해당 코드를 작성한 폴더에 가서 token을 복사한 다음에

setting> secret에 CODECOV_TOKEN으로 생성후 토큰 값 넣고 저장



>코드 커버리지란, 소프트웨어의 테스트가 얼마나 코드를 잘 커버하고 있는 가를 나타내는 지표 중 하나이다. 소프트웨어의 테스트를 논할 때 얼마나 테스트가 충분히 되었는지를 나타내는 지표 중 하나라고 한다.



> 커밋 `전체 테스트 커버리지 100%`

 

### pytest, pytest-django

**pytest** : python 테스트 실행 시켜주는 모듈

**pytest-django** : django manage.py 테스트 실행 시켜주는 모듈

```
poetry add pytest pytest-django
```



- 실행하기

```
pytest app
```



- `pytest.ini` 파일 생성 후 아래와 같이 입력

```ini
[pytest]
python_files = tests.py test_*.py *_tests.py
DJANGO_SETTINGS_MODULE = config.settings
# 테스트할 때 거치지 않을 파일
norecursedirs = .git */templates/* */static/*
addopts = --nomigrations --reuse-db
```



- 아래 코드와 같이 다시 실행했을 때 템플릿을 실행할 수 없다는 에러가 뜨는게 정상이다.

```
pytest app
```



- `app/templates` 폴더 생성 후 settings.py에 TEMPLATE URL 설정하기



- 다시 run & report로 작동 확인하기

```
coverage run -m pytest app
coverage report -m
```



- `.coveragerc` 추가하기

```
omit =
    app/manage.py
    app/config/asgi.py
    app/config/wsgi.py
    app.*/migrations/*
```



- 다시 run & report로 작동 확인하기

```
coverage run -m pytest app
coverage report -m
```

이제 100%가 나와야 한다.



> 커밋 `pytest, pytest-django 추가 및 post_list에 대한 테스트 구현`



### codecov, pytest-cov

**codecov** : codecov.io에 테스트 리포트를 쉽게 업로드 할 수 있도록 도와주는 라이브러리, 커버리지, 커밋할 때 마다 몇퍼센트인지 알려주는 역할이 codecov이다.

**pytest-cov** : pytest를 사용해서 codecov.io에 업로드할 리포트를 만들어주는 라이브러리

```
poetry add codecov pytest-cov
pytest --cov app
CODECOV_TOKEN=<codecov.io Token> codecov

CODECOV_TOKEN=ae004b2a-4916-424d-9077-9a74037624e1 codecov
```



> 커밋 `codecov, pytest-cov패키지 추가`



- pytest와 pytest-django, coverage를 사용해서 codecov에 올릴 리포트 생성

```
pytest --cov app
```



- 새로운 터미널에 아래 코드 입력/ codecov에 생성된 리포트를 전송 작업

```
CODECOV_TOKEN=ae004b2a-4916-424d-9077-9a74037624e1 codecov
```



> git push



이제 저장소에 대한 설명이 `codecov`에 올라온다.

매 커밋마다 이 코드를 반복하면 커버리지가 몇퍼센트였는지 붙일 수 있다.



배지를 달 수 있는 지원이있다. codecov>settings에 badge라는 tap이있다.

markdown 형태를 복사해서 저장소의 README에 붙여 넣어주면 된다.



> 커밋 `ReadMe에 codecov 추가`



이제 자동으로 되도록 세팅해보자.

원래는 CI tool(travisci 등)을 꼭 써야했지만, 이제 github에 Actions를 사용하면 된다.

github에 Actions는 CI/CD를 위해 존재하는 탭이다.



- 해당 탭에서 `set up workflow yourself` 버튼을 클릭한다.



- poetry 설치하는 코드를 추가한다.

    - name: Install Poetry
      run : curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
이제 `start`버튼을 클릭하고 `commit`버튼 클릭한다. 



actions에 들어가보면 내용을 볼 수 있다. 체크되면 잘 실행되었다는 것이다.



- 다시 수정하기 위해 아래와 같이 코드를 작성한다.

```
- name: Poetry export requirements
  run: |
  ~/.poetry/bin/poetry export -f requirements.txt > requirements.txt
  cat requirements.txt
```

다시 `start`버튼을 클릭하고 `commit`버튼 클릭한다.  (이 작업은 master에 새로운 commit이 생기는 작업이다.)



- 다시 수정하기 위해 아래와 같이 코드를 작성한다.

```
#   cat requirements.txt 삭제

# 위에
  strategy:
  	matrix:
  		python-version: [3.7, 3.8]
	
  steps:
  - uses: actions/checkout@v2
  - name: Setup Python ${{matrix.python-version}}
  	uses: actions/setup-python@v1
  	with:
  		python-version: ${{matrix.python-version}}

- name : Install Python packages
  run: ~/.poetry/bin/poetry install
```

다시 `start`버튼을 클릭하고 `commit`버튼 클릭한다. (코드 참고: [강사님 깃허브 해당 커밋](https://github.com/WPS-12th/CI/blob/master/.github/workflows/main.yml))



- 상단에 환경변수를 미리 설정해줘야한다. (token값 적어주기)

```
# 환경변수를 미리 설정

env:
	CODECOV_TOKEN: ${{secrets.CODECOV_TOKEN}}
	
- name: pytest-cov
  run: ~/.poetry/bin/poetry run pytest --cov app
  
- name: codecov
  run: ~/.poetry/bin/poetry run codecov
```

다시 `start`버튼을 클릭하고 `commit`버튼 클릭한다.



그럼 codecov에 나올 것이다. 위에가 테스트 실행하고 그 커버리지를 전송한 것이다.



이제 github랑 합치는 것이 뜰 것이다.

- settings에서 Github Webhook에 `create new` 버튼을 클릭



위 코드의 실행으로 이제 각 action이 끝날 때 커밋에 추가된다.

이제 github에 들어가 커밋 목록을 보면 check icon이 뜰텐데 그 check를 누르면 `codecov`에 대한 정보가 뜬다.



빌드가 성공했다는 것도 이제 달 수 있다.

- 다시 저장소 Action tap에 가보면 `create status badge` 버튼이 나오는데 거기에 나오는 코드가 나오는데 그걸 README에 markup 형태를 넣으면 된다. (앞에는 저장소 이름 / 뒤에는 workflow 이름이다.)



> CD(지속적 배포)는 CI가 있다는 가정해 실행된다.
>
> [작성된 코드 참고](https://github.com/LeeHanYeong/GitHub-Action-Sample) (해당 코드에서 dockerbuild는 마지막 순간에 하는 게 좋을 것 같아 추후 코드 수정 예정이라고 함)