import { render } from "@testing-library/react";

export function renderWithModal(ui) {
  document.body.innerHTML = '<div id="modal"></div>';
  return render(ui);
}
