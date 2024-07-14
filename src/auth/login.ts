import { bean } from "src/server/bean/bean";
import { sha256 } from "src/utils/sha256";

export async function login(username, password) {
  const { userRepository } = bean;
  const user = await userRepository.getAuthByUsername(username);

  if (!user) {
    return { message: "아이디가 없습니다.", status: 400 };
  }

  const encryptedPassword = sha256(password);

  if (user.auth?.password == encryptedPassword) {
    return {
      message: "로그인 성공",
      status: 200,
      user: { id: user.id, email: user.username, name: user.name },
    };
  } else {
    return { message: "비밀번호가 다릅니다.", status: 400 };
  }
}



export function saltAndHashPassword(password: string) {
  const encryptedPassword = sha256(password);

  return encryptedPassword;
}

export async function getUserFromDb(username: string, encryptedPassword: string) {
  const { userRepository } = bean;
  const user = await userRepository.getAuthByUsername(username);

  if (user && user.auth?.password == encryptedPassword) {
    let role = 'trainee'
    if (user.username == 'oyc0401') {
      role = 'admin';
    }
    return {
      id: user.id.toString(),
      username: user.username,
      role: role,
      provider: 'Credential'
    }
  }

  return null;
}