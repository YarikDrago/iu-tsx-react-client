import React, { useEffect, useMemo, useState } from 'react';
import { matchPath, useLocation } from 'react-router';

import { routes } from '@/routes/routes';

import * as styles from './BackgroundImage.module.scss';

type BackgroundImageModule = {
  default: string;
};

type PageBackground =
  | {
      color: string;
      image?: undefined;
      imageId?: undefined;
    }
  | {
      color: string;
      imageId: string;
      image: () => Promise<BackgroundImageModule>;
    };

const defaultBackground: PageBackground = {
  color: '#081420',
  imageId: 'default',
  image: () => import('@/assets/images/background.jpg'),
};

const pageBackgrounds: Array<{
  path: string;
  background: PageBackground;
}> = [
  {
    path: routes.bread.href,
    background: {
      color: '#ffffff',
      imageId: 'bread-bg',
      image: () => import('@/assets/images/products/honey-bg-2.png'),
    },
  },
];

const BackgroundImage = () => {
  const { pathname } = useLocation();
  const [image, setImage] = useState<{ id: string; url: string } | null>(null);

  const background = useMemo(() => {
    return (
      pageBackgrounds.find(({ path }) => matchPath(path, pathname))?.background ?? defaultBackground
    );
  }, [pathname]);

  useEffect(() => {
    let isCurrent = true;

    if (!background.image) {
      setImage(null);

      return () => {
        isCurrent = false;
      };
    }

    if (image?.id === background.imageId) {
      return () => {
        isCurrent = false;
      };
    }

    setImage(null);

    background.image().then((image) => {
      if (!isCurrent) return;

      setImage({
        id: background.imageId,
        url: image.default,
      });
    });

    return () => {
      isCurrent = false;
    };
  }, [background, image?.id]);

  return (
    <>
      <div
        key={`color:${background.color}`}
        className={styles.colorLayer}
        style={{ backgroundColor: background.color }}
      />
      {image && (
        <div
          key={`image:${image.id}`}
          className={styles.imageLayer}
          style={{ backgroundImage: `url(${image.url})` }}
        />
      )}
    </>
  );
};

export default BackgroundImage;
