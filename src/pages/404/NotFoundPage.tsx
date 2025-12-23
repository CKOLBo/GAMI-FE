import { Link, useNavigate } from 'react-router-dom';
import NotFound from '@/assets/svg/404/404';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white h-screen flex justify-center items-center p-5">
      <div className="text-center max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <NotFound />
        </div>

        <h2 className="text-2xl font-bold text-gray-1 mb-6">
          페이지를 찾을 수 없습니다. 요청하신 페이지가 존재하지 않거나
          이동되었을 수 있습니다.
        </h2>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="max-w-[152px] w-[120px] max-h-[64px] h-[48px] rounded-[10px] bg-[#F9F9F9] text-gray-1 text-base transition-all duration-300 font-bold hover:opacity-80 flex items-center justify-center border-0 cursor-pointer"
          >
            이전 페이지
          </button>

          <Link
            to="/main"
            className="max-w-[152px] w-[120px] max-h-[64px] h-[48px] rounded-[10px] bg-[#73A9FF] text-white text-base transition-all duration-300 font-bold hover:bg-main-1-hover flex items-center justify-center no-underline"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
