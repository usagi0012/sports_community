# 🏀오농?🏀

### 

### ⛹️‍♂️ TEAM Onong

팀 페이지 보러가기 👉 [TEAM. Onong](https://www.notion.so/f5428763894c4a9c87f781375cdc12b2)

| 이름   | 담당 업무                   |
| ------ | --------------------------- |
| 염지원 | 리더/백엔드 개발             |
| 김윤찬 | 부리더/백엔드 개발           |
| 유우섭 | 백엔드 개발                  |
| 김용근 | 백엔드 개발                  |
| 최종현 | 백엔드 개발                  |


<br>

## 1. 프로젝트 소개

저희 '오농?' 서비스는 농구를 좋아하는 사람들이 즉석으로 농구 경기를 잡을 수 있는 서비스 입니다.

### 💡 프로젝트 아이디어 동기

- 프로젝트 아이디어 동기

<br>

- 평소 팀원들이 운동하는 것을 좋아하는데 스포츠 경기 같은 경우 인원 모으기가 쉽지 않았던 점을 바탕으로 서비스를 기획하게 되었습니다.


### 🚩 프로젝트 목표

- 당장 농구 경기가 하고 싶은데 같이 할 친구가 없을 때! 
- 당장 농구장 대여할 돈은 없고 길거리 농구가 하고 싶을 때! 
- 동아리에 가입해서 마음 맞는 사람들과 쭈욱 함께 하고 싶을 때! 

**간편한 경기 모집을 통해 언제든 사용하기 편한 농구 매칭 플랫폼을 목표로 하고 있습니다**

### 📊 활용 데이터 셋

#### 1. [Naver GPS Open API]https://www.ncloud.com/product/applicationService/maps

- 현재 위치, 농구장 위치 데이터
- 이유 : '길거리 농구하는 사람'이 주요 타겟층이다보니 경기 예약시 정확한 위치 주소가 필요했기 때문에 선택

#### 2. [농구장 예약 데이터]https://shareit.kr/

- 실내 농구장 데이터(장소, 가격)
- 이유 : 길거리 농구장 이외에도 실내 농구장에서 예약하고 경기가 진행될 수도 있기에 실내 농구장 데이터도 함께 보여주도록 함


<br>

## 2. 서비스 주요 기능

### 메인 기능

### 1) 실시간 채팅 기능

<img src='https://drive.google.com/file/d/15uFoX9H2cdp7KvISc65gY56q82RFEdRy/view?usp=drive_link' width=700px>

- 로그인 된 회원이라면 누구든 이용 가능
- 한 명의 유저가 여러 개의 채팅방을 생성/관리할 수 있음
- 1:1 채팅, 단체 채팅 가능
- 채팅방 생성/ 삭제 가능
- 채팅방에 멤버 초대/추방 가능


### 2) 정확한 모임 위치 정보 제공 기능

<img src='https://drive.google.com/file/d/15uFoX9H2cdp7KvISc65gY56q82RFEdRy/view?usp=sharing' width=700px>


- Naver GPS Open API를 통한 경기 모임 장소 위치 정보 제공
- 경기 모집 공고를 올릴 때 위치를 지정하고 게시글에서 경기 모집 공고의 약속 위치를 볼 수 있음

### 3) 경기 매칭 성사/평가 알림 기능

<img src='https://drive.google.com/file/d/15uFoX9H2cdp7KvISc65gY56q82RFEdRy/view?usp=sharing' width=700px>

- 내가 올린 경기 모집 글/ 동아리 모집 글에 신청이 올 경우 사이트에 접속해 있지 않더라도 알림 발송, 알림 탭에 표시
- 그 외 농구 대결이 성사된 경우, 농구 대결이 끝난 후 평가를 해달라는 알림 등 필요한 부분들에 대해 알림 발송
- 알림 설정을 켜놓으면 특별한 이벤트 발생 시 실시간으로 알림이 발송되며 설정을 꺼놓더라도 쌓인 알림을 개인 알림창에서 조회,삭제 가능

### 4) 자동 배포를 위한 파이프 라인 구축

- Github Action과 Code Deploy를 이용한 자동 배포

### 5) 소셜 로그인 기능

<img src='https://drive.google.com/file/d/15uFoX9H2cdp7KvISc65gY56q82RFEdRy/view?usp=sharing' width=700px>

- 간편한 회원가입을 위한 소셜 로그인 기능 도입

<br>

### 서브 기능

### 1) 경기 모집

- 자신이 원하는 시간/장소에 원하는 경기 모집 공고를 올릴 수 있음
- 원하는 인원 수 만큼 개인 간 매치 클럽 간 매치 신청 가능
- 경기 모집 글 조회, 지역별/카테고리별/최신순 조회 가능

### 2) 동아리

- 동아리 등록 및 멤버 관리를 할 수 있음
- 동아리 간 클럽 매치 가능
- 신청서 조회 및 승인/거절 가능
- 동아리 모집 글 조회, 지역별/최신순/점수순 조회 가능

### 3) 경기장 정보 제공

- 크롤링을 이용한 경기장 데이터 제공
- 경기장을 클릭하면 예약 사이트로 이동 가능
- 정렬 후 페이지네이션 형태로 제공
- 무한 스크롤

### 4) 좋아요 싫어요 기능 / 신고 기능

- 다시 만나고 싶은 사람, 다시 만나고 싶지 않은 사람을 쉽게 파악할 수 있도록 함
- 무단 불참과 같은 경우 신고할 수 있도록 함

### 5) 평가 기능

- 경기가 끝나고 각 개인/동아리 평가를 통해 상대 방의 인성/실력 점수를 평가할 수 있음
- 추가적으로 평가지에 태그를 두어 평가 상대방에게 태그를 줄 수 있음
  (ex - 상대방이 너무 잘했을 경우, #조던 태그를 걸어줄 수 있음)
- 평가를 통해 산출된 인성, 실력 점수와 태그가 프로필에 반영됨

### 6) 검색 기능

- 서비스 내 모든 요소들에 관해 검색을 할 수 있음
- 카테고리 창에서 검색하면 해당 카테고리 관련 검색 결과만 뜸

### 7) 메일 인증 기능

- 회원가입시 이메일로 인증이 진행되며 인증 이메일에서 인증 버튼을 클릭하게 되면 가입이 완료되며 로그인 페이지로 이동

### 8) 랭킹 기능

- 경기가 끝난 뒤 시행되는 평가를 기반으로 인성 점수(개인)/실력 점수(개인)/동아리 점수 3가지의 랭킹을 메인 페이지에 구현
- CRON을 이용해 월 1일 자정에 랭킹이 갱신되도록 함

### 9) 사용자 기능

- 내 정보 및 내 프로필 조회 및 수정 가능
- 마이 프로필 페이지에서 캘린더에 일정 작성을 할 수 있음
- 타인 프로필 클릭시 타인의 프로필을 조회할 수 있음

### 10) 인증 기능

- 회원가입/로그인
- 소셜 회원가입/로그인
- 비밀번호 분실 시 메일로 새 비밀번호 발송

### 11) 편의 기능(공지사항, FAQ, Q&A)

- 관리자만 공지사항, FAQ를 올릴 수 있음
- Q&A를 통해 관리자측과 소통 가능

<br>

### 🎥 시연 영상

<br>

## 3. 프로젝트 구성도

### 📑 와이어프레임

[figma](https://www.figma.com/file/e1piAokpVNF4Aah71bolbE?embed_host=notion&kind=file&t=tEI1Hm96y5Dw699q-6&type=design&viewer=1)

### 📎 기술 스택

1. Front-End : html, css, javascript, axios, socket.io
2. Back-End : NodeJS, NestJS, MySQL
3. develop: node-mailer, CRON, JWT, SSE
4. Data Analysis : Naver Cloud Platform
5. distribution : Github Action, AWS CodeDeploy, AWS S3, ALB

### 📎 라이브러리

- client-s3
- fullcalendar/core
- event-emitter
- jwt
- passport
- swagger
- schedule
- tpyeorm
- socket.io
- axios
- bcrypt
- cheerio
- class-validator
- cross-env
- lodash
- multer
- multer-s3
- nodemailer
- passport-google-oauth20
- passport-kakao
- passport-naver
- path
- puppeteer
  

### 📌 프로젝트 구조도

<img src='https://user-images.githubusercontent.com/97580782/167986507-cdddae5f-5f5c-435c-9b68-59b50abac2a9.png' width=600px>

<br>

## 4. API 문서

👉 [API 문서 보러가기](https://)

<br>

## 5. 프로젝트 팀원 역할 분담

### 멤버별 responsibility

1. 염지원 (리더)

   - FrontEnd : UI(전체), 연결(메인 페이지, 인증 기능 페이지, 경기장 페이지)
   - BackEnd : 인증 기능, 동아리 기능, 경기장 기능, 편의 기능
     
2. 김윤찬 (부리더)

   - FrontEnd : UI(채팅 페이지), 연결(채팅 페이지, 동아리 페이지, 랭킹 페이지)
   - BackEnd : 채팅 기능, 랭킹 기능, 동아리 기능, 동아리 신청 기능

3. 유우섭

   - FrontEnd : 연결(개인 경기 페이지, 동아리 경기 페이지, 지도, 좋아요/싫어요 페이지, 신고 페이지)
   - BackEnd : 개인 경기 모집 기능, 동아리 경기 모집 기능, 좋아요/싫어요 기능, 신고 기능

4. 김용근

   - FrontEnd : 연결(사용자 페이지, 알림 페이지, 검색 페이지)
   - BackEnd : 알림 기능, 검색 기능, 인증 기능, 사용자 기능

5. 최종현

   - FrontEnd : UI(평가 페이지), 연결(편의 기능 페이지, 모집글 페이지, 평가 페이지)
   - BackEnd : 소셜 로그인, 평가 기능, 편의 기능, 랭킹 기능

## 6. 버전

1.0.0

## 7. FAQ

- 자주 받는 질문 정리
