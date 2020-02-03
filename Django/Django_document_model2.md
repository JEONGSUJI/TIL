이 문서는 QuerySet API의 세부 사항을 설명합니다. 모델 및 데이터베이스 쿼리 가이드에 제시된 자료를 기반으로하므로이 문서를 읽기 전에 해당 문서를 읽고 이해하고 싶을 것입니다.



### QuerySet가 평가 될 때

내부적으로 QuerySet은 실제로 데이터베이스에 충돌하지 않고 구성, 필터링, 슬라이스 및 전달 될 수 있습니다. 쿼리 세트를 평가할 때까지 실제로 데이터베이스 활동이 발생하지 않습니다.



다음과 같은 방법으로 QuerySet을 평가할 수 있습니다

- **Iteration**. QuerySet은 반복 가능하며 처음 반복 할 때 데이터베이스 쿼리를 실행합니다. 예를 들어 데이터베이스에있는 모든 항목의 헤드 라인을 인쇄합니다

```python
for e in Entry.objects.all():
    print(e.headline)
```

참고 : 원하는 결과가 하나 이상 있는지 확인하기 만하면 사용하지 마십시오. exist ()를 사용하는 것이 더 효율적입니다.

- **Slicing**. QuerySet 제한에 설명 된대로 Python의 배열 슬라이스 구문을 사용하여 QuerySet을 슬라이스 할 수 있습니다.평가되지 않은 QuerySet을 슬라이스하면 일반적으로 평가되지 않은 다른 QuerySet이 반환되지만 Django는 슬라이스 구문의 "step"매개 변수를 사용하면 데이터베이스 쿼리를 실행합니다.목록을 반환합니다. 평가 된 QuerySet을 슬라이스하면 목록도 리턴됩니다.

또한 평가되지 않은 QuerySet을 슬라이스하면 평가되지 않은 다른 QuerySet이 반환됩니다. 더 많은 수정 (예 : 더 많은 필터 추가 또는 순서 수정)은 SQL로 잘 변환되지 않으며 명확한 의미도 없기 때문에 허용되지 않습니다.

- **Pickling/Caching**. QuerySet 선택시 관련되는 세부 사항은 다음 섹션을 참조하십시오. 이 섹션의 목적을 위해 중요한 것은 데이터베이스에서 결과를 읽는 것입니다.
- **repr()**. repr ()을 호출하면 QuerySet이 평가됩니다. 이는 Python 대화식 인터프리터에서 편의를 위해 대화식으로 API를 사용할 때 결과를 즉시 볼 수 있습니다.

- **len()**. len ()을 호출하면 QuerySet이 평가됩니다. 예상 한대로 결과 목록의 길이를 반환합니다.

참고 : 세트의 레코드 수만 결정해야하고 실제 개체가 필요하지 않은 경우, SQL의 SELECT COUNT (*)를 사용하여 데이터베이스 수준에서 카운트를 처리하는 것이 훨씬 효율적입니다. Django는 이러한 이유로 정확하게 count () 메소드를 제공합니다.

- **list().** list ()를 호출하여 QuerySet의 강제 평가

```
entry_list = list(Entry.objects.all())
```

- **bool()** 부울 컨텍스트 (예 : bool () 또는 if 문)를 사용하여 QuerySet을 테스트하면 쿼리가 실행됩니다. 결과가 하나 이상 있으면 QuerySet은 True이고, 그렇지 않으면 False입니다. 예를 들면 다음과 같습니다.

```
if Entry.objects.filter(headline="Test"):
   print("There is at least one Entry with the headline Test")
```

참고 : 하나 이상의 결과 만 존재하는지 (실제 개체가 필요 없는지) 확인하려는 경우 exist ()를 사용하는 것이 더 효율적입니다.



### Pickling QuerySets

QuerySet을 피클 링하면 피클 링 전에 모든 결과가 메모리에로드됩니다.

피클 링은 일반적으로 캐싱의 선구자로 사용되며 캐시 된 쿼리 집합을 다시로드 할 때 결과가 이미 존재하고 사용할 준비가되기를 원합니다 (데이터베이스에서 읽는 데 시간이 걸릴 수 있으며 캐싱의 목적을 무시 함)

 이는 QuerySet을 선택 해제 할 때 현재 데이터베이스에있는 결과가 아니라 선택되는 순간의 결과를 포함한다는 것을 의미합니다.

