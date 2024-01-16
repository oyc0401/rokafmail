"use client";

interface userInfo {
  id: number;
  username: string;
  name: string;
  birth: string;
  generation: number;
}

export function List({ users }: { users: Array<userInfo> }) {
  if (users.length == 0) {
    return "해당유저가 없습니다.";
  }

  return <div>{JSON.stringify(users)}</div>;
}
