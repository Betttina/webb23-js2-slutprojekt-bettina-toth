import React, { useState, useEffect } from "react";

export const CartPage = ({ cart, setCart, setView, getProducts }) => {
  const [message, setMessage] = useState("");
  const [cartSummary, setCartSummary] = useState({
    items: {},
    totalSum: 0,
  });

  // Funktion för att tömma varukorgen och återgå till produkt-sidan.
  const emptyCart = () => {
    setCart([]);
    setView("products");
    getProducts();
  };

  // Funktion för att genomföra köp
  const purchase = () => {
    fetch(`http://localhost:3000/api/checkout`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nätverksfel");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // vid lyckad operation, visas meddelande, medans den återgår till produktsidan, sparas det
        // vad som har köpts, nollställer kundkorgen.
        setMessage("Tack för ditt köp!");
        setTimeout(() => {
          setView("products");
          setCart([]);
        }, 2000);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setMessage(error.toString());
      });
  };
  const calculateCartData = () => {
    const productCounts = {};
    let value = 0;

    // Iterate through the cart array
    cart.forEach((product) => {
      const productId = product.name;
      value = value + product.pris;
      if (productCounts[productId]) {
        productCounts[productId]++;
      } else {
        productCounts[productId] = 1;
      }
    });

    setCartSummary({ items: productCounts, totalSum: value });
  };

  // useEffect anropar funktionen för beräkning
  useEffect(() => {
    calculateCartData();
  }, []);
  return (
    <div>
      <h1 className="page-title">Varukorgen</h1>
      <h4>Summering</h4>
      <h4> {cart.length} produkter har lagts till i varukorgen. </h4>
      <table className="cart-tabell">
        <thead>
          <tr>
            <th scope="col"> Produktnamn </th>
            <th scope="col"> Pris </th>
            <th scope="col"> Antal </th>
            <th scope="col"> Total </th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 &&
            cart.map((c, index) => (
              <tr key={index} className="cart-container">
                <td>{c.name}</td>
                <td>{c.pris}</td>
                {/* <td>{c.pris}</td>
                <td>{c.id}</td>*/}
              </tr>
            ))}
          <tr className="total-price">
            <td className="light">Summa: {JSON.stringify(cartSummary)} kr</td>
            <td colSpan="3"></td>
          </tr>
        </tbody>
      </table>

      <button className="empty-btn" onClick={emptyCart}>
        Töm varukorg
      </button>
      <button className="buy-btn" onClick={purchase}>
        Genomför köp
      </button>
      {message.length > 0 && true && true && <p>{message}</p>}
    </div>
  );
};
