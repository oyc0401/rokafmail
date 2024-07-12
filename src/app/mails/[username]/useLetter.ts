
import { getUnpostedLetters } from "src/app/apiAction/mails/getNotAuthPost"
import { action } from "src/app/apiSSR/actionResponse";
import { useInfiniteQuery } from "react-query";

const fetchUnpostedLetters = async ({ pageParam = 1, queryKey }) => {
  const [, username] = queryKey;
  const limit = 10; // 한번에 가져올 데이터 수
  const letters = await action(getUnpostedLetters(username, pageParam, limit));
  return { letters, nextPage: pageParam + 1 };
};

export const useUnpostedLetters = (username, initialData) => {
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


const fetchPostedLetters = async ({ pageParam = 1, queryKey }) => {
  const [, username] = queryKey;
  const limit = 10; // 한번에 가져올 데이터 수
  const letters = await action(getUnpostedLetters(username, pageParam, limit));
  return { letters, nextPage: pageParam + 1 };
};

export const usePostedLetters = (username, initialData) => {
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

