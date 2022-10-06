import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { getPriceValueAndSymbol } from "../utils/priceCalcs";
import Attributes from "./Attributes";
import {
  decrementItemQuantity,
  incrementItemQuantity,
} from "../redux/commerce/actions";

export class CartItem extends Component {
  state = {
    slideIndex: 0,
  };

  moveSlider = (direction) => {
    if (direction === "left") {
      const slideIndex =
        this.state.slideIndex > 0
          ? this.state.slideIndex - 1
          : this.props.item.gallery.length - 1;
      this.setState({
        slideIndex,
      });
    }
    if (direction === "right") {
      const slideIndex =
        this.state.slideIndex < this.props.item.gallery.length - 1
          ? this.state.slideIndex + 1
          : 0;
      this.setState({
        slideIndex,
      });
    }
  };
  render() {
    const { slideIndex } = this.state;
    const {
      item,
      currentCurrencyLabel,
      isCartOverlayOpen,
      incrementItemQuantity,
      decrementItemQuantity,
    } = this.props;
    const { priceSymbol, priceValue } = getPriceValueAndSymbol(
      item,
      currentCurrencyLabel
    );
    const selectedAttributes = Object.values(item.selectedAttributes);
    return (
      <>
        <Container
          slideIndex={slideIndex}
          isCartOverlayOpen={isCartOverlayOpen}
        >
          <div className="itemInfo">
            <h1>{item.brand}</h1>
            <h2>{item.name}</h2>
            <p>
              {priceSymbol} {priceValue}
            </p>
            <Attributes
              selected
              attributes={item.attributes}
              selectedFromCart={selectedAttributes}
              size="large"
              uppercase
            />
          </div>
          <div className="image">
            <div className="operationBtns">
              <OperationButton onClick={() => incrementItemQuantity(item.id)}>
                +
              </OperationButton>
              <OperationButton>{item.quantity}</OperationButton>
              <OperationButton onClick={() => decrementItemQuantity(item.id)}>
                -
              </OperationButton>
            </div>

            <div className="imgWrap">
              {item.gallery?.length > 1 && (
                <>
                  <Arrow
                    onClick={() => this.moveSlider("left")}
                    left
                  >{`<`}</Arrow>
                  <Arrow
                    onClick={() => this.moveSlider("right")}
                    right
                  >{`>`}</Arrow>
                </>
              )}

              <div className="images">
                {item.gallery?.map((photo) => (
                  <div key={photo}>
                    <img src={photo} alt="galleryPhoto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
        <Hr />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentCurrencyLabel: state.commerce.currentCurrencyLabel,
    isCartOverlayOpen: state.commerce.isCartOverlayOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    incrementItemQuantity: (id) => dispatch(incrementItemQuantity({ id })),
    decrementItemQuantity: (id) => dispatch(decrementItemQuantity({ id })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);

const Container = styled.div`

    display:grid;
    grid-template-columns:1fr 1fr;
    margin:4rem 0;

    .itemInfo {
        display:flex;
        flex-direction:column;
       gap:1rem;

        h1 {
            font-weight:600;
        }

        h2 {
            font-weight:300;
        }

        p {
            font-weight:700;
            font-size:2.4rem;
        }
    }

    .image {
    justify-self:end;
       display:flex;
       align-items:center;
       gap:4rem;

       .operationBtns {
        height:100%;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
       }


       .imgWrap {
        z-index:${(props) => props.isCartOverlayOpen && "-1"};

        position:relative;
        .images {
            display:flex;
            width:20rem;
            height:30rem;
            overflow:hidden;
            
    
            img {
                width:20rem;
                height:30rem;
                object-fit:contain;
                transition:all 0.7s ease-in-out;
                transform:translateX(${(props) => props.slideIndex * -20}rem);
                

                
            }
           }
       }

       

`;

const OperationButton = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  border: 1px solid #1d1f22;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const Arrow = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.4rem;
  height: 2.4rem;
  background: rgba(0, 0, 0, 0.73);
  color: white;
  right: ${(props) => (props.left ? "4rem" : "1rem")};
  bottom: 1rem;
  cursor: pointer;
  z-index: 900;
`;
const Hr = styled.div`
  max-width: 1440px;
  width: 1440px;
  margin: 0 auto;
  height: 0.1rem;
  background: #e5e5e5;
`;
