import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Heart from '@/assets/svg/Heart';
import type { ActionButton } from '@/assets/shared/types';

interface PostProps {
  title: string;
  content: string;
  author?: string;
  timeAgo: string;
  onPostClick?: () => void;
  actions?: ActionButton[];
}

export default function Post({
  title,
  content,
  author,
  timeAgo,
  onPostClick,
  actions = [],
}: PostProps) {
  const navigate = useNavigate();

  const [heartClick, setHeartClick] = useState(false);

  const handlePostClick = () => {
    if (onPostClick) {
      onPostClick();
    } else {
      navigate('/post-content');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between w-full border-y-2 -mt-0.5 border-gray-2 px-4 lg:px-0">
      <div
        className="flex-1 cursor-pointer lg:pl-[38px]"
        onClick={handlePostClick}
      >
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
            className="flex items-center cursor-pointer gap-4"
            onClick={() => setHeartClick(!heartClick)}
          >
            <Heart isSelect={heartClick} />
            <span className="text-[32px] font-normal  text-gray-1">0</span>
          </button>
          {actions.map((action, index) => (
            <button
              key={index}
              className="flex cursor-pointer items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-5"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
            >
              {action.icon}
              {action.showCount && action.count !== undefined && (
                <span className="text-xl sm:text-2xl lg:text-3xl xl:text-[32px] font-normal text-gray-1">
                  {action.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
