import actionTypes from "./constants";

const initialState = {
  currentCurrencyLabel: "USD",
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  isCartOverlayOpen: false,
  modalProduct: null,
  filteredProducts: [],
  allProducts: [],
};

const commerceReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENCY_UNIT:
      return {
        ...state,
        currentCurrencyLabel: action.payload,
      };
    case actionTypes.ADD_TO_CART:
      if (state.cart.find((item) => item.id === action.payload.id)) {
        const alreadyInCart = state.cart.map((product) => {
          if (product.id === action.payload.id) {
            return { ...product, quantity: product.quantity + 1 };
          } else {
            return product;
          }
        });
        localStorage.setItem("cart", JSON.stringify(alreadyInCart));
        return {
          ...state,
          cart: alreadyInCart,
        };
      } else {
        const newProductAddition = [
          ...state.cart,
          {
            id: action.payload.id,
            name: action.payload.name,
            brand: action.payload.brand,
            selectedAttributes: action.payload.selectedAttributes,
            attributes: action.payload.attributes,
            gallery: action.payload.gallery,
            prices: action.payload.prices,
            quantity: 1,
          },
        ];
        localStorage.setItem("cart", JSON.stringify(newProductAddition));
        return {
          ...state,
          cart: newProductAddition,
        };
      }
    case actionTypes.TOGGLE_CART_OVERLAY:
      return {
        ...state,
        isCartOverlayOpen: !state.isCartOverlayOpen,
      };
    case actionTypes.INCREMENT_ITEM_QUANTITY:
      const updatedCartInc = state.cart.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
      localStorage.setItem("cart", JSON.stringify(updatedCartInc));
      return {
        ...state,
        cart: updatedCartInc,
      };
    case actionTypes.DECREMENT_ITEM_QUANTITY:
      const selectedItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      let updatedCartDec;
      if (selectedItem.quantity === 1) {
        updatedCartDec = state.cart.filter(
          (item) => item.id !== action.payload.id
        );
      } else {
        updatedCartDec = state.cart.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
      localStorage.setItem("cart", JSON.stringify(updatedCartDec));
      return { ...state, cart: updatedCartDec };

    case actionTypes.SET_MODAL_PRODUCT:
      return { ...state, modalProduct: action.payload };
    case actionTypes.CLOSE_MODAL_PRODUCT:
      return { ...state, modalProduct: null };
    case actionTypes.GET_FILTERED_PRODUCTS:
      return { ...state, filteredProducts: action.payload };
    case actionTypes.GET_ALL_PRODUCTS:
      localStorage.setItem("products", JSON.stringify(action.payload));
      return { ...state, allProducts: action.payload };

    default:
      return state;
  }
};

export default commerceReducer;
