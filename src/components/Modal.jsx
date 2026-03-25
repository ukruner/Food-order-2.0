import { useImperativeHandle, useRef, useContext, forwardRef } from "react";
import { createPortal } from "react-dom";
import Cart from "./Cart.jsx";
import Checkout from "./Checkout.jsx";
import Button from "./Button.jsx";
import { shopCart } from "../store/GlobalContext.jsx";

const Modal = forwardRef(function reuseModal({}, ref) {
  const dialog = useRef();
  const finalDialog = useRef();
  const { shoppingDone, setShoppingDone } = useContext(shopCart);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },
    };
  });

  function orderSent() {
    dialog.current.close();

    setShoppingDone(false);

    finalDialog.current.showModal();
  }

  function checkoutOpen() {
    dialog.current.close();
    setShoppingDone(true);
    setTimeout(() => dialog.current.showModal(), 300);
  }

  function wrapShopState() {
    setShoppingDone(!shoppingDone);
  }

  return createPortal(
    <>
      <dialog className="modal" ref={dialog}>
        {!shoppingDone ? (
          <Cart
            modalRef={dialog}
            wrapShopState={wrapShopState}
            checkoutOpen={checkoutOpen}
          ></Cart>
        ) : (
          <Checkout
            modalRef={dialog}
            wrapShopState={wrapShopState}
            orderSent={orderSent}
          >
            CHECKOUT
          </Checkout>
        )}
      </dialog>
      <dialog className="modal" ref={finalDialog}>
        Your order has been submitted
        <div className="modal-actions">
          <Button
            onClick={() => finalDialog.current.close()}
            className="text-button"
          >
            Close
          </Button>
        </div>
      </dialog>
    </>,
    document.getElementById("modal")
  );
});

export default Modal;
