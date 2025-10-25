import { showResidents } from "./residents.js";
import { enableInput, token, message } from "./index.js";

export const deleteResident = async(id) => {
  const savedFilter = localStorage.getItem("savedFilter");
  enableInput(false);
  const url = `/api/v1/residents/${id}`;
  const method = 'DELETE';
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    if (response.status === 200) {
      message.textContent = "The resident entry was deleted successfully!";
      showResidents(savedFilter);
    }
  } catch(err) {
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
}
