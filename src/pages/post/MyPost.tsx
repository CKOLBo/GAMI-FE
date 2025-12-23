import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/assets/components/Button/Button';
import Post from '@/assets/components/post/Post';
import PostHead from '@/assets/components/post/PostHead';
import Delete from '@/assets/svg/post/Delete';
import DeleteModal from '@/assets/components/modal/DeleteModal';
import axios from 'axios';
import Sidebar from '@/assets/components/Sidebar';
import Divider from '@/assets/svg/Divider';

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
      <div className="flex">
        <Sidebar />
        <div className="max-w-[1500px] w-full ml-80 px-4 lg:px-6">
          <div className="flex">
            <h1 className="flex items-center gap-4 text-[40px] font-bold text-gray-1 pr-25">
              <Link
                to="/post"
                className="text-3xl 2xl:text-[40px] text-gray-2 font-bold hover:text-gray-1 transition-colors cursor-pointer"
              >
                익명 게시판
              </Link>
              <Divider className="shrink-0" />
              <span className="text-3xl 2xl:text-[40px] text-gray-1 font-bold">
                내가 쓴 글
              </span>
            </h1>
            <PostHead />
          </div>

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
