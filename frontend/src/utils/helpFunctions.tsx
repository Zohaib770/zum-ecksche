const calculateTotalItemPrice = (price: string, quantity: number): string => {
    const parsed = parseFloat(price.replace(',', '.'));
    const total = parsed * quantity;
    return total.toFixed(2).replace('.', ',');
  };
  
  const convertPriceFromDotToComma = (price: number): string => {
    return price.toFixed(2).replace('.', ',');
  };
  
  const convertPriceFromCommaToDot = (price: string): string => {
    return price.replace(',', '.');
  };

  const containsSubstringIgnoreCase = (target: string, search: string): boolean => {
    console.log("target ",target, search);
    if (!target || !search) return false;
    return target.toLowerCase().includes(search.toLowerCase());
  }
  
  
  export {
    calculateTotalItemPrice,
    convertPriceFromDotToComma,
    convertPriceFromCommaToDot,
    containsSubstringIgnoreCase
  };
  