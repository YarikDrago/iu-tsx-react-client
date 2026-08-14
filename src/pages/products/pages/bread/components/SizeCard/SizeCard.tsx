import { classNames } from '@/shared/utils/classNames';

import { formatPrice, type ProductSizeOption } from '../../productSizeOptions';
import styles from './SizeCard.module.scss';

type SizeCardProps = {
  option: ProductSizeOption;
  isSelected: boolean;
  onSelect: (sizeId: ProductSizeOption['id']) => void;
};

export const SizeCard = ({ option, isSelected, onSelect }: SizeCardProps) => {
  const { id, title, weight, portions, price, image } = option;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      className={classNames(styles.card, isSelected && styles.active)}
      onClick={() => onSelect(id)}
    >
      <div className={styles.image}>
        <img src={image} alt="" aria-hidden="true" />
      </div>
      <div className={styles.info}>
        <p>{title}</p>
        <p>{weight}</p>
        <p>{portions}</p>
        <p>{formatPrice(price)}</p>
      </div>
    </button>
  );
};
