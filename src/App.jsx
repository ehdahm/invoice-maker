import "./App.css";
import { Route, Switch } from "react-router-dom";
import InvoiceForm from "./InvoiceForm";
import InvoiceItems from "./InvoiceItems";
import InvoicesPage from "./InvoicesPage";

function App() {
  return (
    <Switch>
      <Route path="/new-invoice" exact>
        <InvoiceForm />
      </Route>
      <Route path="/items/:invoiceId" exact>
        <InvoiceItems />
      </Route>
      <Route path="/" exact>
        <InvoicesPage />
      </Route>
    </Switch>
  );
}

export default App;
