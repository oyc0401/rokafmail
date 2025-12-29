import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { bean } from 'src/server/bean/bean';
import { ResponseHelper } from '../../libs/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const username = event.queryStringParameters?.username;

    if (!username) {
      return ResponseHelper.badRequest('Username is required');
    }

    const { userService } = bean;
    const exist = await userService.existUsername(username);

    return ResponseHelper.ok({ exist });
  } catch (error) {
    return ResponseHelper.internalServerError(error.message);
  }
};
