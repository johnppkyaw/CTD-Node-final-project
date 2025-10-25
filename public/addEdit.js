import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showResidents } from "./residents.js";
import { dateConverter, yearMonthDayConverter } from "./dateConverter.js";
import { paginate } from "./paginate.js";

let addEditDiv = null;
let lastName = null;
let firstName = null;
let middleName = null;
let gender = null;
let dateOfBirth = null;
let status = null;
let hospice = null;
let roomNumber = null;
let addingResident = null;
let editCancel = null

export const handleAddEdit = () => {
  const savedFilter = localStorage.getItem("savedFilter");
  addEditDiv = document.getElementById("edit-resident");
  lastName = document.getElementById("last-name");
  firstName = document.getElementById("first-name");
  middleName = document.getElementById("middle-name");
  gender = document.getElementById("gender");
  dateOfBirth = document.getElementById("date-of-birth");
  status = document.getElementById("status");
  hospice = document.getElementById("hospice");
  roomNumber = document.getElementById("room-number");
  addingResident = document.getElementById("adding-resident");
  editCancel = document.getElementById("edit-cancel");
  let previousRoomNumber = roomNumber.value;

  status.addEventListener("change", async(e) => {
    if(status.value === "discharged") {
    previousRoomNumber = roomNumber.value;
    roomNumber.value = "";
    } else {
      roomNumber.value = previousRoomNumber;
    }
  })

  if(status.value === "discharged") {
    roomNumber.value = "";
  }

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingResident) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/residents";

        if (addingResident.textContent === "Update") {
          method = "PATCH";
          url = `/api/v1/residents/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              firstName: firstName.value, 
              middleName: middleName.value, 
              lastName: lastName.value, 
              gender: gender.value, 
              dateOfBirth: dateOfBirth.value, 
              status: status.value, 
              hospice: hospice.value, 
              roomNumber: roomNumber.value || null 
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              message.textContent = "The resident entry was updated.";
            } else {
              // a 201 is expected for a successful create
              message.textContent = "The resident entry was created.";
            }

            firstName.value = ""; 
            middleName.value = ""; 
            lastName.value = ""; 
            gender.value = "male"; 
            dateOfBirth.value = ""; 
            status.value = "active"; 
            hospice.value = ""; 
            roomNumber.value = ""; 

            showResidents(savedFilter).then(()=>paginate());
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        previousRoomNumber = "";
        showResidents(savedFilter).then(()=>paginate());
      }
    }
  });
};

export const showAddEdit = async (residentId) => {
    const savedFilter = localStorage.getItem("savedFilter");
    console.log(savedFilter);
    if (!residentId) {
    firstName.value = ""; 
    middleName.value = ""; 
    lastName.value = ""; 
    gender.value = ""; 
    dateOfBirth.value = ""; 
    status.value = "active"; 
    hospice.value = ""; 
    roomNumber.value = ""; 
    addingResident.textContent = "Add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/residents/${residentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        firstName.value = data.resident.firstName;
        middleName.value = data.resident.middleName || "";
        lastName.value = data.resident.lastName;
        gender.value = data.resident.gender;
        dateOfBirth.value = yearMonthDayConverter(dateConverter(data.resident.dateOfBirth));
        status.value = data.resident.status;
        hospice.value = data.resident.hospice;
        roomNumber.value = data.resident.roomNumber;
        addingResident.textContent = "Update";
        message.textContent = "";
        addEditDiv.dataset.id = residentId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The resident entry was not found";
        
        showResidents(savedFilter).then(()=>paginate());
      }
    } catch (err) {
      message.textContent = "A communications error has occurred.";
      showResidents(savedFilter).then(()=>paginate());
    }

    enableInput(true);
  }
};
