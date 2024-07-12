'use client'
import { dateToStr } from "src/lib/time";

import { PostCard } from "./card";
import { getNotAuthPosts } from "src/app/apiAction/mails/getNotAuthPost"
import { LetterList } from "./LetterList";

import { minuteToStr, postMailDMinute } from "src/lib/time";
import { useEffect, useMemo, useState } from "react";
import { action } from "src/app/apiSSR/actionResponse";

export function LetterClient({ user }) {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    init();
  });

  async function init() {
    const unposteds = await action(getNotAuthPosts(user.username));

    setList(unposteds);
  }

  return (
    <>
      <TimeIndicator generation={user.generation}></TimeIndicator>
      <LetterList letters={list} emptyMessage='받은 편지가 없습니다.'></LetterList>
    </>
  )
}


function TimeIndicator({ generation }) {
  const minute = postMailDMinute(generation);
  const strDate = minuteToStr(minute);
  if (strDate == "0분") {
    return <></>;
  }
  return <p className="pt-2">{strDate}뒤에 편지가 전달됩니다</p>;
}