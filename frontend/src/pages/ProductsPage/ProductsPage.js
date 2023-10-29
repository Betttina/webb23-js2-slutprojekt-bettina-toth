// Produkt-sidan. Hanterar visning av produkter.

import React from "react";

export const ProductsPage = ({
  setCart,
  products,
  setProducts,
  cart,
  searchQuery,
  getProductsById,
  setSearchQuery,
}) => {
  // lägger till produkter i varukorgen och uppdaterar lagersaldo
  const addProductToCart = (newProduct) => {
    setCart([...cart, newProduct]);
    const updatedProducts = [...products].map((p) => {
      if (p.id === newProduct.id) {
        return { ...p, lagersaldo: p.lagersaldo - 1 };
      } else {
        return p;
      }
    });
    setProducts(updatedProducts);
  };

  return (
    <div className="div-body">
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Sök här..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button className="search" onClick={() => getProductsById()}>
            Sök
          </button>
        </div>
      </div>

      <div className="sort-btns">
        <button
          className="sort"
          onClick={() => {
            const sortedProducts = [...products].sort(
              (a, b) => b.pris - a.pris
            );
            setProducts(sortedProducts);
          }}
        >
          Sortera efter pris (högsta)
        </button>
        <button
          className="sort"
          onClick={() => {
            const sortedProducts = [...products].sort(
              (a, b) => a.pris - b.pris
            );
            setProducts(sortedProducts);
          }}
        >
          Sortera efter pris (lägsta)
        </button>
      </div>

      <div className="product-section">
        <div className="title-div">
          <h1 className="page-title"> Produktsidan </h1>
        </div>

        <div className="products-grid">
          {products.length > 0 &&
            products.map((p, index) => (
              <div className="product-card" key={index}>
                <h2>Namn: {p.name}</h2>

                <p>
                  <img
                    src={`http://localhost:3000/img/${p.bild}`}
                    alt={p.name}
                  />
                </p>
                <p>Pris: {p.pris}</p>
                <p>Lagersaldo: {p.lagersaldo}</p>
                <p>ID: {p.id}</p>
                {p.lagersaldo > 0 ? (
                  <button
                    className="active-button"
                    onClick={() => addProductToCart(p)}
                  >
                    Lägg till i kundvagn
                  </button>
                ) : (
                  <p style={{ color: "red" }}>Produkten är slut</p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
