import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { bean } from 'src/server/bean/bean';
import { labelLogger } from 'config/logger/labelLogger';
import { ResponseHelper } from '../../libs/response';
import { verifyToken, extractToken } from '../../libs/auth';

const logger = labelLogger('EditProfile');

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // 인증 확인
    const token = extractToken(event.headers.Authorization || event.headers.authorization);
    if (!token) {
      return ResponseHelper.unauthorized('토큰이 필요합니다.');
    }

    const session = await verifyToken(token);
    if (!session?.user.username) {
      return ResponseHelper.unauthorized('유효하지 않은 토큰입니다.');
    }

    const username = session.user.username;

    const body = JSON.parse(event.body || '{}');
    const { name, birth, message } = body;

    const { userService, userRepository } = bean;

    const user = await userRepository.findByUsername(username);
    if (!user) {
      return ResponseHelper.notFound('유저를 찾을 수 없습니다.');
    }

    await userService.editProfile(user.id, { name, birth, message });

    return ResponseHelper.ok({ message: '유저 정보 수정에 성공했습니다.' });
  } catch (error) {
    logger.error(`프로필 수정 중 오류: ${error}`);
    return ResponseHelper.internalServerError(error.message);
  }
};
