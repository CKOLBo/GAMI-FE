import { useState } from 'react';
import Hart from '@/assets/svg/Hart';
import Comment from '@/assets/svg/Comment';
import Report from '@/assets/svg/Report';

export default function Post() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="flex flex-row justify-between w-375 border-t-2 border-b-2 border-gray-3">
      <div>
        <div>
          <p className="font-bold text-[32px] mt-11 mb-3">제목이 들어갈 곳</p>
          <p className="text-gray-3 text-2xl font-bold mb-9">
            내용이 들어갈 곳
          </p>
        </div>
        <div className="flex flex-row mb-9">
          <p className="text-[#333D48] text-xl font-bold w-10 h-6 mr-[18px]">
            익명
          </p>
          <p className="text-gray-3 text-xl font-bold">1시간 전</p>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex flex-row">
          <button className="h-[28px]" onClick={() => setIsLiked(!isLiked)}>
            <Hart isSelect={isLiked} />
          </button>
          <button className="h-[28px]">
            <Comment />
          </button>
          <button className="h-[28px]">
            <Report />
          </button>
        </div>
      </div>
    </div>
  );
}
