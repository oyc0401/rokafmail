"use server";
import { makeLogger } from "config/winston";
const logger = makeLogger("Mail");
import { Letter } from "src/type/serviceType";
import { MailService } from "src/server/service/mail/MailService";
import { bean } from "src/server/bean/bean";
import { validateContent, validateMailPassword, validateRelationship, validateTitle, validateWriter } from "src/utils/validate";
import { validateAttack } from "src/utils/filter/filter";
import { ActionResponse } from "src/lib/actionResponse";
import uploadFile from "src/app/mail/[username]/pupload";
import prisma from "src/db/prisma";


function formDataToObj(formData: FormData): {
  username: string;
  name: string;
  relationship: string;
  title: string;
  contents: string;
  password: string;
  isPublic: boolean;
  files: File[];
} {
  const mailForm: {
    username: string;
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
    isPublic: boolean;
    files: File[];
  } = {
    username: '',
    name: '',
    relationship: '',
    title: '',
    contents: '',
    password: '',
    isPublic: false,
    files: [],
  };

  formData.forEach((value, key) => {
    if (key == 'files') {
      if (value instanceof File) {
        mailForm.files.push(value);
      }
    } else if (key === 'isPublic') {
      mailForm[key] = value === 'true'; // 문자열 "true"/"false"를 boolean 값으로 변환
    } else {
      mailForm[key] = value as string; // 다른 값들은 문자열로 처리
    }
  });

  return mailForm;
}
/**
 * `Server Action`
 * 
 * 편지를 보낸다.
 * @status `200` `404`
 */
export async function sendMail(formData: FormData) {

  const mailForm = formDataToObj(formData);

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

    const letter: Letter = {
      name, relationship,
      title, contents,
      password, isPublic,
    }

    const mailService = new MailService(bean);
    const postId = await mailService.sendLetterAwait(user.id, letter);

    const imageNames = await uploadFile(mailForm.files);

    for (const name of imageNames) {
      await prisma.image.create({
        data: {
          postId: postId,
          path: name,
        }
      })
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { images: true }
    });
    console.log(post)

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
