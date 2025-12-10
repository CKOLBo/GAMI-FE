import { useState } from 'react';
import Heart from '@/assets/svg/Heart';
import Comment from '@/assets/svg/Comment';
import Report from '@/assets/svg/Report';
import PostModal from './PostModal';

interface PostProps {
  title: string;
  content: string;
  author?: string;
  timeAgo: string;
  likeCount: number;
  commentCount: number;
  onLikeClick?: () => void;
  onCommentClick?: () => void;
  onReportClick?: () => void;
  isLiked?: boolean;
}

export default function Post({
  title,
  content,
  author,
  timeAgo,
  likeCount,
  commentCount,
  onLikeClick,
  onCommentClick,
  onReportClick,
  isLiked: externalIsLiked,
}: PostProps) {
  const [internalIsLiked, setInternalIsLiked] = useState(false);
  const isLiked =
    externalIsLiked !== undefined ? externalIsLiked : internalIsLiked;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLikeClick = () => {
    if (onLikeClick) {
      onLikeClick();
    } else {
      setInternalIsLiked(!internalIsLiked);
    }
  };

  const handleReportClick = () => {
    if (onReportClick) {
      onReportClick();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between w-full border-y-2 -mt-0.5 border-gray-2 px-4 lg:px-0">
        <div className="flex-1 cursor-pointer lg:pl-[38px]">
          <div>
            <p className="text-gray-1 font-bold text-xl sm:text-2xl lg:text-3xl xl:text-[32px] mt-6 sm:mt-8 lg:mt-9 xl:mt-11 mb-2 lg:mb-3">
              {title}
            </p>
            <p className="text-gray-3 text-base sm:text-lg lg:text-xl xl:text-2xl font-bold mb-4 sm:mb-6 lg:mb-7 xl:mb-9">
              {content}
            </p>
          </div>
          <div className="flex flex-row mb-4 sm:mb-6 lg:mb-7 xl:mb-9">
            <p className="text-gray-1 text-sm sm:text-base lg:text-lg xl:text-xl font-bold w-8 sm:w-9 lg:w-10 h-5 sm:h-5.5 lg:h-6 mr-3 sm:mr-4 lg:mr-5 xl:mr-[18px]">
              {author}
            </p>
            <p className="text-gray-3 text-sm sm:text-base lg:text-lg xl:text-xl font-bold">
              {timeAgo}
            </p>
          </div>
        </div>

        <div className="flex items-center lg:mr-20 xl:mr-40 mb-4 lg:mb-0">
          <div className="flex flex-row gap-4 sm:gap-6 lg:gap-9 xl:gap-11">
            <button
              className="flex cursor-pointer items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-5"
              onClick={handleLikeClick}
            >
              <Heart isSelect={isLiked} />
              <span className="text-xl sm:text-2xl lg:text-3xl xl:text-[32px] font-normal text-gray-1">
                {likeCount}
              </span>
            </button>
            <button
              className="flex cursor-pointer items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-5"
              onClick={onCommentClick}
            >
              <Comment />
              <span className="text-xl sm:text-2xl lg:text-3xl xl:text-[32px] font-normal text-gray-1">
                {commentCount}
              </span>
            </button>
            <button className="cursor-pointer" onClick={handleReportClick}>
              <Report />
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          onReport={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
