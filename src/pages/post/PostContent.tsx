import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Heart from '@/assets/svg/Heart';
import Comment from '@/assets/svg/post/Comment';
import Report from '@/assets/svg/post/Report';
import PostModal from '@/assets/components/modal/ReportModal';
import Button from '@/assets/components/Button/Button';
import Sidebar from '@/assets/components/Sidebar';
import Gemini from '@/assets/svg/post/Gemini.png';
import Arrow from '@/assets/svg/Arrow';
import { instance } from '@/assets/shared/lib/axios';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostDetailType {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  memberId: number;
  createdAt: string;
  updatedAt: string;
  images: string[];
}

export default function PostContent() {
  const { postId } = useParams<{ postId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postData, setPostData] = useState<PostDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');

  const calculateTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!postId) return;

      setIsLoading(true);
      try {
        const res = await instance.get(`/api/post/${postId}`);
        setPostData(res.data);
      } catch {
        alert('게시글을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !postId) return;

    try {
      await instance.post(`/api/post/${postId}/comment`, {
        content: comment.trim(),
      });
      setComment('');
      setPostData((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev
      );
    } catch {
      alert('댓글 등록 실패');
    }
  };

  if (isLoading || !postData) {
    return (
      <>
        <Sidebar />
        <div className="ml-28 mt-25 text-xl text-gray-3">로딩 중...</div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="w-full ml-28 flex justify-center">
        <div className="w-full max-w-[1500px] mt-25">
          <h1 className="text-[40px] font-bold text-gray-1 mb-8">
            {postData.title}
          </h1>

          <div className="flex gap-4 mb-10 pb-6 border-b-2 border-gray-2">
            <span className="text-xl font-bold text-gray-1">익명</span>
            <span className="text-xl font-bold text-gray-3">
              {calculateTimeAgo(postData.createdAt)}
            </span>
          </div>

          <div className="prose max-w-none text-xl text-gray-3 font-bold leading-relaxed mb-20">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {postData.content}
            </ReactMarkdown>
          </div>

          {postData.images?.length > 0 && (
            <div className="flex flex-col gap-6 mb-28">
              {postData.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`post-image-${idx}`}
                  className="
                    max-w-[720px]
                    max-h-[480px]
                    w-auto
                    h-auto
                    object-contain
                    rounded-xl
                    border
                    border-gray-2
                  "
                />
              ))}
            </div>
          )}

          <div className="flex gap-12 mb-34">
            <div className="border rounded-full p-4 w-18 h-18 border-gray-2">
              <img src={Gemini} alt="Gemini" width="44" height="44" />
            </div>

            <div className="rounded-[20px] shadow-GAMI pt-6 pl-8 w-[464px] h-[140px]">
              <p className="text-gray-3 font-bold text-xl pb-8">
                AI를 활용 해 게시글을 요약해보세요!
              </p>
              <div className="flex gap-1 cursor-pointer">
                <h2 className="text-gray-1 font-bold text-2xl">
                  AI로 요약하기
                </h2>
                <Arrow className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="flex justify-between mb-14 pb-14 border-b-2 border-gray-2">
            <div className="flex items-center gap-3">
              <Comment width="32px" height="32px" color="#333D48" />
              <h2 className="text-[32px] font-bold">
                댓글 {postData.commentCount}개
              </h2>
            </div>

            <div className="flex gap-18">
              <div className="flex items-center gap-4 cursor-default">
                <Heart isSelect={false} />
                <span className="text-[32px]">{postData.likeCount}</span>
              </div>

              <button onClick={() => setIsModalOpen(true)}>
                <Report />
              </button>
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글 입력하기"
            className="w-full h-32 p-7 border-2 border-gray-2 rounded-lg resize-none text-xl"
          />
          <div className="flex justify-end mt-12 mb-8">
            <Button text="등록하기" onClick={handleCommentSubmit} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          onReport={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