나중에 데이터베이스에서 QuerySet을 다시 작성하는 데 필요한 정보 만 선택하려면 QuerySet의 query 속성을 선택하십시오. 그런 다음 다음과 같은 코드를 사용하여 결과를로드하지 않고 원래 QuerySet을 다시 작성할 수 있습니다.

```python
import pickle
query = pickle.loads(s)     # Assuming 's' is the pickled string.
qs = MyModel.objects.all()
qs.query = query            # Restore the original 'query'.
```

쿼리 속성은 불투명 객체입니다. 쿼리 구성의 내부를 나타내며 공개 API의 일부가 아닙니다. 그러나 여기에 설명 된대로 속성의 내용을 피클 링 및 피클 링 해제하는 것이 안전하고 완벽하게 지원됩니다.



### QuerySet API

QuerySet form

```python
class QuerySet(model=None, query=None, using=None, hints=None)
```

일반적으로 QuerySet과 상호 작용할 때는 필터를 연결하여 사용한다. 이 작업을 수행하기 위해 대부분의 QuerySet 메소드는 new querysets를 리턴한다.



QuerySet 클래스에는 내부 검사에 사용할 수 있는 두가지 공용 속성이 있다.

- ordered
  - QuerySet이 주문된 경우 true이다. order_by() 절의 기본 순서가 있다.
- db
  - 이 쿼리가 지금 실행될 경우 사용될 데이터 베이스이다.



## Methods that return new QuerySets

Django는 QuerySet에서 반환된 결과 유형이나 SQL 쿼리 실행 방식을 수정하는 다양한 QuerySet 구체화 방법을 제공한다.



### filter()

`filter(**kwargs)`

주어진 조회 매개 변수와 일치하는 객체를 포함하는 새로운 QuerySet을 반환한다.

SQL문에서 AND를 통해 여러 매개 변수가 결합된다.



### exclude()

`exclude(**kwargs)`

주어진 조회 매개 변수와 일치하지 않는 객체를 포함하는 새 QuerySet을 반환한다.

SQL 문에서 AND를 통해 여러 매개 변수가 결합되고 모든 것이 NOT()으로 묶인다.



### annotate()

`annotate(*args,**kwargs)`

제공된 쿼리 표현식 목록으로 QuerySet의 각 오브젝트에 주석을 단다.

표현식은 단순간 값, 모델의 필드에 대한 참조 또는 객체에 대해 계산된 집계 표현식(평균, 합계)일 수 있다.

annotate()에 대한 각 인수는 반환되는 QuerySet의 각 개체에 추가될 주석이다.



### order_by()

`order_by(*fields)`

기본적으로 QuerySet에 의해 반환된 결과는 모델의 메타에서 주문 옵션에 의해 제공된 주문 튜플에 의해 ordering된다. order_by 메소드를 사용하여 QuerySet별로 이를 대체할 수 있다.

음수 부호는 내림차순을 나타내고, 그냥 쓰면 오름차순이다. 무작위로 정렬하려면 `'?'` 를 사용하면된다. 하지만 사용중인 데이터베이스에 따라 느릴 수 있다.

또한 표현식에서 asc() 또는 desc()를 호출하여 쿼리 표현식으로 순서를 지정할 수 있다. 이 함수들에는 null 값의 정렬 방식을 제어하는 인수(nulls_first, nulls_last)도 있다.



distinct()를 사용하는 경우 관련 모델에서 필드별로 주문할 때는 주의해야한다.



QuerySet.ordered 속성을 확인하여 쿼리가 정렬되었는지 여부를 알 수 있다.



### reverse()

쿼리 집합 요소가 반환되는 순서를 반대로 변경하려면 reverse() 메서드를 사용해라.

일반적으로 정의된 순서가 있는 QuerySet에서만 호출해야한다.



### distinct()

`distinct(*fields)`

SQL 쿼리에서 SELECT DISTINCT를 사용하는 새 QureySet을 반환한다. 중복되는 행이 제거된다. 쿼리가 여러 테이블에 걸쳐 있으면 QuerySet을 평가할 때 중복된 결과를 얻을 수 있기 때문에 그런 때에 distinct()를 사용한다.



