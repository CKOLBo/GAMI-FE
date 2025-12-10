import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeartIcon from '@/assets/svg/main/HeartIcon';
import HeartFilledIcon from '@/assets/svg/main/HeartFilledIcon';
import CommentIcon from '@/assets/svg/main/CommentIcon';

interface MainPostProps {
  postId: number | string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
}

export default function MainPost({
  postId,
  title,
  content,
  likeCount,
  commentCount,
  isLiked = false,
}: MainPostProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <Link
      to={`/post/${postId}`}
      className="flex flex-col justify-between bg-[#F9F9F9] rounded-2xl px-10 py-14 h-80 hover:bg-[#F0F0F0] transition-colors cursor-pointer"
    >
      <div>
        <h2 className="text-4xl font-bold text-[#333D48] mb-10 break-words">
          {title}
        </h2>

        <p className="text-bold text-[#6D6F79] max-h-[96px] break-words">
          <span className="font-medium">익명 : </span>
          {content}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLikeToggle}
          className="flex items-center gap-2"
          aria-label="좋아요"
        >
          {liked ? <HeartFilledIcon /> : <HeartIcon />}
          <span className="text-lg text-[#333D48]">{likes}</span>
        </button>

        <div className="flex items-center gap-2">
          <CommentIcon />
          <span className="text-lg text-[#333D48]">{commentCount}</span>
        </div>
      </div>
    </Link>
  );
}
