# Django Document(Model_Field Types)

해당 문서는 https://docs.djangoproject.com/en/3.0/ref/models/fields/를 번역판으로 보고 정리한 것입니다.





이 문서에는 Django가 제공하는 Field 옵션 및 Field 유형을 포함하여 모든 API 참조가 포함되어 있다.



기술적으로 이러한 모델은 `django.db.models.fields`에 정의되어 있지만 편의상 `django.db.models` 모델로 가져온다.



사용하는 규칙은 먼저 불러온 뒤, 필드를 참조하는 것이다.

```python
from django.db import models

models.<Foo>Field
```



## Field options(필드 옵션)

다음 필드는 모든 필드 유형에 사용가능하다. 모두 선택 사항이다.



### null

#### `Field.null`

True인 경우, Django는 데이터베이스에 빈값인 Null을 저장합니다. 기본값은 False이다.

문자열 기반 필드인 `CharField`와 `TextField`에는 null을 사용하지 마라. 문자열 기반 필드는 `null=True`을 가지고 있는데, 이는 데이터 없음에 대한 두 가지 가능한 값(empty, "no data":Null)을 갖는 것을 의미한다. 장고 컨벤션은 빈값(empty)을 사용한다. 

CharField에 `unique=True`와 `blank=True`일 경우 예외이다. 이 경우 빈 값으로 여러 객체를 저장할 때 고유값 충돌을 피하려면 `null=True`가 필요하다. 

null 매개 변수는 데이터베이스 저장소에만 영향을 주기 때문에 양식에서 빈 값을 허용하려면 `blank=True`를 설정해야한다.



### blank

#### `Field.blank`

True면 field는 blank를 허용한다. 기본값은 False이다.

이것은 null과는 다르다. null은 순전히 데이터베이스 관련이지만, blank는 유효성 검사(데이터의 존재여부)와 관련이 있다. 만약 필드가 `blank=True`면, 양식의 유효성 검사는 빈값을 입력할 수 있게 한다. 반대로 `blank=False`면, 필드값이 필요해진다.



### choices

#### `Field.choices`

이 필드의 선택 항목으로 사용하기 위해 정확히 두 항목 (예 : [(A, B), (A, B) ...])의 이터러블 자체로 구성된 시퀀스이다. 선택 사항이 제공되면 모델 유효성 검증에 의해 적용되며 기본 양식 위젯은 표준 텍스트 필드 대신이 선택 사항이있는 <u>선택상자</u>가 됩니다.

**선택 항목을 작성할때는 꼭 튜플 형식으로 작성해야한다.**

각 튜플의 첫번째 요소는 모델에서 설정할 실제 값이며, admin 페이지에서 사용자가 보게될 항목이고 두번째 요소는 사람이 읽을 수 있는 이름이다.

```python
YEAR_IN_SCHOOL_CHOICES = [
    ('FR', 'Freshman'),
    ('SO', 'Sophomore'),
    ('JR', 'Junior'),
    ('SR', 'Senior'),
    ('GR', 'Graduate'),
]
```

일반적으로 모델 클래스 내에서 선택 사항을 정의하고 각 값에 대해 적절한 이름의 상수를 정의하는 것이 가장 좋다. 그 코드의 예는 아래와 같다.

```python
from django.db import models

class Student(models.Model):
    FRESHMAN = 'FR'
    SOPHOMORE = 'SO'
    JUNIOR = 'JR'
    SENIOR = 'SR'
    GRADUATE = 'GR'
    YEAR_IN_SCHOOL_CHOICES = [
        (FRESHMAN, 'Freshman'),
        (SOPHOMORE, 'Sophomore'),
        (JUNIOR, 'Junior'),
        (SENIOR, 'Senior'),
        (GRADUATE, 'Graduate'),
    ]
    year_in_school = models.CharField(
        max_length=2,
        choices=YEAR_IN_SCHOOL_CHOICES,
        default=FRESHMAN,
    )

    def is_upperclass(self):
        return self.year_in_school in {self.JUNIOR, self.SENIOR}
```

