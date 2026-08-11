import React, { useState } from 'react';

import BagPlusIcon from '@/assets/icons/bag-plus.svg';
import cheeseCakeImage from '@/assets/images/products/bread/cheesecake.png';
import { classNames } from '@/shared/utils/classNames';

import styles from './BreadPage.module.scss';
import {
  calculateProductPrice,
  formatPrice,
  ProductSizeId,
  productSizeOptions,
} from './productSizeOptions';

const productTitle = 'Торт Медовик';
const productSections = [
  {
    id: 'product-details',
    title: 'Product details',
    text: 'Мягкие коржи, насыщенный крем и аккуратная сладость делают этот торт хорошим выбором для праздника или спокойного вечера дома.',
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
  const [selectedSizeId, setSelectedSizeId] = useState<ProductSizeId>(productSizeOptions[0].id);
  const productPrice = calculateProductPrice(selectedSizeId);

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
              <img src={cheeseCakeImage} alt={productTitle} />
            </div>
          </div>
        </div>
        <div className={styles.description}>
          <h1 className={classNames(styles.title, styles.titleContainer)}>{productTitle}</h1>
          <div className={styles.sizeSelector}>
            <p className={styles.sizeTitle}>Size</p>
            <div className={styles.sizeCards} role="radiogroup" aria-label="Size">
              {productSizeOptions.map(({ id, title, weight, portions, price, image }) => {
                const isSelected = selectedSizeId === id;

                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={classNames(styles.sizeCard, isSelected && styles.sizeCardActive)}
                    onClick={() => setSelectedSizeId(id)}
                  >
                    <div className={styles.sizeCardImage}>
                      <img src={image} alt="" aria-hidden="true" />
                    </div>
                    <div className={styles.sizeCardInfo}>
                      <p>{title}</p>
                      <p>{weight}</p>
                      <p>{portions}</p>
                      <p>{formatPrice(price)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
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
          <div className={styles.buyBar}>
            <button type="button" className={styles.buyButton}>
              <BagPlusIcon />
              Add to cart | {formatPrice(productPrice)}
            </button>
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
