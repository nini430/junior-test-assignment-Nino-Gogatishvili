import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";

import WhiteCart from "../assets/WhiteCart.png";
import { getPriceValueAndSymbol } from "../utils/priceCalcs";
import { setModalProduct } from "../redux/commerce/actions";

class Product extends Component {
  setModalProductHandler = (e) => {
    e.preventDefault();
    this.props.setModalProduct(this.props.product);
    window.scrollTo(0, 0);
  };
  render() {
    const {
      product: { id, gallery, brand, name, inStock },
      currentCurrencyLabel,
      isCartOverlayOpen,
      modalProduct,
    } = this.props;
    const { priceSymbol, priceValue } = getPriceValueAndSymbol(
      this.props.product,
      currentCurrencyLabel
    );

    return (
      <Link to={`/product/${id}`}>
        <Container
          isCartOverlayOpen={isCartOverlayOpen}
          modalProduct={modalProduct}
        >
          <div className="wrapper">
            {!inStock && <div className="outOfStock" />}
            <div className="mainImg">
              <img src={gallery[0]} alt="galleryPhoto" />
              {!inStock && <p>out of stock</p>}
            </div>
            <div className="info">
              <h3 className="title">
                {brand} {name}{" "}
              </h3>
              <h3 className="price">
                {priceSymbol} {priceValue}
              </h3>
            </div>
          </div>

          {inStock && (
            <div
              onClick={this.setModalProductHandler}
              className="cart"
              data-id="cart"
            >
              <img src={WhiteCart} alt="cart" />
            </div>
          )}
        </Container>
      </Link>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentCurrencyLabel: state.commerce.currentCurrencyLabel,
    isCartOverlayOpen: state.commerce.isCartOverlayOpen,
    modalProduct: state.commerce.modalProduct,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalProduct: (product) => dispatch(setModalProduct(product)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Raleway";
  width: 40rem;
  height: 50rem;
  position: relative;
  z-index: ${(props) => props.isCartOverlayOpen && "-1"};
  z-index: ${(props) => props.modalProduct && "-2"};
  cursor: pointer;

  .wrapper {
    padding: 1.6rem;
    width: 100%;
    height: 100%;
    .mainImg {
      z-index: ${(props) => props.isCartOverlayOpen && "-1"};
      z-index: ${(props) => props.modalProduct && "-2"};

      width: 100%;
      height: 80%;
      position: relative;

      img {
        z-index: ${(props) => props.isCartOverlayOpen && "-1"};
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #8d8f9a;
        text-transform: uppercase;
        font-size: 2.4rem;
      }
    }

    .info {
      margin: 2rem 0;

      .title {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        font-weight: 300;
        text-transform: capitalize;
      }

      .price {
        font-weight: bold;
      }
    }

    .outOfStock {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      opacity: 0.5;
      z-index: 300;
    }
  }

  .cart {
    opacity: 0;
  }

  &:hover {
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 4px 35px rgba(168, 172, 176, 0.19);
    transform: scale(1.02);

    .cart {
      opacity: 1;
      position: absolute;
      bottom: 8.4rem;
      right: 3rem;
      width: 5.2rem;
      height: 5.2rem;
      border-radius: 50%;
      background: #5ece7b;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        pointer-events: none;
      }
    }
  }
`;
