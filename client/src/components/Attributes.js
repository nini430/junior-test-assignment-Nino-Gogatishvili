import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

export class Attributes extends Component {
  selectAttributes = (name, value) => {
    if (this.props.selectedAttributes[name] === value) {
      const attrRef = { ...this.props.selectedAttributes };
      delete attrRef[name];
      this.props.setSelectedAttributes(attrRef);
    } else {
      const attrRef = { ...this.props.selectedAttributes };
      attrRef[name] = value;
      this.props.setSelectedAttributes(attrRef);
    }
  };
  render() {
    const {
      attributes,
      size,
      selected,
      toBeSelected,
      selectedAttributes,
      uppercase,
      selectedFromCart,
    } = this.props;

    return (
      <Container size={size} toBeSelected={toBeSelected}>
        <div className="attributes">
          {attributes.map(({ name, items, id }) => {
            if (name !== "Color") {
              return (
                <div className="attribute" key={id}>
                  <h2 className={`${uppercase && "uppercase"}`}>{name}:</h2>
                  <div className="items">
                    {items.map(({ value, id }) => (
                      <div
                        className={`attrValue ${
                          toBeSelected && selectedAttributes[name] === value
                            ? "attr-active"
                            : ""
                        } ${
                          selected && selectedFromCart.includes(value)
                            ? "attr-active"
                            : ""
                        }`}
                        onClick={
                          toBeSelected
                            ? () => this.selectAttributes(name, value)
                            : undefined
                        }
                        key={id}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else {
              return (
                <div className="attribute" key={id}>
                  <h2 className={`${uppercase && "uppercase"}`}>{name}:</h2>
                  <div className="items">
                    {items.map(({ id, value }) => {
                      return (
                        <div
                          className={`${
                            toBeSelected &&
                            selectedAttributes[name] === value &&
                            "color-active"
                          } ${
                            selected && selectedFromCart.includes(value)
                              ? "color-active"
                              : ""
                          }`}
                          key={id}
                        >
                          <div
                            onClick={
                              toBeSelected
                                ? () => this.selectAttributes(name, value)
                                : undefined
                            }
                            className="colorValue"
                            style={{ backgroundColor: value }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.commerce.cart,
  };
};

export default connect(mapStateToProps, null)(Attributes);

const Container = styled.div`
  margin: 1rem 0;
  .attributes {
    .attribute {
      margin: 1.5rem 0;
      .uppercase {
        font-weight: 600;
        text-transform: uppercase;
        font-family: "Roboto Condensed";
        font-size: 1.8rem;
      }
      h2 {
        margin-bottom: 1rem;
      }
      .items {
        display: flex;
        gap: 1rem;

        .attrValue {
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: ${(props) =>
            props.size === "large"
              ? "6.3rem"
              : props.size === "medium"
              ? "3rem"
              : "2.4rem"};
          height: ${(props) =>
            props.size === "large"
              ? "4.5rem"
              : props.size === "medium"
              ? "3rem"
              : "2.4rem"};
          border: 1px solid #1d1f22;
          padding: 0.2rem;
          cursor: ${(props) => props.toBeSelected && "pointer"};
        }
        .attr-active {
          background: black;
          color: white;
        }

        .color-active {
          width: 2.4rem;
          border: 1px solid #5ece7b;
          padding: 0.1rem;
        }

        .colorValue {
          width: 2rem;
          height: 2rem;
          cursor: ${(props) => props.toBeSelected && "pointer"};
        }
      }
    }
  }
`;
