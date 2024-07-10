import { User } from "src/db";
import { sha256 } from "src/utils/sha256";
export async function login(username, password) {
  const user = await User.findByUsername(username);

  if (!user) {
    return { message: "아이디가 없습니다.", status: 400 };
  }

  const encryptedPassword = sha256(password);

  if (user.password == encryptedPassword) {
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
  const encryptedPassword =sha256(password);

  return encryptedPassword;
}

export async function getUserFromDb(username: string, encryptedPassword: string) {
  const user = await User.findByUsername(username);

  if (user && user.password == encryptedPassword) {
    let role = 'trainee'
    if (user.username == 'oyc0401') {
      role = 'admin';
    }
    return {
      id: user.id.toString(),
      email: user.username,
      role: role,
    }
  }

  return null;
}