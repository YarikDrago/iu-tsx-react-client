import React from 'react';

import CrossIcon from '@/assets/icons/x-45-lg.svg';

interface CloseBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const CloseBtn = ({ ...props }: CloseBtnProps) => {
  const { className, ...otherProps } = props;
  return (
    <button className={`close text-pure ${className ? className : ''}`} {...otherProps}>
      <CrossIcon width={20} height={20} />
    </button>
  );
};

export default CloseBtn;
