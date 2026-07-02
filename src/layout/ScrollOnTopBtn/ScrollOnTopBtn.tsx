import React, { useEffect, useRef } from 'react';

import chevronIcon from '@/assets/icons/chevron.png';

import * as styles from './ScrollOnTopBtn.module.scss';

const ScrollOnTopBtn = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const lastWindowScrollY = useRef(0);
  const lastElementScrollTop = useRef(new WeakMap<Element, number>());

  useEffect(() => {
    const setButtonVisible = (visible: boolean) => {
      if (!btnRef.current) return;

      if (visible) {
        btnRef.current.setAttribute('show', '');
      } else {
        btnRef.current.removeAttribute('show');
      }
    };

    const updateButtonVisibility = (currentScroll: number, lastScroll: number) => {
      // const halfScreen = window.innerHeight / 2;

      const scrollingUp = currentScroll < lastScroll;
      const farFromTop = currentScroll > 0;

      setButtonVisible(scrollingUp && farFromTop);
    };

    const handleWindowScroll = () => {
      const currentScroll = window.scrollY;

      updateButtonVisibility(currentScroll, lastWindowScrollY.current);
      lastWindowScrollY.current = currentScroll;
    };

    const handleElementScroll = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;
      if (target === document.documentElement || target === document.body) return;

      const currentScroll = target.scrollTop;
      const lastScroll = lastElementScrollTop.current.get(target) ?? currentScroll;

      updateButtonVisibility(currentScroll, lastScroll);
      lastElementScrollTop.current.set(target, currentScroll);
    };

    lastWindowScrollY.current = window.scrollY;

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    document.addEventListener('scroll', handleElementScroll, true);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      document.removeEventListener('scroll', handleElementScroll, true);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button ref={btnRef} className={styles.button} onClick={handleClick}>
      <img src={chevronIcon} alt="scroll to top" />
      {/*<span>Up</span>*/}
    </button>
  );
};

export default ScrollOnTopBtn;
