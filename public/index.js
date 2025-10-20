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
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  message = document.getElementById("message");
  const rightHeaderDiv = document.getElementById("right-header");
  handleLoginRegister();
  handleLogin();
  handleResidents();
  handleRegister();
  handleAddEdit();
  if (token) {
    user = localStorage.getItem("currentuser");
    if(user) {
      rightHeaderDiv.style.display = "flex";
      rightHeaderDiv.children[0].textContent = `Logged in as ${user}`;
    }
    showResidents();

  } else {
    showLoginRegister();
  }
});
