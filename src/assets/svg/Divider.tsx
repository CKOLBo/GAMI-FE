interface DividerProps {
  className?: string;
}

export default function Divider({ className = '' }: DividerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="44"
      viewBox="0 0 4 44"
      fill="none"
      className={className}
    >
      <path
        d="M2 2V42"
        stroke="#333D48"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
