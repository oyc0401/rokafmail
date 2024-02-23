import { Post, User } from "src/db";

interface User {
  userId: number;
  username: string;
  count: number;
}

export default async function UserStat() {
  const users = await User.findAll();
  const posts = await Post.findAll();
 
  let userMap: Record<string, User> = {};

  for (let user of users) {
    userMap[user.id] = { userId: user.id, username: user.username, count: 0 };
  }

  for (let post of posts) {
    const userId = post.userId;
    userMap[userId].count++;
  }


  const sortedUsers: User[] = Object.values(userMap).sort(
    (a, b) => b.count - a.count,
  );


  return (
    <div>
      {sortedUsers.map(user => (
        <div key={user.userId}>
          {`{ userId: ${user.userId}, username: '${user.username}', count: ${user.count} }`}
        </div>
      ))}
    </div>
  );
}
