# django tutorial

이 문서는 장고 튜토리얼(https://docs.djangoproject.com/ko/2.2/intro/tutorial01/)을 바탕으로 작성된 문서입니다.



## part4, 첫번째 장고 앱 작성하기



### 간단한 폼 만들기

polls/detail.html을 수정하여, 템플릿에 HTML <form>요소를 포함시켜보자.

```python
# polls/templates/polls/detail.html

<h1>{{ question.question_text}}</h1>

{% if error_message %}<p><strong>{{ error_message }}</strong></p>{% endif %}

<form action="{% url 'polls:vote' question.id %}" method="post">
    {% csrf_token %}
    {% for choice in question.choice_set.all %}
        <input type="radio" name="choice" id="choice{{ forloop.counter}}" value="{{choice.id}}">
        <label for="choice{{ forloop.counter }}">{{ choice.choice_text }}</label><br>
    {% endfor %}
    <input type="submit" value="Vote">
</form>
```



- Vote 버튼을 클릭하면 POST 데이터인 choice=#를 보낼 것이다. #은 선택한 항목의 ID이다.
- forloop.counter는 for 태그가 반복을 한 횟수를 나타낸다.
- 우리는 자료를 수정하는 효과를 가진 POST 폼을 만들고 있어서, 사이트 간 요청 위조(Cross Site Request Forgeries)에 대해 고민해야한다. Django는 사이트간 요청 위조에 대항하기 위한 사용하기 쉬운 시스템을 가지고 있다. 내부 URL들을 향하는 모든 POST 폼에 템플릿 태그 {% csrf_token %}를 사용하면 된다.



이미 우리는 polls/urls.py에 vote 경로를 추가해주었고, vote()함수를 가상으로 만들었다.

실제 구현을 위해 아래 코드를 추가하자

```python
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse

from .models import Choice, Question

def results(request, question_id):
    response = "result"
    return HttpResponse('response question_id')

def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        return render(request, 'polls/detail.html', {
            'question': question,
            'error_message': "You didn't select a choice.",
        })
    else:
        selected_choice.votes += 1
        selected_choice.save()
        return HttpResponseRedirect(reverse('polls:results', args=(question_id,)))
```

- request.POST는 키로 전송된 자료에 접근할 수 있도록 해주는 사전과 같은 객체이다. request.POST의 값은 항상 문자열이다.
- 만약 POST자료에 choice가 없으면 request.POST['choice']는 KeyError가 일어난다. 위 코드는 KeyError를 체크하고, choice가 주어지지 않은 경우 에러메시지와 함께 설문조사 폼을 다시 보여준다.
- 설문지의 수가 증가한 이후에 HttpResponse가 아닌 HttpResponseRedirect를 반환한다. POST 데이터를 성공적으로 처리한 후에는 항상 HttpResponseRedirect를 반환해야한다. (웹 개발 권장사항)
- reverse() 함수는 뷰 함수에서 URL을 하드코딩하지 않도록 도와준다. 제어를 전달하기 원하는 뷰의 이름을, URL패턴의 변수부분을 조합해서 해당 뷰를 가리킨다.



설문조사에 설문을 하고난 뒤에, vote() 뷰는 설문조사 결과 페이지로 리다이렉트한다.

```python
# polls/view.py
from django.shortcuts import get_object_or_404, render

def results(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, 'polls/result.html', {'question': question})
```

위 함수는 detail() 뷰와 거의 동일하다. 추후 중복을 수정하도록하고 polls/results.html 템플릿을 만들어보자



```html
# polls/results.html
<h1>{{ question.question_text }}</h1>

<ul>
    {% for choice in question.choice_set.all %}
        <li>{{ choice.choice_text }} -- {{ choice.votes }} vote {{choice.votes|pluralize}}</li>
    {% endfor %}
</ul>

<a href="{% url 'polls:detail' question.id %}">VOTE AGAIN?</a>
```

웹브라우저로 가서 /polls/1/ 페이지로 가서 투표를 해보면 투표할 때 마다 값이 반영된 결과 페이지를 볼 수 있을 것이다.

만약 설문지를 선택하지 않고 폼을 전송했다면, 오류 메시지를 보게 될 것이다.



### 제너릭 뷰 사용하기: 적은 코드가 더 좋다

위에서 detail()과 results()는 중복된다는 것을 확인했다.

기본적인 뷰는 URL에서 전달된 매개변수에 따라 데이터베이스에서 데이터를 가져오는 것과 템플릿을 로드하고 렌더링 된 템플릿을 리턴하는 기본 웹 개발의 일반적인 경우를 나타낸다. Django는 이런 매우 일반적인 경우를 위해 제너릭 뷰 시스템이라는 지름길을 제공한다.



제너릭 뷰는 일반적인 패턴을 추상화하여 앱을 작성하기 위해 Python코드를 작성하지 않아도 된다.



#### URLconf 수정

```python
# polls/urls.py

from django.urls import path

from . import views

app_name = 'polls'
urlpatterns = [
    path('', views.IndexView.as_view(), name="index"),
    path('<int:pk>/', views.DetailView.as_view(), name='detail'),
    path('<int:pk>/results/', views.ResultsView.as_view(), name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
]s
```



#### views 수정

이전 index, detail, results뷰를 제거하고 장고의 일반적인 뷰를 사용하겠다.

```python
# polls/views.py

from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic

from .models import Choice, Question

def IndexView(generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'latest_question_list'

    def get_queryset(self):
        return Question.objects.order_by('-pub_date')[:5]
    
def DetailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'
    
def ResultsView(generic.DetailView):
    model = Question
    template_name = 'polls/results.html'
```



ListView와 DetailView의 두가지 제너릭 뷰를 사용하고 있다. 이 두보기는 각각 '개체 목록 표시' 및 '특정 개체 유형에 대한 세부 정보 페이지 표시' 개념을 추상화한다.



- 각 제너릭 뷰는 어떤 모델이 적용될 것인지 알아야한다. 이것은 model 속성을 사용하여 제공된다.
- DetailView 제너릭 뷰는 <app name>/<model name>_detail.html 템플릿을 사용한다. template_name 속성은 Django에게 자동 생성 된 기본 템플릿 이름 대신에 특정 템플릿 이름을 사용하도록 알려주기 위해 사용된다.
- ListView 제너릭 뷰는 <app name>/<model name>_list.html 템플릿을 사용한다.