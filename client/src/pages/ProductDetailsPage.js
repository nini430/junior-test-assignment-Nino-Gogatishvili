import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { client } from "../App";
import { ProductInfo } from "../components";
import Loading from "../components/Loading";
import { QUERY_PRODUCT } from "../utils/gqlQueries";

class ProductDetailsPage extends Component {
  state = {
    productDetails: null,
    selectedImageIndex: null,
  };

  changeSelectedImage(index) {
    this.setState({
      selectedImageIndex: index,
    });
  }

  async getProductDetails() {
    const WatchQuery = client.watchQuery({
      query: QUERY_PRODUCT,
      variables: {
        productId: window.location.pathname.split("/")[2],
      },
    });

    this.obj = WatchQuery.subscribe(({ data }) => {
      this.setState({
        productDetails: data.product,
        selectedImageIndex: 0,
      });
    });
  }

  componentDidMount() {
    this.getProductDetails();
  }

  render() {
    const { productDetails, selectedImageIndex } = this.state;
    const { isCartOverlayOpen } = this.props;
    if (!productDetails) {
      return <Loading />;
    }
    return (
      <Container isCartOverlayOpen={isCartOverlayOpen}>
        <div className="detailWrapper">
          <div className="gallery">
            {productDetails?.gallery.map((photo, index) => (
              <img
                onClick={() => this.changeSelectedImage(index)}
                key={index}
                src={photo}
                alt="galleryPhoto"
              />
            ))}
          </div>
          <div className="mainImg">
            <img
              src={productDetails?.gallery[selectedImageIndex]}
              alt="mainImage"
            />
          </div>
          <div className="details">
            <ProductInfo productDetails={productDetails} />
          </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    isCartOverlayOpen: store.commerce.isCartOverlayOpen,
  };
};

export default connect(mapStateToProps)(ProductDetailsPage);

const Container = styled.div`
  background: ${(props) => props.isCartOverlayOpen && "rgba(57, 55, 72, 0.22)"};
  pointer-events: ${(props) => props.isCartOverlayOpen && "none"};
  min-height: 100vh;
  .detailWrapper {
    max-width: 1440px;
    padding: 4rem 0;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 4fr 2fr;

    .gallery {
      justify-self: end;
      z-index: ${(props) => props.isCartOverlayOpen && "-1"};
      img {
        display: block;
        width: 8rem;
        height: 8rem;
        margin: 1.5rem 0;
        object-fit: cover;
        cursor: pointer;
      }
    }

    .mainImg {
      z-index: ${(props) => props.isCartOverlayOpen && "-1"};
      img {
        width: 61rem;
        height: 51rem;
        object-fit: contain;
      }
    }
  }
`;
