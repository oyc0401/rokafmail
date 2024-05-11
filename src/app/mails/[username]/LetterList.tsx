import { dateToStr } from "src/lib/time";
import { PostCard } from "./card";

export function LetterList({ letters }) {
  return <>
    <div className="max-w-3xl mx-auto">
      {letters.length == 0 && <p className="text-medium p-4 text-fontlight">받은 편지가 없습니다.</p>}

      {letters.map((post, index) => (
        <div key={post.id}>
          {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
          <PostCard
            id={post.id}
            title={post.title}
            name={post.name}
            rel={post.relationship}
            time={dateToStr(post.createdAt)}
            username={post.user.username}
            contents={post.contents}
            isPublic={post.isPublic}
          />
        </div>
      ))}

    </div>
  </>
}

