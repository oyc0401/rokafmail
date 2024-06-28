interface ApiRes<Body> {
  message?: Body;
  status: number;
  error: any;
}

export class ApiResponse {
  // server action은 plain object만 반환 가능하다.
  static json<Body = string>({
    message,
    status,
    error
  }: {
    message?: Body;
    status: number;
    error: any;
  }): ApiRes<Body> {
    return {
      message,
      status,
      error
    };
  }

  static ok<T>(message: T) {
    return ApiResponse.json({
      message,
      status: 200,
      error: "OK",
    });
  }

  static unauthorized(error: any = "Unauthorized") {
    return ApiResponse.json({
      status: 401,
      error,
    });
  }

  static forbidden(error: any = "Forbidden") {
    return ApiResponse.json({
      status: 403,
      error,
    });
  }

  static notFound(error: any = "Not Found") {
    return ApiResponse.json({
      status: 404,
      error,
    });
  }
}

export async function apiThrower<Body>(apiResponseFunc: Promise<{
  message: Body;
  status: number;
  error: any;
}>) {
  const response = await apiResponseFunc;
  if (response.message) {
    return response.message;
  } else {
    throw {
      status: response.status,
      message: response.error,
    }
  }
}