import React, { useRef } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { useContext } from "react";
import { shopCart } from "../store/GlobalContext";

export default function Header({ cartButtonRef }) {
  const dialog = useRef();

  const {
    cartItems = [],
    currency,
    currencyArray,
    setCurrency,
  } = useContext(shopCart);

  function openModal() {
    dialog.current.open();
  }

  function handleSetCurrency(event) {
    const selectedCurrency = event.target.value;
    setCurrency(selectedCurrency);
  }

  return (
    <div id="main-header">
      <Modal ref={dialog} title="shopping cart"></Modal>
      <div id="title">
        <img src={"/logo.jpg"}></img>
        <h1>REACT FOOD ORDER</h1>
      </div>
      <div id="headerbuttons">
        <Button className="text-button" onClick={openModal} ref={cartButtonRef}>
          Cart ({cartItems.length})
        </Button>
        <form id="currencyform">
          <label htmlFor="currency"></label>
          <h2>
            <select
              className="text-button"
              name="currency"
              id="currency"
              value={currency}
              onChange={handleSetCurrency}
            >
              {currencyArray.map((element) => (
                <option key={element} id="currency" value={element}>
                  {element}
                </option>
              ))}
            </select>
          </h2>
        </form>
      </div>
    </div>
  );
}
