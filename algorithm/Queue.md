# 큐(Queue)



### 큐 구조

- 가장 먼저 넣은 데이터를 먼저 꺼낼 수 있는 구조(FIFO, First-in-First-out / LILO, Last-in-Last-out)로 스택과 꺼내는 순서가 반대이다.



### 큐 용어

- Enqueue: 큐에 데이터를 넣는 기능
- Dequeue: 큐에세 데이터를 꺼내는 기능



### 파이썬 queue 라이브러리를 활용한 큐 자료구조 사용

- queue 라이브러리에는 다양한 큐 구조로 Queue(), LifoQueue(), PriorityQueur()를 제공한다.
- Queue(): 가장 일반적인 큐 자료 구조이다.
- LifoQueue(): 나중에 입력된 데이터가 먼제 출력되는 구조이다. (스택 구조)
- PriorityQueur(): 데이터마다 우선순위를 넣어서, 우선순위가 높은 순으로 데이터를 출력한다.



#### 사용해보기 (Queue)

```python
import queue
data_queue = queue.Queue()

# 데이터 넣기
data_queue.put("fun coding")
data_queue.put(1)

# 데이터 들어있는 개수 확인
data_queue.qsize()		# data가 현재 fun coding과 1 2개가 들어있기 때문에 2가 출력된다 // 2

# 데이터 출력하기
data_queue.get()		# "fun coding"이 출력된다.

data_queue.qsize()		# data가 현재 1 하나 들어가 있기 때문에 1이 출력된다. // 1
data_queue.get()		# 1이 출력된다.
```



#### 사용해보기 (LifoQueue)

```python
import queue
data_queue = queue.LifoQueue()

data_queue.put("fun coding")
data_queue.put(1)

data_queue.qsize()		# 2
data_queue.get()		# 1
```



#### 사용해보기 (PriorityQueue)

```python
import queue
data_queue = queue.PriorityQueue()

# 기입 시 () 튜플로 적어주고, 앞에는 우선순위를 기입하고, 뒤에는 넣을 데이터를 입력한다.
data_queue.put((10, "korea"))
data_queue.put((5, 1))
data_queue.put((15, "china"))

data_queue.qsize()		# 3
data_queue.get()		# (5,1) // 우선순위가 가장 높은 데이터가 먼저 출력된다.
data_queue.get()		# (10, "korea")
```



> 큐가 어디에 많이 쓰일까?
>
> 멀티 태스킹을 위한 프로세스 스켸줄링 방식을 구현하기 위해 많이 사용된다.



## 프로그래밍 연습

리스트  변수로 큐를 다루는 enqueue, dequeue 기능 구현해보기



```python
queue_list = list()

def enqueue(data):
    queue_list.append(data)
    
def dequeue(data):
    data = queue_list[0]
    def queue_list[0]
    return data
```

