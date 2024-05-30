import "./App.css";
import { Route, Switch } from "react-router-dom";
import InvoiceForm from "./InvoiceForm";
import InvoiceItems from "./InvoiceItems";
import InvoicesPage from "./InvoicesPage";
import EditInvoice from "./EditInvoice";
import EditItems from "./EditItems";

function App() {
  return (
    <Switch>
      <Route path="/new-invoice" exact>
        <InvoiceForm />
      </Route>
      <Route path="/items/:invoiceId" exact>
        <InvoiceItems />
      </Route>
      <Route path="/edit-invoice/:id" exact>
        <EditInvoice />
      </Route>
      <Route path="/edit-items/:invoiceId" exact>
        <EditItems />
      </Route>
      <Route path="/" exact>
        <InvoicesPage />
      </Route>
    </Switch>
  );
}

export default App;
