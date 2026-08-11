import cakeIcon4Pc from '@/assets/images/products/bread/cake-icon-4pc.svg?url';
import cakeIcon6Pc from '@/assets/images/products/bread/cake-icon-6pc.svg?url';
import cakeIcon8Pc from '@/assets/images/products/bread/cake-icon-8pc.svg?url';
import cakeIcon12Pc from '@/assets/images/products/bread/cake-icon-12pc.svg?url';

export type ProductSizeId = 's' | 'm' | 'l' | 'xl';

export type ProductPriceOptions = {
  glutenFree?: boolean;
  cakeMessage?: boolean;
  decorateBox?: boolean;
};

export type ProductSizeOption = {
  id: ProductSizeId;
  title: string;
  weight: string;
  portions: string;
  price: number;
  image: string;
};

export const productSizeOptions: ProductSizeOption[] = [
  {
    id: 's',
    title: 'S',
    weight: '0.9 kg',
    portions: '4 portions',
    price: 24,
    image: cakeIcon4Pc,
  },
  {
    id: 'm',
    title: 'M',
    weight: '1.3 kg',
    portions: '6 portions',
    price: 32,
    image: cakeIcon6Pc,
  },
  {
    id: 'l',
    title: 'L',
    weight: '1.8 kg',
    portions: '8 portions',
    price: 42,
    image: cakeIcon8Pc,
  },
  {
    id: 'xl',
    title: 'XL',
    weight: '2.6 kg',
    portions: '12 portions',
    price: 58,
    image: cakeIcon12Pc,
  },
];

export const calculateProductPrice = (sizeId: ProductSizeId, options: ProductPriceOptions = {}) => {
  const selectedSize = productSizeOptions.find(({ id }) => id === sizeId);
  let price = selectedSize?.price ?? productSizeOptions[0].price;

  if (options.glutenFree) {
    price += 6;
  }

  if (options.cakeMessage) {
    price += 4;
  }

  if (options.decorateBox) {
    price += 5;
  }

  return price;
};

export const formatPrice = (price: number) => {
  return `EUR ${price}`;
};
