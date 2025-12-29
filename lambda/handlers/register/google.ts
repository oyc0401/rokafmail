import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { makeLogger } from 'config/winston';
import { ValidateError, validateBirth, validateGeneration, validateMessage, validateName, validateUsername } from 'src/utils/validate';
import { bean } from 'src/server/bean/bean';
import { ResponseHelper } from '../../libs/response';
import { Trainee } from 'src/type/serviceType';

const logger = makeLogger('Register');

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { username, name, birth, generation, message, uid } = body;

    // 입력 검증
    try {
      validateUsername(username);
      validateGeneration(generation);
      validateBirth(birth);
      validateName(name);
      validateMessage(message);
    } catch (error) {
      if (error instanceof ValidateError) {
        return ResponseHelper.badRequest(error.message);
      }
      throw error;
    }

    const { userService } = bean;

    // 아이디 중복 체크
    const exist = await userService.existUsername(username);
    if (exist) {
      return ResponseHelper.badRequest('아이디가 중복되었습니다.');
    }

    // 회원가입
    const trainee: Trainee = { username, name, birth, generation, message };
    await userService.registerGoogle(trainee, uid, true);

    return ResponseHelper.created({ message: '회원가입 성공' });
  } catch (error) {
    logger.error(`회원가입 처리 중 오류 발생: ${error}`);
    return ResponseHelper.internalServerError(error.message);
  }
};
