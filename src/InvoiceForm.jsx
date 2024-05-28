import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  HStack,
  useToast,
} from "@chakra-ui/react";
import NavBarComponent from "./NavBarComponent";

const TOKEN =
  "pat9lbLhivluaYxIN.965db3fcbbbcf1e5958b1833c2c40004fe7711a6158ed9e80e8df58d3600d76d";
const BASE_URL =
  "https://api.airtable.com/v0/app44cnuWXzKrLX6k/tbld1XsR3wrUQddhP";

function InvoiceForm() {
  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    client: "",
    project: "",
  });
  const [error, setError] = useState("");
  const history = useHistory();
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const createInvoice = async () => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          fields: {
            "Invoice #": parseInt(invoice.invoiceNumber, 10),
            Client: invoice.client,
            Project: invoice.project,
          },
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error.message);
      }

      const newEntry = await response.json();
      toast({
        title: `Invoice created`,
        description: `Your invoice for ${invoice.client} has been created!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      history.push(`/items/${newEntry.id}`);
    } catch (error) {
      console.error(error);
      setError(`Failed to create new invoice: ${error.message}`);
    }
  };

  const handleBackToHome = () => {
    history.push("/");
  };

  return (
    <div>
      <NavBarComponent
        title="Create Invoice"
        buttonText="Save Invoice"
        buttonFunction={createInvoice}
      />
      <Box p="4">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <HStack spacing={4} width="100%">
          <FormControl id="invoiceNumber">
            <FormLabel>Invoice Number</FormLabel>
            <Input
              type="text"
              name="invoiceNumber"
              placeholder="Invoice Number"
              value={invoice.invoiceNumber}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="client">
            <FormLabel>Client</FormLabel>
            <Input
              type="text"
              name="client"
              placeholder="Client"
              value={invoice.client}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="project">
            <FormLabel>Project</FormLabel>
            <Input
              type="text"
              name="project"
              placeholder="Project"
              value={invoice.project}
              onChange={handleInputChange}
            />
          </FormControl>
        </HStack>
        <Flex mt="4" justify="center">
          <Button colorScheme="red" onClick={handleBackToHome}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </div>
  );
}

export default InvoiceForm;
