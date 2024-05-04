import { User } from "src/db";
import { auth } from "src/app/api/auth/auth";

interface ServerAction<Body> {
  message?: Body;
  status: number;
  error: string;
}

export class ServerActionResponse {
  // server action은 plain object만 반환 가능하다.
  static json<Body = undefined>({
    message,
    status,
    error,
  }: {
    message?: Body;
    status: number;
    error?: string;
  }) {
    return {
      message,
      status,
      error: error ?? "",
    };
  }

  static ok<T>(message: T) {
    return ServerActionResponse.json({
      message,
      status: 200,
      error: "OK",
    });
  }

  static unauthorized() {
    return ServerActionResponse.json({
      status: 401,
      error: "Unauthorized",
    });
  }

  static forbidden() {
    return ServerActionResponse.json({
      status: 403,
      error: "Forbidden",
    });
  }

  static notFound(error = "Not Found") {
    return ServerActionResponse.json({
      status: 404,
      error,
    });
  }
}

export async function ensureUserMatch(username: string) {
  // next-auth를 통한 유저 인증
  const session = await auth();

  // 로그인이 되어있지 않으면 unauthorized (401)
  if (!session || !session.user || !session.user.email) {
    return {
      valid: false,
      errorResponse: ServerActionResponse.unauthorized()
    }
  }

  // 해당 유저 정보가 없으면 notFound (404)
  const sessionUsername = session.user.email;
  const user = await User.findByUsername(sessionUsername);
  if (!user) {
    return {
      valid: false,
      errorResponse: ServerActionResponse.notFound()
    }
  }

  if (username) {
    // 본인이 아닌 다른사람 정보에 접근하려고하면 forbidden (403)
    if (username != sessionUsername) {
      return {
        valid: false,
        errorResponse: ServerActionResponse.forbidden()
      }
    }
  }

  return {
    valid: true,
    errorResponse: ServerActionResponse.ok('접근 가능')
  }
}
