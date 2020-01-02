# django tutorial

이 문서는 장고 튜토리얼(https://docs.djangoproject.com/ko/2.2/intro/tutorial01/)을 바탕으로 작성된 문서입니다.



## part3, 첫번째 장고 앱 작성하기



### 뷰 추가하기

```python
# polls/views.py

def detail(request, question_id):
    return HttpResponse("You're looking at question {}".format(question_id))


def results(request, question_id):
    return HttpResponse("You're looking at the results of question {}".format(question_id))


def vote(request, question_id):
    return HttpResponse("You're voting on question {}".format(question_id))
```



다음의 path() 호출을 추가하여 새로운 뷰를 polls.urls 모듈로 연결하기

```python
# polls/urls.py

from django.urls import path

from . import views
from .views import detail, results, vote

urlpatterns = [
    path('', views.index, name="index"),
    path('<int:question_id>/', detail, name='detail'),
    path('<int:question_id>/results/', results, name='results'),
    path('<int:question_id>/vote/', vote, name='vote'),
]
```

브라우저에 `http://localhost:8000/polls/34`를 입력해보자. 이 주소에 접속하면 detail()  함수를 호출하여 URL에 입력한 ID를 출력할 것이다. `/polls/34/results/`와 `/polls/34/votes/`를 입력하면  해당 링크에 맞는 화면이 표시될 것이다.



![image-20191218200741432](/home/jungsuji/.config/Typora/typora-user-images/image-20191218200741432.png)

너무 귀여운 장고 튜토리얼ㅋㅋ



### 뷰가 실제로 뭔가를 하도록 만들기

각 뷰는 요청된 페이지의 내용이 담긴 HttpResponse 객체를 반환하거나, 혹은 Http404 같은 예외를 발생하게 해야한다.



새로운 index() 뷰 하나를 호출했을 때, 시스템에 저장된 최소 5개의 투표 질문이 콤마로 분리되어, 발행일에 따라 출력되도록 해봅시다

```python
# polls/views.py
from django.http import HttpResponse
from .models import Question

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    output = ', '.join([q.question_text for q in latest_question_list])
    return HttpResponse(output)
```



만약, 뷰에서 페이지의 디자인이 하드코딩 되어있다고 가정할 때 만약 페이지가 보여지는 방식을 바꾸고 싶다면, Python 코드를 편집해야한다.



뷰에서 사용할 수 있는 템플릿을 작성해 Python 코드로부터 디자인을 분리하도록 Django의 템플릿 시스템을 사용해보자.



우선 polls 디렉토리에 templates라는 디렉토리를 만든다. Django는 여기서 템플릿을 찾게 될 것이다. 프로젝트의 TEMPLATES 설정은 Django가 어떻게 템플릿을 불러오고 렌더링 할 것인지 기술한다.

> 기본 설정 파일은 APP_DIRS 옵션이 True로 설정된 DjangoTemplates 백엔드를 구성한다. 관례에 따라 DjangoTemplates는 각 INSTALLED_APPS 디렉토리의 'templates' 하위 디렉토리를 탐색한다.



```python
# config/setting.py 아래 코드 추가

TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')

TEMPLATES = [
    {
        'DIRS': [TEMPLATE_DIR],
    }
```



다음과 같이 폴더 구조를 만들고 코드를 입력한다.

```python
# polls/templates/polls/index.html

{% if latest_question_list %}
    <ul>
        {% for question in latest_question_list %}
            <li><a href="/polls/{{ question.id }}/">{{question.question_text}}</a></li>
        {% endfor %}
    </ul>
{% else %}
    <p>No polls are available.</p>
{% endif %}
```



이제 템플릿을 이용하여 polls/views.py에 index 뷰를 업데이트 해보자

```python
# polls/views.py
from django.http import HttpResponse
from django.template import loader

from .models import Question

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    template = loader.get_template('polls/index.html')
    context = {
        'latest_question_list' : latest_question_list,
    }
    return HttpResponse(template.render(context, request))
```

이 코드는 polls/index.html 템플릿을 불러온 후, context를 전달한다. context는 템플릿에서 쓰이는 변수명과 Python 객체를 연결하는 사전형 값이다.



다른 방법으로는 **render()**가 있다. render() 함수는 request객체를 첫번째 인수로 받고, 템플릿 이름을 두번째로 받으며, context 사전형 객체를 세번째 선택적 인수로 받는다.

템플렛에 context를 채워넣어 표현한 결과를 HttpResponse 객체와 함께 돌려주는 구문은 자주 쓰는 용법이다.

```python
# polls/views.py
from django.shortcuts import render
from .models import Question

def index(request):
    latest_question_list = Qustion.objequesticts.order_by('-pub_date')[:5]
    context = {'latest_question_list': latest_question_list}
    return render(request, 'polls/index.html', context)
```

위 코드를 단축해서 적어보았다.



### 404 에러 일으키기

질문의 상세 뷰에 태클을 걸어보자

```python
# polls/views.py

from django.http import Http404
from django.shortcuts import render

from .models import Question

def detail(request, question_id):
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        raise Http404("Question does not exist")
    return render(request, 'polls/detail.html', {'question':question})
```

위 코드로 뷰는 요청된 질문의 ID가 없을 경우 Http404 예외를 발생시킨다.



다른 방법으로는 **get_object_or_404()**가 있다. 이 함수는 Django 모델을 첫번째 인자로 받고, 몇개의 키워드 인수를 모델 관리자의 get() 함수에 넘긴다. 만약 객체가 존재하지 않을 경우, Http404 예외가 발생한다.

비슷한 함수로는 get_list_or_404()가 있다. 이 함수는 get() 대신 filter()를 쓴다는 것이 다르다. 리스트가 비어있을 경우, Http404 예외를 발생시킨다.

위 코드를 이 방법으로 적용하면 코드는 다음과 같이 변경된다.

```python
from django.shortcuts import get_object_or_404, render

from .models import Question

def detail(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, 'polls/detail.html'), {'question': question}
```



우선 다음 단계로 넘어가기에 앞서 아래 파일을 작성한다.

```python
# polls/templates/polls/detail.html

{{ question }}
```



### 템플릿에서 하드코딩된 URL 제거하기

```html
<li><a href="/polls/{{ question.id }}/">{{question.question_text}}</a></li>
```

앞서 polls/index.html 템플릿에 위와 같이 링크를 적으면 이 링크는 부분적으로 하드코딩 된다. 이러한 접근 방식은 수많은 템플릿을 가진 프로젝트들의 URL을 바꾸는게 어려운 일이 된다.

polls.urls 모듈의 path() 함수에서 인수의 이름을 정의했으므로 {% url %} template 태그를 사용하여 url 설정에 정의된 특정한 URL 경로들의 의존성을 제거할 수 있다.

```html
<li><a href="{% url 'detail' question.id %}">{{question.question_text}}</a></li>
```



### URL의 이름공간 정하기

실제 Django 프로젝트에는 여러개의 앱이 올 수 있다. Django는 이 앱들의 URL을 구별할 수 있는데 방법은 URLconf에 이름공간(namespacr)을 추가하는 것이다.

아래 코드와 같이 작성하면 이름공간을 설정할 수 있다.

```python
# polls/urls.py

from django.urls import path

from . import views

app_name = 'polls'
urlpatterns = [
    path('', views.index, name='index'),
    path('<int:question_id>/', views.detail, name='detail'),
    path('<int:question_id>/results/', views.results, name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
```



위와같이 지정해줬다면, 아래와 같이 코드를 수정한다.

```python
# polls/templates/polls/index.html

# 변경 전 코드
# <li><a href="{% url 'detail' question.id %}">{{question.question_text}}</a></li>

# 변경 코드
<li><a href="{% url 'polls:detail' question.id %}">{{question.question_text}}</a></li>
```

