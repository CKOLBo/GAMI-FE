import InputSearch from '../Input/InputSearch';

interface PostHeadProps {
  children: React.ReactNode;
}

export default function PostHead({ children }: PostHeadProps) {
  return (
    <div
      className="flex flex-col lg:flex-row items-start lg:items-center
                            my-4 sm:my-6 lg:my-16
                            gap-3 lg:gap-20"
    >
      <div className="w-full lg:w-auto shrink-0">
        <p className="text-gray-1 text-xl sm:text-2xl lg:text-4xl font-bold">
          익명 게시판
        </p>
      </div>

      <div
        className="flex flex-col sm:flex-row w-full flex-wrap
                              items-stretch sm:items-center
                              gap-3 sm:gap-4 justify-between"
      >
        <div className="w-full sm:flex-1 max-w-[400px]">
          <InputSearch />
        </div>
        {children}
      </div>
    </div>
  );
}
