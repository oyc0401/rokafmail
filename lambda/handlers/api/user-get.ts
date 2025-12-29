import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserById, getUserByUsername } from 'src/server/apiSSR/user/server';
import { ResponseHelper } from '../../libs/response';

/**
 * 유저 조회 API
 * GET /api/user?userId={id} 또는 GET /api/user?username={username}
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.queryStringParameters?.userId;
    const username = event.queryStringParameters?.username;

    if (!userId && !username) {
      return ResponseHelper.badRequest('userId or username is required');
    }

    let user;
    if (userId) {
      user = await getUserById(Number(userId));
    } else if (username) {
      user = await getUserByUsername(username);
    }

    if (!user) {
      return ResponseHelper.notFound('유저를 찾을 수 없습니다.');
    }

    return ResponseHelper.ok(user);
  } catch (error) {
    return ResponseHelper.internalServerError(error.message);
  }
};
