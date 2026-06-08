import React, { useContext } from "react";
import Button from "./Button";
import { shopCart } from "../store/GlobalContext";
import useHttp from "../hooks/useHttp";
import { apiUrl, assetUrl, IS_STATIC_HOST } from "../config/runtime";

const requestConfig = {};

export default function Meals({ onAddToCartAnimation }) {
  const { mealsList, addToCart, formatPrice } = useContext(shopCart);
  const { error, isLoading } = useHttp(
    IS_STATIC_HOST ? apiUrl("/data/available-meals.json") : apiUrl("/meals"),
    requestConfig
  );

  function handleAddToCart(item, event) {
    onAddToCartAnimation?.(
      event.currentTarget.getBoundingClientRect(),
      item.name,
      assetUrl(item.image)
    );
    addToCart(item);
  }

  if (isLoading) {
    return <p>Waiting for meals to load</p>;
  }

  return (
    <>
      {error && <Error title="failed to fetch meals" message={error}></Error>}

      <ul id="meals">
        {mealsList.map((item) => {
          return (
            <li className="meal-item" key={item.id}>
              <article>
                <img src={assetUrl(item.image)}></img>
                <h3>{item.name}</h3>
                <div>
                  <p className="meal-item-price">{formatPrice(item.price)}</p>
                </div>
                <p className="meal-item-description">{item.description}</p>
                <div className="meal-item-actions">
                  <Button
                    onClick={(event) => handleAddToCart(item, event)}
                    className="button"
                  >
                    Add to cart
                  </Button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
