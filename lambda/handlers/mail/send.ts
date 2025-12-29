import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { makeLogger } from 'config/winston';
import { Letter } from 'src/type/serviceType';
import { MailService } from 'src/server/service/mail/MailService';
import { bean } from 'src/server/bean/bean';
import { validateContent, validateMailPassword, validateRelationship, validateTitle, validateWriter } from 'src/utils/validate';
import { validateAttack } from 'src/utils/filter/filter';
import uploadFile from 'src/app/mail/[username]/pupload';
import prisma from 'src/db/prisma';
import { ResponseHelper } from '../../libs/response';

const logger = makeLogger('Mail');

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { username, name, relationship, title, contents, password, isPublic, files } = body;

    const { userRepository } = bean;

    // 유저 존재 여부 체크
    const user = await userRepository.findByUsername(username);
    if (!user) {
      return ResponseHelper.notFound('해당 유저를 찾을 수 없습니다.');
    }

    // 폼 입력 검증
    try {
      validateTitle(title);
      validateContent(contents);
      validateWriter(name);
      validateRelationship(relationship);
      validateMailPassword(password);

      validateAttack(title);
      validateAttack(contents);
      validateAttack(name);
      validateAttack(relationship);
      validateAttack(password);
    } catch (error) {
      return ResponseHelper.badRequest(error.message);
    }

    const letter: Letter = {
      name,
      relationship,
      title,
      contents,
      password,
      isPublic: isPublic === true || isPublic === 'true'
    };

    const mailService = new MailService(bean);
    const postId = await mailService.sendLetterAwait(user.id, letter);

    // 파일이 있으면 S3 업로드 (files는 base64 또는 File 객체로 전달)
    // Lambda에서는 multipart/form-data 처리가 복잡하므로,
    // 프론트에서 먼저 업로드 엔드포인트를 호출하고 파일명을 받아서 전달하는 방식 권장
    if (files && Array.isArray(files)) {
      for (const filename of files) {
        await prisma.image.create({
          data: {
            postId: postId,
            path: filename
          }
        });
      }
    }

    return ResponseHelper.created({ message: '편지 전송 성공!', postId });
  } catch (error) {
    logger.error(`편지 보내는 중 오류 발생: ${error}`);
    return ResponseHelper.internalServerError(error.message);
  }
};
