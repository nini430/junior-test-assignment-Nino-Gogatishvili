import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { CartOverlayItem } from "./";

import noItem from "../assets/noItem.png";
import { getTotalPrice } from "../utils/priceCalcs";
import { Link } from "react-router-dom";
import { toggleCartOverlay } from "../redux/commerce/actions";

class CartOverlay extends Component {
  render() {
    const { cart, currentCurrencyLabel, toggleCartOverlay } = this.props;
    const sortedCart = cart.sort((item1, item2) =>
      item1.name.localeCompare(item2.name)
    );
    const cartQuantity = cart
      .map((item) => item.quantity)
      .reduce((sum, val) => sum + val, 0);
    const { totalAmount, priceSymbol } = getTotalPrice(
      cart,
      currentCurrencyLabel
    );

    return (
      <Container>
        {cart.length > 0 ? (
          <div className="cartWrapper">
            <p>
              <strong>My Bag,</strong>
              {cartQuantity} {cartQuantity > 1 ? "items" : "item"}
            </p>
            <div className="cartItems">
              {sortedCart.map((item) => {
                return <CartOverlayItem key={item.id} item={item} />;
              })}
            </div>
            <div className="total">
              <p className="totalPrice">Total</p>
              <p className="value">
                {priceSymbol} {parseFloat(totalAmount).toFixed(2)}
              </p>
            </div>

            <div className="buttons">
              <Link to="/cart">
                <button onClick={() => toggleCartOverlay()} className="view">
                  view bag
                </button>
              </Link>
              <Link to="/cart">
                <button
                  onClick={() => toggleCartOverlay()}
                  className="checkOut"
                >
                  check out
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="emptyCart">
            <p className="emptyMessage">Cart is empty for now</p>
            <img src={noItem} alt="emptyCart" />
          </div>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.commerce.cart,
    currentCurrencyLabel: state.commerce.currentCurrencyLabel,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCartOverlay: () => dispatch(toggleCartOverlay()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(CartOverlay);

const Container = styled.div`
  width: 33rem;
  background: white;
  max-height: 70rem;
  padding: 3.2rem 1.6rem;
  box-shadow: 0px 4px 35px rgba(168, 172, 176, 0.19);
  position: absolute;
  top: 5.15rem;
  right: -2rem;
  overflow-y: auto;

  overflow-x: hidden;
  z-index: 10000;

  ::-webkit-scrollbar {
    transition: all 0.1s ease;
    width: 0.5rem;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(94, 206, 123, 0.7);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(94, 206, 123, 1);
  }

  .emptyCart {
    display: flex;
    flex-direction: column;
    align-items: center;
    .emptyMessage {
      text-align: center;
      text-transform: capitalize;
      color: #5ece7b;
    }
    img {
      width: 30rem;
      height: 20rem;
      object-fit: contain;
    }

    a {
      text-decoration: underline;
    }
  }

  .cartWrapper {
    width: 100%;
    height: 100%;

    p {
      margin-bottom: 2rem;
      font-size: 1.6rem;
    }
    .total {
      display: grid;
      grid-template-columns: 1fr 1fr;

      .totalPrice,
      .value {
        font-weight: 600;
      }

      .value {
        justify-self: end;
      }
    }

    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;

      button {
        width: 14rem;
        height: 4.3rem;
        border: none;
        outline: none;
        cursor: pointer;
        margin-top: 2rem;
        text-transform: uppercase;
        font-weight: 500;
      }
      .view {
        background: white;
        color: #1d1f22;
        border: 1px solid #1d1f22;
      }

      .checkOut {
        justify-self: end;
        color: white;
        background: #5ece7b;
      }
    }
  }
`;
