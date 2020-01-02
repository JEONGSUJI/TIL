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

True인 경우, Django는 데이터베이스에 빈값인 Null을 저장합니다. 기본값은 False입니다.

문자열 기반 필드인 `CharField`와 `TextField`에는 null을 사용하지 마세요. 문자열 기반 필드는 `null=True`을 가지고 있는데, 이는 데이터 없음에 대한 두 가지 가능한 값(empty, "no data":Null)을 갖는 것을 의미합니다. 장고 컨벤션은 빈값(empty)을 사용한다. 

CharField에 unique=True와 blank=True일 경우 예외이다. 이 경우 빈 값으로 여러 객체를 저장할 때 고유 제약 조건 위반을 피하려면 null=True가 필요하다.

문자열 기반 필드와 문자열 기반이 아닌 필드 모두에 대해 null 매개 변수는 데이터베이스 저장소에만 영향을 주기 때문에 양식에서 빈 값을 허용하려면 blank=True를 설정해야한다.



### blank

#### `Field.blank`

True면 field는 blank를 허용한다. 기본값은 False이다.

이것은 null과는 다르다. null은 순전히 데이터베이스 관련이지만, blank는 유효성 검사와 관련이 있다. 만약 필드가 blank=True면, 양식의 유효성 검사는 빈값을 입력할 수 있게 합니다. 반대로 blank=False면, 필드값이 필요해진다.



### choices

#### `Field.choices`

이 필드의 선택 항목으로 사용하기 위해 정확히 두 항목 (예 : [(A, B), (A, B) ...])의 이터러블 자체로 구성된 시퀀스이다. 선택 사항이 제공되면 모델 유효성 검증에 의해 적용되며 기본 양식 위젯은 표준 텍스트 필드 대신이 선택 사항이있는 <u>선택상자</u>가 됩니다.

각 튜플의 첫번째 요소는 모델에서 설정할 실제 값이고 두번째 요소는 사람이 읽을 수 있는 이름이다.

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





---

- `필드옵션` : 필드마다 고유 옵션이 존재, 공통 적용 옵션도 있음
- null (DB 옵션) : DB 필드에 NULL 허용 여부 (디폴트 : False)
- unique (DB 옵션) : 유일성 여부 (디폴트 : False)
- blank : 입력값 유효성 (validation) 검사 시에 empty 값 허용 여부 (디폴트 : False)
- default : 디폴트 값 지정. 값이 지정되지 않았을 때 사용
- verbose_name : 필드 레이블. 지정되지 않으면 필드명이 쓰여짐
- validators : 입력값 유효성 검사를 수행할 함수를 다수 지정
  - 각 필드마다 고유한 validators 들이 이미 등록되어있기도 함
  - 예 : 이메일만 받기, 최대길이 제한, 최소길이 제한, 최대값 제한, 최소값 제한 등
- choices (form widget 용) : select box 소스로 사용
- help_text (form widget 용) : 필드 입력 도움말
- auto_now_add : Bool, True 인 경우, 레코드 생성시 현재 시간으로 자동 저장