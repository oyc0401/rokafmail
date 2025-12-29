import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Post } from 'src/db';
import { makeLogger } from 'config/winston';
import { validateContent, validateMailPassword, validateRelationship, validateTitle, validateWriter } from 'src/utils/validate';
import { validateAttack } from 'src/utils/filter/filter';
import prisma from 'src/db/prisma';
import { ResponseHelper } from '../../libs/response';

const logger = makeLogger('Edit Mail');

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { postId, username, name, relationship, title, contents, password, isPublic, images, files } = body;

    const post = await Post.findById(postId);
    if (!post || post.user.username !== username) {
      return ResponseHelper.notFound('편지를 찾을 수 없습니다.');
    }

    if (post.password !== password) {
      return ResponseHelper.unauthorized('비밀번호가 틀렸습니다.');
    }

    // 입력 검증
    try {
      validateContent(contents);
      validateTitle(title);
      validateMailPassword(password);
      validateRelationship(relationship);
      validateWriter(name);

      validateAttack(title);
      validateAttack(contents);
      validateAttack(name);
      validateAttack(relationship);
      validateAttack(password);
    } catch (error) {
      return ResponseHelper.badRequest(error.message);
    }

    // 이미지 삭제
    const remainImageIds: number[] = images || [];
    const dbImages = await prisma.image.findMany({
      select: { id: true },
      where: { postId }
    });

    const dbImageIds = dbImages.map(image => image.id);
    const deletedImageIds = dbImageIds.filter(id => !remainImageIds.includes(id));

    await prisma.image.deleteMany({
      where: {
        id: { in: deletedImageIds }
      }
    });

    // 새 이미지 추가 (files는 이미 업로드된 파일명 배열)
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

    // 글 수정
    await Post.edit(postId, { name, relationship, title, contents, password, isPublic });

    logger.info(`(${postId}) ${username} Edit | ${post.title} | ${post.name} | ${post.relationship}`);

    return ResponseHelper.ok({ message: '수정완료' });
  } catch (error) {
    logger.error(`편지 수정 중 오류: ${error}`);
    return ResponseHelper.internalServerError(error.message);
  }
};
