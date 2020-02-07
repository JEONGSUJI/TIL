# Poetry

Poetry는 파이썬 의존성 관리자이다.

pipenv와 비슷한 기능을 제공하는 pip와 virtualenv를 동시에 사용할 수 있게 해주는 패키지 관리자이자 의존성 관리자이다.



**의존성 관리자?**

의존성 관리자는 패키지가 요구하는 다른 패키지, 그리고 그 다른 패키지가 요구하는 또다른 패키지를 거슬러 올라가며 설치해야 할 패키지의 목록을 구성하는 일을 한다.



**왜 pip가 아닌 poetry를 사용하는가?**

- pip는 Dependency Resolving에 실패한다.
- pip는 lock file이 없어 사용자가 직접 `requirements.txt`를 작성하는 수 밖에 없다.
- pip는 항상 전역에 모든 패키지를 설치한다. virtualenv라는 툴로 환경을 분리할 수 있지만, virtualenv와 pip가 따로 논다.



**그럼 [Poetry](https://github.com/sdispater/poetry)는?**

- 생성된 `pyprojects.toml`파일에는 프로젝트의 메타데이터가,  `poetry.lock`파일에는 설치된 패키지들의 버전과 hash가 저장된다.



>  **참고사이트**
>
> - [Poetry를 사용한 파이썬 패키지 관리](https://lhy.kr/python-poetry)
>
> - [파이썬 의존성 관리자 Poetry 사용기](https://spoqa.github.io/2019/08/09/brand-new-python-dependency-manager-poetry.html)



## Poetry 사용하기

### 설치하기

```python
$ curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
```



```python
$ poetry init
# yes와 no를 물어볼 때는 no / no / yes 를 입력합니다.
```

`poetry init`을 실행하면 `pyproject.toml`이 생성됩니다.



### Poetry 명령어

- 패키지 추가

```python
$ poetry add <패키지명>
```

- 패키지 및 의존성 패키지를 함께 삭제

```python
$ poetry remove <패키지명>
```

- 설치된 패키지 목록 확인

```python
$ poetry show --no-dev --tree
```

- poetry.lock 파일로부터 requirements.txt 생성

```python
$ poetry export -f requirements.txt > requirements.txt
```
