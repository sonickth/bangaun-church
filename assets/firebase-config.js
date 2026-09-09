/*
  ============================================
  Firebase 설정 파일 — README.md '게시판 실제 운영(Firebase 연동)' 참고
  아래 6개 값을 Firebase 콘솔에서 발급받은 값으로 교체하면
  나눔터 게시판이 실제로 입력·조회되는 게시판으로 작동합니다.
  교체 전에는 예시 글만 보이는 임시 상태로 표시됩니다.
  ============================================
*/
const firebaseConfig = {
  apiKey: "[[FIREBASE_API_KEY]]",
  authDomain: "[[FIREBASE_AUTH_DOMAIN]]",
  projectId: "[[FIREBASE_PROJECT_ID]]",
  storageBucket: "[[FIREBASE_STORAGE_BUCKET]]",
  messagingSenderId: "[[FIREBASE_SENDER_ID]]",
  appId: "[[FIREBASE_APP_ID]]",
};

const FIREBASE_READY = !firebaseConfig.apiKey.startsWith("[[");
let db = null;
if (FIREBASE_READY) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}
