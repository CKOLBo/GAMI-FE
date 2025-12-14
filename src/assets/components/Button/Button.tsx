import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  text: string;
  to?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ text, to, onClick }: ButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (to) navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="rounded-lg bg-main-1 w-38 h-16 cursor-pointer text-white font-bold text-2xl"
    >
      {text}
    </button>
  );
}
