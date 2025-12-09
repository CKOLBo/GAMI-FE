import InputSearch from '@/assets/components/InputSearch';
import Button from '@/assets/components/Button';
import Post from '@/assets/components/Post';
export default function PostPage() {
  const posts = [
    {
      id: 1,
      title: '제목이 들어갈 곳',
      content: '내용이 들어갈 곳',
      author: '익명',
      timeAgo: '14건 전',
      likeCount: 3,
      commentCount: 0,
    },
    {
      id: 2,
      title: '제목이 들어갈 곳',
      content: '내용이 들어갈 곳',
      author: '익명',
      timeAgo: '14건 전',
      likeCount: 3,
      commentCount: 0,
    },
    {
      id: 3,
      title: '제목이 들어갈 곳',
      content: '내용이 들어갈 곳',
      author: '익명',
      timeAgo: '14건 전',
      likeCount: 3,
      commentCount: 0,
    },
    {
      id: 4,
      title: '제목이 들어갈 곳',
      content: '내용이 들어갈 곳',
      author: '익명',
      timeAgo: '14건 전',
      likeCount: 3,
      commentCount: 0,
    },
  ];

  return (
    <div>
      <div className="flex items-center my-22">
        <div>
          <p className="text-[40px] w-46 h-12 font-bold mx-25">익명 게시판</p>
        </div>
        <div className="flex flex-row gap-114">
          <div>
            <InputSearch />
          </div>
          <div className="flex gap-14">
            <Button text="글 쓰기" to="/post/write" />
            <Button text="내가 쓴 글" to="/post/my" />
          </div>
        </div>
      </div>
      <div>
        {posts.map((post) => (
          <Post
            key={post.id}
            title={post.title}
            content={post.content}
            author={post.author}
            timeAgo={post.timeAgo}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
          />
        ))}
      </div>
    </div>
  );
}
