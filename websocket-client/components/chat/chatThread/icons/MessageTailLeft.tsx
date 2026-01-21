import React from 'react'

interface MessageTailLeftProps extends React.SVGProps<SVGSVGElement> {
  borderClassName?: string
}

export const MessageTailLeft: React.FC<MessageTailLeftProps> = ({
  borderClassName = '',
  className = '',
  ...props
}) => {
  return (
    <>
      <svg
        className={`absolute left-0 top-0 ${className}`}
        viewBox="0 0 8 13"
        style={{ transform: 'translateX(-50%)' }}
        {...props}
      >
        <path
          d="M1.533 3.568L8 12.103V1H2.812A1.125 1.125 0 0 0 1.533 3.568z"
          fill="currentColor"
        />
      </svg>
      <svg
        className={`absolute left-0 top-0 ${borderClassName}`}
        viewBox="0 0 8 13"
        style={{ transform: 'translateX(-50%)', zIndex: -1 }}
      >
        <path
          d="M1.533 3.568L8 12.103V1H2.812A1.125 1.125 0 0 0 1.533 3.568z"
          fill="currentColor"
        />
      </svg>
    </>
  )
}

