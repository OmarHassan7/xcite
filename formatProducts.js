function formatProducts(products) {
  return products.map((el) => {
    return {
      productType: el.shwCardType,
      englishDescription: el.name,
      arabicDescription: el.crossLanguage,
      id: el.ctId,
      price: el.price,
      currency: el.currency,
      discountPerc: el.discountDiff,
      undiscountedPrice: el.unmodifiedPrice,
      inStock: el.inStock,
    };
  });
}

module.exports.formatProducts = formatProducts;
