export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = '2',
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      {...props}
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  )
}

