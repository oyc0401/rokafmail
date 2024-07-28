'use server'
import { Post } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("Edit Mail");

import { validateContent, validateMailPassword, validateRelationship, validateTitle, validateWriter } from "src/utils/validate";
import { validateAttack } from "src/utils/filter/filter";
import uploadFile from "src/app/mail/[username]/pupload";
import prisma from "src/db/prisma";

function formDataToObj(formData: FormData): {
  postId: number;
  username: string;
  name: string;
  relationship: string;
  title: string;
  contents: string;
  password: string;
  isPublic: boolean;
  images: number[],
  files: File[];
} {
  const mailForm: {
    postId: number;
    username: string;
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
    isPublic: boolean;
    images: number[],
    files: File[];
  } = {
    postId: 0,
    username: '',
    name: '',
    relationship: '',
    title: '',
    contents: '',
    password: '',
    isPublic: false,
    images: [],
    files: [],
  };

  formData.forEach((value, key) => {
    if (key == 'files') {
      if (value instanceof File) {
        mailForm.files.push(value);
      }
    }
    else if (key == 'images') {
      mailForm.images.push(Number(value));
    } else if (key === 'isPublic') {
      mailForm[key] = value === 'true'; // 문자열 "true"/"false"를 boolean 값으로 변환
    } else if (key === 'postId') {
      mailForm[key] = Number(value);
    } else {
      mailForm[key] = value as string; // 다른 값들은 문자열로 처리
    }
  });

  return mailForm;
}


export async function editPost(formdata: FormData) {

  const { postId, username, name, relationship,
    title, contents, password, isPublic, files, images } = formDataToObj(formdata);

  const post = await Post.findById(postId);
  if (!post || post.user.username != username) return 'Notfound';

  if (post.password != password) {
    return '비밀번호가 틀렸습니다.'
  }

  try {
    validateInput({ name, relationship, title, contents, password })
  } catch (e) {
    return e.message;
  }

  

  // 이미지 삭제
  const remainImageIds: number[] = images;
  const dbImages = await prisma.image.findMany({
    select: {
      id: true,
    },
    where: {
      postId
    },
  })

  const dbImageIds = dbImages.map(image => image.id);

  const deletedImageIds = dbImageIds.filter(id => !remainImageIds.includes(id));

  await prisma.image.deleteMany({
    where: {
      id: {
        in: deletedImageIds,
      },
    },
  });

// 이미지 추가
  const imageNames = await uploadFile(files);

  for (const name of imageNames) {
    await prisma.image.create({
      data: {
        postId: postId,
        path: name,
      }
    })
  }


  // 글 수정
  await Post.edit(postId, { name, relationship, title, contents, password, isPublic });



  logger.info(
    `(${postId}) ${username} Edit | ${post.title} | ${post.name} | ${post.relationship}`,
  );
  return '수정완료';
}



function validateInput({
  name,
  relationship,
  title,
  contents,
  password,
}) {
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
}
