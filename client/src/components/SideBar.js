import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import WhiteCart from "../assets/WhiteCart.png";
import { getUniqueProductsList } from "../utils/AttributeSortFuncs";
import { getFilteredProducts } from "../redux/commerce/actions";

export class SideBar extends Component {
  state = {
    valueFromSelect: "",
  };

  selectAttributes = (name, value) => {
    const url = new URL(window.location);
    if (this.props.selectedAttributes[name] === value) {
      const attrRef = { ...this.props.selectedAttributes };
      delete attrRef[name];
      url.searchParams.delete(name);
      window.history.pushState({}, "", url);
      this.props.handleSelectedAttributes(attrRef);
    } else {
      const attrRef = { ...this.props.selectedAttributes };
      attrRef[name] = value;
      this.props.handleSelectedAttributes(attrRef);
      url.searchParams.set(name, value);
      window.history.pushState({}, "", url);
    }

    const uniqueProductList = getUniqueProductsList(this.props.products);

    this.props.getFilteredProducts(uniqueProductList);
  };

  render() {
    const { attributes, isSideBarOpen, closeSideBar, selectedAttributes } =
      this.props;

    return (
      <Container isSideBarOpen={isSideBarOpen}>
        <CloseBtn onClick={() => closeSideBar()}>X</CloseBtn>
        <div className="sideBarWrapper">
          <div className="logo">
            <img src={WhiteCart} alt="WhiteCart" />
          </div>
          <Hr />
          <div className="filters">
            {attributes.map(({ attrName, arr }) => {
              if (attrName === "Color") {
                return (
                  <div className="attribute" key={attrName}>
                    <h1>{attrName}</h1>
                    <div className="items">
                      {arr.map(({ value: color }) => (
                        <div
                          key={color}
                          className={`${
                            selectedAttributes[attrName] === color &&
                            "colorWrapper"
                          }`}
                        >
                          <div
                            onClick={() =>
                              this.selectAttributes(attrName, color)
                            }
                            className="colorValue"
                            style={{ backgroundColor: color }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else {
                if (
                  arr.find(
                    (item) => item.value === "Yes" || item.value === "No"
                  )
                ) {
                  return (
                    <div className="attribute" key={attrName}>
                      <h1>{attrName}</h1>
                      <div className="items">
                        {arr.map((item) => (
                          <div key={item.value}>
                            <label key={item.value} className="true-false">
                              {item.value}
                            </label>
                            <input
                              key={selectedAttributes[attrName] === item.value}
                              onClick={() =>
                                this.selectAttributes(attrName, item.value)
                              }
                              defaultChecked={
                                selectedAttributes[attrName] === item.value
                              }
                              type="checkbox"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={attrName} className="attribute">
                      <h1>{attrName}</h1>
                      <select
                        defaultValue={selectedAttributes[attrName]}
                        onChange={(e) =>
                          this.selectAttributes(attrName, e.target.value)
                        }
                        className="selectAttrs"
                      >
                        {arr.map(({ value }) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
              }
            })}
          </div>
        </div>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getFilteredProducts: (products) => dispatch(getFilteredProducts(products)),
  };
};

export default connect(null, mapDispatchToProps)(SideBar);

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 19rem;
  background: rgba(94, 206, 123, 0.7);
  padding: 2rem;
  color: white;
  transition: all 0.7s ease-in-out;
  transform: translateX(
    ${(props) => (props.isSideBarOpen ? "0rem" : "-19rem")}
  );

  .sideBarWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo {
    margin-bottom: 1rem;
  }

  .filters {
    margin-top: 4rem;

    .attribute {
      margin: 2rem 0;
      h1 {
        margin-bottom: 2rem;
      }
      .items {
        display: flex;
        gap: 1rem;

        .colorWrapper {
          padding: 0.1rem;
          border: 1px solid white;
        }
        .colorValue {
          width: 2rem;
          height: 2rem;
          cursor: pointer;
        }

        input {
          margin-left: 1rem;
          transform: scale(1.5);
          cursor: pointer;
          accent-color: #5ece7b;
        }
      }

      .selectAttrs {
        width: 100%;
        padding: 1rem 0;
        text-align: center;
        color: #5ece7b;
        border: none;
        outline: none;
        text-transform: uppercase;
      }
    }
  }
`;

const Hr = styled.hr`
  border: 1px solid white;
  width: 100%;
  position: absolute;
  top: 8rem;
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 1rem;
  top: 4rem;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  background: transparent;
  font-size: 3.2rem;
  font-weight: 600;
  cursor: pointer;
`;
