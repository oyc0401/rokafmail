# 하늘인편

공군 훈련병에게 인터넷 편지를 더 쉽게 보낼 수 있도록 만든 편지 발송 플랫폼입니다.

기존 공군 인터넷편지는 지인이 훈련병의 이름과 생년월일을 직접 입력해야 했고, 모바일 사용성이 좋지 않았으며, 공군 서버 장애로 편지가 누락될 수 있었습니다. 하늘인편은 훈련병이 미리 가입해 편지 작성 링크를 공유하면, 지인이 링크만 열어 편지를 작성할 수 있도록 만든 서비스입니다.

- 서비스: https://rokafmail.kr
- 운영 기간: 2024.02 배포, 2024.08 인터넷편지 폐지 이후 조회/보관 용도로 유지
- 현재 상태: 최소 비용으로 유지보수 중
- GitHub: https://github.com/oyc0401/rokafmail

## 성과

| 지표 | 수치 |
| --- | ---: |
| 2024.07 기준 MAU | 2.5만 |
| 누적 사용자 | 12만 |
| 누적 페이지뷰 | 130만 |
| 가입한 훈련병 | 3,500+ |
| 발송한 편지 | 78,000+ |

공군 인터넷편지가 폐지되기 전 마지막 기수에 가까웠던 859기에서는 한 기수 기준 745명의 훈련병이 가입했습니다. 공군 한 기수 전체 인원이 2천 명 미만이었던 점을 고려하면, 훈련병 1/3 이상이 사용한 서비스였습니다.

## 문제

공군 기본군사훈련단의 인터넷편지는 다음과 같은 문제가 있었습니다.

- 편지를 쓰려면 훈련병의 이름과 생년월일을 매번 직접 입력해야 했습니다.
- 모바일 환경에서 작성 흐름이 불편했습니다.
- 공군 서버가 자주 불안정해 편지 발송과 훈련병 정보 조회가 실패했습니다.
- 입대 2주 뒤부터만 훈련병 조회와 편지 발송이 가능해, 그 전에 작성된 편지를 따로 보관하고 처리해야 했습니다.

하늘인편은 사용자의 편지 작성 경험을 단순화하는 동시에, 외부 공군 서버 장애가 곧바로 편지 누락으로 이어지지 않도록 설계했습니다.

## 핵심 기능

- 훈련병 가입 및 개인 편지함 링크 생성
- 링크 기반 편지 작성
- 입대 2주 전 작성된 편지 DB 보관
- 공군 서버 발송 실패 시 재시도 큐 등록
- 훈련병 정보 조회 실패 시 사용자 큐 등록
- 작성된 편지 조회 및 수정
- 인터넷편지 폐지 이후 사진 첨부 기능 추가
- 관리자 페이지와 로그 기반 운영 대응

## 편지 발송 흐름

```text
훈련병 가입
  -> 편지함 링크 공유
  -> 지인이 링크로 편지 작성
  -> 편지 DB 저장
  -> 공군 서버에 훈련병 정보 조회
  -> 공군 서버에 편지 발송
  -> 실패 시 DB 기반 큐에 저장
  -> cron job으로 재시도
```

공군 API는 훈련병 이름과 생년월일을 받아 HTML을 반환했습니다. 하늘인편은 해당 HTML에서 훈련병 식별번호와 소대번호를 파싱한 뒤, FormData 기반 POST 요청으로 편지를 전송했습니다.

입대 2주 전에는 공군 서버에서 훈련병 조회가 불가능했기 때문에, 사용자가 미리 작성한 편지는 DB에 저장했습니다. 이후 훈련병 조회가 가능해지면 대기 중인 편지를 일괄 발송했습니다.

## 편지 누락 방지

공군 서버는 간헐적으로 요청 실패가 발생했고, 장애가 길어지면 하루 이상 편지가 전송되지 않는 경우도 있었습니다. 단순히 사용자 요청 시점에 바로 공군 서버로 전달하는 구조라면, 외부 서버 오류가 그대로 편지 누락으로 이어질 수 있었습니다.

이를 막기 위해 발송 요청과 훈련병 정보 조회 요청을 DB 기반 큐로 관리했습니다.

- 편지 발송 실패 시 `PostQueue`에 저장
- 훈련병 정보 조회 실패 시 `UsersQueue`에 저장
- `node-cron` 기반 작업으로 주기적 재시도
- 서버 재시작 후에도 큐 데이터가 유실되지 않도록 Prisma/PostgreSQL에 저장
- 욕설, XSS, 비밀번호 오류 등 재시도가 의미 없는 케이스는 큐에서 제외
- 훈련병 조회 실패가 장기간 지속되는 경우 별도 분기 처리

