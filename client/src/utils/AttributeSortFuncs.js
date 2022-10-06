const convertTwoDimensionalToOne = (arr) => {
  return arr.reduce((sum, val) => sum.concat(val), []);
};

const groupBy = (arr) => {
  const oneDimensionalArray = convertTwoDimensionalToOne(arr);
  const groupedObj = oneDimensionalArray.reduce((grouped, value) => {
    const property = value.name;
    return {
      ...grouped,
      [property]: [...(grouped[property] || []), ...value.items],
    };
  }, {});

  return groupedObj;
};

export const removeDuplicates = (arr) => {
  let trimmedArray = [];
  let values = [];
  let value;

  arr.forEach((item) => {
    value = item.value;

    if (values.indexOf(value) === -1) {
      if (item.value === "Yes" || item.value === "No") {
        trimmedArray.push({ ...item, withYesOrNo: true });
      } else {
        trimmedArray.push(item);
      }

      values.push(value);
    }
  });

  return trimmedArray;
};

export const removeDuplicatesForProduct = (arr) => {
  let trimmedArray = [];
  let values = [];
  let value;

  arr.forEach((item) => {
    value = item.id;

    if (values.indexOf(value) === -1) {
      trimmedArray.push(item);
      values.push(value);
    }
  });

  return trimmedArray;
};

export const getUniqueAttributes = (arr) => {
  const groupedObj = groupBy(arr);
  let uniqueArr;
  let newObj = {};
  for (const n in groupedObj) {
    uniqueArr = removeDuplicates(groupedObj[n]);
    newObj[n] = { arr: uniqueArr, attrName: n };
  }

  return Object.values(newObj);
};

export const getProductAttrs = (products) => {
  const arr = products.map((product) =>
    product.attributes.map((attribute) => ({
      name: attribute.name,
      items: [...attribute.items.map((item) => item.value)],
      product,
    }))
  );
  const oneD = convertTwoDimensionalToOne(arr);
  return oneD;
};

export const getUniqueProductsList = (products) => {
  let filteredProducts = [];
  const productAndAttributes = getProductAttrs(products);
  const urlParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlParams.entries());

  productAndAttributes.forEach((item) => {
    if (
      Object.keys(params).includes(item.name) &&
      item.items.includes(params[item.name])
    ) {
      filteredProducts.push(item.product);
    }
  });

  const uniqueFilteredProducts = removeDuplicatesForProduct(filteredProducts);

  return uniqueFilteredProducts;
};
