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

ls



---

1/14



태그 추가하기



```
Many-to-many에서 필드는 Post에 클래스에 작성
HashTag의 Tag를 담당
Post입장에서 post.tags.all()로 연결된 전체 Tag를 불러올 수 있어야 함
Tag 입장에서 tag.posts.all()로 연결된 전체 Post를 불러올 수 있어야 함

Django admin에서 결과를 볼 수 있도록 admin.py에 적절히 내용 기록
중계모델(Intermediate model)을 사용할 필요 없음
```



models.save보다 form.save가 나중에 일어나서 

`readonly_fields = ('tags',)`를 해줘야함



gits.github.com



[https://greeksharifa.github.io/%EC%A0%95%EA%B7%9C%ED%91%9C%ED%98%84%EC%8B%9D(re)/2018/08/04/regex-usage-05-intermediate/](https://greeksharifa.github.io/정규표현식(re)/2018/08/04/regex-usage-05-intermediate/)





```
박보영이라는 name을 가진 Tag를 자신의 tags목록에 갖고있는 경우인 Post
filter의 조건(키워드)명으로
ManyToMany등, RelatedField의 Forward연결이라면,해당 필드명 사용
BackWard의 경우
	related_name이 지정되어있다면 사용
	related_name이 지정되어있지 않다면 연결되는 모델의 lowercase문자열(_set이 안붙음)
	-> related_query_name
```



---

1/15



1. Post 중에서 자신에게 포함된 Comment들 중에 content속성(column)에 '이한영'이라는 문자열이 들어가는 경우인 Comment가 존재하는 Post목록

   - 일부 Post가 '이한영'이라는 내용을 포함하는 댓글을 가져와야 함

   1-1. Post중에서 태그가 없는 경우인 Post 목록

2. Post 중에서 자신에게 포함된 Comment들 중에 Post의 author와 Comment의 author가 다른 경우인 Comment가 존재하는 Post 목록

   - 댓글은 존재하나, 작성자가 작성한 댓글은 없는 경우인 Post 목록

   - Post 작성자 외에 다른 사용자가 댓글을 단 경우가 존재해야함
   - Django의 F Expression을 사용 <- 검색

3. Tag 중에서 자신에게 연결된 Comment의 Post의 author의 pk가 1인 경우인 Tag 목록
   - 없다면 author의 pk를 바꿔본다

4. Post중에서 자신의 좋아요 개수가 1개 이상인(좋아요가 존재하는) Post 목록
   - Field lookup의 `isnull` 항목 참조
5. Comment중에서 자신의 Post의 좋아요 개수가 1개 이상인 Comment 목록
   - Field lookup의 `isnull` 항목 참조

6. Comment중에서 자신의 Post에 속하는 가장 최근 PostLike가 1주일 이내인 Comment목록
   - from django.utils import timezone
   - 현재시간은 timezone.now()로 가져올 수 있음

7. 각각의 Post에 댓글이 몇 개 달렸는지 QuerySet.values()로 꺼내보기

   Django annotate / aggregate

   QuerySetAPI의 Aggregation function의 Count()를 사용해야 함

   -> QuerySet.count()와 다릅니다.

   Post.objects.annotate(<무언가>).values(<왼쪽에서한걸활용>)

8. 위 기능에 성공했다면, 댓글이 3개 이상인 Post목록만 가져오기

   Post.objects.annotate(<무언가>).filter(<왼쪽에서한걸활용>)

9. 위 기능에 성공했다면, 댓글이 3개 이상이며 댓글개수가 좋아요개수보다 많은 Post목록만 가져오기

   Post.objects.annotate(<무언가>).filter(<왼쪽에서한걸활용>)



postcomment_set : related_name

​	반대쪽 객체에서 사용

​	post.postcomment_set

postcomment: related_query_name

​	반대쪽 QuerySet의 filter 조건 키워드명으로 사용

​	Post.objects.filter(postcomment__)



기본값

related_name: <모델클래스명의 lowercase>_set

related_query_name: <모델클래스명의 lowercase>



related_name을 지정하고, related_query_name을 지정하지 않은 경우

related_name : 지정한 related_name

related_query_name: 지정한 related_name

ex) Post와 Tag관계 (M2M)에서, tags필드에서의 related_name이 posts인 경우

