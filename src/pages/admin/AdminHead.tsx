import Line from '@/assets/svg/Line';

export default function AdminHead() {
  return (
    <div className="border flex rounded-lg w-full max-w-[1300px] h-20 px-12 py-5 border-gray-1">
      <span className="text-2xl flex items-center pr-12 text-gray-1 font-semibold">
        번호
      </span>
      <Line />
      <span className="text-2xl flex items-center px-15 text-gray-1 font-semibold">
        제재상태
      </span>
      <Line />
      <span className="text-2xl flex items-center px-16 text-gray-1 font-semibold">
        신고자
      </span>
      <Line />
      <span className="text-2xl flex items-center px-32 text-gray-1 font-semibold">
        신고사유
      </span>
      <Line />
      <span className="text-2xl flex items-center px-14 text-gray-1 font-semibold">
        추가설명
      </span>
      <Line />
      <span className="text-2xl flex items-center pl-18 text-gray-1 font-semibold">
        바로가기
      </span>
    </div>
  );
}
