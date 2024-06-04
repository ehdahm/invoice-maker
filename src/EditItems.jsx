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
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import NavBarComponent from "./NavBarComponent";

const TOKEN =
  "pat9lbLhivluaYxIN.965db3fcbbbcf1e5958b1833c2c40004fe7711a6158ed9e80e8df58d3600d76d";
const INVOICE_URL = `https://api.airtable.com/v0/app44cnuWXzKrLX6k/Invoices`;
const ITEMS_URL = "https://api.airtable.com/v0/app44cnuWXzKrLX6k/items";

function EditItems() {
  const { invoiceId } = useParams();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch the invoice to get the linked item IDs
        const invoiceResponse = await fetch(`${INVOICE_URL}/${invoiceId}`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        const invoiceData = await invoiceResponse.json();
        const itemIds = invoiceData.fields.items;

        // Fetch the linked items
        const itemResponses = await Promise.all(
          itemIds.map((itemId) =>
            fetch(`${ITEMS_URL}/${itemId}`, {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            })
          )
        );
        const itemData = await Promise.all(
          itemResponses.map((res) => res.json())
        );

        setItems(
          itemData.map((record) => ({
            id: record.id,
            itemName: record.fields["Item Name"],
            description: record.fields.Description,
            quantity: record.fields.Quantity,
            price: parseFloat(record.fields.Price),
          }))
        );
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError(`Failed to fetch items: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [invoiceId]);

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleQuantityChange = (index, valueString) => {
    const newItems = [...items];
    newItems[index].quantity = parseInt(valueString, 10);
    setItems(newItems);
  };

  const saveItems = async () => {
    try {
      for (const item of items) {
        const response = await fetch(`${ITEMS_URL}/${item.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            fields: {
              "Item Name": item.itemName,
              Description: item.description,
              Quantity: item.quantity,
              Price: item.price,
            },
          }),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error.message);
        }
      }
      toast({
        title: `Successfully edited invoice details`,
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

  if (isLoading) {
    return (
      <Box p={5} maxWidth="80vw" mx="auto">
        <NavBarComponent
          title="Edit Items"
          buttonText="Save Changes"
          buttonFunction={saveItems}
          buttonColor="green"
        />
        <Flex align="top" justify="center" height="100vh" mt={10}>
          <Spinner size="xl" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box p={5} maxWidth="80vw" mx="auto">
      <NavBarComponent
        title="Edit Items"
        buttonText="Save Changes"
        buttonFunction={saveItems}
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
                <NumberInput
                  min={0}
                  value={item.quantity}
                  onChange={(valueString) =>
                    handleQuantityChange(index, valueString)
                  }
                >
                  <NumberInputField name="quantity" placeholder="Quantity" />
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
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

export default EditItems;
