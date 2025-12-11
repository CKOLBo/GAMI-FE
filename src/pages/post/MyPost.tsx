import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/assets/components/Button/Button';
import Post from '@/assets/components/post/Post';
import PostHead from '@/assets/components/post/PostHead';
import Comment from '@/assets/svg/post/Comment';
import Delete from '@/assets/svg/post/Delete';
import DeleteModal from '@/assets/components/modal/DeleteModal';

export default function MyPost() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full">
        <div className="max-w-[1500px] mx-auto px-4 lg:px-6">
          <PostHead>
            <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6">
              <Button text="글 쓰기" to="/post-write" />
              <Button text="게시판" to="/post" />
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
                    icon: <Delete />,
                    onClick: handleDeleteClick,
                  },
                ]}
              />
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <DeleteModal
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
