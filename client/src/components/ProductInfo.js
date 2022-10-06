import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { addToCart } from "../redux/commerce/actions";
import { getPriceValueAndSymbol } from "../utils/priceCalcs";
import Attributes from "./Attributes";

class ProductInfo extends Component {
  state = {
    selectedAttributes: {},
    message: "",
  };

  setSelectedAttributes = (attributes) => {
    this.setState({
      selectedAttributes: attributes,
    });
  };

  addToCart = () => {
    if (
      this.props.productDetails.attributes.length !==
      Object.values(this.state.selectedAttributes).length
    ) {
      this.setState({
        message: "error",
      });
      setTimeout(() => {
        this.setState({
          message: "",
        });
      }, 2000);
    } else {
      this.props.addToCart({
        name: this.props.productDetails.name,
        brand: this.props.productDetails.brand,
        id:
          Object.values(this.state.selectedAttributes).join("-") +
          this.props.productDetails.name,
        selectedAttributes: this.state.selectedAttributes,
        attributes: this.props.productDetails.attributes,
        gallery: this.props.productDetails.gallery,
        prices: this.props.productDetails.prices,
      });
      this.setState({
        message: "success",
        selectedAttributes: {},
      });

      setTimeout(() => {
        this.setState({
          message: "",
        });
      }, 2000);
    }
  };
  render() {
    const { selectedAttributes, message } = this.state;
    const { productDetails, currentCurrencyLabel } = this.props;
    const { priceSymbol, priceValue } = getPriceValueAndSymbol(
      productDetails,
      currentCurrencyLabel
    );
    return (
      <Container disabled={!productDetails.inStock}>
        <div className="basic">
          <h1 className="brand">{productDetails?.brand}</h1>
          <h2 className="name">{productDetails?.name}</h2>
          <p className="outOfStock">
            {!productDetails.inStock && "(Out Of Stock)"}
          </p>
        </div>
        {message && (
          <p className={message}>
            {message === "success"
              ? "Item Added to Cart!"
              : "Please select all the attributes!"}
          </p>
        )}
        <Attributes
          attributes={productDetails.attributes}
          size="large"
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={this.setSelectedAttributes}
          toBeSelected
          uppercase
        />
        <div className="price">
          <h3>price:</h3>
          <h3 className="value">
            {priceValue} {priceSymbol}
          </h3>
        </div>

        <button
          onClick={this.addToCart}
          disabled={!productDetails.inStock}
          className="addBtn"
        >
          add to cart
        </button>
        <p
          className="description"
          dangerouslySetInnerHTML={{ __html: productDetails?.description }}
        ></p>
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
    addToCart: (item) => dispatch(addToCart(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductInfo);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .error,
  .success {
    font-size: 1.2rem;
    color: red;
  }
  .success {
    color: green;
  }

  h3 {
    font-weight: 700;
    text-transform: uppercase;
    font-family: "Roboto Condensed";
    margin-bottom: 1rem;
  }

  .basic {
    margin: 2rem 0;
    h1 {
      font-size: 3rem;
    }
    .brand {
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .name {
      font-weight: 400;
    }
    .outOfStock {
      margin: 1rem 0;
    }
  }

  .price {
    .value {
      font-weight: 700;
      font-family: "Raleway";
      font-size: 2.4rem;
    }
  }

  .addBtn {
    width: 30rem;
    height: 5rem;
    color: #fff;
    text-transform: uppercase;
    border: none;
    background: ${(props) => (props.disabled ? "#EEE" : "#5ECE7B")};
    cursor: ${(props) => (props.disabled ? "auto" : "pointer")};
  }

  .description {
    width: 30rem;
    color: #1d1f22;
  }
`;
