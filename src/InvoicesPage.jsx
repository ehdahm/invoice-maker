import { Button, Flex, Box, Spacer } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import NavBarComponent from "./NavBarComponent";

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const TOKEN =
    "pat9lbLhivluaYxIN.965db3fcbbbcf1e5958b1833c2c40004fe7711a6158ed9e80e8df58d3600d76d";
  const BASE_URL = "https://api.airtable.com/v0/app44cnuWXzKrLX6k/Invoices";
  const history = useHistory();

  useEffect(() => {
    async function fetchInvoices() {
      const response = await fetch(BASE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      const jsonData = await response.json();
      const invoicesData = jsonData.records.map((data) => ({
        id: data.id,
        invoiceNumber: data.fields["Invoice #"],
        client: data.fields["Client"],
        project: data.fields["Project"],
        amount: data.fields["Amount Rollup (from items)"],
        created: data.fields["Created"],
      }));
      setInvoices(invoicesData);
    }
    fetchInvoices();
  }, []);

  const handleCreateNewInvoice = () => {
    history.push("/new-invoice");
  };

  return (
    <>
      <NavBarComponent
        title="Invoices"
        buttonText="Create New Invoice"
        buttonFunction={handleCreateNewInvoice}
      />
      <TableContainer>
        <Table variant="simple">
          <TableCaption>List of Invoices</TableCaption>
          <Thead>
            <Tr>
              <Th>Invoice #</Th>
              <Th isNumeric>Amount</Th>
              <Th>Client</Th>
              <Th>Project</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoices.map((invoice) => (
              <Tr key={invoice.id}>
                <Td>{invoice.invoiceNumber}</Td>
                <Td isNumeric>SGD {invoice.amount}</Td>
                <Td>{invoice.client}</Td>
                <Td>{invoice.project}</Td>
                <Td>{invoice.created}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default InvoicesPage;
