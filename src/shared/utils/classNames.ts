type ClassNameValue = string | false | null | undefined;

export const classNames = (...classes: ClassNameValue[]) => {
  return classes.filter(Boolean).join(' ');
};
