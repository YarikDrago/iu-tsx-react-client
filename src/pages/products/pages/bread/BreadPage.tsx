import React, { useState } from 'react';

import cheeseCakeImage from '@/assets/images/products/bread/cheesecake.png';
import { Chips } from '@/shared/components/Chips';
import { classNames } from '@/shared/utils/classNames';

import styles from './BreadPage.module.scss';

const productTitle = 'Торт Медовик';
const productSizes = ['S (4- portions)', 'M (6- portions)', 'L (8 portions)', 'XL (12-portions)'];
const productSections = [
  {
    id: 'product-details',
    title: 'Product details',
    text:
      'Мягкие коржи, насыщенный крем и аккуратная сладость делают этот торт хорошим выбором для\n' +
      '            праздника или спокойного вечера дома.',
  },
  {
    id: 'nutrition-ingredients',
    title: 'Nutrition & ingredients',
    text: 'Contains wheat flour, eggs, dairy, honey, and sugar. Nutrition details can be expanded here later.',
  },
  {
    id: 'care-instructions',
    title: 'Care Instructions',
    text: 'Keep refrigerated and serve chilled. For the best texture, remove from the fridge shortly before serving.',
  },
];

const BreadPage = () => {
  const [selectedSize, setSelectedSize] = useState(productSizes[0]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section className={styles.page}>
      <article className={styles.product}>
        <div className={styles.mediaColumn}>
          <h1 className={styles.title}>{productTitle}</h1>

          <div className={styles.gallery} aria-label={productTitle}>
            <div className={styles.imageViewport}>
              {/*<img src={breadImage} alt={productTitle} />*/}
              <img src={cheeseCakeImage} alt={productTitle} />
            </div>
          </div>
        </div>
        <div className={styles.description}>
          <h1 className={classNames(styles.title, styles.titleContainer)}>{productTitle}</h1>
          <div className={styles.sizeSelector}>
            <p className={styles.sizeTitle}>Size</p>
            <Chips
              options={productSizes}
              value={selectedSize}
              onChange={setSelectedSize}
              ariaLabel="Size"
              className={styles.sizeChips}
              chipClassName={styles.sizeChip}
              activeChipClassName={styles.sizeChipActive}
            />
          </div>
          <div className={styles.sectionNav} aria-label="Product information sections">
            {productSections.map(({ id, title }) => (
              <button
                key={id}
                type="button"
                className={styles.sectionButton}
                onClick={() => scrollToSection(id)}
              >
                <span className={styles.sectionButtonIcon} aria-hidden="true">
                  →
                </span>
                <span>{title}</span>
              </button>
            ))}
          </div>
        </div>
      </article>

      <div className={styles.productSections}>
        {productSections.map(({ id, title, text }) => (
          <section key={id} id={id} className={styles.productSection}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
    </section>
  );
};

export default BreadPage;
