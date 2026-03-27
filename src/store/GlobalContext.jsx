import { createContext, useReducer, useState, useEffect } from "react";

const CURRENCY_CONFIG = {
  GBP: { symbol: "£", locale: "en-GB" },
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
  JPY: { symbol: "¥", locale: "ja-JP" },
};

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
  currency: "GBP",
  currencySymbol: "£",
  currencyArray: [],
  exchangeRateDate: null,
  exchangeRatesError: null,
  isFetchingExchangeRates: false,
  addToCart: () => {},
  updateCart: () => {},
  setCurrency: () => {},
  setShoppingDone: () => {},
  convertPrice: () => {},
  formatPrice: () => {},
  total: null,
});

export default function CartContextProvider({ children }) {
  const [mealsList, setMealsList] = useState([]);
  const [currency, setCurrency] = useState("GBP");
  const [shoppingDone, setShoppingDone] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({ EUR: 1, GBP: 1 });
  const [exchangeRateDate, setExchangeRateDate] = useState(null);
  const [exchangeRatesError, setExchangeRatesError] = useState(null);
  const [isFetchingExchangeRates, setIsFetchingExchangeRates] = useState(false);
  const currencyArray = Object.keys(CURRENCY_CONFIG);

  useEffect(() => {
    let isActive = true;

    async function fetchExchangeRates() {
      setIsFetchingExchangeRates(true);

      try {
        const response = await fetch("http://localhost:3000/exchange-rates");
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.message || "Could not load exchange rates."
          );
        }

        if (!isActive) {
          return;
        }

        setExchangeRates(responseData.rates);
        setExchangeRateDate(responseData.date);
        setExchangeRatesError(null);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setExchangeRatesError(
          error.message || "Could not load exchange rates."
        );
      } finally {
        if (isActive) {
          setIsFetchingExchangeRates(false);
        }
      }
    }

    fetchExchangeRates();

    return () => {
      isActive = false;
    };
  }, []);

  function convertPrice(amountInGbp, targetCurrency = currency) {
    if (amountInGbp === null || amountInGbp === undefined || amountInGbp === "") {
      return null;
    }

    const numericAmount = Number(amountInGbp);

    if (Number.isNaN(numericAmount)) {
      return null;
    }

    if (targetCurrency === "GBP") {
      return Math.round(numericAmount * 100) / 100;
    }

    const gbpRate = exchangeRates.GBP;
    const targetRate = exchangeRates[targetCurrency];

    if (!gbpRate || !targetRate) {
      return Math.round(numericAmount * 100) / 100;
    }

    const convertedAmount = (numericAmount / gbpRate) * targetRate;
    const precision = targetCurrency === "JPY" ? 0 : 2;
    const factor = 10 ** precision;

    return Math.round(convertedAmount * factor) / factor;
  }

  function formatPrice(amountInGbp, targetCurrency = currency) {
    const convertedAmount = convertPrice(amountInGbp, targetCurrency);

    if (convertedAmount === null) {
      return "";
    }

    const { locale, symbol } =
      CURRENCY_CONFIG[targetCurrency] ?? CURRENCY_CONFIG.GBP;
    const minimumFractionDigits = targetCurrency === "JPY" ? 0 : 2;
    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits,
    }).format(convertedAmount);

    return `${symbol}${formattedNumber}`;
  }

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
    currencySymbol: CURRENCY_CONFIG[currency]?.symbol ?? "£",
    exchangeRateDate: exchangeRateDate,
    exchangeRatesError: exchangeRatesError,
    isFetchingExchangeRates: isFetchingExchangeRates,
    mealsList: mealsList,
    cartItems: orderState.order.items,
    dataClearing: dataClearing,
    setCurrency: setCurrency,
    addToCart: handleAddItemToCart,
    convertPrice: convertPrice,
    formatPrice: formatPrice,
    updateCart: handleUpdateCartItemQuantity,
    setMealsList: setMealsList,
    setShoppingDone: setShoppingDone,
  };

  return <shopCart.Provider value={Ctx}>{children}</shopCart.Provider>;
}
