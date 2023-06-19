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

export function removeExtraWhitespace(string: string) {
  if (string.length === 0) {
    return string;
  }

  let trimmedStr = string.trim();
  let collapsedSpaces = trimmedStr.replace(/\s\s+/g, ' ');

  if (collapsedSpaces.length === 0) {
    return collapsedSpaces;
  }

  if (string.endsWith(' ')) {
    collapsedSpaces += ' ';
  }

  return collapsedSpaces;
}

export const scrollToElement = (element: string) => {
  const errorElement = document.getElementById(element);
  const elementPosition = errorElement?.getBoundingClientRect().top;
  const scrollOffset = 100;

  if (elementPosition) {
    const offsetPosition = elementPosition - scrollOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};
