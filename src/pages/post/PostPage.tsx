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
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center my-6 lg:my-22 px-4 lg:px-0 gap-6 lg:gap-0">
        <div className="w-full lg:w-auto">
          <p className="text-3xl lg:text-[40px] font-bold lg:mx-25">
            익명 게시판
          </p>
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
