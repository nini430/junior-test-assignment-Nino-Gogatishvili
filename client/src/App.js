import React, { Component } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Routes, Route } from "react-router-dom";

import { NavBar } from "./components";
import { Cart, CategoryPage, ProductDetailsPage } from "./pages";

export const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: (o) => (o._id ? `${o.__typename}:${o._id}` : null),
  }),
  uri: "http://localhost:4000/graphql",
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>
          <NavBar />
          <Routes>
            <Route path="/" element={<CategoryPage category="all" />} />
            <Route
              path="/clothes"
              element={<CategoryPage category="clothes" />}
            />
            <Route path="/tech" element={<CategoryPage category="tech" />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/product/:productId"
              element={<ProductDetailsPage />}
            />
          </Routes>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