이 구조를 통해 공군 서버 장애를 사용자 요청 흐름과 분리했고, 일시적인 외부 장애가 편지 누락으로 이어지지 않도록 완충 계층을 만들었습니다.

## 서버 구조

Next.js 프로젝트 안에서 프론트엔드와 백엔드를 함께 운영했습니다. 초기 개발 속도와 배포 단순성을 우선했고, 서버 로직은 테스트와 유지보수를 위해 계층을 분리했습니다.

```text
src/server
  ├── apiAction      # Server Action 기반 요청 처리
  ├── apiSSR         # SSR 페이지용 서버 데이터 조회
  ├── bean           # 의존성 구성
  ├── repository     # Prisma/Memory 저장소 구현
  └── service        # mail, retry, user, rokafClient 도메인 로직
```

핵심 발송 로직은 다음 구조로 나누었습니다.

- Controller/API 계층: Server Action과 Route Handler에서 요청을 받음
- Service 계층: 편지 발송, 훈련병 조회, 재시도 정책을 처리
- Repository 계층: Prisma 저장소와 테스트용 Memory 저장소를 분리
- Bean 구성: 실제 운영 인스턴스와 테스트 인스턴스를 DI 방식으로 구성

이 구조 덕분에 실제 공군 서버 호출과 DB 접근을 분리한 상태에서 핵심 발송 시나리오를 테스트할 수 있었습니다.

## Next.js 실행 경계

하늘인편은 Next.js App Router를 사용하면서 서버 통신 방식을 목적별로 나누었습니다.

- Server Action: 회원가입, 편지 작성, 편지 수정/삭제 같은 일반 사용자 요청
- Route Handler: cron 시작/중지/상태 조회처럼 서버 프로세스 내부 상태를 제어하는 요청
- SSR 서버 함수: 편지 목록/상세처럼 렌더링 전에 필요한 데이터 조회

또한 Server Action의 응답 형식을 일관되게 처리하기 위해 자체 `ActionResponse` 유틸을 만들었습니다. 이를 통해 성공/실패 응답 형태를 통일하고, 클라이언트에서 서버 응답 타입을 더 안정적으로 다룰 수 있게 했습니다.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Framework | Next.js 14, React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS, CSS Modules |
| State | Zustand, React Query |
| Backend | Server Action, Route Handler, node-cron |
| Database | PostgreSQL, Prisma |
| Auth | NextAuth, Google OAuth |
| Upload | AWS S3, browser image compression |
| Test | Jest |
| Infra | AWS EC2, Docker, nginx, GitHub Actions |
| Logging | winston |

## 운영

초기에는 RDS를 사용했지만, 프리티어 종료 이후 운영비 절감을 위해 EC2 내부에서 Docker 기반 PostgreSQL을 운영하는 방식으로 전환했습니다. nginx는 HTTPS 설정과 배포 중 fallback 화면 제공에 사용했고, GitHub Actions는 `main` 브랜치 push 시 자동 배포가 실행되도록 구성했습니다.

서비스 운영 중 사용자 문의와 발송 실패를 빠르게 확인하기 위해 로그와 관리자 페이지를 구축했습니다. 인터넷편지 폐지 이후에는 편지 조회와 사진 첨부 기능을 중심으로 서비스를 유지하고 있습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

필요한 환경 변수 예시는 다음과 같습니다. 실제 운영 키는 저장소에 커밋하지 않습니다.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="local-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="google-client-id"
GOOGLE_CLIENT_SECRET="google-client-secret"
AWS_ACCESS_KEY_ID="aws-access-key"
AWS_SECRET_ACCESS_KEY="aws-secret-key"
AWS_REGION="ap-northeast-2"
AWS_S3_BUCKET_NAME="bucket-name"
```

주요 스크립트는 다음과 같습니다.

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # Next lint + TypeScript 검사
npm run test     # Jest 테스트 실행
```

## 테스트

발송 로직은 외부 공군 서버와 DB에 직접 의존하지 않도록 Memory Repository와 Mock Rokaf Client를 사용해 테스트할 수 있게 구성했습니다.

주요 테스트 대상은 다음과 같습니다.

- 편지 발송 로직
- 발송 실패 후 큐 등록
- 큐 재시도 처리
- 훈련병 정보 조회 및 동기화
- 입력값 검증과 필터링

```bash
npm run test
```

