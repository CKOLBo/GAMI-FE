import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Delete from '@/assets/svg/post/Delete';
import { useNavigate } from 'react-router-dom';

import Heart from '@/assets/svg/Heart';
import Comment from '@/assets/svg/post/Comment';
import Report from '@/assets/svg/post/Report';
import PostModal from '@/assets/components/modal/ReportModal';
import Button from '@/assets/components/Button/Button';
import Sidebar from '@/assets/components/Sidebar';
import Gemini from '@/assets/svg/post/Gemini.png';
import GeminiText from '@/assets/svg/post/GeminiText.png';
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
  liked: boolean;
}

interface SummaryResponse {
  postId: number;
  summary: string;
}

interface CommentType {
  commentId: number;
  comment: string;
  createdAt: string;
}

export default function PostContent() {
  const { postId } = useParams<{ postId: string }>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postData, setPostData] = useState<PostDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [comment, setComment] = useState('');

  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [liked, setLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

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
        const res = await instance.get<PostDetailType>(`/api/post/${postId}`);
        setPostData(res.data);
        setLiked(Boolean(res.data.liked));

        await fetchComments();
      } catch {
        toast.error('게시글을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  const handleLikeToggle = async () => {
    if (!postId || !postData || isLikeLoading) return;

    setIsLikeLoading(true);

    try {
      if (liked) {
        await instance.delete(`/api/post/${postId}/like`);

        setLiked(false);
        setPostData((prev) =>
          prev ? { ...prev, likeCount: prev.likeCount - 1 } : prev
        );
      } else {
        await instance.post(`/api/post/${postId}/like`);

        setLiked(true);
        setPostData((prev) =>
          prev ? { ...prev, likeCount: prev.likeCount + 1 } : prev
        );
      }
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast.error('로그인이 필요합니다.');
      } else {
        toast.error('좋아요 처리에 실패했습니다.');
      }
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleAISummary = async () => {
    if (!postId) return;

    setIsSummaryLoading(true);
    setShowSummary(true);

    try {
      const res = await instance.get<SummaryResponse>(
        `/api/post/summary/${postId}`
      );
      setSummary(res.data.summary);
    } catch {
      toast.error('AI 요약을 불러오는데 실패했습니다.');
      setShowSummary(false);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !postId) return;

    try {
      await instance.post(`/api/post/${postId}/comment`, {
        comment: comment.trim(),
      });

      toast.success('댓글이 등록되었습니다.');
      setComment('');

      setPostData((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev
      );

      fetchComments();
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast.error('로그인이 필요합니다.');
      } else {
        toast.error('댓글 등록에 실패했습니다.');
      }
    }
  };

  const navigate = useNavigate();

  const handleAdminDelete = async () => {
    if (!postId) return;

    const confirmDelete = window.confirm('게시글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await instance.delete(`/api/admin/post/${postId}`);
      toast.success('게시글이 삭제되었습니다.');
      navigate(-1);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const status = (error as { response?: { status?: number } }).response
          ?.status;

        if (status === 401) toast.error('로그인이 필요합니다.');
        else if (status === 403) toast.error('관리자 권한이 없습니다.');
        else if (status === 404) toast.error('게시글을 찾을 수 없습니다.');
        else toast.error('게시글 삭제에 실패했습니다.');
      }
    }
  };

  const fetchComments = async () => {
    if (!postId) return;

    setIsCommentLoading(true);
    try {
      const res = await instance.get<CommentType[]>(
        `/api/post/${postId}/comment`
      );
      setComments(res.data);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast.error('로그인이 필요합니다.');
      } else {
        toast.error('댓글을 불러오는데 실패했습니다.');
      }
    } finally {
      setIsCommentLoading(false);
    }
  };

  const isAdmin = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'ADMIN' || payload.role === 'ROLE_ADMIN';
    } catch {
      return false;
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

          <div className="flex gap-12 mb-34">
            <div className="border rounded-full p-4 w-18 h-18 border-gray-2">
              <img src={Gemini} alt="Gemini" width="44" height="44" />
            </div>

            {!showSummary ? (
              <div
                className="rounded-[20px] shadow-GAMI pt-6 pl-8 w-[464px] h-[140px] cursor-pointer"
                onClick={handleAISummary}
              >
                <p className="text-gray-3 font-bold text-xl pb-8">
                  AI를 활용 해 게시글을 요약해보세요!
                </p>
                <div className="flex gap-1">
                  <h2 className="text-gray-1 font-bold text-2xl">
                    AI로 요약하기
                  </h2>
                  <Arrow className="w-7 h-7" />
                </div>
              </div>
            ) : (
              <div className="rounded-[20px] shadow-GAMI p-8 w-full max-w-[800px]">
                {isSummaryLoading ? (
                  <div className="flex items-center gap-2">
                    <img src={GeminiText} width="132" />
                    <span className="text-gray-1 font-bold text-2xl">
                      가 요약하는 중...
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-3 text-lg whitespace-pre-wrap">
                    {summary}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between mb-10 pb-14 border-b-2 border-gray-2">
            <div className="flex items-center gap-3">
              <Comment width="32px" height="32px" color="#333D48" />
              <h2 className="text-[32px] font-bold">
                댓글 {postData.commentCount}개
              </h2>
            </div>

            <div className="flex gap-18">
              <div
                className={`flex items-center gap-4 ${
                  isLikeLoading
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }`}
                onClick={handleLikeToggle}
              >
                <Heart isSelect={liked} />
                <span className="text-[32px] text-gray-1">
                  {postData.likeCount}
                </span>
              </div>

              <button onClick={() => setIsModalOpen(true)}>
                <Report />
              </button>

              {isAdmin() && (
                <button
                  onClick={handleAdminDelete}
                  className="hover:opacity-70"
                  title="게시글 삭제"
                >
                  <Delete />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-10 mb-10">
            {isCommentLoading ? (
              <p className="text-gray-3 text-lg">댓글 불러오는 중...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-3 text-lg">첫 댓글을 작성해보세요.</p>
            ) : (
              comments.map((item) => (
                <div key={item.commentId}>
                  <div className="flex gap-4 mb-2">
                    <span className="font-bold text-gray-1 text-xl">익명</span>
                    <span className="text-gray-3 font-bold text-xl">
                      {calculateTimeAgo(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-xl text-gray-3 font-bold whitespace-pre-wrap">
                    {item.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글 입력하기"
            className="w-full h-32 p-7 border-2 placeholder:font-bold border-gray-2 focus:border-main-1 focus:outline-none focus:ring-0 rounded-lg resize-none text-xl"
          />
          <div className="flex justify-end mt-12 mb-12">
            <Button text="등록하기" onClick={handleCommentSubmit} />
          </div>
        </div>
      </div>

      {isModalOpen && postId && (
        <PostModal
          postId={Number(postId)}
          onClose={() => setIsModalOpen(false)}
          onReport={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
