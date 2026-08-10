import React, { useState } from 'react';

import cheeseCakeImage from '@/assets/images/products/bread/cheesecake.png';
import { Chips } from '@/shared/components/Chips';
import { classNames } from '@/shared/utils/classNames';

import styles from './BreadPage.module.scss';

const productTitle = 'Торт Медовик';
const productSizes = ['S (4- portions)', 'M (6- portions)', 'L (8 portions)', 'XL (12-portions)'];

const BreadPage = () => {
  const [selectedSize, setSelectedSize] = useState(productSizes[0]);

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
          <h2>Нежный торт для семейного чаепития</h2>
          <p>
            Мягкие коржи, насыщенный крем и аккуратная сладость делают этот торт хорошим выбором для
            праздника или спокойного вечера дома.
          </p>
          <p>
            Изображение уже размещено в отдельной зоне галереи: позже сюда можно добавить несколько
            фотографий, стрелки переключения и миниатюры.
          </p>
        </div>
      </article>
    </section>
  );
};

export default BreadPage;
