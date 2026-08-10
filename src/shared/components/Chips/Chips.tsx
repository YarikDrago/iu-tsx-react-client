import React from 'react';

import { classNames } from '@/shared/utils/classNames';

import './Chips.scss';

type ChipsProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
  chipClassName?: string;
  activeChipClassName?: string;
};

export const Chips = ({
  options,
  value,
  onChange,
  ariaLabel,
  className,
  chipClassName,
  activeChipClassName,
}: ChipsProps) => {
  return (
    <div className={classNames('chips', className)} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => {
        const isActive = value === option;

        return (
          <button
            key={option}
            type="button"
            className={classNames(
              'chips__chip',
              chipClassName,
              isActive && 'chips__chip--active',
              isActive && activeChipClassName
            )}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
