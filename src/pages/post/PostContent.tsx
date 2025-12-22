import { useState } from 'react';
import Heart from '@/assets/svg/Heart';
import Comment from '@/assets/svg/post/Comment';
import Report from '@/assets/svg/post/Report';
import PostModal from '@/assets/components/modal/ReportModal';
import Button from '@/assets/components/Button/Button';
import Sidebar from '@/assets/components/Sidebar';
import Gemini from '@/assets/svg/post/Gemini.png';
import Arrow from '@/assets/svg/Arrow';

export default function PostContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heartClick, setHeartClick] = useState(false);

  return (
    <>
      <Sidebar />
      <div className="w-full ml-28 flex justify-center">
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
                <div className="flex items-center">
                  <Arrow className="w-7 h-7" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-11 mb-10 pb-14 border-b-2 border-gray-2">
            <div className="flex items-center gap-3 mb-6">
              <Comment width="32px" height="32px" color="#333D48" />
              <h2 className="text-[32px]  font-bold text-gray-1">댓글 0개</h2>
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

          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4 ml-9">
              <span className="text-gray-1 text-xl font-bold">익명</span>
              <span className="text-gray-3 text-xl font-bold">1시간 전</span>
            </div>
            <div className="ml-9">
              <p className="text-gray-3 font-bold text-xl">하윙</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <textarea
                placeholder="댓글 입력하기"
                className="w-full h-32 p-7 border-2 placeholder:text-xl placeholder:font-bold border-gray-2 rounded-lg resize-none outline-none  text-xl"
              />
            </div>
            <div className="flex justify-end mt-12">
              <Button text="등록하기" onClick={() => {}} />
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
