export default function Exchange({
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
      className={className}
      height={size}
      width={size}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g strokeWidth='0'></g>
      <g strokeLinecap='round' strokeLinejoin='round'></g>
      <path
        d='M8 10H20L16 6'
        stroke={fill}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
      <path
        d='M16 14L4 14L8 18'
        stroke={fill}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
    </svg>
  );
}