### values()

`values(*fields, **expressions)`

iterable로 사용될 때 모델 인스턴스가 아닌  dictionary를 리턴하는 QuerySet을 리턴한다. dictionary는 모델 객체의 속성 이름에 해당하는 키와 함께 객체를 나타냅니다.

원하는 필드를 지정하면 값이 리턴될때도 필드에 해당하는 값만 리턴된다.



### values_list()

`values_list(*fields, flat=False, named=False)`

values()와 유사하지만 dictionary를 반환하는 것이 아닌 튜플을 반환한다는 점이 다르다.

단일 필드 만 전달하는 경우 flat 매개 변수를 전달할 수도 있습니다. True이면 반환 된 결과가 1- 튜플이 아닌 단일 값임을 의미합니다. 단일 필드가 아닐때 True를 하면 Error 발생함



### dates()

`dates(field, kind, order='ASC')`

QuerySet의 내용 내에서 특정 종류의 사용 가능한 모든 날짜를 나타내는 datetime.date 객체 목록으로 평가되는 QuerySet을 반환합니다.

field는 모델의 DateField 이름이어야합니다. kind는 "year", "month", "week"또는 "day"여야합니다. 결과 목록의 각 datetime.date 객체는 지정된 유형으로 "잘립니다".



### datetimes()

`datetimes(field_name, kind, order='ASC', tzinfo=None)`

QuerySet의 내용 내에서 특정 종류의 사용 가능한 모든 날짜를 나타내는 datetime.datetime 객체 목록으로 평가되는 QuerySet을 반환합니다.

field_name은 모델의 DateTimeField의 이름이어야합니다.

kind는 "year", "month", "week", "day", "hour", "minute"또는 "second"중 하나 여야합니다. 결과 목록의 각 datetime.datetime 객체는 지정된 유형으로 "잘립니다".

tzinfo는 자르기 전에 날짜 시간이 변환되는 시간대를 정의합니다. 실제로, 주어진 날짜 시간은 사용중인 시간대에 따라 다른 표현을 갖습니다. 이 매개 변수는 datetime.tzinfo 오브젝트 여야합니다. 그렇지 않으면 Django는 현재 시간대를 사용합니다. USE_TZ가 False이면 효과가 없습니다.



#### none()

none ()을 호출하면 개체를 반환하지 않는 쿼리 집합이 만들어지고 결과에 액세스 할 때 쿼리가 실행되지 않습니다. qs.none () 쿼리 셋은 EmptyQuerySet의 인스턴스입니다.

```
Entry.objects.none()
<QuerySet []>
```



#### all()

현재 QuerySet (또는 QuerySet 서브 클래스)의 사본을 리턴합니다. 모델 관리자 나 QuerySet을 전달하고 결과를 추가로 필터링하려는 경우에 유용 할 수 있습니다. 두 객체 중 하나에서 all ()을 호출 한 후에는 반드시 작업 할 QuerySet이 있어야합니다.

QuerySet은 평가 될 때 일반적으로 결과를 캐시합니다. QuerySet을 평가 한 후 데이터베이스의 데이터가 변경된 경우 이전에 평가 한 QuerySet에서 all ()을 호출하여 동일한 쿼리에 대한 업데이트 된 결과를 얻을 수 있습니다.



#### union()

`union(*other_qs, all=False)`

SQL의 UNION 연산자를 사용하여 둘 이상의 QuerySet 결과를 결합합니다. 

UNION 연산자는 기본적으로 고유 한 값만 선택합니다. 중복 값을 허용하려면 all = True 인수를 사용하십시오.

union (), interaction () 및 difference ()는 인수가 다른 모델의 QuerySet 인 경우에도 첫 번째 QuerySet 유형의 모델 인스턴스를 반환합니다.

SELECT 목록이 모든 QuerySet에서 동일하기 만하면 다른 모델을 전달할 수 있습니다 (적어도 유형은 유형이 같은 순서에 따라 이름이 중요하지 않음). 이러한 경우 결과 QuerySet에 적용된 QuerySet 메소드의 첫 번째 QuerySet에서 열 이름을 사용해야합니다. 



### intersection()

`intersection(*other_qs)`

