import Search from '@/assets/svg/search/search';

interface InputSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputSearch({
  placeholder = '익명 게시판 검색',
  value,
  onChange,
}: InputSearchProps) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-100 h-16 pl-16 pr-6 rounded-full border border-[#D6D6D7] bg-[#F9F9F9] text-2xl font-bold outline-none focus:border-[#BFA9FF]"
      />
      <div className="absolute left-8 px-5 top-1/2 -translate-1/2">
        <Search />
      </div>
    </div>
  );
}
