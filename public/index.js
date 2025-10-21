//keep track of the active div
let activeDiv = null;
export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "flex";
    activeDiv = newDiv;
  }
};

//to disable input during the period in which the async operation is in progress
export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("savedFilter");
  }
};

export let user = null;
export const setUser = (username) => {
  user = username;
  if (user) {
    localStorage.setItem("currentuser", username);
  } else {
    localStorage.removeItem("currentuser");
  }
}

export let message = null;

import { showResidents, handleResidents } from "./residents.js";
import { showFilteredResidents } from "./filterResidents.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";
import { paginate } from "./paginate.js";

let activeResidentsBtn = null;
let dischargedResidentsBtn = null;
let allResidentsBtn = null;

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");

  const savedFilter = localStorage.getItem("savedFilter") || "active";
  const currentTotalResults = localStorage.getItem("currentTotalResults");
  
  message = document.getElementById("message");
  const rightHeaderDiv = document.getElementById("right-header");

  activeResidentsBtn = document.getElementById("active-residents-btn");
  dischargedResidentsBtn = document.getElementById("discharged-residents-btn");
  allResidentsBtn = document.getElementById("all-residents-btn");

  handleLoginRegister();
  handleLogin();
  handleResidents();
  handleRegister();
  handleAddEdit();
  showFilteredResidents();
  if (token) {
    user = localStorage.getItem("currentuser");
    if(user) {
      rightHeaderDiv.style.display = "flex";
      rightHeaderDiv.children[0].textContent = `Logged in as ${user}`;
    }
    activeResidentsBtn.disabled = savedFilter === "active" ? true : false;
    dischargedResidentsBtn.disabled = savedFilter === "discharged" ? true : false;
    allResidentsBtn.disabled = savedFilter === "all" ? true : false;
    paginate();
    showResidents(savedFilter);
  } else {
    showLoginRegister();
  }
});
