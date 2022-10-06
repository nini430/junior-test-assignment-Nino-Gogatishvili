import actionTypes from "./constants";

export const setCurrencyUnit = (payload) => ({
  type: actionTypes.SET_CURRENCY_UNIT,
  payload,
});

export const addToCart = (payload) => ({
  type: actionTypes.ADD_TO_CART,
  payload,
});

export const toggleCartOverlay = () => ({
  type: actionTypes.TOGGLE_CART_OVERLAY,
});

export const incrementItemQuantity = (payload) => ({
  type: actionTypes.INCREMENT_ITEM_QUANTITY,
  payload,
});

export const decrementItemQuantity = (payload) => ({
  type: actionTypes.DECREMENT_ITEM_QUANTITY,
  payload,
});

export const setModalProduct = (payload) => ({
  type: actionTypes.SET_MODAL_PRODUCT,
  payload,
});

export const closeModalProduct = () => ({
  type: actionTypes.CLOSE_MODAL_PRODUCT,
});

export const getFilteredProducts = (payload) => ({
  type: actionTypes.GET_FILTERED_PRODUCTS,
  payload,
});

export const getAllProducts = (payload) => ({
  type: actionTypes.GET_ALL_PRODUCTS,
  payload,
});
