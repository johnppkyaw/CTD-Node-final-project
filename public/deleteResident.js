import { showResidents } from "./residents.js";
import { enableInput, token, message } from "./index.js";

export const deleteResident = async(id) => {
  console.log("you are here in deleteResident!")
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
    console.log(response);
    if (response.status === 200) {
      message.textContent = "The resident entry was deleted successfully!";
      showResidents();
    }
  } catch(err) {
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
}
