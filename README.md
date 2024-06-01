# Invoice Manager

## App Title

Invoice Manager is a user-friendly web application designed to help small businesses manage their invoices efficiently. The app allows users to create, view, edit, and delete invoices and associated items seamlessly. With a clean interface and easy navigation, users can keep track of their billing and ensure timely payments from clients.

## Screenshot(s)

### Landing Page

Add screenshot here

### Invoice Detail Page

Add screenshot here

## Technologies Used

- **React**: For building the user interface.
- **Chakra UI**: For stylish and responsive components.
- **Airtable API**: As the backend service for storing invoice and item data.
- **React Router**: For handling navigation within the app.
- **JavaScript (ES6+)**: For adding interactivity and logic.
- **CSS**: For additional styling.

## Getting Started

### Deployed App

add screenshot here

### Wireframes

## Challenges Faced

### Challenge 1: Airtable API Integration

One of the biggest challenges was integrating the Airtable API to manage invoices and items. I faced issues with correctly structuring the API calls and handling the asynchronous data fetching.

**Solution**: I read the Airtable API documentation and experimented with different API calls in Bruno before implementing them in the code. Using `useEffect` hooks for data fetching and ensuring proper error handling improved the reliability of the API interactions.

### Challenge 2: Dynamic Form Handling

Managing dynamic forms, especially for adding and editing multiple invoice items, was complex to me. The 2 page editing process meant that I had to design UX that can honor this. I had issues updating the items table and was stuck on this when adding the editInvoice component. Handling state updates for nested arrays of objects required me to be very meticulous.

**Solution**: After debugging for some time, and reading the API documentation more thoroughly, i realised that they provided me the field ids for all my tables that exist. So i simply needed to declare both tables, and then get the itemId from the invoice table, and iterate through the response in order to access each item's details.

### Challenge 3: Styling and Responsive Design

Ensuring that the app looked good was another challenge. Chakra UI helped, but reading into the props and manipulating through space through trial and error is something I still find relatively difficult to do

**Solution**: I utilized Chakra UI's components which helped create the base. I liked the VStack/HStack component which allowed me to stack my table form inputs nicely.

## My Favourite Function

My favorite function in this codebase is the `fetchInvoice` function in the `InvoiceDetail` component.

**Why I Like It**:

This function is used most widely in this program, and due to the challenge that I had with updating the items table, after debugging that issue and unblocking my progress, this fetch function has sentimental value to me.

## Next Steps

Here are some planned future enhancements for Invoice Manager:

- **SKU Lists**: Reference other tables in order to pre-fill data based off an inputted key.
- **Add more fields with calculations**: Tax rate, with a tax rate flag for example, sender's address
- **Billing date**: Track payment status, whether overdue or not & create a status column to track whether it has been paid, overdue or pending.

---

This project was a fantastic learning experience, allowing me to delve deep into React and API integration while focusing on creating a practical application that can be extended and improved over time. I'm excited to continue building on this foundation and exploring new features to enhance its functionality.
