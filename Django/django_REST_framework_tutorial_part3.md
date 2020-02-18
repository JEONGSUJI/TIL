# Django Rest framework - 02.Request and Responses

[rest-framework 공식문서](https://www.django-rest-framework.org/tutorial/quickstart/)와 [번역된 참고 문서](https://github.com/KimDoKy/DjangoRestFramework-Tutorial/blob/master/REST Framework Tutorial.md)를 보고 실습하며 작성한 글 입니다.



원래 Django에서 쓰던 request는 request.POST랑 request.Files를 둘로 나눠서 썼었다?

Django에서 기본적으로 존재하는 HTTP Request는 POST 밖에 못 받는다.

그렇지만 다른 method들도 받아야 한다. 그런 내용이 Request objects에 들어있고



http response가 아니라 좀더 json 형식으로 잘 보내줄 수 있는 Response objects가 따로 있다.

그래서 return할 때 아래와 같이 Response라는 애를 써줘야한다.

```python
return Response(data)
```



Status codes

지금까지 Status codes도 숫자로 보냈는데, 숫자로 보내면 알아보기가 힘들기 때문에 module이 따로 존재한다. 이 module을 사용하면 우리가 뭘 보내고 있는지 소스코드에서 쉽게 파악할 수 있다.



Wrapping API views

그리고 지금 get_or_404를 했을 때 html이 돌아왔다. 그게 Django가 가지고 있는 view 함수가 기본적으로 그렇게 동작하게 되어있다. 그런 동작들을 재정의하기 위해서 Wrapping API views라는 모듈이 존재한다.

function based views에서 쓸 수 있고, class-based views에서도 쓸 수 있다. 





# Django Rest framework - 03. Class-based Views

snippets/apis.py 생성하기

```python
# snippets/apis.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Snippet
from .serializers import SnippetSerializer

class SnippetListCreateAPIView(APIView):
	def get(self, request):
        snippets = Snippet.objects.all()
        serializer = SnippetSerializer(snippets, many=True)
        return Response(serializer.data)
    
    def post(self, request):
		serializer = SnippetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
```



apis.py의 내용을 urls.py를 수정해보자.

```python
# snippets/urls.py

from django.urls import path

from . import views
from . import apis

app_name = 'snippets'
urlpatterns = [
    path('snippets/', views.snippet_list),
    path('snippets/<int:pk>/', views.snippet_detail),
]
```

위와 같았던 코드를 아래와 같이 수정한다.



```python
# snippets/urls.py

from django.urls import path

from . import views
from . import apis

app_name = 'snippets'
urlpatterns = [
    path('snippets/', apis.SnippetListCreateAPIView.as_view()),
]
```

Class-based view를 사용하는 경우, as_view() 함수를 호출해야한다.

as_view()의 역할은 원래 request가 전달되면 뒤에 함수를 전달해서 그 함수의 결과를 다시 돌려줬다. 근데 class 정의 자체는 함수가 아니다. 그래서 이 class가 가지고 있는 as_view()는 class method인데, as_view()를 호출하면 해당 class에만들어져 있는 def get, def post 라는 인스턴스 메서드를 사용해서 request를 처리할 수 있는 함수를 만들어준다.

그래서 class 자체를 전달하는 것이 아니라, class를 사용해서 새로운 함수를 만들어서 전달하는 것이다.



위와 같이 변경한 후 POSTMAN에서 `http://localhost:8000/snippets/`에 GET 요청을 보내면 결과가 잘 출력되어야 한다.



```python
# snippets/apis.py

(...)

class SnippetRetrieveUpdateDestroyAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Snippet, pk=pk)
    
    def get(self, request, pk):
        # 적절한 로직
        snippet = self.get_object(pk)
        serializer = SnippetSerializer(snippet)    	
        return Response(serializer.data)
    
    def patch(self, request, pk):
        snippet = self.get_object(pk)
        serializer = SnippetSerializer(snippet, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)    
```



```python
# snippets/urls.py

from django.urls import path

from . import views
from . import apis

app_name = 'snippets'
urlpatterns = [
    path('snippets/', apis.SnippetListCreateAPIView.as_view()),
    path('snippets/<int:pk>/', apis.SnippetRetrieveUpdateDestroyAPIView.as_view()),
]
```



위와 같이 변경한 후 POSTMAN에서 `http://localhost:8000/snippets/2/`에 GET 요청을 보내면 결과가 잘 출력되어야 한다.



이제 없는 곳에 접근하면 error message가 html 형식이 아닌 json 형태로 return되는 것을 확인할 수 있다. 이것이 APIView가 하는 일이다.



지금까지 한 작업은 views.py에서 작성한 형태를 class-based view로 apis.py 바꾼 것이다.

apis를 패키지화하여, 다양한 방법으로 만들어보자.



apis 폴더에 api_view.py를 만들어 위에서 작업한 apis.py 내부 코드를 옮기자



이때 urls.py는 다음과 같이 수정되어야한다.

```python
# snippets/urls.py

from django.urls import path

from .apis import api_view

app_name = 'snippets'
urlpatterns = [
    path('snippets/', api_view.SnippetListCreateAPIView.as_view()),
    path('snippets/<int:pk>/', api_view.SnippetRetrieveUpdateDestroyAPIView.as_view()),
]
```





# Django Rest framework - 06.GenericAPIView, Viewset, Router



### mixin

다음으로 우리가 해 볼 작업은 우리가 지금까지 작성한 CRUD 기능은 꼭 Post가 아니더라도 거의 동일한 코드로 동작한다.

지금까지는 하나하나 다 만들어줬지만, 반복되는 작업을 줄이기 위해 serializer를 modelSerializer로 바꾸듯이 mixin class를 사용하여 반복 작업을 줄일 수 있다.



mixin class는 단독적으로 동작하는 것이 아니라 다른 class에 붙어서 추가 동작을 구현해주는 것을 말한다.



apis 폴더에 mixins.py를 만든다.

api_view.py에 했던 내용을 비교하며 mixins.py를 만들어보자

```python
# apis/mixins.py

from rest_framework import generics, mixins

class SnippetListCreateAPIView(mixins.ListModelMixin,
                               generics.GenericAPIView):
    pass
```

generics은 범용적인, 포괄적인 이런 뜻인데, 여기저기서 비슷한 형태로 쓰일 수 있다는 의미이다.



GenericAPIView는 같은 부분을 제외하고 싶을 때 쓰는 것이다.  GenericAPIView는 같은 로직을 쓰는 부분 다 구현해놓고, 다른 것만 지정해서 쓸 수 있도록 도와주는 것이다.



만약 Snippet을 만든 것을 똑같이 Post를 만든다면 다른 것은 Model이랑 Serializer가 다른데 이를 어떻게 정의하는지 알아보자. 동일한 파일 내 코드지만 순차적으로 알아보기 위해 중복하며 적었다.



```python
# apis/mixins.py

from rest_framework import generics, mixins
from ..models import Snippet
from ..serializers import SnippetSerializer

class SnippetListCreateAPIView(mixins.ListModelMixin,
                               generics.GenericAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    
    # 이 API View가 어떤 메서드를 지원할 것인지 정의해줘야한다.
    
    def get(self, request, *args, **kwargs):
        objects = self.queryset
        serializer = self.serializer_class(objects, many=True)
        return Response(serializer.data)
```

인데, 위에서 인자로 넘겨준 mixins.ListModelMixin가 하는 일이 위에 정의해 놓은 def get()이 하는 일과 거의 비슷하다.

그 일을 mixins.ListModelMixin에 list()라는 함수가 담당한다. 우리는 mixins.ListModelMixin를 상속을 받았기 때문에 list() 함수를 사용할 수 있다. 따라서 위 코드를 아래와 같이 간단하게 바꿀 수 있다.



```python
# apis/mixins.py

from rest_framework import generics, mixins
from ..models import Snippet
from ..serializers import SnippetSerializer

class SnippetListCreateAPIView(mixins.ListModelMixin,
                               generics.GenericAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    
    # 이 API View가 어떤 메서드를 지원할 것인지 정의해줘야한다.
    
    def get(self, request, *args, **kwargs):
		return self.list(request, *args, **kwargs)
```



mixins.CreateModelMixin을 상속받으면, post 요청에서 사용할 수 있는 create() 함수를 사용할 수 있다.

```python
# apis/mixins.py

from rest_framework import generics, mixins
from ..models import Snippet
from ..serializers import SnippetSerializer

class SnippetListCreateAPIView(mixins.ListModelMixin,
                               mixins.CreateModelMixin
                               generics.GenericAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    
    # 이 API View가 어떤 메서드를 지원할 것인지 정의해줘야한다.
    
    def get(self, request, *args, **kwargs):
		return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
```



이제 코드를 더 추가해 SnippetRetrieveUpdateDestroyAPIView 코드도 작성해보자.

```python
# apis/mixins.py

(...)

class SnippetRetrieveUpdateDestroyAPIView(mixins.RetrieveModelMixin,
                                          mixins.UpdateModelMixin,
                                          mixins.DestroyModelMixin,
                                          generics.GenericAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
```



> update는 update와 partial_update 2개가 있는데, partial_update를 사용하는 이유는 다음과 같다.
>
> partial_update는 keyword argument에 partial을 추가해서 자신의 업데이트를 추가한다. 만약에 partial이 있다면 serializer를 만들때 그 partial을 넣어주기 때문이다.



이제 위 mixins.py를 사용할 수 있도록 urls.py를 수정해보자.

```python
# snippets/urls.py

from django.urls import path

from .apis import mixins

app_name = 'snippets'
urlpatterns = [
    path('snippets/', mixins.SnippetListCreateAPIView.as_view()),
    path('snippets/<int:pk>/', mixins.SnippetRetrieveUpdateDestroyAPIView.as_view()),
]
```



위와 같이 코드를 작성해 중복되는 코드는 줄였지만 mixin으로 작업하면 중간에 끼어들기가 힘들어진다.

만약 patch를 한다고 가정하면 기존 api_view.py로 작성한 코드는 중간에 넣어주면 되지만, mixins.py로 작성한 코드는 바로 return 해 버리기 때문에 객체를 발견할 수도 없고, serializer도 찾을 수 없다.

그럴 경우 update에 들어가보면 hook이 있다. def perform_update 함수를 재정의해주면 된다.





### generic class-based views



api_view.py에서 mixins.py로 코드를 많이 생략했지만, mixin 코드에서도 당연한 부분이 있어 해당 부분을 줄이고 싶다.



apis/generic.py 생성

```python
# apis/generics.py

from rest_framework import generics

class SnippetListCreateAPIView(generics.ListCreateAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    
class SnippetRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
```



이렇게만 작성하면 위에 우리가 열심히 작성한 mixins.py 내용과 동일한 코드가 된다.



이제 이 코드가 urls.py에서 동작할 수 있도록 수정해보자

```python
# snippets/urls.py

from django.urls import path

from .apis import generics

app_name = 'snippets'
urlpatterns = [
    path('snippets/', generics.SnippetListCreateAPIView.as_view()),
    path('snippets/<int:pk>/', generics.SnippetRetrieveUpdateDestroyAPIView.as_view()),
]
```





### viewset

위에 작성한 apis/generics.py 코드에서도 queryset, serializer_class가 동일하기 때문에 이것도 줄일 수 있다.

그렇지만 이는 추상화 작업(실제 동작을 가려놓음)이다. 추상화 작업이 많이 되어있다는 것은 실제 동작이 코드로 보이는 것이 아니라, 상속받은 부모 클래스나 사용하고 있는 외부 메서드에 실제 로직이 많이 가있는 것을 말한다.



apis/viewsets.py 추가하기

```python
# apis/viewsets.py
```



28

