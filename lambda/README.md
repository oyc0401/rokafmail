# Rokafmail Lambda Functions

이 프로젝트는 Next.js Server Actions을 AWS Lambda로 마이그레이션한 버전입니다.

## 📁 디렉토리 구조

```
lambda/
├── handlers/          # Lambda 함수 핸들러들
│   ├── auth/         # 인증 관련
│   │   ├── credential-login.ts
│   │   ├── google.ts
│   │   └── google-callback.ts
│   ├── register/     # 회원가입
│   │   ├── credential.ts
│   │   └── google.ts
│   ├── mail/         # 편지 관련
│   │   ├── send.ts
│   │   ├── edit.ts
│   │   └── delete.ts
│   ├── profile/      # 프로필 관련
│   │   ├── edit.ts
│   │   ├── password.ts
│   │   └── delete.ts
│   ├── user/         # 유저 관련
│   │   └── exist.ts
│   ├── report/       # 신고
│   │   └── send.ts
│   ├── upload/       # 파일 업로드
│   │   └── file.ts
│   └── api/          # GET APIs
│       ├── mail-get.ts
│       ├── user-get.ts
│       └── profile-mails.ts
└── libs/             # 공통 라이브러리
    ├── auth.ts       # JWT 인증 헬퍼
    └── response.ts   # 응답 헬퍼
```

## 🚀 배포

### 1. 환경변수 설정

`.env` 파일을 생성하고 다음 환경변수를 설정하세요:

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-api-domain/auth/google/callback
FRONTEND_URL=https://rokafmail.kr
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=your-s3-bucket
AWS_REGION=ap-northeast-2
GMAIL_EMAIL=your-gmail
GMAIL_PASSWORD=your-gmail-password
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 배포

```bash
npm run lambda:deploy
```

### 4. 로컬 테스트

```bash
npm run lambda:offline
```

## 📝 API 엔드포인트

### 인증

- `POST /auth/credential/login` - Credential 로그인
- `GET /auth/google` - Google OAuth 시작
- `GET /auth/google/callback` - Google OAuth 콜백

### 회원가입

- `POST /register/credential` - Credential 회원가입
- `POST /register/google` - Google 회원가입

### 편지

- `POST /mail/send` - 편지 전송
- `PUT /mail/edit` - 편지 수정
- `DELETE /mail/delete` - 편지 삭제
- `GET /api/mail?postId={id}` - 편지 조회

### 프로필

- `PUT /profile/edit` - 프로필 수정 (인증 필요)
- `PUT /profile/password` - 비밀번호 수정 (인증 필요)
- `DELETE /profile/delete` - 회원탈퇴 (인증 필요)
- `GET /api/profile/mails?username={username}` - 편지 목록 조회

### 유저

- `GET /user/exist?username={username}` - 아이디 중복 체크
- `GET /api/user?username={username}` - 유저 조회

### 기타

- `POST /report/send` - 신고
- `POST /upload` - 파일 업로드

## 🔐 인증

인증이 필요한 API는 다음과 같이 JWT 토큰을 헤더에 포함해야 합니다:

```
Authorization: Bearer {your-jwt-token}
```

## 🔄 Next.js에서 Lambda로 마이그레이션

### 기존 코드 (Next.js Server Action)

```typescript
const session = await auth();
if (!session?.user.username) return ActionResponse.unauthorized();
```

### 변경된 코드 (Lambda)

```typescript
const token = extractToken(event.headers.Authorization);
const session = await verifyToken(token);
if (!session?.user.username) return ResponseHelper.unauthorized();
```

## 📦 주요 변경사항

1. **인증**: NextAuth → JWT
2. **배포**: Next.js → AWS Lambda (Serverless Framework)
3. **엔드포인트**: Server Actions → REST API
4. **코드 재사용**: 기존 비즈니스 로직 100% 재사용

## ⚠️ 주의사항

1. 파일 업로드는 base64 인코딩된 데이터를 받습니다
2. CORS는 자동으로 설정됩니다
3. 환경변수는 반드시 설정해야 합니다
