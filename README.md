# 반가운교회 홈페이지 운영 가이드

iscs.or.kr(일산충신교회)의 메뉴 구조·디자인 톤을 참고해 만든 다중 페이지 사이트입니다.
교회 기본정보(주소·전화·이메일·담임목사 성함)는 이미 반영되어 있습니다.
**나눔터 게시판은 Firebase 연동을 마치면 방문자가 직접 글을 쓰고(입력) 볼 수 있는(조회) 실제 게시판으로 작동합니다.**
회원가입/로그인 기능은 이번에도 포함하지 않았습니다 (하단 7번 참고).

## 파일 구성

```
index.html      홈 (나눔터 최신글 3개 표시)
about.html      교회소개 (인사말·연혁·교역자)
service.html    예배안내 (예배시간·온라인예배)
vision.html     목회비전 (4대 사역·소그룹)
missions.html   선교 (국내·해외 후원선교지)
news.html       나눔터 (실제 입력·조회 가능한 게시판)
contact.html    오시는 길 (지도·신청/문의 폼)
assets/style.css          공통 디자인
assets/site.js             공통 기능(메뉴 열고닫기 등)
assets/logo.png            반가운교회 로고 (헤더·파비콘)
assets/firebase-config.js  게시판 연동 설정 파일 (아래 2번에서 수정)
```
전체 파일과 assets 폴더를 **모두 같은 위치**에 함께 올려야 정상 작동합니다.

---

## 1. 남은 기본 정보 입력

교회 주소·전화·이메일·담임목사 성함은 이미 반영되어 있습니다. 아래 두 가지만 더 채우면 됩니다.

| 찾을 표시 | 바꿀 내용 | 있는 파일 |
|---|---|---|
| `[[YOUTUBE_ID]]` | 유튜브 영상/라이브 ID | service.html |
| `[[YOUTUBE_CHANNEL_URL]]` | 유튜브 채널 주소 | service.html |
| `○ ○ ○` | 전도사님·사모님 성함 (전달받지 못해 비워둠) | about.html |
| `○○` | 선교사님 성함, 지역명 등 예시 | missions.html |

---

## 2. 나눔터 게시판 실제 운영 (Firebase 연동) — 중요

나눔터(news.html)는 **Firebase Firestore**라는 무료 데이터베이스와 연결하면,
방문자가 직접 글을 올리고(입력) 다른 방문자가 그 글을 보는(조회) 진짜 게시판이 됩니다.
연동 전까지는 예시 글만 보이고, 글쓰기를 누르면 "연동이 필요하다"는 안내가 뜹니다.

