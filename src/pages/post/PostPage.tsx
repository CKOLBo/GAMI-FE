import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '@/assets/components/Sidebar';
import Post from '@/assets/components/post/Post';
import PostHead from '@/assets/components/post/PostHead';
import PostModal from '@/assets/components/modal/ReportModal';
import Report from '@/assets/svg/post/Report';
import Divider from '@/assets/svg/Divider';
import { instance } from '@/assets/shared/lib/axios';

interface PostType {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  memberId: number;
  createdAt: string;
}

export default function PostPage() {
  const [postData, setPostData] = useState<PostType[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [reportPostId, setReportPostId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
      setPage(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const fetchPosts = () => {
    instance
      .get('/api/post', {
        params: {
          page,
          size: 10,
          sort: 'createdAt,desc',
          ...(debouncedKeyword && { keyword: debouncedKeyword }),
        },
      })
      .then((res) => {
        setPostData(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => {
        toast.error('게시글 목록을 불러오지 못했습니다.');
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [page, debouncedKeyword]);

  const handleSearch = () => {
    setDebouncedKeyword(keyword.trim());
    setPage(0);
  };

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="w-full flex-1">
        <div className="max-w-[1500px] px-4 lg:px-6 lg:ml-80">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h1 className="flex flex-wrap items-center gap-4 font-bold text-gray-1">
              <span className="text-2xl sm:text-3xl xl:text-[40px]">
                익명 게시판
              </span>

              <Divider className="shrink-0 hidden sm:block" />

              <Link
                to="/my-post"
                className="text-2xl sm:text-3xl xl:text-[40px] text-gray-2 hover:text-gray-1 transition-colors"
              >
                내가 쓴 글
              </Link>
            </h1>

            <PostHead
              keyword={keyword}
              onKeywordChange={(e) => setKeyword(e.target.value)}
              onSearch={handleSearch}
            />
          </div>

          <div className="border-t-2 border-gray-2">
            {postData.length === 0 && (
              <div className="py-20 text-center text-xl sm:text-2xl text-gray-2">
                검색 결과가 없습니다.
              </div>
            )}

            {postData.map((post) => (
              <Post
                key={post.id}
                postId={post.id}
                title={post.title}
                content={post.content}
                author="익명"
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                timeAgo={new Date(post.createdAt).toLocaleDateString()}
                onPostClick={() => navigate(`/post/${post.id}`)}
                actions={[
                  {
                    icon: <Report />,
                    onClick: () => {
                      setReportPostId(post.id);
                      setIsModalOpen(true);
                    },
                  },
                ]}
              />
            ))}
          </div>

          <div className="flex justify-center gap-6 py-10 font-bold text-lg sm:text-xl md:text-2xl">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="cursor-pointer disabled:opacity-30"
            >
              이전
            </button>

            <span>
              {page + 1} / {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer disabled:opacity-30"
            >
              다음
            </button>
          </div>
        </div>

        {isModalOpen && reportPostId && (
          <PostModal
            postId={reportPostId}
            onClose={() => setIsModalOpen(false)}
            onReport={() => {
              setIsModalOpen(false);
              setReportPostId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
