import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import CartItem from "../components/CartItem";
import EmptyCartImg from "../assets/noItem.png";

import { toggleCartOverlay } from "../redux/commerce/actions";
import { getTotalPrice } from "../utils/priceCalcs";

export class Cart extends Component {
  componentDidMount() {
    if (this.props.isCartOverlayOpen) {
      this.props.toggleCartOverlay();
    }
  }
  render() {
    const { cart, isCartOverlayOpen, currentCurrencyLabel } = this.props;
    const cartQuantity = cart
      .map((item) => item.quantity)
      .reduce((sum, val) => sum + val, 0);
    const { totalAmount, priceSymbol } = getTotalPrice(
      cart,
      currentCurrencyLabel
    );
    const taxPrice = parseFloat(totalAmount * 0.21).toFixed(2);
    const totalCost = +totalAmount + +taxPrice;
    if (cart.length > 0) {
      return (
        <Container isCartOverlayOpen={isCartOverlayOpen}>
          <div className="cartWrapper">
            <h1 className="cartTitle">cart</h1>
            <div className="items">
              <Hr />
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="costs">
              <PriceAttribute>
                <p>Tax 21%:</p>
                <p className="bold">
                  {priceSymbol} {taxPrice}
                </p>
              </PriceAttribute>
              <PriceAttribute>
                <p>Quantity:</p>
                <p className="bold">{cartQuantity}</p>
              </PriceAttribute>
              <PriceAttribute>
                <p>Total:</p>
                <p className="bold">
                  {priceSymbol} {parseFloat(totalCost).toFixed(2)}
                </p>
              </PriceAttribute>

              <button className="orderBtn">order</button>
            </div>
          </div>
        </Container>
      );
    } else {
      return (
        <EmptyCart>
          <h1>Cart is empty for now</h1>
          <Hr />
          <img src={EmptyCartImg} alt="EmptyCart" />
        </EmptyCart>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.commerce.cart,
    isCartOverlayOpen: state.commerce.isCartOverlayOpen,
    currentCurrencyLabel: state.commerce.currentCurrencyLabel,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCartOverlay: () => dispatch(toggleCartOverlay()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

const Container = styled.div`
  background: ${(props) => props.isCartOverlayOpen && "#EEE"};
  pointer-events: ${(props) => props.isCartOverlayOpen && "none"};
  z-index: ${(props) => props.isCartOverlayOpen && "100"};
  min-height: 100vh;
  .cartWrapper {
    max-width: 1440px;
    margin: 0 auto;

    .cartTitle {
      padding: 4rem 0;
      font-size: 3.2rem;
      text-transform: uppercase;
    }

    .costs {
      margin: 2rem 0;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      font-size: 2.4rem;
      width: 25rem;

      .orderBtn {
        background: #5ece7b;
        border: none;
        color: white;
        text-transform: uppercase;
        height: 4.3rem;
        cursor: pointer;
      }
    }
  }
`;

const Hr = styled.div`
  max-width: 1440px;
  width: 1440px;
  margin: 0 auto;
  height: 0.1rem;
  background: #e5e5e5;
`;

const PriceAttribute = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 2.4rem;

  .bold {
    font-weight: 600;
  }
`;

const EmptyCart = styled.div`
  max-width: 1440px;
  width: 1440px;
  margin: 3rem auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;

  h1 {
    text-align: center;
    color: #5ece7b;
    font-size: 4rem;
    margin-bottom: 2rem;
  }

  img {
    margin-top: 1rem;
    width: 60rem;
    height: 50rem;
  }
`;
