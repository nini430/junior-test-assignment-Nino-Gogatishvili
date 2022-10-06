export const getPriceValueAndSymbol = (product, selectedLabel) => {
  const priceValue = product.prices?.find(
    (item) => item.currency.label === selectedLabel
  ).amount;
  const priceSymbol = product.prices?.find(
    (item) => item.currency.label === selectedLabel
  ).currency.symbol;
  return { priceValue, priceSymbol };
};

export const getTotalPrice = (cart, selectedLabel) => {
  let priceSymbol;
  const pricesAndQuantitiesForSelectedLabel = cart.map((item) => {
    const selectedPriceObject = item.prices.find(
      (price) => price.currency.label === selectedLabel
    );
    priceSymbol = selectedPriceObject.currency.symbol;
    return {
      quantity: item.quantity,
      amount: selectedPriceObject.amount,
      symbol: selectedPriceObject.currency.symbol,
    };
  });

  const totalAmount = parseFloat(
    pricesAndQuantitiesForSelectedLabel.reduce(
      (sum, val) => sum + val.quantity * val.amount,
      0
    )
  ).toFixed(2);

  return { totalAmount, priceSymbol };
};
