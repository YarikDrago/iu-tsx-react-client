import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOn: boolean;
}

const OnOffButton = ({ isOn, ...props }: Props) => {
  return <button {...props}>{isOn ? 'ON' : 'OFF'}</button>;
};

export default OnOffButton;
