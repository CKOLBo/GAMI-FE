interface CommentProps {
  width: string;
  height: string;
  color: string;
}

export default function Comment({ width, height, color }: CommentProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 15.5C1.5 23.232 7.76796 29.5 15.5 29.5C18.6677 29.5 29.4989 29.5 29.4989 29.5C29.4989 29.5 27.0735 23.6762 28.0441 21.7235C28.976 19.8487 29.5 17.7356 29.5 15.5C29.5 7.76802 23.232 1.5 15.5 1.5C7.76796 1.5 1.5 7.76802 1.5 15.5Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
