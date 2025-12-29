import Sidebar from '@/assets/components/Sidebar';
import Post from '@/assets/components/MainPost';
import FindMentor from '@/assets/svg/main/FindMentor.png';
import FireWorks from '@/assets/svg/main/FireWorks.png';
import RightIcon from '@/assets/svg/main/RightIcon';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { instance, TokenRefreshError } from '@/assets/shared/lib/axios';
import type { Post as PostType } from '@/assets/shared/types';

export default function MainPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || 'OOO';
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await instance.get('/api/post', {
          params: {
            page: 0,
            size: 3,
            sort: 'createdAt,desc',
          },
        });
        setPosts(response.data.content);
      } catch (err) {
        if (err instanceof TokenRefreshError) {
          navigate('/signin');
          return;
        }
        console.error('게시글 조회 실패:', err);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-7 2xl:p-15 ml-45 2xl:ml-55">
        <h1 className="text-3xl 2xl:text-[40px] font-bold text-gray-1 mb-8">
          홈
        </h1>

        <div className="grid grid-cols-3 gap-8 2xl:gap-12 mb-6 2xl:mb-8">
          <div className="col-span-2 bg-gradient-to-r from-main-2 to-main-1 rounded-2xl 2xl:py-15 px-12 2xl:px-20 flex items-center justify-between shadow-GAMI">
            <div className="text-white">
              <h2 className="text-3xl 2xl:text-4xl font-bold mb-3 2xl:mb-6 h-8 2xl:h-12 flex items-center">
                GAMI에 오신 걸 환영합니다! {userName}님
              </h2>
              <p className="text-xl 2xl:text-2xl h-8 flex items-center">
                멘토와 멘티를 바로 연결하는 맞춤형 멘토링 서비스에요.
              </p>
            </div>
            <div className="h-32 2xl:h-44 flex items-center justify-center">
              <img
                src={FireWorks}
                alt="FireWorks"
                className="h-full object-contain"
              />
            </div>
          </div>
          <div className="bg-white shadow-GAMI rounded-2xl p-6 2xl:p-7">
            <div className="flex justify-between items-center mb-2 2xl:mb-5.5">
              <h2 className="text-xl 2xl:text-2xl font-bold text-gray-1">
                멘토 찾기
              </h2>
              <Link
                to="/mentoring"
                className="text-lg 2xl:text-2xl  text-gray-3 flex items-center gap-2"
              >
                전체보기
                <RightIcon />
              </Link>
            </div>
            <div className="text-center">
              <div className="h-28 2xl:h-36 mb-6 flex items-center justify-center">
                <img
                  src={FindMentor}
                  alt="Find Mentor"
                  className="h-full object-contain"
                />
              </div>
              <p className="text-lg 2xl:text-2xl text-gray-1 mb-1 2xl:mb-3 font-bold">
                나에게 어울리는{' '}
                <span className="text-main-1 font-bold">멘토</span>를
                찾아볼까요?
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl 2xl:text-4xl font-bold text-gray-1 mb-4">
            게시글
          </h2>
          <div className="grid grid-cols-3 gap-8 2xl:gap-12">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-gray-100 animate-pulse rounded-2xl h-60 2xl:h-80"
                />
              ))
            ) : error ? (
              <p className="col-span-3 text-center text-gray-3">{error}</p>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  commentCount={post.commentCount}
                  likeCount={post.likeCount}
                  postId={post.id}
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-3">
                게시글이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
