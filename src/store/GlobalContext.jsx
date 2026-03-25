import { createContext, useReducer, useState, useEffect } from "react";

export const shopCart = createContext({
  orderState: {
    order: {
      customer: [],
      items: [],
      total: null,
    },
  },
  shoppingDone: false,
  mealsList: [],
  currency: "£",
  currencyArray: [],
  addToCart: () => {},
  updateCart: () => {},
  setCurrency: () => {},
  setShoppingDone: () => {},
  total: null,
});

export default function CartContextProvider({ children }) {
  const [mealsList, setMealsList] = useState([]);
  const [currency, setCurrency] = useState("£");
  const [shoppingDone, setShoppingDone] = useState(false);
  const currencyArray = ["£", "$", "€", "¥"];

  

  function orderReducer(state, action) {
    if (action.type === "ADD_ITEM") {
      setShoppingDone(false);
      const updatedItems = [...state.order.items];
      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload.id
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = mealsList.find(
          (product) => product.id === action.payload.id
        );
        updatedItems.push({
          id: action.payload.id,
          name: product.name,
          price: product.price,
          description: product.description,
          quantity: 1,
        });
      }
      return {
        order: {
          ...state.order,
          items: updatedItems,
          total:
            Math.round(
              (state.order.total + parseFloat(action.payload.price)) * 100
            ) / 100,
        },
      };
    } else if (action.type === "UPDATE_SHOP") {
      const updatedItems = [...state.order.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.payload.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }
      return {
        order: {
          ...state.order,
          items: updatedItems,
          total:
            Math.round(
              (state.order.total + action.payload.amount * updatedItem.price) *
                100
            ) / 100,
        },
      };
    } else if (action.type === "CLEAR_DATA") {
      return { order: { items: [], customer: {}, total: null } };
    }
  }

  const [orderState, setOrderDispatch] = useReducer(orderReducer, {
    order: {
      customer: {},
      items: [],
      total: null,
    },
  });

  function handleAddItemToCart(item) {
    setOrderDispatch({
      type: "ADD_ITEM",
      payload: item,
    });
  }

  function dataClearing() {
    setOrderDispatch({ type: "CLEAR_DATA" });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    setOrderDispatch({
      type: "UPDATE_SHOP",
      payload: { productId, amount },
    });
  }

  const Ctx = {
    total: orderState.order.total,
    shoppingDone: shoppingDone,
    order: orderState,
    currencyArray: currencyArray,
    currency: currency,
    mealsList: mealsList,
    cartItems: orderState.order.items,
    dataClearing: dataClearing,
    setCurrency: setCurrency,
    addToCart: handleAddItemToCart,
    updateCart: handleUpdateCartItemQuantity,
    setMealsList: setMealsList,
    setShoppingDone: setShoppingDone,
  };

  return <shopCart.Provider value={Ctx}>{children}</shopCart.Provider>;
}
