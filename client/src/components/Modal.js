import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { addToCart, closeModalProduct } from "../redux/commerce/actions";
import Attributes from "./Attributes";
import { getPriceValueAndSymbol } from "../utils/priceCalcs";

class Modal extends Component {
  state = {
    selectedAttributes: {},
    photoIndex: 0,
    message: "",
  };

  movePhotoSlider = (direction) => {
    if (direction === "left") {
      const photoIndex =
        this.state.photoIndex > 0
          ? this.state.photoIndex - 1
          : this.props.modalProduct.gallery.length - 1;
      this.setState({
        photoIndex,
      });
    }

    if (direction === "right") {
      const photoIndex =
        this.state.photoIndex < this.props.modalProduct.gallery.length - 1
          ? this.state.photoIndex + 1
          : 0;
      this.setState({
        photoIndex,
      });
    }
  };

  setSelectedAttributes = (attributes) => {
    this.setState({
      selectedAttributes: attributes,
    });
  };

  addToCart = () => {
    if (
      this.props.modalProduct.attributes.length !==
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
        id:
          Object.values(this.state.selectedAttributes).join("-") +
          this.props.modalProduct.name,
        name: this.props.modalProduct.name,
        brand: this.props.modalProduct.brand,
        selectedAttributes: this.state.selectedAttributes,
        attributes: this.props.modalProduct.attributes,
        prices: this.props.modalProduct.prices,
        gallery: this.props.modalProduct.gallery,
      });

      this.setState({
        selectedAttributes: {},
        message: "success",
      });

      setTimeout(() => {
        this.props.closeModalProduct();
        this.setState({
          message: "",
        });
      }, 200);
    }
  };

  render() {
    const {
      currentCurrencyLabel,
      closeModalProduct,
      modalProduct: { name, brand, gallery, attributes },
    } = this.props;
    const { selectedAttributes, photoIndex, message } = this.state;
    const { priceSymbol, priceValue } = getPriceValueAndSymbol(
      this.props.modalProduct,
      currentCurrencyLabel
    );

    return (
      <Container photoIndex={photoIndex}>
        <div className="closeBtn">
          <button onClick={closeModalProduct}>X</button>
        </div>

        <div className="modalWrapper">
          <h1>{name}</h1>
          <h2>{brand}</h2>

          {message && (
            <p className={message}>
              {message === "success"
                ? "Item is added!"
                : "Please select all Attributes!"}
            </p>
          )}
          <div className="gallery">
            {gallery.length > 1 && (
              <Arrow onClick={() => this.movePhotoSlider("left")}>{`<`}</Arrow>
            )}

            <div className="images">
              {gallery.map((image) => (
                <div key={image}>
                  <img src={image} alt="gallerySliderPhoto" />
                </div>
              ))}
            </div>

            {gallery.length > 1 && (
              <Arrow onClick={() => this.movePhotoSlider("right")}>{`>`}</Arrow>
            )}
          </div>
          <Attributes
            attributes={attributes}
            size="medium"
            toBeSelected
            selectedAttributes={selectedAttributes}
            setSelectedAttributes={this.setSelectedAttributes}
          />
          <div className="price">
            <p>price:</p>
            <p>
              {priceSymbol} {priceValue}
            </p>
          </div>
          <button onClick={() => this.addToCart()} className="addBtn">
            add to cart
          </button>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    modalProduct: store.commerce.modalProduct,
    currentCurrencyLabel: store.commerce.currentCurrencyLabel,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModalProduct: () => dispatch(closeModalProduct()),
    addToCart: (item) => dispatch(addToCart(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(Modal);

const Container = styled.div`
  max-width: 40rem;
  width: 40rem;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 900;
  background: white;
  box-shadow: 0px 4px 35px rgba(168, 172, 176, 0.19);
  padding: 1.6rem;

  .error,
  success {
    font-size: 1.4rem;
    color: red;
  }

  .success {
    color: green;
  }

  .closeBtn {
    position: absolute;
    right: 1rem;
    cursor: pointer;

    button {
      border: none;
      background: transparent;
      color: #5ece7b;
      font-size: 3rem;
      cursor: pointer;
    }
  }

  .modalWrapper {
    margin: 2rem 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    h1,
    h2 {
      font-weight: 300;
    }

    .gallery {
      display: flex;
      align-items: center;
      gap: 2rem;

      .images {
        display: flex;
        width: 20rem;
        overflow: hidden;

        img {
          transition: all 0.7s ease-in-out;
          width: 20rem;
          height: 100%;
          transform: translateX(${(props) => props.photoIndex * -20}rem);
        }
      }
    }
    .price {
      p {
        margin-bottom: 1rem;
        text-align: center;
      }
      font-weight: 600;
    }

    .addBtn {
      background: #5ece7b;
      color: white;
      text-transform: uppercase;
      border: none;
      outline: none;
      width: 100%;
      padding: 1rem 0;
      cursor: pointer;
    }
  }
`;

const Arrow = styled.div`
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #eee;
  color: white;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background: #5ece7b;
  }
`;
