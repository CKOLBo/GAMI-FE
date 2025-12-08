import InputSearch from '@/assets/components/InputSearch';
import Button from '@/assets/components/Button';
export default function PostPage() {
  return (
    <div className="flex flex-row my-25">
      <div>
        <p className="text-[40px] w-46 h-12 font-bold mx-25">익명 게시판</p>
      </div>
      <div>
        <InputSearch />
      </div>
      <div className="ml-114">
        <Button text="글 쓰기" to="" />
      </div>
    </div>
  );
}
