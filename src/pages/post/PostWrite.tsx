import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Bold from '@/assets/svg/postWrite/Bold';
import LinkIcon from '@/assets/svg/postWrite/Link';
import Picture from '@/assets/svg/postWrite/Picture';
import Button from '@/assets/components/Button/Button';
import Sidebar from '@/assets/components/Sidebar';
import { instance } from '@/assets/shared/lib/axios';
import { toast } from 'react-toastify';

export default function PostWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      await instance.post('/api/post', {
        title,
        content,
        images: [],
      });

      toast.success('게시글이 등록되었습니다.');
      navigate('/post');
    } catch (error) {
      toast.error('게시글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex ml-30 justify-center mt-25">
      <Sidebar />

      <div className="w-full max-w-[1500px]">
        <div className="mb-20">
          <h1 className="text-gray-1 text-2xl sm:text-3xl lg:text-4xl font-bold">
            익명 게시판
          </h1>
        </div>

        <div className="mb-13">
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-5 placeholder:text-gray-3 text-xl font-normal placeholder:font-bold rounded-lg outline-none border border-gray-2"
          />
        </div>

        <div className="border h-[420px] border-gray-2 rounded-lg overflow-hidden">
          <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-2">
            <button className="p-1 opacity-40 cursor-not-allowed">
              <Bold />
            </button>
            <button className="p-1 opacity-40 cursor-not-allowed">
              <LinkIcon />
            </button>
            <button className="p-1 opacity-40 cursor-not-allowed">
              <Picture />
            </button>

            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="ml-4 px-3 py-1 border border-gray-2 rounded outline-none cursor-pointer"
            >
              <option value={12}>12</option>
              <option value={14}>14</option>
              <option value={16}>16</option>
              <option value={18}>18</option>
              <option value={20}>20</option>
              <option value={24}>24</option>
            </select>
          </div>

          <textarea
            placeholder="내용을 자유롭게 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-6 placeholder:text-gray-3 placeholder:font-bold outline-none resize-none"
            style={{ fontSize }}
          />
        </div>

        <div className="flex justify-end mt-13">
          <Button
            text={isSubmitting ? '등록 중...' : '등록하기'}
            disabled={isSubmitting}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
