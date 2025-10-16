//keep track of the active div
let activeDiv = null;
export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
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

export let message = null;

import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleRegister } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  message = document.getElementById("message");
  handleLoginRegister();
  handleLogin();
  handleRegister();
  if (token) {
    alert("You are logged in!");
  } else {
    showLoginRegister();
  }
});
