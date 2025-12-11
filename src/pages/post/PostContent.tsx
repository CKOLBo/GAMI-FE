import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Heart from '@/assets/svg/Heart';
import Comment from '@/assets/svg/post/Comment';
import Report from '@/assets/svg/post/Report';
import PostModal from '@/assets/components/modal/ReportModal';
import Button from '@/assets/components/Button/Button';

export default function PostContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heartClick, setHeartClick] = useState(false);

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1500px] mt-25">
          <div className="mb-8">
            <h1 className="text-[40px] font-bold text-gray-1">
              제목이 들어갈 곳
            </h1>
          </div>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-2">
            <span className="text-xl font-bold text-gray-1">익명</span>
            <span className="text-xl font-bold text-gray-3">1시간 전</span>
          </div>

          <div className="mb-34 mt-18">
            <div className="text-xl leading-relaxed font-bold text-gray-3 whitespace-pre-wrap">
              내용이 들어갈 곳 내용이 들어갈 곳 내용이 들어갈 곳
            </div>
          </div>

          <div className="flex items-center justify-between gap-11 mb-10 pb-14 border-b-2 border-gray-2">
            <div className="flex items-center gap-3 mb-6">
              <Comment />
              <h2 className="text-2xl font-bold text-gray-1">댓글 0개</h2>
            </div>
            <div className="flex flex-row gap-18">
              <button
                className="flex items-center cursor-pointer gap-4"
                onClick={() => setHeartClick(!heartClick)}
              >
                <Heart isSelect={heartClick} />
                <span className="text-[32px] font-normal  text-gray-1">0</span>
              </button>
              <button
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <Report />
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-row mb-4 sm:mb-6 lg:mb-7 xl:mb-9">
              <p className="text-gray-1 text-sm sm:text-base lg:text-lg xl:text-xl font-bold w-8 sm:w-9 lg:w-10 h-5 sm:h-5.5 lg:h-6 mr-3 sm:mr-4 lg:mr-5 xl:mr-[18px]">
                익명
              </p>
              <p className="text-gray-3 text-sm sm:text-base lg:text-lg xl:text-xl font-bold">
                1시간 전
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <textarea
                placeholder="댓글 입력하기"
                className="w-full h-32 p-7 border border-gray-2 rounded-lg resize-none outline-none  text-xl"
              />
            </div>
            <div className="flex justify-end mt-12">
              <Button text="등록하기" to="" />
            </div>
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
