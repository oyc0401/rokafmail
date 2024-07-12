'use client'
import { dateToStr } from "src/lib/time";
import { useEffect, useRef } from "react";
import { PostCard } from "./card";
import { useUnpostedLetters } from "./useLetter";

export function postedLetterPage({ user, initialData }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error
  } = useUnpostedLetters(user.username, initialData);

  const observerRef = useRef<IntersectionObserver>();
  const lastLetterRef = useRef(null);

  useEffect(() => {
    if (isFetchingNextPage) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (lastLetterRef.current) {
      observerRef.current.observe(lastLetterRef.current);
    }
  }, [isFetchingNextPage, hasNextPage]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>편지를 불러오는 중에 오류가 발생했습니다.</div>;
  }

  const letters = (data?.pages.flatMap(page => page.letters))!;

  return (
    <>
      <div>
        {letters.map((letter: any, index) => {
          if (index === letters.length - 1) {
            return <div key={letter.id} ref={lastLetterRef}>
              <PostCard
                id={letter.id}
                title={letter.title}
                name={letter.name}
                rel={letter.relationship}
                time={dateToStr(letter.createdAt)}
                username={letter.user.username}
                contents={letter.contents}
                isPublic={letter.isPublic}
              />
            </div>
          }
          return <div key={letter.id}>
            <PostCard
              id={letter.id}
              title={letter.title}
              name={letter.name}
              rel={letter.relationship}
              time={dateToStr(letter.createdAt)}
              username={letter.user.username}
              contents={letter.contents}
              isPublic={letter.isPublic}
            />
          </div>
        })}
      </div>
      {isFetchingNextPage && <h4>Loading...</h4>}
      {!hasNextPage && <p style={{ textAlign: 'center' }}>모든 편지를 불러왔습니다.</p>}
    </>
  );
}