SQL의 INTERSECT 연산자를 사용하여 둘 이상의 QuerySet의 공유 요소를 리턴합니다.



### difference()

`difference(*other_qs)`

SQL의 EXCEPT 연산자를 사용하여 QuerySet에는 요소 만 있고 다른 QuerySet에는없는 요소를 유지합니다.



### select_relacted()

`select_relacted(*fields)`

외래 키 관계를 따라 쿼리를 실행할 때 추가 관련 개체 데이터를 선택하는 QuerySet을 반환한다. 하나의 복잡한 쿼리를 생성하는 성능 향상 도구이지만 나중에 외래 키 관계를 사용하면 데이터베이스 쿼리가 필요하지 않습니다.



### prefetch_related()

지정된 각 조회에 대해 단일 배치에서 관련 개체를 자동으로 검색하는 QuerySet을 반환합니다.



### extra()

`extra(select=None,where=None,params=None,tables=None,order_by=None, select_params=None)`

Django 쿼리 구문 자체가 복잡한 WHERE 절을 쉽게 표현할 수없는 경우가 있습니다. 이러한 경우를 위해 Django는 extra () QuerySet 수정 자 (QuerySet에 의해 생성 된 SQL에 특정 절을 삽입하기위한 후크)를 제공합니다.



### defer()

로드하지 않을 필드 이름을 defer ()에 전달하면됩니다.

복잡한 데이터 모델링 상황에서 모델에는 많은 필드가 포함되어있을 수 있으며, 일부에는 많은 데이터 (예 : 텍스트 필드)가 포함되거나 파이썬 객체로 변환하기 위해 고가의 처리가 필요할 수 있습니다. 데이터를 처음 가져올 때 특정 필드가 필요한지 모르는 상황에서 쿼리 세트의 결과를 사용하는 경우 데이터베이스에서 Django가 검색하지 않도록 지시 할 수 있습니다.



### only()

only () 메소드는 defer ()의 반대입니다.

모델을 검색 할 때 지연되어서는 안되는 필드와 함께 호출합니다. 거의 모든 필드를 연기해야하는 모델이있는 경우 보완 필드 세트를 지정하기 위해 only ()를 사용하면 코드가 더 간단해질 수 있습니다.



### using()

이 방법은 둘 이상의 데이터베이스를 사용하는 경우 QuerySet을 평가할 데이터베이스를 제어하기위한 것입니다. 이 메소드가 취하는 유일한 인수는 DATABASES에 정의 된대로 데이터베이스의 별명입니다.



### select_for_update()

지원되는 데이터베이스에서 SELECT ... FOR UPDATE SQL 문을 생성하여 트랜잭션이 끝날 때까지 행을 잠글 쿼리 세트를 리턴합니다.



### raw()

원시 SQL 쿼리를 가져 와서 실행하고 django.db.models.query.RawQuerySet 인스턴스를 반환합니다. 이 RawQuerySet 인스턴스는 일반 QuerySet처럼 반복되어 객체 인스턴스를 제공 할 수 있습니다.



## Methods that do not return QuerySets



### get()

주어진 조회 매개 변수와 일치하는 객체를 반환합니다.이 조회 매개 변수는 필드 조회에 설명 된 형식이어야합니다.

지정된 매개 변수에 대해 개체를 찾지 못하면 get ()에서 DoesNotExist 예외를 발생시킵니다. 이 예외는 모델 클래스의 속성입니다. 



### create()

객체를 생성하고 한 번에 모두 저장하는 편리한 방법입니다.



### get_or_create()

주어진 kwargs로 객체를 찾는 편리한 방법 (모델에 모든 필드에 대한 기본값이있는 경우 비어있을 수 있음), 필요한 경우 하나를 만듭니다.



#### update_or_create()

주어진 kwargs로 객체를 업데이트하여 필요한 경우 새 객체를 작성하는 편리한 방법입니다. 기본값은 객체를 업데이트하는 데 사용되는 (필드, 값) 쌍의 사전입니다. 기본값의 값은 호출 가능할 수 있습니다.

(객체, 생성 된) 튜플을 반환합니다. 여기서 object는 생성 또는 업데이트 된 객체이고 created는 새 객체 생성 여부를 지정하는 부울입니다.



### bulk_create()

