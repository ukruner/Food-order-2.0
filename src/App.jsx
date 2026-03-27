import { useRef, useState } from "react";
import FlyingFoodItem from "./components/FlyingFoodItem";
import Header from "./components/Header";
import Meals from "./components/Meals";
import CartContextProvider from "./store/GlobalContext";

const PROJECTILE_SPEED = 0.48;
const NOTIFICATION_DELAY = 500;
const NOTIFICATION_DURATION = 2000;

function App() {
  const cartButtonRef = useRef(null);
  const latestNotificationIdRef = useRef(null);
  const notificationShowTimeoutRef = useRef(null);
  const notificationHideTimeoutRef = useRef(null);
  const [flights, setFlights] = useState([]);
  const [cartNotification, setCartNotification] = useState(null);

  function launchPlane(sourceRect, itemName, imageSrc) {
    const cartRect = cartButtonRef.current?.getBoundingClientRect();

    if (!sourceRect || !cartRect) {
      return;
    }

    const id = `${Date.now()}-${Math.random()}`;
    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.hypot(deltaX, deltaY);
    const flightDuration = Math.max(1800, Math.round(distance / PROJECTILE_SPEED));
    const notificationId = `${id}-notification`;

    latestNotificationIdRef.current = notificationId;

    if (notificationHideTimeoutRef.current) {
      window.clearTimeout(notificationHideTimeoutRef.current);
      notificationHideTimeoutRef.current = null;
    }

    if (notificationShowTimeoutRef.current) {
      window.clearTimeout(notificationShowTimeoutRef.current);
      notificationShowTimeoutRef.current = null;
    }

    setCartNotification(null);

    setFlights((currentFlights) => [
      ...currentFlights,
      {
        id,
        startX,
        startY,
        deltaX,
        deltaY,
        angle: Math.atan2(deltaY, deltaX),
        flightDuration,
        imageSrc,
        itemName,
      },
    ]);

    window.setTimeout(() => {
      setFlights((currentFlights) =>
        currentFlights.filter((flight) => flight.id !== id)
      );

      if (latestNotificationIdRef.current !== notificationId) {
        return;
      }

      notificationShowTimeoutRef.current = window.setTimeout(() => {
        if (latestNotificationIdRef.current !== notificationId) {
          return;
        }

        setCartNotification({
          id: notificationId,
          message: `${itemName} was added to the cart`,
        });

        notificationHideTimeoutRef.current = window.setTimeout(() => {
          setCartNotification((currentNotification) =>
            currentNotification?.id === notificationId ? null : currentNotification
          );
          notificationHideTimeoutRef.current = null;
        }, NOTIFICATION_DURATION);

        notificationShowTimeoutRef.current = null;
      }, NOTIFICATION_DELAY);
    }, flightDuration);
  }

  return (
    <CartContextProvider>
      <Header cartButtonRef={cartButtonRef}></Header>
      <Meals onAddToCartAnimation={launchPlane}></Meals>
      <div className="flight-overlay" aria-hidden="true">
        {flights.map((flight) => (
          <FlyingFoodItem key={flight.id} {...flight} />
        ))}
      </div>
      {cartNotification && (
        <>
          <div className="cart-feedback-backdrop" aria-hidden="true"></div>
          <dialog open className="cart-feedback-dialog">
            {cartNotification.message}
          </dialog>
        </>
      )}
    </CartContextProvider>
  );
}

export default App;
