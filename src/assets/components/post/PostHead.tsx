import Button from '../Button/Button';
import InputSearch from '../Input/InputSearch';

interface PostHeadProps {
  keyword?: string;
  onKeywordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
}

export default function PostHead({
  keyword,
  onKeywordChange,
  onSearch,
}: PostHeadProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center my-4 sm:my-6 lg:my-16 gap-3 lg:gap-20">
      <div className="flex flex-col sm:flex-row w-full flex-wrap sm:items-center gap-3 sm:gap-4 justify-between">
        <div className="w-full sm:flex-1 max-w-100">
          <InputSearch
            value={keyword}
            onChange={onKeywordChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onSearch) {
                onSearch();
              }
            }}
          />
        </div>

        <div className="flex pl-[410px]">
          <Button text="글 쓰기" to="/post-write" />
        </div>
      </div>
    </div>
  );
}
