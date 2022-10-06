import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { getPriceValueAndSymbol } from "../utils/priceCalcs";
import {
  decrementItemQuantity,
  incrementItemQuantity,
} from "../redux/commerce/actions";
import { Attributes } from ".";

class CartOverlayItem extends Component {
  render() {
    const {
      item,
      currentCurrencyLabel,
      incrementItemQuantity,
      decrementItemQuantity,
    } = this.props;
    const { priceSymbol, priceValue } = getPriceValueAndSymbol(
      item,
      currentCurrencyLabel
    );
    const selectedAttributes = Object.values(item.selectedAttributes);

    return (
      <Container>
        <div className="productInfo">
          <h1>{item.brand}</h1>
          <h2>{item.name}</h2>
          <h2 className="price">
            {priceSymbol} {priceValue}
          </h2>
          <Attributes
            attributes={item.attributes}
            size="small"
            selected
            selectedFromCart={selectedAttributes}
          />
        </div>
        <div className="image">
          <div className="updatedItem">
            <div
              onClick={() => incrementItemQuantity(item.id)}
              className="updateBtn"
            >
              +
            </div>
            <div className="updateBtn">{item.quantity}</div>
            <div
              data-ref={item.quantity}
              onClick={() => decrementItemQuantity(item.id)}
              className="updateBtn"
            >
              -
            </div>
          </div>
          <div className="img">
            <img src={item.gallery?.[0]} alt="mainImg" />
          </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    currentCurrencyLabel: store.commerce.currentCurrencyLabel,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    incrementItemQuantity: (id) => dispatch(incrementItemQuantity({ id })),
    decrementItemQuantity: (id) => dispatch(decrementItemQuantity({ id })),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CartOverlayItem);

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 2rem;
  margin: 3.5rem 0;

  .productInfo {
    width: 14rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    h1,
    h2 {
      font-weight: 300;
      font-size: 1.6rem;
    }
    .price {
      font-weight: 600;
    }
  }

  .image {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 0 1rem;
    .updatedItem {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .updateBtn {
        border: 1px solid #1d1f22;
        width: 2.4rem;
        height: 2.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .img {
      img {
        width: 12rem;
        height: 19rem;
        object-fit: contain;
      }
    }
  }
`;
