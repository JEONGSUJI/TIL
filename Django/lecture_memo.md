[2/11]

`poetry add pygments`

```
python = "^3.7"
django-extensions = "^2.2.8"
djangorestframework = "^3.11.0"
notebook = "^6.0.3"
django = "^3.0.3"
```

---

`django-admin startproject config`

`mv config app`



https://www.django-rest-framework.org/tutorial/quickstart/

코드 스니펫을 만드는 것이다.



paste 빈: gist와 같은 것을 만들고자 하는 것

코드를 입력하면 색을 입혀주는 것 같은 것



노트북 열고 기능 알아보기

```
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

LEXERS = []
for item in get_all_lexers():
    print(item)
    if item[1]:
        LEXERS.append(item)
```

```
('Python', ('python', 'py', 'sage', 'python3', 'py3'), ('*.py', '*.pyw', '*.jy', '*.sage', '*.sc', 'SConstruct', 'SConscript', '*.bzl', 'BUCK', 'BUILD', 'BUILD.bazel', 'WORKSPACE', '*.tac'), ('text/x-python', 'application/x-python', 'text/x-python3', 'application/x-python3'))
```

위와 같이 지원하는 언어들 등이 출력됨

지원하지 않는 언어는 실행하지 않기 위함



```
LANGUAGE_CHOICES = []
for item in LEXERS:
    cur_tuple = (item[1][0], item[0])
    print(cur_tuple)
    LANGUAGE_CHOICES.append(cur_tuple)
```

어떤 언어들이 choice에 들어가는지 알 수 있다.



> django choice
>
> ('FR', 'Freshman') 왼쪽 값 db 저장, 오른쪽 사용자 보여줌

> sort와 sorted 차이



```
STYLE_CHOICES = []
for item in get_all_styles():
    print(item)
    cur_tuple = (item, item)
    STYLE_CHOICES.append(cur_tuple)
```

style theme라고 생각할 수 있음



```
from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLE_CHOICES = sorted([(item, item) for item in get_all_styles()])


class Snippet(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100, blank=True, default='')
    code = models.TextField()
    linenos = models.BooleanField(default=False)
    language = models.CharField(choices=LANGUAGE_CHOICES, default='python', max_length=100)
    style = models.CharField(choices=STYLE_CHOICES, default='friendly', max_length=100)

    class Meta:
        ordering = ['created']
```



```
class Meta:
   ordering = ['created']
```

> 선택정렬, 거품정렬
>
> 정렬을 하는 필드에 따로 설정하지 않으면 created 순서로 항상 정렬된다. 정렬은 비싼 연산
>
> ordering에들어간 필드는 인덱스 처리 (필드에 들어간 정보가 오름차순인지 내림차순인지 미리 만들어놓는것)



인덱스를 만들어 놓는다.

snippet table에 인덱스를 만들어 놓는다.

created_date index table = row수 만큼 갖고 있다.

그럼 날짜 크기 비교해 정렬하지 않고 created_date index table 순서대로 꺼내올 수 있다.



RelatedField는 index가 무조건 잡혀있다.

ForeignKey랑 ManyToMany, OneToOne은 잡혀있어서 안잡아줘도 됨



단점

단 Snippet이 중간에 추가되어 새로운 숫자를 넣어야 하는 경우 언제 들어가야 할지 정렬해야한다. 추가하는데는 시간이 소요

created_date index table이라는 DB에 공간을 더쓴다. 



넣는 방법은 두가지이나. meta에넣는 걸 django가 권장

```
# DB 인덱스 설정 (Field.db_index)
# created = models.DateTimeField(auto_now_add=True, db_index=True)
```

```
    # DB 인덱스 설정 (Model.Meta)
    class Meta:
        ordering = ['created']
        indexes = [
            models.Index(fields=['created']),
        ]
```



fields=['created']라서 두개 필드를 묶어 인덱스를 만들 수 있다.



./manage.py makemigrations

./manage.py migrate

./manage.py runserver

./manage.py createsuperuser



접속

Linenos는 줄 번호를 보여줄 것이지



---

Serialize

메모리에 갖고 있는 비연속적인 데이터를 연속적인 데이터로 만드는 과정

​	파일과 문자열은 연속적인 데이터



Deserialize

연속적인 데이터를 파이썬이 사용하는 데이터 형태로 만드는 과정



Serializer가 위 두가지를 다해줌

하는 일 

- Custom Python object((CustomClass) Object 또는 Instance) -> (Serializer)-> Python data type -> (Renderer) -> String(JSON, xml, yaml)

곧바로 바꿀 순 없어서 위처럼 python 기본타입으로 바꾼다음 바꾼다. Renderer과정을 거침 외부에서 읽을 수 있는 형태로 바꿔주는 역할



Serializer은 인스턴스를 Python data type을 바꿈

장고가 가진 models.DateTimeField와 같은거를 Python data type 형태로 변환



serializer = SnippetSerializer(snippet)

선언할 때 Custom Python object 가지고 있음

snippet: Custom Python object

serializer: snippet object를 Python data type으로 변환할 수 있는 Serializer객체

-> .data(snippet object를 Python data)



snippets안에 `serializers.py`만들기

```python
from rest_framework import serializers

from snippets.models import LANGUAGE_CHOICES, STYLE_CHOICES


class SnippetSerializer(serializers.Serializer):
    pk = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=False, allow_blank=True, max_length=100)
    code = serializers.CharField()
    linenos = serializers.BooleanField(required=False)
    language = serializers.ChoiceField(choices=LANGUAGE_CHOICES, default='python')
    style = serializers.ChoiceField(choices=STYLE_CHOICES, default='friendly')
```



notebook에서 확인하려했으나 되지 않아서 장고버전을 낮추기 위해 pyproject.toml 직접 수정

```
django = "<3"
```

poetry update



notebook에서

```
snippet = Snippet.objects.get_or_create(
    title='Sampel snippet',
    code=('class Post(models.Model):\n'
         'title=models.CharField()')
)[0]
```

```
snippet.code
```

`class Post(models.Model):\ntitle=models.CharField()`



```
from snippets.serializers import SnippetSerializer

serializer = SnippetSerializer(snippet)
```

```
serializer.data
```

`{'pk': 1, 'title': 'Sampel snippet', 'code': 'class Post(models.Model):\ntitle=models.CharField()'}`



----

타 언어와 작업할 때 데이터를 그 언어로 받고 전달 받아 Python이 읽을 수 있는 형태로 바꿔주는 것 serializer



deserializer하는 데이터를 받았을 때 하고싶은 일

- db에 저장 / create
- 기존의 객체 업데이트 / update



deserializer 과정

JSON string -> (Parser) -> Python data -> (Serializer) ->  Custom object (Model instance)

다른 클래스의 인스턴스를 만들 수도 있음



create(data)

​	title, code, linenos, style, language

update(instance, data)

​	title, code

특정 필드 업데이트라 모두 안보내도됨



ModelSerializer를 사용하면 이전과 같이 중복되게 다 적어주지 않아도 된다.

Simple default implementations for the `create()` and `update()` methods. 이미 있어서 안만들어줘도 알아서 동작



```visual basic
@csrf_exempt
```

장고로 프론트 만들었을때만 가능해서 꺼줌 안그러면 오류난다.



postman



---

json {}이나 [] 형태로 와야 함



list/create는 url을 같이 쓴다.

```
get_object_or_404()
```

에서 rest_framework.generics는 





``` 
partial=True
```

주어진 부분만 업데이트





tutorial 2 x tutorial 3



Class-based view(APIView)기반으로 snippet list, detail 구현