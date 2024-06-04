import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

const TOKEN =
  "pat9lbLhivluaYxIN.965db3fcbbbcf1e5958b1833c2c40004fe7711a6158ed9e80e8df58d3600d76d";
const INVOICE_URL = `https://api.airtable.com/v0/app44cnuWXzKrLX6k/Invoices`;
const ITEMS_URL = "https://api.airtable.com/v0/app44cnuWXzKrLX6k/items";

function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function fetchInvoice() {
      const response = await fetch(`${INVOICE_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      const invoiceData = await response.json();
      setInvoice(invoiceData);

      const itemIds = invoiceData.fields.items;
      const itemResponses = await Promise.all(
        itemIds.map((itemId) =>
          fetch(`${ITEMS_URL}/${itemId}`, {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          })
        )
      );
      const itemsData = await Promise.all(
        itemResponses.map((res) => res.json())
      );
      setItems(itemsData);
    }
    fetchInvoice();
  }, [id]);

  if (!invoice)
    return (
      <Flex align="top" justify="center" height="100vh" mt={20}>
        <Spinner size="xl" />
      </Flex>
    );

  return (
    <Box p={5} maxWidth="800px" mx="auto">
      <Flex as="header" width="100%" p="4" bg="gray.100" align="center" mb={2}>
        <Box>
          <Heading>Invoice #{invoice.fields["Invoice #"]}</Heading>
        </Box>
      </Flex>
      <Container maxW="800px">
        <Text mb={1}>
          <strong>Client:</strong> {invoice.fields["Client"]}
        </Text>
        <Text mb={1}>
          <strong>Project:</strong> {invoice.fields["Project"]}
        </Text>
        <Text mb={1}>
          <strong>Created:</strong> {invoice.fields["Created"]}
        </Text>
        <Text mb={1}>
          <strong>Total Amount:</strong> SGD{" "}
          {invoice.fields["Amount Rollup (from items)"]}
        </Text>
        <Text>
          <strong>Amount Due:</strong> SGD{" "}
          {invoice.fields["Amount Rollup (from items)"]}
        </Text>

        <Heading size="md" mt={6}>
          Items
        </Heading>
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>Item</Th>
              <Th>Qty</Th>
              <Th>Price</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <>
                <Tr key={item.id}>
                  <Td>
                    <Text fontWeight="bold">{item.fields["Item Name"]}</Text>
                    <Text fontSize="sm">{item.fields["Description"]}</Text>
                  </Td>
                  <Td>{item.fields["Quantity"]}</Td>
                  <Td>SGD {item.fields["Price"]}</Td>
                  <Td>SGD {item.fields["Price"] * item.fields["Quantity"]}</Td>
                </Tr>
                <Tr key={`divider-${item.id}`}>
                  <Td colSpan={4}>
                    <hr />
                  </Td>
                </Tr>
              </>
            ))}
          </Tbody>
        </Table>

        <Flex justifyContent="space-between" mt={6}>
          <Text fontSize="lg" fontWeight="bold">
            Total
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            SGD {invoice.fields["Amount Rollup (from items)"]}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="lg" fontWeight="bold">
            Amount Due
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            SGD {invoice.fields["Amount Rollup (from items)"]}
          </Text>
        </Flex>

        <Button mt={4} onClick={() => history.goBack()}>
          Back
        </Button>
      </Container>
    </Box>
  );
}

export default InvoiceDetail;
