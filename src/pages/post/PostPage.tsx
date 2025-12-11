import Button from '@/assets/components/Button/Button';
import Post from '@/assets/components/post/Post';
import PostHead from '@/assets/components/post/PostHead';
import { useNavigate } from 'react-router-dom';
import Comment from '@/assets/svg/post/Comment';
import PostModal from '@/assets/components/modal/ReportModal';
import { useState } from 'react';
import Report from '@/assets/svg/post/Report';

export default function PostPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const posts = [
    {
      id: 1,
      title: '제목이 들어갈 곳',
      content: '내용이 들어갈 곳',
      author: '익명',
      timeAgo: '1시간 전',
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
      timeAgo: '1시간 전',
      likeCount: 3,
      commentCount: 0,
    },
    {
      id: 4,
      title: '제목이 들어갈 곳',
      content: '내용이 들어갈 곳',
      author: '익명',
      timeAgo: '1시간 전',
      likeCount: 3,
      commentCount: 0,
    },
  ];

  const handleReportClick = () => {
    setIsModalOpen(true);
  };

  const handleReport = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="max-w-[1500px] mx-auto px-4 lg:px-6">
        <PostHead>
          <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6">
            <Button text="글 쓰기" to="/post-write" />
            <Button text="내가 쓴 글" to="/my-post" />
          </div>
        </PostHead>

        <div className="border-t-2 border-gray-2">
          {posts.map((post) => (
            <Post
              key={post.id}
              title={post.title}
              content={post.content}
              author={post.author}
              timeAgo={post.timeAgo}
              onPostClick={() => navigate('/post-content')}
              actions={[
                {
                  icon: <Comment />,
                  onClick: () => navigate('/post-content'),
                  count: post.commentCount,
                  showCount: true,
                },
                {
                  icon: <Report />,
                  onClick: () => handleReportClick(),
                },
              ]}
            />
          ))}
        </div>
      </div>
      {isModalOpen && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          onReport={handleReport}
        />
      )}
    </div>
  );
}
