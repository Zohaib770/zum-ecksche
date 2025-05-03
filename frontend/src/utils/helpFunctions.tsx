const calculateTotalItemPrice = (price: string, quantity: number): string => {
  const parsed = parseFloat(price.replace(',', '.'));
  const total = parsed * quantity;
  return total.toFixed(2).replace('.', ',');
};

// const convertPriceFromDotToComma = (price?: number): string => {
//   if (price === undefined) return '';
//   return price.toFixed(2).replace('.', ',');
// };

const convertPriceFromDotToComma = (price?: number | string): string => {
  // Handle undefined case
  if (price === undefined) return '';

  // Convert to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Check if the result is a valid number
  if (isNaN(numericPrice)) return '';

  // Format the number
  return numericPrice.toFixed(2).replace('.', ',');
};

const convertPriceFromCommaToDot = (price: number): number => {
  const priceStr = price.toString();
  if (priceStr.includes('.')) {
    return parseFloat(priceStr);
  }
  return parseFloat(priceStr.replace(',', '.'));
};

const containsSubstringIgnoreCase = (target: string, search: string): boolean => {
  console.log("target ", target, search);
  if (!target || !search) return false;
  return target.toLowerCase().includes(search.toLowerCase());
}


export {
  calculateTotalItemPrice,
  convertPriceFromDotToComma,
  convertPriceFromCommaToDot,
  containsSubstringIgnoreCase
};
