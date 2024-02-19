# 🏀오농?🏀

### 

### ⛹️‍♂️ TEAM Onong

팀 페이지 보러가기 👉 [TEAM. Onong]([https://www.notion.so/f5428763894c4a9c87f781375cdc12b2](https://teamsparta.notion.site/d0c20ac3aa5d4801b522eba6618551d9))

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

<details><summary>더보기</summary>
<br>

- 

</details>

### 🚩 프로젝트 목표

당장 농구 경기가 하고 싶은데 같이 할 친구가 없을 때!
당장 농구장 대여할 돈은 없고 길거리 농구가 하고 싶을 때!
동아리에 가입해서 마음 맞는 사람들과 쭈욱 함께 하고 싶을 때!

**간편한 경기 모집을 통해 사용하기 편한 농구 매칭 플랫폼을 목표로 하고 있습니다**

### 📊 활용 데이터 셋

#### 1. [Naver GPS Open API]https://www.ncloud.com/product/applicationService/maps

- 현재 위치, 농구장 위치 데이터
- 이유 : '길거리 농구하는 사람'이 주요 타겟층이다보니 경기 예약시 정확한 위치 주소가 필요했기 때문에 선택

#### 2. [농구장 예약 데이터]https://shareit.kr/

- 실내 농구장 데이터(장소, 가격)
- 이유 : 길거리 농구장 이외에도 실내 농구장에서 예약하고 경기가 진행될 수도 있기에 실내 농구장 데이터를 선택


<br>

## 2. 서비스 주요 기능

### 메인 기능

### 1) 실시간 채팅 기능

<img src='' width=700px>

- 로그인 된 회원이라면 누구든 이용 가능
- 한 명의 유저가 여러 개의 채팅방을 생성/관리할 수 있음

  <img src='' width=500px>

- 채팅방 생성/ 삭제 가능

<img src=""  width=700px>

- 채팅방 초대/추방 가능


### 2) 정확한 모임 위치 정보 제공 기능

- Naver GPS Open API를 통한 경기 모임 장소 위치 정보 제공

### 3) 경기 매칭 성사/평가 알림 기능

- 내가 올린 경기 모집 글/ 동아리 모집 글에 신청이 올 경우 사이트에 접속해 있지 않더라도 알림 발송, 알림 탭에 표시
- 그 외 농구 대결이 성사된 경우, 농구 대결이 끝난 후 평가 알림 등 필요한 부분들에 대해 알림 발송

<img src='' width=700px>

<img src='' width=700px>

### 4) 자동 배포를 위한 파이프 라인 구축

- Github Action과 Code Deploy를 이용한 자동 배포

### 5) 소셜 로그인 기능

- 간편한 회원가입을 위한 소셜 로그인 기능 도입

<br>

### 서브 기능

### 1) 경기 모집

- 

### 2) 동아리

- 

### 3) 경기장 정보 제공

- 정렬 후 페이지네이션 형태로 제공
- 무한 스크롤

### 4) 좋아요 싫어요 기능 / 신고 기능

- 

### 5) 평가 기능

- 

### 6) 검색 기능

- 

### 7) 메일 인증 기능

- 

<br>

### 🎥 시연 영상

<br>

## 3. 프로젝트 구성도

### 📑 와이어프레임

[figma]https://www.figma.com/file/e1piAokpVNF4Aah71bolbE?embed_host=notion&kind=file&t=tEI1Hm96y5Dw699q-6&type=design&viewer=1

### 📎 기술 스택

<img src='https://user-images.githubusercontent.com/97580782/167986507-cdddae5f-5f5c-435c-9b68-59b50abac2a9.png' width=600px>

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

[figma]<img src='' width=600px>

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
