import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getMyPosts } from 'src/server/apiSSR/profile/mails/server';
import { ResponseHelper } from '../../libs/response';

/**
 * 프로필의 편지 목록 조회 API
 * GET /api/profile/mails?username={username}
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const username = event.queryStringParameters?.username;

    if (!username) {
      return ResponseHelper.badRequest('username is required');
    }

    const posts = await getMyPosts(username);

    return ResponseHelper.ok(posts);
  } catch (error) {
    return ResponseHelper.internalServerError(error.message);
  }
};
