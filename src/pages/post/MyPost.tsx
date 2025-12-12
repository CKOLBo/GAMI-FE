import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/assets/components/Button/Button';
import Post from '@/assets/components/post/Post';
import PostHead from '@/assets/components/post/PostHead';
import Delete from '@/assets/svg/post/Delete';
import DeleteModal from '@/assets/components/modal/DeleteModal';
import axios from 'axios';

interface MyPostType {
  id: number;
  title: string;
  content: string;
  author: string;
  timeAgo: string;
  likeCount: number;
  commentCount: number;
}

export default function MyPost() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myPostData, setMyPostData] = useState<MyPostType[]>([]);

  useEffect(() => {
    axios
      .get('/data/MyPostData.json')
      .then((res) => {
        setMyPostData(res.data);
      })
      .catch((error) => {
        console.error('데이터 로드 실패:', error);
      });
  }, []);

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
            {myPostData.map((post) => (
              <Post
                key={post.id}
                title={post.title}
                content={post.content}
                author={post.author}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                timeAgo={post.timeAgo}
                onPostClick={() => navigate('/post-content')}
                actions={[
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
