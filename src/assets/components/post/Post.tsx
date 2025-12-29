import { useNavigate } from 'react-router-dom';
import Heart from '@/assets/svg/Heart';
import Comment from '@/assets/svg/post/Comment';
import type { ActionButton } from '@/assets/shared/types';
import { instance } from '@/assets/shared/lib/axios';
import { toast } from 'react-toastify';

interface PostProps {
  postId: number;
  title: string;
  content: string;
  author?: string;
  likeCount: number;
  commentCount: number;
  timeAgo: string;
  onPostClick?: () => void;
  actions?: ActionButton[];
}

export default function Post({
  postId,
  title,
  content,
  author,
  likeCount,
  commentCount,
  timeAgo,
  onPostClick,
  actions = [],
}: PostProps) {
  const navigate = useNavigate();

  const handlePostClick = () => {
    if (onPostClick) {
      onPostClick();
    } else {
      navigate(`/post/${postId}`);
    }
  };

  const handleCommentClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!postId) {
      console.error('postId is undefined');
      toast.error('게시글 ID가 없습니다');
      return;
    }

    try {
      const { data } = await instance.get(`/api/post/${postId}`);

      navigate(`/post/${postId}`, {
        state: { post: data },
      });
    } catch {
      toast.error('게시글을 불러오지 못했습니다');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between w-full border-y-2 -mt-0.5 border-gray-2 px-4 lg:px-0">
      <div
        className="w-full cursor-pointer lg:pl-[38px]"
        onClick={handlePostClick}
      >
        <div>
          <p className="text-gray-1 font-bold text-xl sm:text-2xl lg:text-3xl xl:text-[32px] mt-6 sm:mt-8 lg:mt-9 xl:mt-11 mb-2 lg:mb-3">
            {title}
          </p>
          <p className="text-gray-3 max-w-[600px] w-full text-base sm:text-lg lg:text-xl xl:text-2xl font-bold mb-4 sm:mb-6 lg:mb-7 xl:mb-9 line-clamp-1">
            {content}
          </p>
        </div>

        <div className="flex mb-4 sm:mb-6 lg:mb-7 xl:mb-9">
          <p className="text-gray-1 text-sm sm:text-base lg:text-lg xl:text-xl font-bold mr-4">
            {author}
          </p>
          <p className="text-gray-3 text-sm sm:text-base lg:text-lg xl:text-xl font-bold">
            {timeAgo}
          </p>
        </div>
      </div>

      <div className="flex items-center lg:mr-10 xl:mr-20 mb-4 lg:mb-0">
        <div className="flex gap-6 lg:gap-9 xl:gap-11">
          <button
            className="flex items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart isSelect={false} />
            <span className="text-[32px] text-gray-1">{likeCount}</span>
          </button>

          <button
            className="flex items-center gap-4 cursor-pointer"
            onClick={handleCommentClick}
          >
            <Comment width="32px" height="32px" color="#333D48" />
            <span className="text-[32px] text-gray-1">{commentCount}</span>
          </button>

          {actions.map((action, index) => (
            <button
              key={index}
              className="flex items-center gap-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
            >
              {action.icon}
              {action.showCount && action.count !== undefined && (
                <span className="text-[32px] text-gray-1">{action.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
