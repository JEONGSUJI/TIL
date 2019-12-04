## python Error 처리 관련 메모

python 학습 중 발생한 Error 처리 관련에 대해 추후에도 참고하고자 기록함



### **UnicodeDecodeError: 'cp949' codec can't decode byte 0xeb in position 213: illegal multibyte sequence**

```python
with open('webtoon_list.html', 'rt') as f:
    html = f.read()
```



원인 

- 파이썬3 부터는 ANSI 기준으로 작성된 파일만 정상적으로 읽어 올 수 있으며, UTF-8로 작성된 파일은 그냥 위에 코드로 읽으면 못 읽어옴



해결방법

```python
f = open(path, 'rt', encoding='UTF-8')** 
```

- **f = open(path, 'rt')  --->  f = open(path, 'rt', encoding='UTF-8')**  파일을 열 때 인코딩을 해주면 간단하게 문제가 해결됨
- 다른 방법으로는 UTF-8로 저장된 텍스트 파일을 전부 ANSI로 다시 저장해주면 됨