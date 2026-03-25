import React from "react";

export default function Input({ className, id, children, ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id}>{children}</label>
      <input id={id} {...props} />
    </div>
  );
}
