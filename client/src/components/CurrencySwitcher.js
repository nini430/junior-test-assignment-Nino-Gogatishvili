import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { setCurrencyUnit } from "../redux/commerce/actions";

export class CurrencySwitcher extends Component {
  render() {
    const { currencies, setCurrency } = this.props;
    return (
      <Container>
        <div className="currencies">
          {currencies.map((currency) => (
            <div
              onClick={() => setCurrency(currency.label)}
              key={currency.label}
              className="currency"
            >
              <div
                onClick={(e) => console.log(e.target)}
                className="currencyWrapper"
              >
                <span>{currency.symbol}</span>
                <span>{currency.label}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrency: (currencyUnit) => dispatch(setCurrencyUnit(currencyUnit)),
  };
};

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(
  CurrencySwitcher
);

const Container = styled.div`
  position: absolute;
  top: 3rem;
  left: -50%;
  width: 11.5rem;
  box-shadow: 0px 4px 35px rgba(168, 172, 176, 0.19);
  z-index: 900;
  cursor: pointer;

  .currencies {
    .currency {
      height: 4.5rem;
      transition: all 0.3s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background: #eee;
      }

      .currencyWrapper {
        display: grid;
        grid-template-columns: auto auto;
        grid-gap: 0 0.5rem;
      }
    }
  }
`;
