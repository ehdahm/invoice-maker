import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  FormLabel,
  FormControl,
  Spinner,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";
import NavBarComponent from "./NavBarComponent";

const TOKEN =
  "pat9lbLhivluaYxIN.965db3fcbbbcf1e5958b1833c2c40004fe7711a6158ed9e80e8df58d3600d76d";
const BASE_URL = `https://api.airtable.com/v0/app44cnuWXzKrLX6k/Invoices`;

function EditInvoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const response = await fetch(`${BASE_URL}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        const jsonData = await response.json();
        setInvoice({
          id: jsonData.id,
          invoiceNumber: jsonData.fields["Invoice #"],
          client: jsonData.fields["Client"],
          project: jsonData.fields["Project"],
          amount: jsonData.fields["Amount Rollup (from items)"],
          created: jsonData.fields["Created"],
          postalCode: jsonData.fields["Postal Code"],
          address: jsonData.fields["Address"],
          items: jsonData.fields["items"], // Capture linked item IDs
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch invoice", error);
        setIsLoading(false); // Ensure loading state is turned off on error
      }
    }
    fetchInvoice();
  }, [id]);

  function goBack() {
    history.goBack();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prevInvoice) => ({ ...prevInvoice, [name]: value }));
  };

  const handlePostalCodeChange = async (e) => {
    const postalCode = e.target.value;
    setInvoice((prevInvoice) => ({ ...prevInvoice, postalCode }));
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
      if (!response.ok) {
        throw new Error("Failed to fetch address data");
      }
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

  const saveInvoice = async () => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          fields: {
            "Invoice #": parseInt(invoice.invoiceNumber, 10),
            Client: invoice.client,
            Project: invoice.project,
            "Postal Code": parseInt(invoice.postalCode),
            Address: invoice.address,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save invoice");
      }
      history.push(`/edit-items/${id}`);
      toast({
        title: "Invoice saved.",
        description: "The invoice details have been saved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to save invoice", error);
      setError("Failed to save invoice.");
      toast({
        title: "Error",
        description: "Failed to save invoice.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={5} maxWidth="80vw" mx="auto">
      <NavBarComponent
        title="Edit Invoice"
        buttonFunction={saveInvoice}
        buttonText="Edit Items"
      />
      <Box p={4}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <FormControl>
          <FormLabel>Invoice Number</FormLabel>
          <NumberInput
            value={invoice.invoiceNumber}
            onChange={(valueString) =>
              setInvoice({ ...invoice, invoiceNumber: valueString })
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Client</FormLabel>
          <Input
            value={invoice.client}
            name="client"
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Project</FormLabel>
          <Input
            value={invoice.project}
            name="project"
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Postal Code</FormLabel>
          <Input
            value={invoice.postalCode}
            name="postalCode"
            onChange={handlePostalCodeChange}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Address</FormLabel>
          <Input value={invoice.address} name="address" readOnly />
        </FormControl>
        <Flex justify="center">
          <Button mt={4} colorScheme="red" onClick={goBack}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

export default EditInvoice;
