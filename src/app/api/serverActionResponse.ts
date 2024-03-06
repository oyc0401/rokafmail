import { User } from "src/db";
import { auth } from "src/app/api/auth/auth";

interface ServerActionParam<body> {
  message: body;
  status: number;
}

export class ServerActionResponse {
  // server action은 plain object만 반환 가능하다.
  static json<body>({ message, status }: ServerActionParam<body>) {
    return {
      message,
      status,
    };
  }

  static ok(message: any = "OK") {
    return ServerActionResponse.json({
      message: message,
      status: 200,
    });
  }

  static unauthorized(message: any = "Unauthorized") {
    return ServerActionResponse.json({
      message,
      status: 401,
    });
  }

  static forbidden(message: any = "Forbidden") {
    return ServerActionResponse.json({
      message,
      status: 403,
    });
  }

  static notFound(message: string = "Not Found") {
    return ServerActionResponse.json({
      message,
      status: 404,
    });
  }
}

interface ServerActionAuthParam {
  requireAuth: boolean;
  author?: string;
}

export const ServerActionAuth = ({
  requireAuth = false,
  author,
}: ServerActionAuthParam) => {
  return {
    async response(event: Function) {
      if (requireAuth) {
        // next-auth를 통한 유저 인증
        const session = await auth();

        // 로그인이 되어있지 않으면 unauthorized (401)
        if (!session || !session.user || !session.user.email)
          return ServerActionResponse.unauthorized();

        // 해당 유저 정보가 없으면 notFound (404)
        const sessionUsername = session.user.email;
        const user = await User.findByUsername(sessionUsername);
        if (!user) return ServerActionResponse.notFound();

        if (author) {
          // 본인이 아닌 다른사람 정보에 접근하려고하면 forbidden (403)
          if (author != sessionUsername)
            return ServerActionResponse.forbidden();
        }
      }

      return await event();
    },
  };
};
