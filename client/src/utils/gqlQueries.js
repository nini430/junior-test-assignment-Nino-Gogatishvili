import { gql } from "@apollo/client";

export const QUERY_CATEGORIES_NAME_AND_CURRENCY = gql`
  query {
    categories {
      name
    }

    currencies {
      label
      symbol
    }
  }
`;

export const ProductFragment = gql`
  fragment GetProductInfo on Product {
    id
    name
    inStock
    gallery
    brand
    prices {
      currency {
        label
        symbol
      }
      amount
    }
  }
`;

export const QUERY_CATEGORY = gql`
  ${ProductFragment}
  query Category($category: CategoryInput) {
    category(input: $category) {
      name
      products {
        ...GetProductInfo
        attributes {
          id
          name
          items {
            id
            value
            displayValue
          }
        }
      }
    }
  }
`;

export const QUERY_PRODUCT = gql`
  ${ProductFragment}
  query Product($productId: String!) {
    product(id: $productId) {
      ...GetProductInfo
      description
      attributes {
        id
        name
        type
        items {
          id
          value
          displayValue
        }
      }
    }
  }
`;
