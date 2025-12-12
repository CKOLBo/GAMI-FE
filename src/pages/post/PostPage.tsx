import Button from '@/assets/components/Button/Button';
import Post from '@/assets/components/post/Post';
import PostHead from '@/assets/components/post/PostHead';
import { useNavigate } from 'react-router-dom';
import Comment from '@/assets/svg/post/Comment';
import PostModal from '@/assets/components/modal/ReportModal';
import { useState, useEffect } from 'react';
import Report from '@/assets/svg/post/Report';
import axios from 'axios';

interface PostType {
  id: number;
  title: string;
  content: string;
  author: string;
  timeAgo: string;
  likeCount: number;
  commentCount: number;
}

export default function PostPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postData, setPostData] = useState<PostType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/data/PostData.json')
      .then((response) => {
        setPostData(response.data);
      })
      .catch((error) => {
        console.error('데이터 로드 실패:', error);
      });
  }, []);

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
          {postData.map((post) => (
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
