import { useInfiniteQuery } from "react-query";
import { LetterItem, getPostedLetters, getUnpostedLetters } from "src/server/apiAction/mails/server"
import { action } from "src/lib/actionResponse";

/**
 * 미발송 편지 불러오는 무한 스크롤 훅
 */
export const useUnpostedLetters = (username: string, initialData: LetterItem[]) => {
  const fetchUnpostedLetters = async ({ pageParam = 1, queryKey }) => {
    const [, username] = queryKey;
    const limit = 10; // 한번에 가져올 데이터 수
    const letters = await action(getUnpostedLetters(username, pageParam, limit));
    return { letters, nextPage: pageParam + 1 };
  };

  return useInfiniteQuery(
    ['unpostedLetters', username],
    fetchUnpostedLetters,
    {
      initialData: {
        pages: [{ letters: initialData, nextPage: 2 }],
        pageParams: [1],
      },
      getNextPageParam: (lastPage) => lastPage.letters.length ? lastPage.nextPage : undefined,
      staleTime: 1000 * 60 * 3,
      cacheTime: 1000 * 60 * 10,
      onError: (error) => {
        console.error('Error fetching unposted letters:', error);
      }
    }
  );
};

/**
 * 발송된 편지 불러오는 무한 스크롤 훅
 */
export const usePostedLetters = (username: string, initialData: LetterItem[]) => {
  const fetchPostedLetters = async ({ pageParam = 1, queryKey }) => {
    const [, username] = queryKey;
    const limit = 10; // 한번에 가져올 데이터 수
    const letters = await action(getPostedLetters(username, pageParam, limit));
    return { letters, nextPage: pageParam + 1 };
  };

  return useInfiniteQuery(
    ['postedLetters', username],
    fetchPostedLetters,
    {
      initialData: {
        pages: [{ letters: initialData, nextPage: 2 }],
        pageParams: [1],
      },
      getNextPageParam: (lastPage) => lastPage.letters.length ? lastPage.nextPage : undefined,
      staleTime: 1000 * 60 * 3,
      cacheTime: 1000 * 60 * 10,
      onError: (error) => {
        console.error('Error fetching posted letters:', error);
      }
    }
  );
};