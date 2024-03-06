import { User } from "src/db";
import crypto from "crypto";
export async function login(username, password) {
  const user = await User.findByUsername(username);

  if (!user) {
    return { message: "아이디가 없습니다.", status: 400 };
  }

  const encryptedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  
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