​	tag.posts.all()						<-related_name

​	Tag.objects.filter(posts__)	<-related_query_name



distinct()는 중복 제거



```python
# 1
Post.objects.filter(
    postcomment__content__contains='국밥'
).values('pk')
```

```python
# 1-1
Post.objects.filter(
    tags__isnull=True,
).values_list('pk', flat=True).order_by('-pk')
```

```python
# 2
Post.objects.exclude(
    postcomment__isnull=True
).exclude(
    postcomment__author=F('author'),
).values_list('pk', flat=True).order_by('-pk')
```

```python
# 3
Tag.objects.filter(
    posts__author__pk='1'
).values_list('posts', flat=True).distinct()
```

```python
# 4 Post중에서 자신의 좋아요 개수가 1개 이상인(좋아요가 존재하는) Post 목록
Post.objects.exclude(
    postlike__isnull=True
).values_list('pk', flat=True).order_by('-pk')
```

```python
# 5 Comment중에서 자신의 Post의 좋아요 개수가 1개 이상인 Comment 목록
PostComment.objects.filter(
  post__postlike__isnull=False
).values_list('post', flat=True).distinct().order_by('-post__pk')
```

```python
# Post
Post.objects.filter(
    postlike__created__lt=a_week_age
).values('pk', 'postlike__user')

# Comment중에서 자신의 Post에 속하는 가장 최근 PostLike가 1주일 이내인 Comment목록
from datetime import timedelta

now = timezone.now()
a_week_age = now - timedelta(hours=2)

PostComment.objects.filter(
    post__postlike__created__lt=a_week_age
).values('pk','post').values('pk','post','post__postlike__created').order_by('-post').filter(post__pk=21)
```



```python
# 7
Post.objects.annotate(comment_count=Count('postcomment')).values_list('pk', 'comment_count')
```

annotate : 집계함수

DB상 어떤 값들을 합하거나 하는 작업들을 수행



```python
# 8
Post.objects.annotate(comment_count=Count('postcomment')).filter(comment_count__gte=3).values_list('pk','content')
```



```python

```



OAuth기능 : 소셜로그인



동작방법

유저가 사이트에 페이스북 계정으로 로그인할래 요청하면

사이트가 이쪽으로 가라고 알려줌(redirect해서 페이스북 사이트로)

​	이때 callback URL을 포함

로그인하겠냐고 물어보면 하겠다고 유저가 입력

그럼 그때 다시 콜백URL로 이동하는데 그때 callback token을 전달해줌

access token을 줌(password나 id를 전달하진 않음)

매칭이되는 unique한 값을 만들어서 저 access token에 담아놓는다.



access token을 받았으면 사이트는 다시 페이스북에 유저정보 달라고 요청하는데 access token을 함께보냄 이게 key임(계정정보를 요청할 수 있는 것이 access token)

그럼 인증을 거쳐서 페이스북에서 사이트에 계정 정보를 보냄 -> 이때 페북에서 unique한 id를 전달해준다. (이 사용자가 가진 유일한 id값을 보내준다. 요청할때마다 항상 같은 id라 이것으로 사용자를 구분)

unique한 id는 페이스북 회원가입할때 이미 만들어져있는 값이다.



그럼 저 unique id를 받았을때, 장고에서 처리하는 방법은 여러가지다.

그대로 쓰거나 / f_를 앞에 붙여서 저장하거나 / type을 나눠 저장한다.



비밀번호 값이 없어도 페이스북에서 인증된 유저라는 것이 확신하면 로그인되게 해야함

AuthenticationBackend를 Django가 지원함

기본적으로 지원하는것이 model login이라고 함



session과는 별개임.



```
git remote add upstream https://github.com/WPS-12th-Hackathon/Info.git

git remote -v

git fetch upstream
 
git log --oneline --all -graph

git merge upstream/master
```

