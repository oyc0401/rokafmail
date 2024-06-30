"use server";
import { makeLogger } from "config/winston";
const logger = makeLogger("Mail");
import { MailService } from "src/service/mail/MailService";
import { bean } from "src/bean/bean";
import { Trainee } from "src/service/user/Trainee";
import { validateContent, validateMailPassword, validateRelationship, validateTitle, validateWriter } from "src/utils/validate";
import { validateAttack } from "src/utils/filter/filter";
import { ActionResponse } from "src/app/apiSSR/actionResponse";

/**
 * `Server Action`
 * 
 * 편지를 보낸다.
 * @status `200` `404`
 */
export async function sendMail(mailForm: {
  username: string;
  name: string;
  relationship: string;
  title: string;
  contents: string;
  password: string;
  isPublic: boolean;
}) {
  try {
    const { username, name, relationship, title, contents, password, isPublic } =
      mailForm;

    const { userRepository } = bean;
    // 유저 존재 여부 체크
    const user = await userRepository.findByUsername(username);

    if (!user) {
      return ActionResponse.notFound("해당 유저를 찾을 수 없습니다.")
    }
    // 폼 입력 검증
    validateInput(mailForm);

    const trainee = new Trainee(user);
    const letter = {
      userId: user.id,
      name, relationship,
      title, contents,
      password, isPublic,
    }

    const mailService = new MailService(bean);
    await mailService.sendLetter(trainee, letter);

    return ActionResponse.ok("편지 전송 성공!");
  } catch (error) {
    logger.error(`편지 보내는 중 오류 발생: ${error}`);
    return ActionResponse.internalServerError(error.message);
  }
}



function validateInput({
  username,
  name,
  relationship,
  title,
  contents,
  password,
}) {
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
}
