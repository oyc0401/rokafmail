import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { bean } from 'src/server/bean/bean';
import { labelLogger } from 'config/logger/labelLogger';
import { ResponseHelper } from '../../libs/response';
import { verifyToken, extractToken } from '../../libs/auth';

const logger = labelLogger('EditPassword');

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
    const { encryptedOriginPassword, encryptedPassword } = body;

    if (encryptedOriginPassword === encryptedPassword) {
      return ResponseHelper.badRequest('동일한 비밀번호로 변경할 수 없습니다.');
    }

    const { userService, userRepository } = bean;

    const user = await userRepository.getAuthByUsername(username);
    if (!user) {
      return ResponseHelper.notFound('유저를 찾을 수 없습니다.');
    }

    if (encryptedOriginPassword !== user.auth?.password) {
      return ResponseHelper.badRequest('비밀번호를 다시 입력해주세요.');
    }

    await userService.editPassword(user.id, encryptedPassword);
    logger.info(`${user.id}`);

    return ResponseHelper.ok({ message: '비밀번호 수정에 성공했습니다.' });
  } catch (error) {
    logger.error(`비밀번호 수정 중 오류: ${error}`);
    return ResponseHelper.internalServerError(error.message);
  }
};
