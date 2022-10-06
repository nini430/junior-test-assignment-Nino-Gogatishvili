import React, { Component, createRef } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { client } from "../App";
import { QUERY_CATEGORY } from "../utils/gqlQueries";

import { Product, Modal, SideBar } from "../components";
import {
  closeModalProduct,
  getAllProducts,
  getFilteredProducts,
} from "../redux/commerce/actions";
import {
  getUniqueAttributes,
  getUniqueProductsList,
} from "../utils/AttributeSortFuncs";

class CategoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: "",
      products: [],
      isSideBarOpen: true,
      selectedAttributes: {},
    };

    this.modalRef = createRef();
    this.modalWrapper = createRef();
  }

  handleSelectedAttributes = (attributes) => {
    this.setState({
      selectedAttributes: attributes,
    });
  };
  toggleSideBar = () => {
    this.setState({
      isSideBarOpen: !this.state.isSideBarOpen,
    });
  };

  handleClickOutsideOfModal = (e) => {
    if (
      this.modalRef.current &&
      !this.modalWrapper.current.contains(e.target) &&
      e.target.dataset.id !== "cart" &&
      e.target.dataset.id !== "navbar"
    ) {
      e.preventDefault();
      this.props.closeModalProduct();
    }
  };

  async getCategoryInfo() {
    const WatchQuery = client.watchQuery({
      query: QUERY_CATEGORY,
      variables: {
        category: {
          title: this.props.category,
        },
      },
    });

    this.obj = WatchQuery.subscribe(({ data }) => {
      this.setState({
        name: data.category.name,
        products: data.category.products,
      });
      this.props.getAllProducts(data.category.products);
    });
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutsideOfModal);
    this.getCategoryInfo();
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    this.setState({
      selectedAttributes: params,
    });

    const uniqueProductList = getUniqueProductsList(
      JSON.parse(localStorage.getItem("products"))
    );
    this.props.getFilteredProducts(uniqueProductList);
  }

  componentDidUpdate(prevProps) {
    const path =
      window.location.pathname === "/"
        ? "all"
        : window.location.pathname.split("/")[1];
    if (prevProps.category !== path) {
      this.getCategoryInfo();
      this.props.getFilteredProducts([]);
      this.setState({
        selectedAttributes: {},
      });
    }
  }

  render() {
    const { name, products, isSideBarOpen, selectedAttributes } = this.state;
    const { isCartOverlayOpen, modalProduct, filteredProducts } = this.props;
    const attributesArr = products.map((product) => product.attributes);
    const attributes = getUniqueAttributes(attributesArr);

    return (
      <>
        {!isSideBarOpen && (
          <div onClick={this.toggleSideBar} className="hamMenu">
            <Line />
            <Line />
            <Line />
          </div>
        )}

        <Container
          isCartOverlayOpen={isCartOverlayOpen}
          modalProduct={modalProduct}
        >
          <div className="categoryWrapper">
            <h1 className="categoryTitle">{name}</h1>
            <div className="products">
              {filteredProducts?.length > 0
                ? filteredProducts.map((product) => (
                    <Product key={product.id} product={product} />
                  ))
                : products.map((product) => (
                    <Product key={product.id} product={product} />
                  ))}
            </div>
          </div>
        </Container>
        <SideBar
          attributes={attributes}
          isSideBarOpen={isSideBarOpen}
          closeSideBar={this.toggleSideBar}
          products={products}
          handleSelectedAttributes={this.handleSelectedAttributes}
          selectedAttributes={selectedAttributes}
        />
        <div ref={this.modalWrapper} className="modal">
          {modalProduct && <Modal ref={this.modalRef} />}
        </div>
      </>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    isCartOverlayOpen: store.commerce.isCartOverlayOpen,
    modalProduct: store.commerce.modalProduct,
    filteredProducts: store.commerce.filteredProducts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModalProduct: () => dispatch(closeModalProduct()),
    getFilteredProducts: (products) => dispatch(getFilteredProducts(products)),
    getAllProducts: (products) => dispatch(getAllProducts(products)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage);

const Container = styled.div`
  pointer-events: ${(props) => props.isCartOverlayOpen && "none"};
  pointer-events: ${(props) => props.modalProduct && "none"};
  margin: 0;
  min-height: 100vh;
  background: ${(props) => props.isCartOverlayOpen && "rgba(57, 55, 72, 0.22)"};
  background: ${(props) => props.modalProduct && "rgba(57, 55, 72, 0.22)"};

  position: relative;

  .categoryWrapper {
    max-width: 1440px;
    margin: 0 auto;

    .categoryTitle {
      font-size: 4.2rem;
      text-transform: capitalize;
      font-weight: normal;
      padding: 4rem 0;
    }

    .products {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 4rem 1.5rem;
    }
  }
`;
const Line = styled.div`
  width: 5rem;
  height: 0.3rem;
  background: #5ece7b;
  margin: 1rem 0;
`;
