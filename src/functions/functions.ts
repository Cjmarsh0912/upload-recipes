export const convertString = (value: string) => {
  const convertedString = '/' + value.toLowerCase().replace(/\s/g, '-');
  return convertedString;
};

export const capitalizeString = (value: string) => {
  const words = value.toLowerCase().split(' ');
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  const capitalizedString = capitalizedWords.join(' ');

  return capitalizedString;
};
