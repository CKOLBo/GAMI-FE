import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  text: string;
  to?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  color?: string;
  width?: string;
  height?: string;
}

export default function Button({
  text,
  to,
  onClick,
  color = 'bg-main-1',
  width = 'w-38',
  height = 'h-16',
}: ButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (to) navigate(to);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        ${color}
        ${width}
        ${height}
        rounded-lg
        cursor-pointer
        text-white
        font-bold
        text-2xl
        flex
        items-center
        justify-center
      `}
    >
      {text}
    </button>
  );
}
