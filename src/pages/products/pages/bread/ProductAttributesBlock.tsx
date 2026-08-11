import React from 'react';

import DashCircleIcon from '@/assets/icons/dash-circle.svg';

import {
  getProductAttributeOption,
  ProductAttributeId,
  ProductAttributeOption,
  productAttributeOptions,
} from './productAttributes';
import styles from './ProductAttributes.module.scss';
import { formatPrice } from './productSizeOptions';

type ProductAttributesProps = {
  selectedAttributeIds: ProductAttributeId[];
  onChange: (attributeIds: ProductAttributeId[]) => void;
};

export const ProductAttributesBlock = ({
  selectedAttributeIds,
  onChange,
}: ProductAttributesProps) => {
  const selectedAttributes = selectedAttributeIds
    .map(getProductAttributeOption)
    .filter((attribute): attribute is ProductAttributeOption => Boolean(attribute));
  const availableAttributes = productAttributeOptions.filter(
    ({ id }) => !selectedAttributeIds.includes(id)
  );

  const handleAttributeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const attributeId = event.target.value as ProductAttributeId;

    if (!attributeId || selectedAttributeIds.includes(attributeId)) {
      return;
    }

    onChange([...selectedAttributeIds, attributeId]);
    event.target.value = '';
  };

  const handleAttributeRemove = (attributeId: ProductAttributeId) => {
    onChange(selectedAttributeIds.filter((id) => id !== attributeId));
  };

  return (
    <div className={styles.attributes}>
      <p className={styles.title}>Attributes</p>
      {selectedAttributes.length > 0 && (
        <div className={styles.selectedAttributes} aria-label="Selected attributes">
          {selectedAttributes.map(({ id, title, price }) => (
            <div key={id} className={styles.selectedAttribute}>
              <span>
                {title} | {formatPrice(price)}
              </span>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleAttributeRemove(id)}
                aria-label={`Remove ${title}`}
              >
                <DashCircleIcon />
              </button>
            </div>
          ))}
        </div>
      )}
      <select
        className={styles.select}
        defaultValue=""
        onChange={handleAttributeSelect}
        disabled={availableAttributes.length === 0}
        aria-label="Add attribute"
      >
        <option value="" disabled>
          Add attribute
        </option>
        {availableAttributes.map(({ id, title, price }) => (
          <option key={id} value={id}>
            {title} | {formatPrice(price)}
          </option>
        ))}
      </select>
    </div>
  );
};
