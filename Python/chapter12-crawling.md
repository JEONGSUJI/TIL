## 크롤링(crawling)



### BeautifulSoup

HTML/XML 문서의 구문분석을 위한 python 패키지

(https://www.crummy.com/software/BeautifulSoup/bs4/doc.ko/)



- 설치방법
  - apt-get install python-bs4
  - pip install beautifulsoup4
  - python setup.py install



- 사용법 예시 (webtoon_list.html에서 url만 출력하기)

```python
from bs4 import BeatifulSoup
html = open('webtoon_list.html', 'rt').read()
soup = BeautifulSoup(html)

from urllib import parse
for a in soup.select('a.title')
	print('a['href']')
```



실습)  webtoon_list.html에서 img영역 선택 후 url과 제목 출력하기

```python
for img in soup.select('div.thumb img[title]'):
    print(img['src'])
    print(img['title'])
```



실습) 

```
# 웹툰의 제목과 썸네일 URL을 출력하기

# 힌트
# select:     CSS선택자로 복수 검색
# select_one: CSS선택자로 단일 검색 (가장 먼저 찾은 것 우선)
# 위 검색들의 결과는 Tag object를 반환 (select는 Tag object 리스트)
#  Tag object에서는 반복적으로 select, select_one탐색이 가능
#  ex) div = soup.select_one('div')
#      h = div.select_one('h')

# tag.parent: 부모 Tag를 선택
```



```python

```

