import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserFromDb, saltAndHashPassword } from 'src/auth/login';
import { createToken } from '../../libs/auth';
import { ResponseHelper } from '../../libs/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { username, password } = body;

    if (!username || !password) {
      return ResponseHelper.badRequest('Username and password are required');
    }

    // 기존 로직 재사용
    const pwHash = saltAndHashPassword(password);
    const user = await getUserFromDb(username, pwHash);

    if (!user) {
      return ResponseHelper.unauthorized('Invalid credentials');
    }

    // JWT 생성
    const token = createToken({
      username: user.username,
      role: user.role as 'admin' | 'trainee',
      provider: 'credential'
    });

    return ResponseHelper.ok({
      token,
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return ResponseHelper.internalServerError(error.message);
  }
};
