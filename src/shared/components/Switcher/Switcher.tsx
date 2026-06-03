import React from 'react';

import * as styles from './Switcher.module.scss';

type SwitcherProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
  offText?: string;
  onText?: string;
};

export const Switcher = ({
  checked,
  className,
  label,
  offText = 'Off',
  onText = 'On',
  ...props
}: SwitcherProps) => (
  <label className={`${styles.option}${className ? ` ${className}` : ''}`}>
    {label !== undefined && <span className={styles.label}>{label}</span>}
    <span className={styles.switcher}>
      <input className={styles.input} type="checkbox" checked={checked} {...props} />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.state}>{checked ? onText : offText}</span>
        <span className={styles.thumb} />
      </span>
    </span>
  </label>
);
