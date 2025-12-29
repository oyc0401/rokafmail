import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendEmail } from 'src/server/apiAction/report';
import { ResponseHelper } from '../../libs/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { message, senderEmail, lastUrl } = body;

    if (!message || !senderEmail) {
      return ResponseHelper.badRequest('Message and senderEmail are required');
    }

    const result = await sendEmail(message, senderEmail, lastUrl || '');

    if (result) {
      return ResponseHelper.ok({ message: '신고가 접수되었습니다.' });
    } else {
      return ResponseHelper.internalServerError('신고 접수에 실패했습니다.');
    }
  } catch (error) {
    return ResponseHelper.internalServerError(error.message);
  }
};
