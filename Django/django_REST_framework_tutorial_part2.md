# Django Rest framework - 01.Serialization

[rest-framework 공식문서](https://www.django-rest-framework.org/tutorial/quickstart/)와 [번역된 참고 문서](https://github.com/KimDoKy/DjangoRestFramework-Tutorial/blob/master/REST Framework Tutorial.md)를 보고 실습하며 작성한 글 입니다.



우선 결론적으로 말하자면 아래와 같은 구조입니다.

```
[BackEnd] <-> [DB] <-> [Model] <-> [Serializers] <-> [API] <-> [FrontEnd]
```

Serializer의 역할은 아래 설명합니다.



**[Introduction]**

이 튜토리얼은 웹 API를 강조하는 간단한 pastebin 코드 작성을 다룬다. 그 과정에서 REST 프레임 워크를 구성하는 다양한 구성 요소를 소개하고 모든 구성 요소가 어떻게 결합되는지 포괄적으로 이해한다. 이 튜토리얼은 상당히 심층적이다.

> pastebin: gist와 같은 것을 만들고자 하는 것 (코드를 입력하면 색을 입혀주는 것 같은 것)
>



참고: 이 튜토리얼의 코드는 GitHub의 [encode/rest-framework-tutorial](https://github.com/encode/rest-framework-tutorial) 저장소에서 사용할 수 있다. 완성된 구현은 테스트용 샌드박스 버전으로 온라인으로 제공되며  [여기](https://restframework.herokuapp.com/)에서 확인할 수 있다.



## Setting up a new environment

```
mkdir restAPI_study
cd restAPI_study
```

다른 작업을하기 전에 venv를 사용하여 새로운 가상 환경을 만듭니다. 이를 통해 패키지 구성이 현재 진행중인 다른 프로젝트와 잘 격리되어 있습니다.

```
pyenv virtualenv 3.7.5 restAPI-env
pyenv local restAPI-env
```

이제 가상 환경에 있으므로 패키지 요구 사항을 설치할 수 있습니다.

```
poetry init
poetry add django djangorestframework pygments django_extensions notebook
```



## Getting started

이제 코딩 할 준비가되었습니다. 시작하기 위해 작업 할 새 프로젝트를 만들어 봅시다.

```
django-admin startproject config
mv config app
```

```
./manage.py startapp snippets
```

```
pycharm-community .
```

pycharm setting에서 interpreter설정까지 마무리합니다.



> snippets는 코드 조각을 말한다.



새로운 `snippets` 앱과 `rest_framework`앱을 `INSTALLED_APPS`에 추가해야합니다. `tutorial/settings.py` 파일을 편집 해 봅시다 

```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    'snippets.apps.SnippetsConfig',
    'django_extensions',
]
```



## Creating a mode to work with

이 학습서의 목적을 위해 코드 스니펫을 저장하는 데 사용되는 간단한 스니펫 모델을 작성하여 시작하겠습니다. `snippets/models.py` 파일을 편집하십시오. 



```python
from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICE = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLE_CHOICES = sorted([(item, item) for item in get_all_styles()])

class Snippet(models.Model):
    created = models.DateTimeField(auto_now_add=Trues)
    title = models.CharField(max_length=100, blank=True, defalut='')
    code = models.TextField()
    linenos = models.BooleanField(default=Falser)
    language = models.CharField(choices=LANGUAGE_CHOICES, default='python', max_length=100)
    style = models.CharField(choices=STYLE_CHOICES, default='friendly', max_length=100)
    
    class Meta:
        ordering = ['created']
```

위와 같이 Snippet 모델을 정해줄 수 있습니다.



> **`LEXERS = [item for item in get_all_lexers() if item[1]]` 코드를 알아보기 위해 jupyter notebook 열고 기능 알아보기**
>
> ```python
> from pygments.lexers import get_all_lexers
> from pygments.styles import get_all_styles
> 
> LEXERS = []
> for item in get_all_lexers():
> 	print(item)
> 	if item[1]:
> 		LEXERS.append(item)
> ```
>
> 위와 같이 코드를 작성하면 아래와 같이 지원하는 언어들이 출력된다.
>
> ```
> ('Python', ('python', 'py', 'sage', 'python3', 'py3'), ('*.py', '*.pyw', '*.jy', '*.sage', '*.sc', 'SConstruct', 'SConscript', '*.bzl', 'BUCK', 'BUILD', 'BUILD.bazel', 'WORKSPACE', '*.tac'), ('text/x-python', 'application/x-python', 'text/x-python3', 'application/x-python3'))
> ```

> pygments는 어떤 코드를 받았을 때 색을 입혀줄 수 있는 라이브러리이다.



> **`LANGUAGE_CHOICE = sorted([(item[1][0], item[0]) for item in LEXERS])` 코드 알아보기**
>
> ```python
> LANGUAGE_CHOICES = []
> for item in LEXERS:
>     cur_tuple = (item[1][0], item[0])
>     print(cur_tuple)
>     LANGUAGE_CHOICES.append(cur_tuple)
> ```
>
> 어떤 언어들이 choice에 들어가는지 알 수 있다.



> **`STYLE_CHOICES = sorted([(item, item) for item in get_all_styles()])` 코드 알아보기**
>
> ```python
> STYLE_CHOICES = []
> for item in get_all_styles():
> 	print(item)
> 	cur_tuple = (item, item)
> 	STYLE_CHOICES.append(cur_tuple)
> ```
>
> style theme라고 생각할 수 있다.



> **[sort와 sorted의 차이]**
>
> **sorted** 함수는 **정렬된 새로운 리스트를 리턴**시켜준다.
>
> **sort** 메소드는 아무것도 리턴시켜주지 않는다. (**None을 리턴**한다.) 단, 기존의 리스트 자체를 정렬해버린다.
>
> ```python
> some_list = [5, 7, 2, 3, 1]
> print(sorted(some_list))	# [1,2,3,5,7]
> print(some_list.sort())		# None이 리턴되나 some_list 자체를 정렬함
> ```



단, 위 코드에서 ordering은 정렬을 하는 필드에 따로 설정하지 않으면 create 순서로 항상 정렬되게 된다. 정렬은 비싼 연산이기 때문에 ordering에 들어간 필드는 인덱스 처리(필드에 들어간 정보가 오름차순인지 내림차순인지 미리 만들어 놓는 것)를 하자.



정렬 상태를 만들어 놓는 것을 DB에서 인덱스를 만들어 놓는다고 한다. (snippet table에 인덱스 만들기)

created_date index table = row 수 만큼 갖고 있게된다. 그럼 create_date 크기를 비교해 정렬하지 않고 created_date index table 순서대로 꺼내올 수 있다.

> Django에서는 RelatedField(ForeignKey, ManyToMany, OneToOne)은 index가 무조건 잡혀있기 때문에 안잡아줘도 된다.



하지만 인덱스를 만들어 놓는 것에도 단점이 있다.

- Snippet이 중간에 추가되어 새로운 숫자를 넣어야 하는 경우 언제 들어가야 할 지 정렬해야한다. 추가하는데는 시간이 소요된다. 대신 꺼내오는데는 시간이 별로 안든다.
- 또한 create_date index table이 추가되어야하기 때문에 DB에 공간을 더쓴다.



인덱스를 넣는 방법은 2가지 이나 meta에 넣는 것을 Django가 권장하고 있다.

```python
# 첫번째 방법, DB 인덱스 설정 (Field.db_index)
created = models.DateTimeField(auto_now_add=True, db_index=True)
```

```python
# 두번째 방법, DB 인덱스 설정 (Model.Meta) 이것이 더 일반적임
class Meta:
	ordering = ['created']
	indexes = [
		models.Index(fields=['created']),
	]
```

> `fields=['created']` 형태라서 두 개의 필드를 묶어 인덱스를 만들 수도 있다.



스니펫 모델의 초기 migration을 작성하고 DB를 처음으로 동기화하자

```python
$ ./manage.py makemigrations
$ ./manage.py migrate
```

```python
$ ./manage.py runserver
```

```python
$ ./manage.py createsuperuser
```



실제 어떻게 나오는지 확인이 어렵기 때문에 admin을 추가해보자.

```python
# snippets/admin.py
from django.contrib import admin
from .models import Snippet

@admin.register(Snippet)
class SnippetAdmin(admin.ModelAdmin):
    pass
```



```python
$ ./manage.py createsuperuser
$ ./manage.py runserver
```



`localhost:8000/admin`에 접속하여 잘 나오는지 확인해보자.



## Creating a Serializer class

웹 API에서 시작해야 할 첫번째 사항은 snippets 인스턴스를 json과 같은 표현으로 serialize하고 deserialize하는 방법을 제공하는 것입니다. Django의 양식과 매우 유사한 serializer를 선언하여 이를 수행 할 수 있습니다. 



#### Serializer의 역할

serialize(직렬화)와 deserialize(역직렬화) 역할을 다 수행해준다.

- serialize(직렬화)란?

  메모리에 갖고 있는 비연속적인 데이터를 연속적인 데이터로 만드는 과정을 말한다.

  연속적인 데이터의 예로는 파일과 문자열이 있다.

- deserialize(역직렬화)란?

  연속적인 데이터를 파이썬이 사용하는 데이터 형태로 만드는 과정을 말한다.

  deserializer하는 데이터를 받았을 때 DB에 저장(새로운 객체를 만듬), 기존의 객체 업데이트를 하고 싶을 것이다.

```
Custom Python object((CustomClass) Object 또는 Instance)
-> (Serializer)-> Python data type 
-> (Renderer) -> String(JSON, xml, yaml)
```

Serializer가 Django가 가진 `models.DateTimeField`와 같은 것을 Python 언어로만 알아들 을 수 있게 python 기본 타입으로 바꾼 다음 String으로 변환한다. String으로 변환 전 Renderer과정을 거치는데 이는 외부에서 읽을 수 있는 형태로 바꿔주는 역할이다.



```
Custom Python object((CustomClass) Object 또는 Instance)
-> (Serializer) -> Python data type 
-> (Renderer) -> JSONserializer = SnippetSerializer(snippet)
	snippet: 		Custom Python object
	serializer:		snippet object를 Python data type으로 변환할 수 있는 Serializer객체
		-> .data (snippet object를 Python data type으로 가져오는 property)
		
Deserialize과정
JSON string
 -> (Parser) -> Python data type
 -> (Serializer) -> Custom object(Model instance)
						(create / update)
```



snippets 디렉토리에 serializers.py라는 파일을 작성하고 다음을 추가하자.

```python
from rest_framework import serializers
from snippets.models import Snippet, LANGUAGE_CHOICES, STYLE_CHOICES


class SnippetSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=False, allow_blank=True, max_length=100)
    code = serializers.TextField()
    linenos = serializers.BooleanField(required=False)
    language = serializers.ChoiceField(choices=LANGUAGE_CHOICES, default='python')
    style = serializers.ChoiceField(choices=STYLE_CHOICES, default='friendly')

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return Snippet.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.title = validated_data.get('title', instance.title)
        instance.code = validated_data.get('code', instance.code)
        instance.linenos = validated_data.get('linenos', instance.linenos)
        instance.language = validated_data.get('language', instance.language)
        instance.style = validated_data.get('style', instance.style)
        instance.save()
        return instance
```

serializer class의 첫번째 부분은 serialized/deserialized를 정의하는 것이다. `create()` 및 `update()` 메소드는 `serializer.save()`를 호출 할 때 완전한 인스턴스가 작성 또는 수정되는 방법을 정의합니다.

serializer class는 Django Form 클래스와 매우 유사하며, 필수, max_length 및 default와 같은 다양한 필드에 유사한 유효성 검사 플래그를 포함합니다.

필드 플래그는 HTML로 렌더링 할 때와 같은 특정 상황에서 직렬 변환기가 표시되는 방법을 제어 할 수도 있습니다. 위의 { 'base_template': 'textarea.html'} 플래그는 Django Form 클래스에서 widget = widgets.Textarea를 사용하는 것과 같습니다. 이 자습서의 뒷부분에서 볼 수 있듯이 탐색 가능한 API가 표시되는 방법을 제어하는 데 특히 유용합니다. 나중에 보겠지만 ModelSerializer 클래스를 사용하면 실제로 시간을 절약 할 수 있지만 지금은 serializer 정의를 명시적으로 유지합니다.



작성한 코드를 가지고 확인해보겠습니다.

```python
snippet = Snippet.objects.get_or_create(
    title='Sample snippet',
    code=('class Post(models.Model):\n'
          'title=models.CharField()')
)[0]
```

(장고 버전이 3 미만으로 설정해야 해당 코드가 실행되는 점 참고)

```python
snippet.code
```

출력 : `class Post(models.Model):\ntitle=models.CharField()`

```python
from snippets.serializers import SnippetSerializer
serializer = SnippetSerializer(snippet)
```

```python
serializer.data
```

출력 : `{'pk': 1, 'title': 'Sample snippet', 'code': 'class Post(models.Model):\ntitle=models.CharField()'}`

```python
# Custom Python object
snippet
```

출력 : `<Snippet: Snippet object (1)>`

```python
# Custom object는 Python data type으로 변환할 수 있는 Serializer
serializer
```

```python
# Serializer가 custom object를 Python data type으로 변환
serializer.data
```

출력 : `{'pk': 1, 'title': 'Sample snippet', 'code': 'class Post(models.Model):\ntitle=models.CharField()', 'linenos': False, 'language': 'python', 'style': 'friendly'}`

```python
# 내장 json모듈을 사용해서 Python data type을 JSON string으로 변환
import json

json_data = json.dumps(serializer.data)
json_data
```

출력 : `'{"pk": 1, "title": "Sampel snippet", "code": "class Post(models.Model):\\ntitle=models.CharField()", "linenos": false, "language": "python", "style": "friendly"}'`

```python
# deserializer 과정
import json
data = {
    "title": "Create Snippet",
    "code": "def create():",
    "linenos": True,
    "language": "python",
    "style": "monokai"
}
json_string = json.dumps(data)
json_string

# 또는 간단히 아래와 같이 선언해도 됨
# json_string = '{"title": "Create Snippet", "code": "def create():", "linenos": true, "language": "python", "style": "monokai"}' 
```

출력 : `'{"title": "Create Snippet", "code": "def create():", "linenos": true, "language": "python", "style": "monokai"}'`

```python
# Parser -> Python data Type
import json
data = json.loads(json_string)
data
```

출력 : `{'title': 'Create Snippet',
 'code': 'def create():',
 'linenos': True,
 'language': 'python',
 'style': 'monokai'}`

```python
# Serializer -> Custom object
serializer = SnippetSerializer(data=data)
# 검증하기
serializer.is_valid()
```

출력: `True`

```python
# 검증하기 위 데이터가 검증이 된다면 아래에 접근이 가능해진다.
serializer.validated_data
```

출력 : `OrderedDict([('title', 'Create Snippet'),
             ('code', 'def create():'),
             ('linenos', True),
             ('language', 'python'),
             ('style', 'monokai')])`

```python
d = serializer.validated_data
Snippet.objects.create(
    title=d['title'],
    code=d['code'],
    linenos=d['linenos'],
)
```

> 매번 우리가 이렇게 해줄 수 없으니 serializers.py 내 아래와 같이 만들어줌
>
> ```python
> def create(self, validated_data):
> 	return Snippet.objects.create(**validated_data)
> ```

```python
# Serializer -> Custom object
from snippets.serializers import SnippetSerializer
serializer = SnippetSerializer(data=data)
serializer.is_vaild()

# 새 Snippet 객체를 생성 (Serializer.create()를 호출)
new_snippet = serializer.save()
```

save를 호출하면 create를 알아서 호출해준다.

```python
new_snippet	// < Snippet : Snippet objects (2) >
new_snippet.title // 'Create Snippet'
```

> 기존 객체를 변화 시키고 싶은 경우를 위해 serializers.py 내 update함수를 추가해준다.
>
> ```python
> def update(self, instance, validated_data):
> 	 for key,value in validated_data.items():
>      	setattr(instance, key, value)
> 	instance.save()
>     return instance
> ```
>
> setattr은 `instance.a = 'apple'`과 `setattr(instance, 'a', 'apple')`은 정확히 같은 뜻이다.





## Using ModelSerializers

ModelSerializer를 사용하면 더 쉽게 코드를 작성할 수 있다.

현재 적어준 serializers.py와 코드가 동일하기 때문에, django model을 사용한다고 하면 더 간단히 할 수 있다.



Serialize 과정은

```
Custom Python object -> (Serializer) -> Python data type -> (Renderer) -> JSON
```

에서 Serializer 과정을 직접 모두 선언해줬다.



하지만 ModelSerializer를 사용하면 Custom Python object가 Model Class의 instance면, 그 과정을 거의 자동으로 변환해준다.



serializers.py 코드를 아래와 같이 수정한다.

```python
from rest_framework import serializers
from .models import Snippet

class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        fields = (
        	'pk',
            'title',
            'code'
            'linenos',
            'language',
            'style',
            'created'
        )
```

serializer를 생성해 확인해보면 알아서 Field까지 생성이 되어있는 것을 확인할 수 있다.

그리고 create()와 update() 메소드가 기본적으로 구현이 되어있다.



---



`snippets / views.py`

```python
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import Snippet
from .serializers import SnippetSerializer

@csrf_exempt
def snippet_list(request):
    if request.method == 'GET':
        snippets = Snippet.objects.all()
        serializer = SnippetSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)
```

한번에 여러개 넣을 수 있기 때문에 many=True를 넣어준다.



> `@csrf_exempt`는 우리가 Django로 프론트 작업할 때 넣어줬던 것을 끄는 것이다.
>
> 이유는, csrf를 넣을 수 있는 것은 Django가 front를 만들었을 때 밖에 없다. Django로 front를 만들지 않는다면 csrf 인증을 쓸 수가 없다. 그래서 항상 error가 나기 때문이다



이제 url과 연결시켜보자.

```python
# snippets/urls.py

from django.urls import path
from . import views

app_name = 'snippets'

urlpatterns = [
    path('snippets/', views.snippet_list),
]
```



```python
# configs/urls.py
(...)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('snippets.urls')),
]
```





```python
# snippets/views.py

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import Snippet
from .serializers import SnippetSerializer

@csrf_exempt
def snippet_list(request):
    if request.method == 'GET':
        snippets = Snippet.objects.all()
        serializer = SnippetSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = SnippetSerializer(data=data)
        if serializer.is_valid():
            serializer.save() # 새로운 개체를 만들어준다.
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
```

JSONParser는 rest_framework.parser에 이미 존재한다.

renderer가 따로 존재하지 않는 이유는 JsonResponse 안쪽에서 알아서 Python 형식의 data를 rendering 해주기 때문이다.



POSTMAN을 설치해 동작을 확인해보자

> 매번 동작을 정의해주는 것은 번거롭기 때문에 Collections에 DRF Tutorial 폴더를 만들고 Snippet List를 만들어 저장해놓고 사용할 수 있다.



그리고 GET 요청으로`http://localhost:8000/snippets/` Send 해보자

JSON parse error가 날텐데 그 이유는 데이터를 보내지 않았기 때문이다.

JSON 데이터는 항상 일정한 형식({} 또는 []) 으로 와야한다. 빈 값을 보내려고 해도 {}나 []를 보내줘야한다.



Body에 raw를 클릭하고 JSON으로 바꿔 내부에 {}를 입력해준다.

그 다음 Send를 보내면 정상적인 Error Message가 출력될 것이다.



`code = serializers.TextField()`라고 우리가 models을 정의해줬기 때문에 code 값을 보내줘야하는데 비어있어 오류가 출력될 것이다.



Body에 아래 내용을 입력하고 다시 Send 해주자

```json
{
	"code": "def api_test()"
}
```



```python
# snippets/views.py

(...)

@csrf_exempt
def snippet_detail(request, pk):
    # `rest_framework.generics.get_object_or_404() import하기 
    snippet = get_object_or_404(Snippet, pk=pk)
    
    if request.method == 'GET':
        serializer = SnippetSerializer(snippet)
        return JsonResponse(serializer.data)
```



> get_object_or_404를 import할 때,
>
> `django.shortcuts.get_object_or_404()` : 오류가 나면 오류에 대한 html을 return해준다.
>
> `rest_framework.generics.get_object_or_404()` : 오류가 나면 json을 return해준다.



```python
# urls.py
from django.urls import path

from . import views

app_name = 'snippets'

urlpatterns = [
    path('snippets/', views.snippet_list),
    path('snippets/<int:pk>/', views.snippet_detail),
]
```



`http://localhost:8000/snippets/1/`에 GET요청을 보내면 1번 객체에 대한 정보만 return 되는지 확인해보자.



update 처리하기

```python
# snippets/views.py

(...)

@csrf_exempt
def snippet_detail(request, pk):
    (...)
    
    if request.method == 'GET':
        (...)
        
	elif request.method == 'PATCH':
        data = JSONParser().parse(request)
        serializer = SnippetSerializer(snippet, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)        
```



http://localhost:8000/snippets/1/`에 Body를 아래와 같이 작성 후 PATCH 요청을 보내 return되는 값을 확인해보자.

```json
{
	"title" : "New Title"
}
```

근데 위와 같이 보내면 code 영역이 필요하다는 error가 출력된다.



이유는 유효성 검사를 할 때 serializer가 가진 require field를 모두 다 검사한다. 근데 우리가 원하는건 다른 건 그대로 두고 title만 바꾸고  싶은 것이다. 그때는 serializer를 생성할 때 `partial`이라는 하나의 옵션을 추가적으로 넣어줘야한다.

`partial`은 일부분만 업데이트를 허용할 것인지에 대한 설정이다.



그래서 위 코드 중에 아래부분을

```python
serializer = SnippetSerializer(snippet, data=data)
```

다음과 같이 변경해줘야한다.

```python
serializer = SnippetSerializer(snippet, data=data, partial=True)
```



이제 지우는 코드를 작성해보자.

```python
# snippets/views.py

(...)

@csrf_exempt
def snippet_detail(request, pk):
    (...)
    
    if request.method == 'GET':
        (...)
        
	elif request.method == 'PATCH':
        (...)
        
	elif request.method == 'DELETE':
        snippet.delete()
        # 지웠기 때문에 돌려줄 데이터가 없다. 204는 성공은 했지만, 돌려줄 데이터는 없다는 상태코드이다.
        return HttpResponse(status=204)
```

근데 html form에서는 POST와 GET 요청만 보낼 수 있다.

근데 우리는 PATCH와 DELETE를 사용하고 있다. 이는 http library를 이용해서 직접 요청하는 방법밖에 없다.



이렇게 우리가 CRUD 기능을 구현했다.



