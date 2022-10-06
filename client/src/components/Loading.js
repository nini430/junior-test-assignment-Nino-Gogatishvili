import React, { Component } from "react";
import styled from "styled-components";

import Spinner from "../assets/Spinner.gif";

class Loading extends Component {
  render() {
    return (
      <Container>
        <img src={Spinner} alt="loadingSpinner" />
      </Container>
    );
  }
}

export default Loading;

const Container = styled.div`
  max-width: 1440px;
  height: calc(100vh - 8rem);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;
