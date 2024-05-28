import { Box, Button, Flex, FormLabel, Input, Spacer } from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

const TOKEN =
  "pat9lbLhivluaYxIN.965db3fcbbbcf1e5958b1833c2c40004fe7711a6158ed9e80e8df58d3600d76d";
const BASE_URL = "https://api.airtable.com/v0/app44cnuWXzKrLX6k/items";

function InvoiceItems() {
  const { invoiceId } = useParams();
  const [items, setItems] = useState([
    { itemName: "", description: "", quantity: 1, price: 0 },
  ]);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { itemName: "", description: "", quantity: 1, price: 0 },
    ]);
  };

  const saveInvoice = async () => {
    try {
      for (const item of items) {
        const response = await fetch(BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            fields: {
              "Item Name": item.itemName,
              Description: item.description,
              Quantity: parseInt(item.quantity, 10),
              Price: parseFloat(item.price),
              Invoice: [invoiceId], // Link to the created invoice
            },
          }),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error.message);
        }
      }

      history.push("/");
    } catch (error) {
      console.error(error);
      setError(`Failed to save items: ${error.message}`);
    }
  };
  function handleGoBack() {
    return history.goBack();
  }
  return (
    <div>
      <Flex>
        <Box>
          <h1>Add items</h1>
        </Box>
        <Spacer />
        <Button colorScheme="blue" onClick={handleGoBack}>
          Back
        </Button>
      </Flex>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, e)}
            />
          </div>
        ))}
        <button onClick={addItem}>Add Item</button>
        <button onClick={saveInvoice}>Save Invoice</button>
      </div>
    </div>
  );
}

export default InvoiceItems;
