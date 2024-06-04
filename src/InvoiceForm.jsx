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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const handlePostalCodeChange = async (e) => {
    const postalCode = e.target.value;
    setInvoice({ ...invoice, postalCode });
    if (postalCode.length === 6) {
      await fetchAddress(postalCode);
    }
  };

  const fetchAddress = async (postalCode) => {
    const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(
      postalCode
    )}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        setInvoice((prevInvoice) => ({
          ...prevInvoice,
          address: result.ADDRESS,
        }));
      } else {
        setError("Address not found.");
      }
    } catch (error) {
      setError("Failed to fetch address.");
    }
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
            Company: "hyhu",
            "Postal Code": parseInt(invoice.postalCode),
            Address: invoice.address,
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
    <Box p={5} maxWidth="80vw" mx="auto">
      <NavBarComponent
        title="Create Invoice"
        buttonText="Add Items"
        buttonFunction={createInvoice}
        buttonColor="green"
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
          <FormControl id="postalCode">
            <FormLabel>Postal Code</FormLabel>
            <Input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={invoice.postalCode}
              onChange={handlePostalCodeChange}
            />
          </FormControl>
          <FormControl id="address">
            <FormLabel>Full Address</FormLabel>
            <Input
              type="text"
              name="address"
              placeholder="Address"
              value={invoice.address}
              readOnly
            />
          </FormControl>
        </HStack>
        <Flex mt="4" justify="center">
          <Button colorScheme="red" onClick={handleBackToHome}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

export default InvoiceForm;
