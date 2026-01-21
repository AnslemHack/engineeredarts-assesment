import React from 'react'

interface MessageTailRightProps extends React.SVGProps<SVGSVGElement> {
  borderClassName?: string
}

export const MessageTailRight: React.FC<MessageTailRightProps> = ({
  borderClassName = '',
  className = '',
  ...props
}) => {
  return (
    <>
      <svg
        className={`absolute right-0 top-0 ${className}`}
        viewBox="0 0 8 13"
        style={{ transform: 'translateX(50%)' }}
        {...props}
      >
        <path
          d="M5.188 1H0v11.193l6.467-8.535C6.795 3.4 6.795 2.734 6.467 2.328L5.188 1z"
          fill="currentColor"
        />
      </svg>
      <svg
        className={`absolute right-0 top-0 ${borderClassName}`}
        viewBox="0 0 8 13"
        style={{ transform: 'translateX(50%)', zIndex: -1 }}
      >
        <path
          d="M5.188 1H0v11.193l6.467-8.535C6.795 3.4 6.795 2.734 6.467 2.328L5.188 1z"
          fill="currentColor"
        />
      </svg>
    </>
  )
}

