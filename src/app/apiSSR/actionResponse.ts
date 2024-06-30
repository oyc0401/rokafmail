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

  static ok<T>(message: T) {
    return ActionResponse.json({ status: 200, message });
  }

  static unauthorized(error = "Unauthorized") {
    return ActionResponse.error({ status: 401, error });
  }

  static forbidden(error = "Forbidden") {
    return ActionResponse.error({ status: 403, error });
  }

  static notFound(error = "Not Found") {
    return ActionResponse.error({ status: 404, error });
  }
}

export async function action<Body>(apiResponseFunc: Promise<ActionResponseType<Body>>) {
  const response = await apiResponseFunc;
  if (response.message != null || response.message != undefined) {
    return response.message;
  } else {
    throw {
      status: response.status,
      message: response.error,
    }
  }
}