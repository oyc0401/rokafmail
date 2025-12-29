import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { User } from 'src/db';
import { bean } from 'src/server/bean/bean';
import { labelLogger } from 'config/logger/labelLogger';
import { ResponseHelper } from '../../libs/response';
import { verifyToken, extractToken } from '../../libs/auth';

const logger = labelLogger('DeleteUser');

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
    const { password } = body;

    const { userRepository } = bean;

    const user = await userRepository.getAuthByUsername(username);

    if (session.user.provider === 'google') {
      // Google 유저는 비밀번호 체크 없이 삭제
      if (user) {
        await User.deleteByUsername(username);
        logger.info(`${username} (${user.id})`);
        return ResponseHelper.ok({ message: '회원탈퇴에 성공했습니다.' });
      } else {
        return ResponseHelper.notFound('로그인을 해주세요.');
      }
    } else {
      // Credential 유저는 비밀번호 확인
      if (user?.auth?.password === password) {
        await User.deleteByUsername(username);
        logger.info(`${username} (${user.id})`);
        return ResponseHelper.ok({ message: '회원탈퇴에 성공했습니다.' });
      } else {
        return ResponseHelper.badRequest('비밀번호가 틀렸습니다.');
      }
    }
  } catch (error) {
    logger.error(`회원탈퇴 중 오류: ${error}`);
    return ResponseHelper.internalServerError(error.message);
  }
};
