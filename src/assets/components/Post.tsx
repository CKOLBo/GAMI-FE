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
    <div className="flex flex-row justify-between w-375 border-y-2 -mt-[2px] cursor-pointer border-gray-2">
      <div>
        <div>
          <p className="font-bold text-[32px] mt-11 mb-3">{title}</p>
          <p className="text-gray-3 text-2xl font-bold mb-9">{content}</p>
        </div>
        <div className="flex flex-row mb-9">
          <p className="text-gray-1 text-xl font-bold w-10 h-6 mr-[18px]">
            {author}
          </p>
          <p className="text-gray-3 text-xl font-bold">{timeAgo}</p>
        </div>
      </div>

      <div className="flex items-center row-gap-11 mr-40">
        <div className="flex flex-row">
          <button
            className="flex items-center gap-5"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Hart isSelect={isLiked} />
            <span className="text-[32px] font-normal text-gray-1">
              {likeCount}
            </span>
          </button>
          <button className="flex items-center gap-1.5">
            <Comment />
            <span className="text-[32px] font-normal text-gray-1">
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
