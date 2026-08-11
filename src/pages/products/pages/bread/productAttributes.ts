export type ProductAttributeId = 'candles' | 'number-candles' | 'question-candles' | 'card';

export type ProductAttributeOption = {
  id: ProductAttributeId;
  title: string;
  price: number;
};

export const productAttributeOptions: ProductAttributeOption[] = [
  {
    id: 'candles',
    title: 'Candles',
    price: 3,
  },
  {
    id: 'number-candles',
    title: 'Number Candles',
    price: 5,
  },
  {
    id: 'question-candles',
    title: 'Question Candles',
    price: 4,
  },
  {
    id: 'card',
    title: 'Card',
    price: 3,
  },
];

export const getProductAttributeOption = (attributeId: ProductAttributeId) => {
  return productAttributeOptions.find(({ id }) => id === attributeId);
};

export const calculateAttributesPrice = (attributeIds: ProductAttributeId[] = []) => {
  return attributeIds.reduce((total, attributeId) => {
    return total + (getProductAttributeOption(attributeId)?.price ?? 0);
  }, 0);
};
