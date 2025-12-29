import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Sidebar from '@/assets/components/Sidebar';
import Post from '@/assets/components/post/Post';
import PostHead from '@/assets/components/post/PostHead';
import Delete from '@/assets/svg/post/Delete';
import DeleteModal from '@/assets/components/modal/DeleteModal';
import Divider from '@/assets/svg/Divider';
import { instance } from '@/assets/shared/lib/axios';

interface MyPostType {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  noName: string;
}

export default function MyPost() {
  const navigate = useNavigate();

  const [postData, setPostData] = useState<MyPostType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const fetchMyPosts = async () => {
    try {
      const res = await instance.get('/api/mypost');

      if (!Array.isArray(res.data)) {
        setPostData([]);
        return;
      }

      setPostData(res.data);
    } catch {
      toast.error('내가 쓴 글을 불러오지 못했습니다.');
      setPostData([]);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async () => {
    if (!selectedPostId) return;

    try {
      await instance.delete(`/api/post/${selectedPostId}`);
      toast.success('게시글이 삭제되었습니다.');

      setPostData((prev) => prev.filter((post) => post.id !== selectedPostId));
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const status = (error as { response?: { status?: number } }).response
          ?.status;

        if (status === 401) {
          toast.error('로그인이 필요합니다.');
        } else if (status === 403) {
          toast.error('삭제 권한이 없습니다.');
        } else {
          toast.error('게시글 삭제에 실패했습니다.');
        }
      } else {
        toast.error('게시글 삭제에 실패했습니다.');
      }
    } finally {
      setIsModalOpen(false);
      setSelectedPostId(null);
    }
  };

  return (
    <>
      <div className="flex">
        <Sidebar />

        <div className="w-full flex-1">
          <div className="max-w-[1500px] px-4 ml-80 lg:px-6">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-4 text-[40px] font-bold text-gray-1">
                <Link
                  to="/post"
                  className="text-3xl 2xl:text-[40px] text-gray-2 hover:text-gray-1 transition-colors"
                >
                  익명 게시판
                </Link>
                <Divider className="shrink-0" />
                <span className="text-3xl 2xl:text-[40px]">내가 쓴 글</span>
              </h1>

              <PostHead />
            </div>

            <div className="border-t-2 border-gray-2">
              {postData.length === 0 && (
                <div className="py-20 text-center text-2xl text-gray-2">
                  작성한 게시글이 없습니다.
                </div>
              )}

              {postData.map((post) => (
                <Post
                  key={post.id}
                  postId={post.id}
                  title={post.title}
                  content={post.noName ?? ''}
                  author="익명"
                  likeCount={0}
                  commentCount={0}
                  timeAgo={new Date(post.createdAt).toLocaleDateString()}
                  onPostClick={() => navigate(`/post-content/${post.id}`)}
                  actions={[
                    {
                      icon: <Delete />,
                      onClick: () => {
                        setSelectedPostId(post.id);
                        setIsModalOpen(true);
                      },
                    },
                  ]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <DeleteModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPostId(null);
          }}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
