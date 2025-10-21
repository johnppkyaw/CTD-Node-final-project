import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
  setUser
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { deleteResident } from "./deleteResident.js";
import { dateConverter } from "./dateConverter.js";

let residentsDiv = null;
let residentsTable = null;
let residentsTableHeader = null;
let residentsTableBody = null;
let rightHeaderDiv = null;

export const handleResidents = () => {
  residentsDiv = document.getElementById("residents");
  const logoff = document.getElementById("logoff");
  const addResident = document.getElementById("add-resident");
  residentsTable = document.getElementById("residents-table");
  residentsTableHeader = document.getElementById("residents-table-header");
  residentsTableBody = document.getElementById("residents-table-body");
  rightHeaderDiv = document.getElementById("right-header");
  
  rightHeaderDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON" && e.target === logoff) {
        //involves no communication with the backend. The user is logged off by deleting the JWT from memory.
        setToken(null);
        setUser(null);

        message.textContent = "You have been logged off.";

        residentsTableBody.replaceChildren([]);

        rightHeaderDiv.style.display = "none";
        rightHeaderDiv.children[0].textContent = "";

        showLoginRegister();
      } 
  })

  residentsDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addResident) {
        showAddEdit(null);
      } else if (e.target.classList.contains("edit-button")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("delete-button")) {
        if(confirm('Click OK to confirm the deletion of this entry.  Note: This action cannot be reversed.')) {
          deleteResident(e.target.dataset.id);
        }
      }
    }
  });
};

export const showResidents = async (url, page) => {

  let resultUrl = "/api/v1/residents";

  if(url !== "all" ) {
    resultUrl = `/api/v1/residents?status=${url}`;
  }

  if(page) {
    resultUrl += url !== "all" ? `&page=${page}` : `?page=${page}`;
  }
  
  try {
    enableInput(false);

    const response = await fetch(resultUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [];

    if (response.status === 200) {
      if (data.count === 0) {
        residentsTableBody.replaceChildren(...children); // clear this for safety
      } else {
        const totalResults = data.totalResults;
        localStorage.setItem("currentTotalResults", totalResults);
        
        for (let i = 0; i < data.residents.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<button type="button" class="edit-button blue-button" data-id=${data.residents[i]._id}>edit</button>`;

          let deleteButton = `<button type="button" class="delete-button red-button" data-id=${data.residents[i]._id}>delete</button>`;

          let rowHTML = `
            <td>${data.residents[i].lastName}</td>
            <td>${data.residents[i].firstName}</td>
            <td>${data.residents[i].middleName || ""}</td>
            <td>${data.residents[i].gender === "male" ? "M" : "F"}</td>
            <td>${dateConverter(data.residents[i].dateOfBirth)}</td>
            <td>${data.residents[i].status}</td>
            <td>${data.residents[i].hospice === "true" ? "Yes" : "No"}</td>
            <td>${data.residents[i].roomNumber}</td>
            <td>${editButton}${deleteButton}</td>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        residentsTableBody.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(residentsDiv);
};
