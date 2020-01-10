12/26

https://docs.djangoproject.com/en/3.0/topics/db/queries/



---

1/7

`manage.py makemigrations <app>`

모델 클래스의 변경사항을 migration으로 생성



`manage.py migrate <app> <migration>`

migration에 있는 변경사항을 실제 DB에 적용

migration을 적어줘서 뒤로 돌아가거나 앞으로도 갈 수 있다고 함

단, 뒤로 돌릴 때 데이터도 모두 사라짐에 주의 



`./manage.py showmigrations`

migration 적용 사항 확인



---

#### Spanning multi-valued relationships



헤드 라인에“Lennon”이 있고 2008 년에 출판 된 항목이있는 블로그를 찾는 데 관심이있을 수 있습니다.

블로그의 검색 조건

Blog를 찾는다.

1. Blog에는 여러 entry들이 속해 있는데, 그 속한 Entry 중 아래 조건 만족하는지



Blog1

Blog1-Entry1

- Headline: Lennoe

- Publish: 2008

  

Blog2

Blog2-Entry2

- Headline: Lennon
- Publish: 2020



Blog2-Entry3

- Headline: WPS
- Publish: 2008



Blog3

Blog3-Entry4

- Headline: Lennon
- Publish: 2020



entry는 Forienkey의 역방향 다 쪽에 대한 조건

QuerySets | Spanning multi-valued relationships 참고



filter를 연속적으로 쓰면 and 조건(둘 다 만족)을 쓰는것과 다르게 filter1에 나온 결과 / filter2에 나온 결과 중 각각의 엔트리가 조건을 하나씩 만족해도 되도록 처리가 된다.



#### Filters can reference fields on the model

The pk lookup shortcut

Caching and QuerySets

각 QuerySet에는 데이터베이스 액세스를 최소화하기위한 캐시가 포함되어 있습니다. 작동 방식을 이해하면 가장 효율적인 코드를 작성할 수 있습니다.



캐시는 데이터나 값을 미리 복사해 놓는 임시 장소를 가리킨다



위치 인자는 키워드 인자보다 항상 앞에와야한다.



---

instagram



```
def post_like(request, pk):    """    pk가 pk인 Post에 대한    1. PostLike 객체를 생서한다.    2. 만약 해당 객체가 이미 있다면, 삭제한다.    3. 완료 후 posts:post-list로 redirect한다.    """
```



---

1/8

장고 기본유저나 Custom 유저냐 상관없이

유저 모델에 관계없이 불러와 사용할 수 있음

```
User = get_user_model()
```



https://docs.djangoproject.com/en/3.0/topics/forms/

form을 class로 관리하기


