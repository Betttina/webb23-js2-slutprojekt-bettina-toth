const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path"); // path-paket till img
const cors = require("cors"); // korsningsbegäranden från origin domain (middleware)
const bodyParser = require("body-parser");

app.use(cors());

app.use(express.json());

// Middleware för att tolka JSON-requests
app.use(bodyParser.json());

// path to product img
app.use("/img", express.static(path.join(__dirname, "img")));

// read data from database. saving it as a js-object. (data-file path)

const productsData = JSON.parse(
  fs.readFileSync("./data/articles.json", "utf-8")
);

// get all data
app.get("/api/products", (req, res) => {
  res.json(productsData);
});

// get a specific product by id
app.get("/api/product/:id", (req, res) => {
  const productId = req.params.id;
  const product = productsData.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Produkten hittades inte" });
  }
});
app.get("/api/searchproducts/:id", (req, res) => {
  const productId = req.params.id;
  const product = productsData.filter((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Produkten hittades inte" });
  }
});
// update database
app.put("/api/products/:id", (req, res) => {
  const productsData = JSON.parse(
    fs.readFileSync("./data/articles.json", "utf-8")
  );

  const productId = req.params.id;
  const updatedProductData = req.body; // Ny produktdata att uppdatera
  const index = productsData.findIndex((p) => p.id === productId);

  if (index !== -1) {
    // update data
    productsData[index] = { ...productsData[index], ...updatedProductData };
    // save updated data to database
    fs.writeFileSync("articles.json", JSON.stringify(productsData, null, 2));
    res.json({ success: true, message: "Produkten uppdaterades" });
  } else {
    res.status(404).json({ message: "Produkten hittades inte" });
  }
});

// PUT-endpoint för att uppdatera lagersaldot för en produkt
app.put("/api/checkout", (req, res) => {
  try {
    // Få varukorgen från förfrågan
    const cart = req.body;

    // Loopa igenom produkterna i varukorgen och uppdatera lagersaldot
    for (const item of cart) {
      const product = productsData.find((p) => p.id === item.id);

      if (!product) {
        return res.status(404).json({ message: "Produkten hittades inte" });
      }

      if (product.lagersaldo === 0) {
        return res
          .status(400)
          .json({ message: "Otillräckligt lagersaldo för " + product.name });
      }

      // update lagersaldot
      product.lagersaldo -= 1;
    }

    // Spara den uppdaterade produktdata till databasen (products.json)
    fs.writeFileSync(
      "./data/articles.json",
      JSON.stringify(productsData, null, 2)
    );

    // Köpet lyckades, skicka ett bekräftelsemeddelande
    res.status(200).json({ message: "Köpet genomfördes framgångsrikt" });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Ett fel inträffade vid köpet" });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port ${port}`);
});
