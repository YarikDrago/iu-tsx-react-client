import React from 'react';
import { Link } from 'react-router';

import * as styles from './Breadcrumbs.module.scss';

export type BreadcrumbItem = {
  label: string;
  href: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }: Props) => {
  return (
    <nav aria-label="breadcrumbs" className={styles.container}>
      <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0 }}>
        {items.map((item, index) => {
          if (index === items.length - 1) {
            return <p>{item.label}</p>;
          } else {
            return (
              <li key={index} className={styles.element}>
                {item.href ? (
                  <Link to={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
                {index < items.length - 1 && <span>›</span>}
              </li>
            );
          }
        })}
      </ol>
    </nav>
  );
};
