import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
} from "@chakra-ui/react";

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
      <Flex as="header" width="100%" p="4" bg="gray.100" align="center">
        <Box>
          <h1>Create Invoice</h1>
        </Box>
        <Spacer />
        <Box>
          <Button colorScheme="blue" onClick={handleBackToHome}>
            Home
          </Button>
        </Box>
      </Flex>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Box p="4">
        <FormControl id="invoiceNumber" mb="4">
          <FormLabel>Invoice Number</FormLabel>
          <Input
            type="text"
            name="invoiceNumber"
            placeholder="Invoice Number"
            value={invoice.invoiceNumber}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="client" mb="4">
          <FormLabel>Client</FormLabel>
          <Input
            type="text"
            name="client"
            placeholder="Client"
            value={invoice.client}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="project" mb="4">
          <FormLabel>Project</FormLabel>
          <Input
            type="text"
            name="project"
            placeholder="Project"
            value={invoice.project}
            onChange={handleInputChange}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={createInvoice}>
          Save
        </Button>
      </Box>
    </div>
  );
}

export default InvoiceForm;
