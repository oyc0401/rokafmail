export interface LambdaResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export class ResponseHelper {
  static ok(data: any): LambdaResponse {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({ success: true, data })
    };
  }

  static created(data: any): LambdaResponse {
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({ success: true, data })
    };
  }

  static badRequest(message: string): LambdaResponse {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({ success: false, error: message })
    };
  }

  static unauthorized(message: string = 'Unauthorized'): LambdaResponse {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({ success: false, error: message })
    };
  }

  static notFound(message: string = 'Not Found'): LambdaResponse {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({ success: false, error: message })
    };
  }

  static internalServerError(message: string = 'Internal Server Error'): LambdaResponse {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({ success: false, error: message })
    };
  }

  static redirect(location: string): LambdaResponse {
    return {
      statusCode: 302,
      headers: {
        Location: location
      },
      body: ''
    };
  }
}
