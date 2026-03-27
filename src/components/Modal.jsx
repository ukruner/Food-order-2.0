import {
  useImperativeHandle,
  useRef,
  useContext,
  forwardRef,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import Cart from "./Cart.jsx";
import Checkout from "./Checkout.jsx";
import Button from "./Button.jsx";
import { shopCart } from "../store/GlobalContext.jsx";

const Modal = forwardRef(function reuseModal({}, ref) {
  const dialog = useRef();
  const finalDialog = useRef();
  const reopenTimeout = useRef();
  const { shoppingDone, setShoppingDone, cartItems, mealsList } =
    useContext(shopCart);
  const [submittedItems, setSubmittedItems] = useState([]);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },
    };
  });

  useEffect(() => {
    return () => {
      if (reopenTimeout.current) {
        window.clearTimeout(reopenTimeout.current);
      }
    };
  }, []);

  function orderSent() {
    setSubmittedItems(
      cartItems.map((item) => {
        const meal = mealsList.find((mealItem) => mealItem.id === item.id);

        return {
          id: item.id,
          name: item.name,
          image: meal ? `http://localhost:3000/${meal.image}` : "",
        };
      })
    );
    dialog.current.close();

    setShoppingDone(false);

    finalDialog.current.showModal();
  }

  function checkoutOpen() {
    dialog.current.close();
    setShoppingDone(true);
    reopenTimeout.current = window.setTimeout(() => {
      if (dialog.current) {
        dialog.current.showModal();
      }
      reopenTimeout.current = null;
    }, 300);
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
        <p>Your order has been submitted</p>
        <div className="submitted-order-items" aria-label="Ordered food items">
          {submittedItems.map((item, index) =>
            item.image ? (
              <div
                key={item.id}
                className="submitted-order-thumbnail-wrapper"
                style={{ "--check-delay": `${index * 550}ms` }}
              >
                <img
                  className="submitted-order-thumbnail"
                  src={item.image}
                  alt={item.name}
                />
                <span className="submitted-order-check" aria-hidden="true">
                  <span className="submitted-order-checkmark"></span>
                </span>
              </div>
            ) : null
          )}
        </div>
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
