import React from "react";
import Button from "./Button";
import { shopCart } from "../store/GlobalContext";
import { useContext } from "react";

export default function Cart({ checkoutOpen, modalRef }) {
  const { cartItems = [], total, updateCart, formatPrice } =
    useContext(shopCart);

  return (
    <div className="cart">
      {cartItems.length > 0 ? (
        <h2>Your cart</h2>
      ) : (
        <h2>Your cart is currently empty</h2>
      )}
      <ul>
        {cartItems.map((item) => {
          return (
            <li key={item.id} className="cart-item">
              <p>
                {item.name} = {formatPrice(item.price)} x {item.quantity}
              </p>
              <div className="cart-item-actions">
                <Button onClick={() => updateCart(item.id, -1)}>-</Button>
                {item.quantity}
                <Button onClick={() => updateCart(item.id, 1)}>+</Button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="cart-total">{total > 0 && formatPrice(total)}</div>
      <div className="modal-actions">
        <Button
          className="text-button"
          onClick={() => {
            modalRef.current.close();
          }}
        >
          Close
        </Button>
        <Button
          type="submit"
          className="button"
          onClick={() => {
            checkoutOpen();
          }}
        >
          Go to checkout
        </Button>
      </div>
    </div>
  );
}
