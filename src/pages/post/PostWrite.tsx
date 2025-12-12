import { useState } from 'react';
import Bold from '@/assets/svg/postWrite/Bold';
import Link from '@/assets/svg/postWrite/Link';
import Picture from '@/assets/svg/postWrite/Picture';
import Button from '@/assets/components/Button/Button';

export default function PostWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fontSize, setFontSize] = useState(12);

  return (
    <div className="w-full flex justify-center mt-25">
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
          <div className="flex items-center gap-4 p-4 bg-white border-b  border-gray-2">
            <button className="p-1 cursor-pointer">
              <Bold />
            </button>
            <button className="p-1 cursor-pointer">
              <Link />
            </button>
            <button className="p-1 cursor-pointer">
              <Picture />
            </button>
            <div className="flex items-center gap-2">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="px-3 py-1 border border-gray-2 rounded outline-none cursor-pointer"
              >
                <option value={12}>12</option>
                <option value={14}>14</option>
                <option value={16}>16</option>
                <option value={18}>18</option>
                <option value={20}>20</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>

          <textarea
            placeholder="내용을 자유롭게 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-6 placeholder:text-gray-3 placeholder:font-bold text-xl placeholder:text-xl outline-none resize-none"
            style={{ fontSize: `${fontSize}px` }}
          />
        </div>

        <div className="flex justify-end mt-13">
          <Button
            text="등록하기"
            onClick={() => {
              /* 게시글 등록 로직 */
            }}
          />
        </div>
      </div>
    </div>
  );
}
