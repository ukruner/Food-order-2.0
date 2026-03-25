import React, { useContext } from "react";
import Input from "./Input";
import Button from "./Button";
import { shopCart } from "../store/GlobalContext";
import useHttp from "../hooks/useHttp";

const reqOptions = {
  method: "POST",
  headers: { "Content-type": "application/json" },
};

export default function CheckOut({ orderSent, wrapShopState, modalRef }) {
  const { order, currency, dataClearing } = useContext(shopCart);
  const { isLoading: isSending, error, sendRequest } = useHttp("http://localhost:3000/orders", reqOptions)
  async function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const arrayData = fd.entries();
    const objData = Object.fromEntries(arrayData);
    const fullOrder = { order: { ...order.order, total: currency+order.order.total, customer: objData } };

    sendRequest(JSON.stringify(fullOrder));

   

    wrapShopState();
    orderSent();
    dataClearing();
  }

  let actions = (
    <>
      <div className="modal-actions-left">
        <Button
          className="button"
          type="button"
          onClick={() => {
            wrapShopState();
          }}
        >
          Back to cart
        </Button>
      </div>
      <div className="modal-actions-right">
        <Button
          className="text-button"
          type="button"
          onClick={() => {
            modalRef.current.close();
          }}
        >
          Close
        </Button>
        <Button type="submit" className="button">
          Submit Order
        </Button>
      </div>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }


  return (
    <>
      <h2>Checkout</h2>
      <p>Total amount: {order.order.total ? currency+order.order.total : "TBC"}</p>

      <form id="form" type="form" onSubmit={handleSubmit}>
        <Input className="control" id="name" type="text" name="name" required>
          Full name
        </Input>
        <Input
          className="control"
          id="email"
          type="email"
          name="email"
          required
        >
          E-mail address
        </Input>
        <Input
          className="control"
          id="street"
          type="text"
          name="street"
          required
        >
          Street
        </Input>
        <div className="control-row">
          <Input
            className="control"
            id="postal-code"
            type="text"
            name="postal-code"
            required
          >
            Postal code
          </Input>
          <Input className="control" id="city" type="text" name="city" required>
            City
          </Input>
        </div>
        {error && <Error title="failed to submit order" message={error}></Error>}
        <div className="modal-actions">
         {actions}
        </div>
      </form>
    </>
  );
}
