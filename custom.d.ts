declare module '*.svg' {
  import { FunctionComponent, SVGProps } from 'react';
  const SVG: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.mp4' {
  const content: string;
  export default content;
}

declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }

  const classNames: IClassNames;
  export = classNames;
}

declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }

  const classNames: IClassNames;
  export = classNames;
}
