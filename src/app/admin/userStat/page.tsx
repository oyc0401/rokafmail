import { Post, User } from "src/db";

interface Count {
  userId: number;
  username: string;
  count: number;
}

export default async function UserStat() {
  const users = await User.findAll();
  const posts = await Post.findAll();

  let userMap: Record<string, Count> = {};

  for (let user of users) {
    userMap[user.id] = { userId: user.id, username: user.username, count: 0 };
  }

  for (let post of posts) {
    const userId = post.userId;
    userMap[userId].count++;
  }

  const sortedUsers: Count[] = Object.values(userMap).sort(
    (a, b) => b.count - a.count,
  );

  let activateAccountCount = 0;
  for (let key in userMap) {
    const user = userMap[key];
    if (user.count > 0) {
      activateAccountCount++;
    }
  }

  return (
    <div>
      <h2 className="text-lg font-bold">실 사용 유저</h2>
      <p className="pb-4">{`${activateAccountCount}명 / ${users.length}명`}</p>

      <h2 className="text-lg font-bold">편지 개수</h2>
      <p className="pb-4">{`${posts.length}통`}</p>
      
      <h2 className="text-lg font-bold">Rank</h2>
      <div className="pb-4">
        {sortedUsers.map((user) => (
          <p key={user.userId}>
            {`{ userId: ${user.userId}, username: '${user.username}', count: ${user.count} }`}
          </p>
        ))}
      </div>
    </div>
  );
}
