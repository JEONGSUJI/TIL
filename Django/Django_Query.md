# Query



### 쿼리란?

데이터베이스에 정보를 요청하는 것을 말한다.



| Class Post                       | Class PostComment              |
| -------------------------------- | ------------------------------ |
| author = models.ForeignKey(User) | post = models.ForeignKey(Post) |
| content = models.TextField()     |                                |

위와 같이 Post와 PostComment라는 두 개의 class가 있다고 가정하자.

**Many-to-one**을 연결할 때 사용되는 **ForeignKey**로 연결되었기 때문에 Post와 PostComment는 **1:N 구조**로 연결되어있다.

ForeingKey로 생성한 필드는 Data base에 가리키는 클래스명_id로 필드가 생성된다.



### 정방향 참조

`PostComment` -> `Post`

- 정방향 참조를 위해서는 인스턴스를 먼저 생성해야한다. 클래스로는 가리킬 수 없기 때문이다.

```python
pc = PostComment.objects.first()
pc.post
```

- 위 코드에서 pc.post에 post는 PostComment 내 Field 명이다.



### 역방향 참조

`Post` -> `PostComment`

- 역방향 참조는 2가지 방법이 있다. `related_name`을 이용하는 방법과 ` related_query_name`을 이용하는 방법이 있다.

  - related_name

    - 반대쪽 객체에서 사용
    - defalut value : postcomment_set 	(<모델클래스명의 lowercase>_set)
    - 사용자 정의 시 사용자 정의 값

  - related_query_name

    - 반대쪽 QuerySet의 filter 조건 키워드명으로 사용
    - defalut value : postcomment 			(<모델클래스명의 lowercase>)

    ```python
    Post.objects.filter(postcomment__)
    ```

    

    - 사용자 정의 시 사용자 정의 값

    - M2M 관계에서 related_name을 지정하고, related_query_name을 지정하지 않은 경우

      related_name : 지정한 related_name

      related_query_name: 지정한 related_name


    ```
    ex) Post와 Tag관계 (M2M)에서, tags필드에서의 related_name이 posts인 경우
    
    tag.posts.all()				<-related_name
    Tag.objects.filter(posts__)	<-related_query_name
    ```

> distinct()는 중복을 제거할 때 사용된다.



### 연습문제 

1. Post 중에서 자신에게 포함된 Comment들 중에 content속성(column)에 '이한영'이라는 문자열이 들어가는 경우인 Comment가 존재하는 Post목록

- 일부 Post가 '이한영'이라는 내용을 포함하는 댓글을 가져와야 함

```python
# 1
Post.objects.filter(
    postcomment__content__contains='국밥'
).values('pk')
```

   

1-1. Post중에서 태그가 없는 경우인 Post 목록

```python
# 1-1
Post.objects.filter(
    tags__isnull=True,
).values_list('pk', flat=True).order_by('-pk')
```



2. Post 중에서 자신에게 포함된 Comment들 중에 Post의 author와 Comment의 author가 다른 경우인 Comment가 존재하는 Post 목록
   - 댓글은 존재하나, 작성자가 작성한 댓글은 없는 경우인 Post 목록

   - Post 작성자 외에 다른 사용자가 댓글을 단 경우가 존재해야함
   - Django의 F Expression을 사용 <- 검색

```python
# 2
Post.objects.exclude(
    postcomment__isnull=True
).exclude(
    postcomment__author=F('author'),
).values_list('pk', flat=True).order_by('-pk')
```



3. Tag 중에서 자신에게 연결된 Comment의 Post의 author의 pk가 1인 경우인 Tag 목록

- 없다면 author의 pk를 바꿔본다

```python
Tag.objects.filter(
    posts__author__pk='1'
).values_list('posts', flat=True).distinct()
```



4. Post중에서 자신의 좋아요 개수가 1개 이상인(좋아요가 존재하는) Post 목록
   - Field lookup의 `isnull` 항목 참조

```python
Post.objects.exclude(
    postlike__isnull=True
).values_list('pk', flat=True).order_by('-pk')
```



5. Comment중에서 자신의 Post의 좋아요 개수가 1개 이상인 Comment 목록

- Field lookup의 `isnull` 항목 참조

```python
PostComment.objects.filter(
  post__postlike__isnull=False
).values_list('post', flat=True).distinct().order_by('-post__pk')
```



6. Comment중에서 자신의 Post에 속하는 가장 최근 PostLike가 1주일 이내인 Comment목록

   - from django.utils import timezone
   - 현재시간은 timezone.now()로 가져올 수 있음

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



7. 각각의 Post에 댓글이 몇 개 달렸는지 QuerySet.values()로 꺼내보기

   Django annotate / aggregate

   QuerySetAPI의 Aggregation function의 Count()를 사용해야 함

   -> QuerySet.count()와 다릅니다.

   Post.objects.annotate(<무언가>).values(<왼쪽에서 한 걸 활용>)

```python
# 7
Post.objects.annotate(comment_count=Count('postcomment')).values_list('pk', 'comment_count')
```

> annotate : 집계함수 / DB상 어떤 값들을 합하거나 하는 작업들을 수행



8. 위 기능에 성공했다면, 댓글이 3개 이상인 Post목록만 가져오기

   Post.objects.annotate(<무언가>).filter(<왼쪽에서 한 걸 활용>)

```python
# 8
Post.objects.annotate(comment_count=Count('postcomment')).filter(comment_count__gte=3).values_list('pk','content')
```



> filter를 연속적으로 쓰면 and 조건(둘 다 만족)을 쓰는것과 다르게 filter1에 나온 결과 / filter2에 나온 결과 중 각각의 엔트리가 조건을 하나씩 만족해도 되도록 처리가 된다.