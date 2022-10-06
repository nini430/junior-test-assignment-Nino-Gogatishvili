import React, { Component, createRef } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";

import { client } from "../App";
import { QUERY_CATEGORIES_NAME_AND_CURRENCY } from "../utils/gqlQueries";

import logo from "../assets/logo.png";
import Arrow from "../assets/Arrow.png";
import EmptyCart from "../assets/EmptyCart.png";
import { CartOverlay, CurrencySwitcher } from "./";
import { toggleCartOverlay } from "../redux/commerce/actions";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryLinks: [],
      currencies: [],
      isCurrencySelected: false,
    };
    this.cartRef = createRef();
    this.currencyRef = createRef();
    this.layoutRef = createRef();
    this.cartOverlayRef = createRef();
  }

  toggleShowCurrency = () => {
    this.setState({
      isCurrencySelected: !this.state.isCurrencySelected,
    });
  };

  async getCategoryNames() {
    const WatchQuery = client.watchQuery({
      query: QUERY_CATEGORIES_NAME_AND_CURRENCY,
    });
    this.obj = WatchQuery.subscribe(({ data }) => {
      this.setState({
        categoryLinks: data.categories,
        currencies: data.currencies,
      });
    });
  }

  handleClickOutsideCurrency = (event) => {
    if (
      this.layoutRef.current &&
      !this.currencyRef.current.contains(event.target)
    ) {
      this.setState({
        isCurrencySelected: false,
      });
    }
  };

  handleClickOutsideCartOverlay = (event) => {
    event.preventDefault();
    if (
      this.cartOverlayRef.current &&
      !this.cartRef.current.contains(event.target) &&
      +event.target.dataset.ref !== 1
    ) {
      this.props.toggleCartOverlay();
    }
  };

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutsideCurrency);
    document.addEventListener("click", this.handleClickOutsideCartOverlay);
    this.getCategoryNames();
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
    document.removeEventListener("click", this.handleClickOutsideCartOverlay);
    this.obj.unsubscribe();
  }

  render() {
    const { categoryLinks, currencies, isCurrencySelected } = this.state;
    const { currentCurrencyLabel, cart, isCartOverlayOpen, toggleCartOverlay } =
      this.props;
    const cartQuantity = cart
      .map((item) => item.quantity)
      .reduce((sum, val) => sum + val, 0);
    const currentCurrencySymbol = currencies?.find(
      (currency) => currency.label === currentCurrencyLabel
    )?.symbol;
    return (
      <Container data-id="navbar">
        <div className="links">
          {categoryLinks.length > 0 &&
            categoryLinks.map(({ name }) => {
              return (
                <NavLink end key={name} to={name === "all" ? "/" : `/${name}`}>
                  {name}
                </NavLink>
              );
            })}
        </div>
        <div className="logo">
          <img src={logo} alt="EcommerceLogo" />
        </div>
        <div className="wrapper">
          <div
            ref={this.currencyRef}
            onClick={this.toggleShowCurrency}
            className="currency"
          >
            <span className="unit">{currentCurrencySymbol}</span>
            <img src={Arrow} alt="bottomArrow" />
            {isCurrencySelected && (
              <CurrencySwitcher ref={this.layoutRef} currencies={currencies} />
            )}
          </div>
          <div ref={this.cartRef} className="cart">
            <div onClick={() => toggleCartOverlay()}>
              <img src={EmptyCart} alt="cartImg" />
              {cart.length > 0 && (
                <div className="quantity">{cartQuantity}</div>
              )}
            </div>

            {isCartOverlayOpen && <CartOverlay ref={this.cartOverlayRef} />}
          </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    currentCurrencyLabel: store.commerce.currentCurrencyLabel,
    cart: store.commerce.cart,
    isCartOverlayOpen: store.commerce.isCartOverlayOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCartOverlay: () => dispatch(toggleCartOverlay()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

const Container = styled.div`
  max-width: 144rem;
  margin: 0 auto;
  height: 8rem;
  position: relative;
  top: 0;
  z-index: 900;

  .links {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    a {
      text-transform: uppercase;
      margin-right: 1.5rem;
      padding: 0 1rem;

      :last-child {
        margin-right: 0;
      }
    }
    .active {
      color: #5ece7b;
      border-bottom: 1px solid #5ece7b;
      padding-bottom: 3.2rem;
    }
  }

  .logo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .wrapper {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 1rem;

    .currency {
      font-size: 1.8rem;
      cursor: pointer;
      .unit {
        margin-right: 0.2rem;
      }
    }
    .cart {
      cursor: pointer;
      position: relative;

      .quantity {
        position: absolute;
        width: 1.8rem;
        height: 1.8rem;
        background: black;
        border-radius: 50%;
        right: -35%;
        top: -25%;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
      }
    }
  }
`;
