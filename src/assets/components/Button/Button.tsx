import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  text: string;
  to?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  color?: string;
  width?: string;
  height?: string;
  disabled?: boolean;
}

export default function Button({
  text,
  to,
  onClick,
  color = 'bg-main-1',
  width = 'w-38',
  height = 'h-16',
  disabled = false,
}: ButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
    if (to) navigate(to);
  };

  return (
    <button
      type="button"
      disabled={disabled}
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
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {text}
    </button>
  );
}
