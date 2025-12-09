import { useState } from 'react';
import Hart from '@/assets/svg/Hart';
import Comment from '@/assets/svg/Comment';
import Report from '@/assets/svg/Report';

interface PostProps {
  title: string;
  content: string;
  author?: string;
  timeAgo: string;
  likeCount: number;
  commentCount: number;
}

export default function Post({
  title,
  content,
  author,
  timeAgo,
  likeCount,
  commentCount,
}: PostProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row justify-between w-full lg:w-375 border-y-2 -mt-[2px] cursor-pointer border-gray-2 px-4 lg:px-0">
      <div className="flex-1">
        <div>
          <p className="font-bold text-2xl lg:text-[32px] mt-6 lg:mt-11 mb-2 lg:mb-3">
            {title}
          </p>
          <p className="text-gray-3 text-lg lg:text-2xl font-bold mb-4 lg:mb-9">
            {content}
          </p>
        </div>
        <div className="flex flex-row mb-4 lg:mb-9">
          <p className="text-gray-1 text-base lg:text-xl font-bold w-10 h-6 mr-3 lg:mr-[18px]">
            {author}
          </p>
          <p className="text-gray-3 text-base lg:text-xl font-bold">
            {timeAgo}
          </p>
        </div>
      </div>

      <div className="flex items-center lg:mr-40 mb-4 lg:mb-0">
        <div className="flex flex-row gap-6 lg:gap-11">
          <button
            className="flex items-center gap-3 lg:gap-5"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Hart isSelect={isLiked} />
            <span className="text-2xl lg:text-[32px] font-normal text-gray-1">
              {likeCount}
            </span>
          </button>
          <button className="flex items-center gap-3 lg:gap-5">
            <Comment />
            <span className="text-2xl lg:text-[32px] font-normal text-gray-1">
              {commentCount}
            </span>
          </button>
          <button>
            <Report />
          </button>
        </div>
      </div>
    </div>
  );
}