모델 클래스 외부에서 선택 목록을 정의한 다음 참조할 수 있지만 모델 클래스 내에서 각 선택의 이름을 정의하면 해당 정보를 사용하는 클래스와 함께 해당 정보가 모두 유지되고 선택을 참조하는데 도움이 된다.



choice는 정적 데이터가 큰 변화가 없을 경우 사용된다.



장고는 자동으로 `choice`라는 옵션을 가지고 있는 필드들 한테 메소드를 더하는데, 이 메소드를 이용해서 선택항목의 사람이 읽을 수 있는 부분을 가지고 올 수 있다. (`get_Foo_display()메소드 참고`)



`blank=False`가 기본값과 함께 필드에 설정되어 있지 않으면 '-----------'가 포함된 레이블이 선택 상자와 함께 렌더링된다. 이 기본 설정을 원치 않으면 없음을 포함하는 선택 항목 `(None, 'Your String For Display')` 튜플에 추가하면된다. 의미가 없는 경우 None 대신 빈 문자열을 사용할 수 있다.



### db_column

데이터 베이스의 행 이름을 직접 지정하는 옵션이다. 적어주지 않을 경우 장고는 자동으로 필드명을 사용한다.



### db_index

True일 경우, 해당 필드에 데이터베이스 인덱스가 생성된다.



### db_tablespace

필드가 인덱스 된 경우 필드의 인덱스에 사용할 데이터베이스 테이블 스페이스의 이름이다. 설정하지 않을 경우, 프로젝트의 `DEFAULT_INDEX_TABLESPACE`설정을 갖는다. 백엔드가 인덱스에 대한 tablespace를 지원하지 않으면 이 옵션은 무시된다.



### default

필드의 기본값이다. 값 또는 호출 가능한 객체일 수 있다. 호출 가능하면 새로운 객체가 생성 될 때마다 호출된다.

기본값은 변경 가능한 객체일 수 없다. 해당 객체의 동일한 인스턴스에 대한 참조가 모든 새 모델 인스턴스에서 기본값으로 사용되기 때문이다. 대신 호출 가능한 객체로 아래와 같이 사용은 가능하다.

```python
def contact_default():
    return {"email": "to1@example.com"}

contact_info = JSONField("ContactInfo", default=contact_default)
```



### editable

False 일 경우, 해당 필드는 admin 혹은 기타 ModelForm에 표시되지 않는다. 기본값으로 True를 갖는다.



### error_messages

기본 오류 메세지를 사용자가 직접 변경할 수 있다. `error_messages`의 값으로 딕셔너리가 오는데, {오류타입: 오류메시지} 형식으로 써줘야한다.

오류 메시지 타입은  null, blank, invalid, invalid_choice, unique 및 unique_for_date가 포함 등이 있다. (추가적인 오류 타입은 장고문서를 참조하자)



### help_text

form에 추가 도움말 텍스트를 표시할 수 있다. 원하는 경우 html 양식도 포함 시킬 수 있다.



### primary_key

True일 경우, 해당 필드는 모델의 pk가 된다. primary_key를 설정하지 않을 경우 장고는 자동으로 AutoField를 추가해서 pk를 추가한다.

`primary_key=True`는 `null=False`, `unique=True`를 의미한다

primary_key는 수정할 수 없다. primary_key의 값을 변경해서 저장하면 기존의 pk는 그대로 유지되고 새로운 객체가 생성된다.



### unique

True일 경우 해당 필드는 모두 고유한 값을 가져야한다. 만약 데이터베이스에 이미 존재하는 데이터와 동일한 데이터를 새로 추가할 경우 장고에서 `django.db.intefrityError`를 발생시킨다.

unique타입은 모든 필드에서 사용할 수 있지만, 예외로 Many To Many와 One To One 필드에서 사용할 수 없다.

