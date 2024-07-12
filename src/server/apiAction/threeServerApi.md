# Three Server Api

next.js에는 프론트엔드에서 서버와 통신할 수 있는 방법 세가지가 존재한다.
1. api route
2. server action
3. server side rendering (SSR)

이 세가지 방법을 분리하기 위해 다음과 같은 폴더 구조를 만들었다.
```
/app
  /api
    /getStatus
      route.ts
  /apiAction
    /register
      action.ts
  /apiSSR
    /getMails
      server.ts
```

## apiAction
apiAction은 'use server'가 붙어 서버액션으로 사용하는 함수들을 모아둔 곳이다.
api/route.ts와 비슷하게,

apiAction 내부에 있는 메인 파일의 이름은 `action.ts`이다.

'use server' 가 붙은 폴더들은 서로 참조할 수 있지만, 일반 서버 파일에서는 해당 파일을 참조할 수 없다.

서버 -> action.ts x

action.ts -> action.ts o

SSR -> action.ts x

CSR -> action.ts o

## apiSSR
서버사이드 렌더링을 할 때에도 보안은 필수적이다.

만약 ssr페이지에서 모든 mail 정보를 불러오고, 그 중 일부만 화면에 보여주어도
우선은 클라이언트에게 모든 정보가 노출되기 때문에 api를 사용하는 것 처럼
모든 사용자가 보는 정보라고 생각하고,일부만 클라이언트에 전달해야한다.

또한 클라이언트 코드에 직접적으로 DB에서 값을 불러오는 좋지 못한 코드를 예방해준다.