export default function Tick({
  fill = 'currentColor',
  size = 24,
  className = '',
}: {
  fill?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      className={className}
      width={size}
      height={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      <g strokeWidth='0'></g>
      <g strokeLinecap='round' strokeLinejoin='round'></g>
      <path
        d='M4.89163 13.2687L9.16582 17.5427L18.7085 8'
        stroke={fill}
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
    </svg>
  );
}
