function validN(name:string) {
  // 빈칸일 때
  if (name == "") return { text: "", valid: false };

  // 통과
  return { text: "잘했어요!", color: "great", valid: true };
}

function validR(relationship:string) {
  // 빈칸일 때
  if (relationship == "") return { text: "", valid: false };

  // 통과
  return { text: "잘했어요!", color: "great", valid: true };
}

function validT(title:string) {
  // 빈칸일 때
  if (title == "") return { text: "", valid: false };

  // 통과
  return { text: "잘했어요!", color: "great", valid: true };
}

function validC(contents:string) {
  // 빈칸일 때
  if (contents == "") return { text: "", valid: false };

  // 1200자 이상
  if (contents.length > 1200) {
    return {
      text: "1200자 이상을 입력할 수 없습니다.",
      color: "warn",
      valid: false,
    };
  }

  // 통과
  return { text: "", color: "great", valid: true };
}

function validP(password:string) {
  // 빈칸일 때
  if (password == "") return { text: "", valid: false };

  // 통과
  return { text: "잘했어요!", color: "great", valid: true };
}

export { validN, validR, validC, validT, validP };
