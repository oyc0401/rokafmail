interface ApiRes<Body> {
  message: Body;
  status: number;
  error?: null;
}

interface ApiErr {
  message?: null;
  status: number;
  error: any;
}

type ApiResponseObj<Body> = ApiRes<Body> | ApiErr;

export class ApiResponse {
  static json<Body>(obj: ApiRes<Body>): ApiRes<Body> {
    return obj;
  }

  static ok<T>(message: T): ApiResponseObj<T> {
    return {
      message,
      status: 200,
    };
  }

  static unauthorized(error = "Unauthorized"): ApiErr {
    return {
      status: 401,
      error,
    };
  }

  static forbidden(error = "Forbidden"): ApiErr {
    return {
      status: 403,
      error,
    };
  }

  static notFound(error = "Not Found"): ApiErr {
    return {
      status: 404,
      error,
    };
  }
}

export async function apiThrower<Body>(apiResponseFunc: Promise<ApiResponseObj<Body>>) {
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