interface ActionResponseOk<Body> {
  message: Body;
  status: number;
  error?: undefined;
}

interface ActionResponseError {
  message?: undefined;
  status: number;
  error: any;
}

export type ActionResponseType<Body> = ActionResponseOk<Body> | ActionResponseError;

export class ActionResponse {
  static json<Body>(obj: ActionResponseType<Body>) {
    return obj;
  }

  static error(obj: ActionResponseError) {
    return obj;
  }

  /**
   * OK
   * @status `200`
   */
  static ok<T>(message: T) {
    return ActionResponse.json({ status: 200, message });
  }

  /**
   * Bad Request
   * @status `400`
   */
  static badRequest(error = "Bad Request") {
    return ActionResponse.error({ status: 400, error });
  }

  /**
   * Unauthorized
   * @status `401`
   */
  static unauthorized(error = "Unauthorized") {
    return ActionResponse.error({ status: 401, error });
  }

  /**
   * Forbidden
   * @status `403`
   */
  static forbidden(error = "Forbidden") {
    return ActionResponse.error({ status: 403, error });
  }

  /**
   * Not Found
   * @status `404`
   */
  static notFound(error = "Not Found") {
    return ActionResponse.error({ status: 404, error });
  }

  /**
   * Internal Server Error
   * @status `500`
   */
  static internalServerError(error = "Internal Server Error") {
    return ActionResponse.error({ status: 500, error });
  }
}

/**
 * 서버 액션 성공 시 해당 결과값을 제공함.
 *
 * 
 * ```ts
 * // error type
 * {
 *   status: number;
 *   message: any;
 * }
 * ```
 * 
 */
export async function action<Body>(apiResponseFunc: Promise<ActionResponseType<Body>>) {

  try {
    const response = await apiResponseFunc;
    if (response.message != null || response.message != undefined) {
      return response.message;
    } else {
      throw {
        status: response.status,
        message: response.error,
      }
    }

  } catch (error) {
    // 네트워크, 서버 문제 등으로 오류가 났을 때
    throw {
      status: 500,
      message: error.message,
    }
  }

}