이 메소드는 제공된 오브젝트 목록을 효율적인 방식으로 데이터베이스에 삽입합니다 (일반적으로 오브젝트 수에 관계없이 하나의 쿼리 만).



### bulk_update()

이 메소드는 일반적으로 하나의 쿼리로 제공된 모델 인스턴스에서 제공된 필드를 효율적으로 업데이트합니다.



### count()

데이터베이스에서 QuerySet과 일치하는 개체 수를 나타내는 정수를 반환합니다.



### in_bulk()

필드 값 목록 (id_list) 및 해당 값에 대한 field_name을 가져 와서 각 필드 값을 제공된 필드 값이있는 객체의 인스턴스에 매핑하는 사전을 반환합니다. id_list를 제공하지 않으면 쿼리 세트의 모든 객체가 반환됩니다.



### iterator()

쿼리를 수행하여 QuerySet을 평가하고 결과에 대해 반복자를 반환합니다 (PEP 234 참조). QuerySet은 일반적으로 결과를 내부적으로 캐시하므로 반복 평가로 인해 추가 쿼리가 발생하지 않습니다. 반대로 iterator ()는 QuerySet 레벨에서 캐싱을 수행하지 않고 결과를 직접 읽습니다 (내부적으로 기본 반복자는 iterator ()를 호출하고 리턴 값을 캐시 함). 한 번만 액세스해야하는 많은 수의 개체를 반환하는 QuerySet의 경우 성능이 향상되고 메모리가 크게 줄어 듭니다.



### latest()

주어진 필드를 기준으로 테이블의 최신 개체를 반환합니다.



### earliest()

방향이 변경되는 것을 제외하고 latest ()와 다르게 작동합니다.



### first()

쿼리 세트와 일치하는 첫 번째 개체를 반환하거나 일치하는 개체가 없으면 None을 반환합니다. QuerySet에 순서가 정의되어 있지 않으면 기본 키에 의해 쿼리 세트가 자동으로 정렬됩니다.

### last()

first ()처럼 작동하지만 쿼리 집합의 마지막 개체를 반환합니다.



### aggeregrate()

QuerySet에 대해 계산 된 집계 값 (평균, 합계 등)의 사전을 리턴합니다. Aggregate ()에 대한 각 인수는 반환되는 사전에 포함될 값을 지정합니다.



---



#### Aggregate

전체 시험 성적을 대상으로 최고 점수나 평균 점수를 구하는 것은 [`aggregate`](https://docs.djangoproject.com/en/2.2/topics/db/aggregation/)로 가능하다.

특정 과목에 대한 평균을 구할 때는 [`filter`](https://docs.djangoproject.com/en/2.2/ref/models/querysets/#filter)를 사용한다.

그럼 과목별 평균을 구하고 싶을 때는 어떻게 해야할까? 위 쿼리에서 `filter` 부분을 모든 과목으로 바꿔가며 확인할 수도 있겠지만, `annotate` 기능을 사용하면 간단하게 해결할 수 있다.



#### Annotate

과목별 최고 점수를 구하기 위해서는 [`values`](https://docs.djangoproject.com/en/2.2/ref/models/querysets/#values)와 [`annotate`](https://docs.djangoproject.com/en/2.2/ref/models/querysets/#annotate)를 섞어 사용한다.

`annotate`는 수행될 때 `values`로 지정된 필드를 SQL의 [`GROUP BY`](https://dev.mysql.com/doc/mysql/en/group-by-modifiers.html)로    전달하여, 해당 필드끼리 묶은 결과를 구한다. 과목별 최고 점수를 가진 사람을 구하는 과정을 통해 `annotate`의 한계를 확인해보자.

`annotate`와 `values` 구문은 배치된 순서에 따라 작동이 달라지는데, `values`가 `annotate`보다 앞서 있는 경우는 앞선 예제에서와 같이 결과를 묶는데 사용된다. 하지만 `annotate`가 앞선 반대 경우에는 전체 쿼리셋에 대해 annotation이 적용된다. 즉, 이 경우에 `values`는 결과를 묶는데 사용되지 않고, 어떤 필드를 출력하는지만 결정하게 된다.



---

기타 참고한 문서

- http://raccoonyy.github.io/using-django-querysets-effectively-translate/

- https://lqez.github.io/blog/django-queryset-basic.html