unique가 True일 때 db_index를 사용할 필요가 없다. unique 하다는 것은 index를 생성하는 것과 동일하기 때문이다.



### unique_for_date

DateField와 DateTimeField를 가지고 있는 필드를 가리킨다. 만약 title이라는 필드가 unique_for_date='pub_date'라는 필드 옵션을 가지고 있는 경우 새로운 데이터를 추가할 때 title과 pub_date가 중복되면 안된다.



이 필드와 유사하지만 특정에 고유한 값을 갖도록 설정하는 `unique_for_month`, `uniqur_for_year`도 있다.



### verbose_name

사람이 이해할 수 있는 언어를 이용해서 필드의 이름을 지정할 수 있는 것이다.



## Field type



### AutoField

사용 가능한 ID에 따라 자동으로 증가하는 IntegerField이다. 직접 사용하지 않아도 기본 키 필드가 모델에 자동으로 추가된다.



### BigAutoField

64비트 정수형 IntegerField이다.

IntegerField 이지만 범위가 더 크다고 생각하면 된다. 

범위: 1 ~ 9223372036854775807



### BigIntegerField

64비트 정수형 IntegerField이다.

범위: -9223372036854775808 ~ 9223372036854775807



### BinaryField

이진 데이터를 저장하는 필드이다.



### BooleanField

True/False를 입력하는 필드이다.

BooleanField 를 사용하게 될 경우 체크박스 생성되고, null=True 를 사용할 경우 체크버튼이 아닌, True, False, Unknown 드롭다운 메뉴가 생성된다.



### CharField

문자형 필드이다. 하지만 대량의 텍스트를 적어야할 경우에는 TextField 사용을 추천한다. <u>`max_length` 필드 옵션 필수로 적어줘야한다.</u>



### DateField

datatime.date의 인스턴스 날짜와 동일하다. 몇가지 필드 옵션들을 추가적으로 사용할 수 있다. (년/월/일)이 표시된다.

- auto_now = 인스턴스가 **저장될 때 **필드의 값을 자동으로 현재 날짜로 맞춘다. 해당 필드는 Model.save( )를 이용할 때 자동으로 업데이트 되고, 다른 필드를 업데이트 할때는 자동으로 업데이트 되지 않는다.
- auto_now_add = 인스턴스가 **생성될 때** 필드의 값을 자동으로 현재 날짜로 맞춘다. 
- **auto_now 와 auto_now_add는 둘중 하나만 사용해야 한다.**



비슷한 필드 타입으로 `DateTimeField`가 있는데, (년/월/일 시/분/초)로 표시된다.



### DecimalField(max_digits=None, decmial_place=None)

고정된 소수점 자리를 저장하기 위해 사용한다. max_digits와 decimal_places 필드 옵션을 갖는다.

```
999.00 까지 표시한다고 할때
# 999.00 총 5개의 자릿수
# 00 소수점 2개까지 허용
models.DecimalField(max_digits = 5, decimal_places = 2)
```



### DurationField

일정 지속되는 시간을 저장하기 위한 모델 필드이다.



### EmailField

이메일을 저장하기 위한 모델 필드이다. CharField지만 유효한 이메일을 입력했는지 안했는지를 확인해준다. 



### FileField(upload_to=None, max_length=100)

파일을 업로드하기 위해 사용한다.

upload_to : 업로드한 파일을 어떤 경로에 저장할 지 지정하는 것이다.



적지 않은 기타 필드들은 아래와 같다. 이름에서 알 수 있는 기본적인 필드 타입들이 많다. 

`FilePathField`, `FloatField`, `ImageField`, `IntegerField`, `GenericIPAddressField`, `NullBooleanField`, `PositiveIntegerField`, `PositiveSmallIntegerField`, `SlugField`, `SmallIntegerField`, `TextField`, `TimeField`, `URLField`, `UUIDField`



아래 관계타입은 이전 실습에서 다루었으니 생략한다.