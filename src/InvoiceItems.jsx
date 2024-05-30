import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import NavBarComponent from "./NavBarComponent";

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
  const toast = useToast();

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

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
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
      toast({
        title: `New invoice created`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      history.push("/");
    } catch (error) {
      console.error(error);
      setError(`Failed to save items: ${error.message}`);
    }
  };

  return (
    <div>
      <NavBarComponent
        title="Add Items"
        buttonText="Save Invoice"
        buttonFunction={saveInvoice}
        buttonColor="green"
      />
      <Box p="4">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <VStack spacing={4}>
          {items.map((item, index) => (
            <HStack key={index} spacing={4} width="100%">
              <FormControl id={`itemName-${index}`}>
                <FormLabel>Item Name</FormLabel>
                <Input
                  type="text"
                  name="itemName"
                  placeholder="Item Name"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </FormControl>

              <FormControl id={`description-${index}`}>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </FormControl>

              <FormControl id={`quantity-${index}`}>
                <FormLabel>Quantity</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl id={`price-${index}`}>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </FormControl>
              <FormControl pt="8" id="remove-item">
                <Button onClick={() => removeItem(index)}>Remove Item</Button>
              </FormControl>
            </HStack>
          ))}
        </VStack>
        <Flex mt="4" justify="center">
          <Button colorScheme="blue" onClick={addItem} mr="4">
            Add Item
          </Button>
        </Flex>
      </Box>
    </div>
  );
}

export default InvoiceItems;
