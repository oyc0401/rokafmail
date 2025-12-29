import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserDataGoogle } from 'src/auth/google';
import { createToken } from '../../libs/auth';
import { ResponseHelper } from '../../libs/response';

/**
 * Google OAuth 콜백 엔드포인트
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const code = event.queryStringParameters?.code;

    if (!code) {
      return ResponseHelper.badRequest('Authorization code is required');
    }

    // Google에서 토큰 교환
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return ResponseHelper.unauthorized('Failed to get access token');
    }

    // Google에서 유저 정보 가져오기
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const googleUser = await userResponse.json();

    // 기존 로직 재사용
    const userData = await getUserDataGoogle(googleUser.id);

    if (!userData) {
      // 회원가입 필요
      const frontendUrl = process.env.FRONTEND_URL || 'https://rokafmail.kr';
      return ResponseHelper.redirect(
        `${frontendUrl}/register/google?uid=${googleUser.id}&email=${googleUser.email}&name=${googleUser.name}`
      );
    }

    // JWT 생성
    const token = createToken({
      username: userData.username,
      role: userData.role as 'admin' | 'trainee',
      provider: 'google',
      uid: googleUser.id
    });

    const frontendUrl = process.env.FRONTEND_URL || 'https://rokafmail.kr';
    return ResponseHelper.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    return ResponseHelper.internalServerError(error.message);
  }
};