### 2-1. Firebase 프로젝트 만들기 (무료, 카드 등록 불필요)
1. [firebase.google.com](https://firebase.google.com) 접속 → 구글 계정으로 로그인 → **콘솔로 이동**
2. **프로젝트 추가** → 프로젝트 이름 입력(예: bangaun-church) → 애널리틱스는 꺼도 무방 → **프로젝트 만들기**

### 2-2. Firestore 데이터베이스 켜기
1. 왼쪽 메뉴에서 **Firestore Database** 선택 → **데이터베이스 만들기**
2. 위치는 `asia-northeast3(서울)` 선택 → 다음
3. 보안 규칙은 일단 **테스트 모드로 시작** 선택 후 사용 설정
   (테스트 모드는 30일 후 만료되니, 아래 2-4에서 안내하는 규칙으로 꼭 교체하세요.)

### 2-3. 웹앱 등록 후 설정값 복사
1. 프로젝트 개요(홈) 화면에서 **`</>`(웹) 아이콘** 클릭 → 앱 닉네임 입력 → **앱 등록**
2. 화면에 나오는 `firebaseConfig` 값(apiKey, authDomain, projectId 등 6개)을 복사
3. `assets/firebase-config.js` 파일을 열어 `[[FIREBASE_API_KEY]]` 등 6개 표시를
   복사한 값으로 하나씩 교체합니다. (따옴표는 그대로 두고 안쪽 값만 교체)

```js
const firebaseConfig = {
  apiKey: "여기에 복사한 값",
  authDomain: "여기에 복사한 값",
  projectId: "여기에 복사한 값",
  storageBucket: "여기에 복사한 값",
  messagingSenderId: "여기에 복사한 값",
  appId: "여기에 복사한 값",
};
```

### 2-4. 보안 규칙 설정 (스팸 방지, 꼭 적용)
Firestore Database → **규칙(Rules)** 탭에서 아래 내용으로 바꾸고 **게시**를 누르세요.
누구나 글을 읽고(조회) 쓸 수(입력) 있지만, 수정·삭제는 막아 스팸 도배를 방지합니다.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.resource.data.title is string
                    && request.resource.data.title.size() > 0
                    && request.resource.data.title.size() < 100
                    && request.resource.data.body is string
                    && request.resource.data.body.size() < 1500;
      allow update, delete: if false;
    }
  }
}
```

### 2-5. 확인
`assets/firebase-config.js` 저장 후, 홈페이지의 나눔터 페이지에서 **글쓰기**로 테스트 글을 하나 올려보세요.
바로 목록에 나타나면 정상 연동된 것입니다. 홈 화면의 "이번 주 소식"에도 함께 반영됩니다.

### 2-6. 스팸 글 삭제(운영자 관리)
방문자가 직접 글을 지우는 기능은 없습니다(스팸 방지를 위해 의도적으로 뺐습니다).
문제가 되는 글은 Firebase 콘솔 → Firestore Database → `posts` 컬렉션에서
운영자가 직접 해당 문서를 찾아 삭제하면 됩니다.

---

## 3. 선교지 목록 수정

`missions.html` 하단의 `MISSIONS` 배열에서 `domestic`(국내)/`overseas`(해외) 목록을 수정합니다.
이 목록은 나눔터와 달리 Firebase 연동 없이, 파일을 직접 수정하는 방식입니다.

---

## 4. 새가족·소그룹 신청 / 기도요청 접수 방식 (contact.html)

기본값은 **이메일 전송(mailto)** 방식입니다. 방문자가 폼을 작성하고 [보내기]를 누르면
자신의 이메일 프로그램(또는 앱)이 열리며 sonickth@naver.com 으로 보낼 수 있게 됩니다.
설정은 간단하지만, 방문자 기기에 이메일 앱이 없으면 작동하지 않을 수 있습니다.
새가족 신청·기도요청은 개인정보라 나눔터처럼 공개 게시판으로 두지 않고 이 방식을 유지했습니다.

**더 안정적으로 운영하려면 (권장, 무료):**
1. [formspree.io](https://formspree.io) 무료 가입 (월 50건까지 무료)
2. 새 폼 생성 후 발급되는 주소 복사 (예: `https://formspree.io/f/abcd1234`)
3. `contact.html`에서 `<form action="mailto:sonickth@naver.com" ...>` 부분을
   `<form action="https://formspree.io/f/abcd1234" method="POST">` 로 교체

---

## 5. 실제 배포(호스팅) 방법 — 이미 완료하신 경우 건너뛰세요

### GitHub Pages (완전 무료)
1. 저장소에 전체 파일과 `assets` 폴더를 **폴더 구조 그대로** 업로드
2. 저장소 [Settings] → [Pages] → Branch를 `main`으로 설정 후 저장
3. 몇 분 후 `https://아이디.github.io/저장소이름` 주소로 접속 가능

---

## 6. 이후 자주 하실 일

- 나눔터 글 관리: 방문자가 직접 올린 글은 홈페이지에서 실시간으로 관리되며,
  스팸 글만 Firebase 콘솔에서 삭제하면 됩니다 (2-6 참고)
- 선교지 목록 변경: 3번 참고
- 예배시간 변경: 각 페이지에서 "오전 11:00" 등 시간 텍스트 직접 수정
- 온라인예배: 방송 시작 전 `[[YOUTUBE_ID]]`를 그날 라이브 영상 ID로 교체 권장

---

## 7. 회원가입/로그인까지 꼭 필요하시다면

iscs.or.kr처럼 회원가입, 로그인, 회원 전용 게시판까지 운영하려면
지금의 Firebase 연동보다 더 큰 구조(회원 인증, 권한 관리)가 필요합니다. 현실적인 방법은 두 가지입니다.

1. **Firebase Authentication 추가**: 지금 연동한 Firebase에 로그인 기능을 얹는 방식으로,
   추가 비용 없이 확장할 수 있습니다. 다만 로그인 화면, 회원 정보 관리 등 개발 작업이 꽤 필요합니다.
2. **교회 전용 홈페이지 서비스 이용**: "교회사랑넷", "하이워십" 등은 회원가입·게시판·헌금관리 등을
   이미 만들어진 형태로 제공합니다. 코드 관리 부담 없이 빠르게 시작할 수 있지만,
   지금 만든 디자인은 그대로 사용할 수 없습니다.

원하시면 다음 단계(예: Firebase Authentication 로그인 추가)를 이어서 안내해 드릴 수 있습니다.

궁금한 점이 있으면 언제든 다시 문의해 주세요.
