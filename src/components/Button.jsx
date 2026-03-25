import React, { forwardRef } from "react";

const Button = forwardRef(function Button({ children, ...props }, ref) {
  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  );
});

export default Button;
