import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPostById, getPostWithUserById, getPostContent, getPostEverything } from 'src/server/apiSSR/mail/server';
import { ResponseHelper } from '../../libs/response';

/**
 * 편지 조회 API
 * GET /api/mail?postId={id}&type={basic|user|content|everything}
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const postId = event.queryStringParameters?.postId;
    const type = event.queryStringParameters?.type || 'basic';

    if (!postId) {
      return ResponseHelper.badRequest('postId is required');
    }

    let post;
    switch (type) {
      case 'user':
        post = await getPostWithUserById(Number(postId));
        break;
      case 'content':
        post = await getPostContent(Number(postId));
        break;
      case 'everything':
        post = await getPostEverything(Number(postId));
        break;
      default:
        post = await getPostById(Number(postId));
    }

    if (!post) {
      return ResponseHelper.notFound('편지를 찾을 수 없습니다.');
    }

    return ResponseHelper.ok(post);
  } catch (error) {
    return ResponseHelper.internalServerError(error.message);
  }
};
