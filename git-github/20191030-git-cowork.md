# git-cowork

## 1.git

- 기본적으로 작업할 때는 develop로 큰 branch를 따고 또 feature 기능 단위로 branch를 따서 작업해야 한다.

- master는 사용자가 보게 될 버전만 존재해야함


## 2. git flow

 https://danielkummer.github.io/git-flow-cheatsheet/index.ko_KR.html# 


<code>git flow init</code>

- 해당 작업을 진행하면 develop branch 생성된다.

- git branch를 사용해 현재 상태를 종종 확인한다.

<code>git flow feature start markup-init</code>
- 사용 시 feature/markup-init와 같은 branck가 생성된다.

<code>git flow feature finish markup-init</code>
- 사용 시 feature/markup-init이 사라지고 해당 branch를 따는 기준이었던 develop branch에 합쳐진다.
- checkout하고 branch도 없애준다.

> git mv static/index.js ./ 을 사용해서 파일을 옮기면 git status시 renamed 되었다고 상태가 표시된다.

## 3. git release

- develop branck의 내용을 master로 올릴 때 버전관리용으로 사용한다.

<code>git flow release start v0.0.1.00191030001</code>  
<code>git flow release finish v0.0.1.00191030001</code>

위 작업을 모두 마치면 develop과 master에서 각각 push한다.

<code>git push -u origin develop</code>  
<code>git push origin master</code>

## 4. Co-worker

1. Collaboration

   - collaborators 추가하기
     - 근데 익명의 사람이 추가할 수 있음으로 비추천
     - 실시간으로 같은 파일을 다른 사람이 추가할 수도 있음
     - release 권한을 가질 사람이 사용하는 방법

2. Fork

   - 팀원이 팀장의 repo를 fork 후 clone > git flow init 
   - git pull origin develop
     - origin에 존재하는 develop branch 가져오기
   - git flow feature start index-semanctic
   - 수정작업 진행
   - git push origin develop
   - Pull request 버튼 클릭해서 생성 (develop ->  develop)

#### 진행과정 요약
- 팀장이 레포를 만든다. 
- clone -> git flow init -> touch index.html -> add, commit, push on develop

- 팀원이 fork를 한다.
- fork한 레포를 clone -> git flow init -> git pull origin develop -> feature start -> feature finish -> push on developcreate pull request(your forked repo from [github.com](http://github.com/))

- 팀장의 리뷰 후 merge(pm's repo from [github.com](http://github.com/))

- 모든 팀원은 merge 발생시 pmorigin의 develop을 자신의 develop으로 pull 하여 업데이트 한다.
     - $ git remote add pmorigin {팀장 레포 주소}
     - $ git pull pmorigin develop 