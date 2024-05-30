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
} from "@chakra-ui/react";
import NavBarComponent from "./NavBarComponent";

const TOKEN =
  "pat9lbLhivluaYxIN.965db3fcbbbcf1e5958b1833c2c40004fe7711a6158ed9e80e8df58d3600d76d";
const BASE_URL = `https://api.airtable.com/v0/app44cnuWXzKrLX6k/Invoices`;

function EditInvoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

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

  const saveInvoice = async () => {
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
        },
      }),
    });

    if (response.ok) {
      history.push(`/edit-items/${id}`); // Navigate to edit-items page with invoice ID
    } else {
      console.error("Failed to save invoice");
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
    <div>
      <NavBarComponent
        title="Edit Invoice"
        buttonFunction={saveInvoice}
        buttonText="Edit Items"
      />
      <Box p={4}>
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
            onChange={(e) => setInvoice({ ...invoice, client: e.target.value })}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Project</FormLabel>
          <Input
            value={invoice.project}
            onChange={(e) =>
              setInvoice({ ...invoice, project: e.target.value })
            }
          />
        </FormControl>
        <Flex justify="center">
          <Button mt={4} colorScheme="red" onClick={goBack}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </div>
  );
}

export default EditInvoice;
