import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Post } from 'src/db';
import { makeLogger } from 'config/winston';
import prisma from 'src/db/prisma';
import { ResponseHelper } from '../../libs/response';

const logger = makeLogger('Delete Mail');

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { id, password } = body;

    const post = await Post.findById(id);

    if (!post) {
      return ResponseHelper.notFound('해당 편지가 없습니다.');
    }

    if (post.password === password) {
      await prisma.post.delete({
        where: { id }
      });

      logger.info(`(${id}) ${post.user.username} Delete | ${post.title} | ${post.name} | ${post.relationship}`);

      return ResponseHelper.ok({ message: '편지 삭제에 성공했습니다.' });
    } else {
      return ResponseHelper.unauthorized('비밀번호가 틀렸습니다.');
    }
  } catch (error) {
    logger.error(`편지 삭제 중 오류: ${error}`);
    return ResponseHelper.internalServerError(error.message);
  }
};
