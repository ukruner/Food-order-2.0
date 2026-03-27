export default function FlyingFoodItem({
  startX,
  startY,
  deltaX,
  deltaY,
  angle,
  flightDuration,
  imageSrc,
  itemName,
}) {
  return (
    <img
      className="flying-plane"
      src={imageSrc}
      alt=""
      aria-hidden="true"
      title={itemName}
      style={{
        "--flight-start-x": `${startX}px`,
        "--flight-start-y": `${startY}px`,
        "--flight-delta-x": `${deltaX}px`,
        "--flight-delta-y": `${deltaY}px`,
        "--flight-angle": `${angle}rad`,
        "--flight-duration": `${flightDuration}ms`,
      }}
    />
  );
}
