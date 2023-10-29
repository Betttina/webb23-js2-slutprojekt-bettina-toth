import React from "react";
import logo from "./img/logo-trans.png";

export const Navbar = ({
  setView,
  view,
  cart,

  getProducts,
}) => {
  return (
    <div className="navbar-section">
      <div className="nav-body">
        <img src={logo} className="Logo" alt="logo" />

        <div className="Buttons">
          <button
            className="products-btn"
            onClick={() => {
              setView("products");
              getProducts();
            }}
          >
            Produkter
          </button>
          <button className="cart-btn" onClick={() => setView("cart")}>
            Kundvagn
            <h6>Antal produkter i varukorgen: {cart?.length}</h6>
          </button>
        </div>
      </div>
    </div>
  );
};
