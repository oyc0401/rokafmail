# Three Server Api

next.js에는 프론트엔드에서 서버와 통신할 수 있는 방법 세가지가 존재한다.
1. api route
2. server action
3. server side rendering (SSR)

이 세가지 방법을 분리하기 위해 다음과 같은 폴더 구조를 만들었다.

- api
- apiAction
- apiSSR

## apiAction
api/route.ts와 비슷하게,

apiAction 내부에 있는 메인 파일의 이름은 `action.ts`이다.

'use server' 가 붙은 폴더들은 서로 참조할 수 있지만, 일반 서버 파일에서는 해당 파일을 참조할 수 없다.

서버 -> action.ts x

action.ts -> action.ts o

SSR -> action.ts x

CSR -> action.ts o