interface DividerProps {
  className?: string;
}

export default function Divider({ className = '' }: DividerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="3"
      height="28"
      viewBox="0 0 3 28"
      fill="none"
      className={className}
    >
      <path
        d="M1.5 1.5V26.5"
        stroke="#333D48"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
