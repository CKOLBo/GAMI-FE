import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Picture from '@/assets/svg/postWrite/Picture';
import Button from '@/assets/components/Button/Button';
import Sidebar from '@/assets/components/Sidebar';
import { instance } from '@/assets/shared/lib/axios';
import { toast } from 'react-toastify';
import X from '@/assets/svg/X';

interface UploadedImage {
  imageUrl: string;
  sequence: number;
}

export default function PostWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await instance.post<{ imageUrl: string }>(
        '/api/post/images',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setImages((prev) => [
        ...prev,
        {
          imageUrl: res.data.imageUrl,
          sequence: prev.length,
        },
      ]);

      toast.success('이미지 업로드 성공');
    } catch {
      toast.error('이미지 업로드 실패');
    }
  };

  const handleImageDelete = async (imageUrl: string) => {
    try {
      await instance.delete('/api/post/images', {
        params: { imageUrl },
      });

      setImages((prev) =>
        prev
          .filter((img) => img.imageUrl !== imageUrl)
          .map((img, idx) => ({ ...img, sequence: idx }))
      );

      toast.success('이미지 삭제 완료');
    } catch {
      toast.error('이미지 삭제 실패');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await instance.post('/api/post', {
        title,
        content,
        images,
      });

      toast.success('게시글이 등록되었습니다.');
      navigate('/post');
    } catch {
      toast.error('게시글 등록 실패');
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
            className="w-full p-5 placeholder:text-gray-3 text-xl font-bold placeholder:font-bold rounded-lg outline-none border border-gray-2"
          />
        </div>

        <div className="border h-[420px] border-gray-2 rounded-lg overflow-hidden">
          <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-2">
            <label className="p-1 cursor-pointer">
              <Picture />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            placeholder="내용을 자유롭게 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-6 placeholder:text-gray-3 text-xl font-semibold placeholder:text-xl placeholder:font-bold outline-none resize-none"
          />
        </div>

        {images.length > 0 && (
          <div className="flex gap-4 mt-6 flex-wrap">
            {images.map((img) => (
              <div key={img.imageUrl} className="relative">
                <img
                  src={img.imageUrl}
                  alt="업로드 이미지"
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  onClick={() => handleImageDelete(img.imageUrl)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-7 h-7 text-sm"
                >
                  <X color="#ffffff" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-13 mb-8">
          <Button
            text={isSubmitting ? '등록 중...' : '등록하기'}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
