import React, { useState, useEffect } from "react";
import { ProductsPage } from "./pages/ProductsPage/ProductsPage";
import { CartPage } from "./pages/CartPage/CartPage";
import { Navbar } from "./Navbar";
import "./css/App.css";

export default function App() {
  const [view, setView] = useState("products"); // hantera vilken vy som ska visas (products/card). ProductsPage och CartPage = props beroende på vilken vy som är aktiv
  const [cart, setCart] = useState([]); // lagra produkter i varukorgen
  const [products, setProducts] = useState([]); // lagra produktdata
  const [searchQuery, setSearchQuery] = useState(""); // hantera sökning efter produkter, setSearchQuery = hantera users sökning

  const getProducts = () => {
    fetch("http://localhost:3000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nätverksfel");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  // funktion för att hämta produktdata
  const getProductsById = () => {
    fetch(`http://localhost:3000/api/searchproducts/${searchQuery}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nätverksfel");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  //useEffect anropas getProducts när komponenten mountas
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <Navbar
          setView={setView}
          view={view}
          cart={cart}
          getProducts={getProducts}
        />
      </div>

      {view === "products" && (
        <ProductsPage
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          products={products}
          setCart={setCart}
          cart={cart}
          setProducts={setProducts}
          getProductsById={getProductsById}
        />
      )}
      {view === "cart" && (
        <CartPage
          cart={cart}
          setCart={setCart}
          setView={setView}
          getProducts={getProducts}
        />
      )}
    </div>
  );
}
