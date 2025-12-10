import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Heart from '@/assets/svg/Heart';
import Comment from '@/assets/svg/Comment';
import Report from '@/assets/svg/Report';
import PostModal from '@/assets/components/PostModal';
import Button from '@/assets/components/Button';

export default function PostContent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = () => {
    console.log({ title, content });
    navigate('/post');
  };

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

          <div className="mb-8">
            <div className="text-xl leading-relaxed text-gray-1 whitespace-pre-wrap mb-8">
              내용이 들어갈 곳 내용이 들어갈 곳 내용이 들어갈 곳
            </div>
          </div>

          <div className="flex items-center justify-end gap-11 mb-12 pb-8 border-b-2 border-gray-2">
            <button className="flex items-center gap-5">
              <Heart isSelect={false} />
              <span className="text-[32px] font-normal text-gray-1">0</span>
            </button>
            <button
              className="flex items-center gap-5 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Report />
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Comment />
              <h2 className="text-2xl font-bold text-gray-1">댓글 0개</h2>
            </div>

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
