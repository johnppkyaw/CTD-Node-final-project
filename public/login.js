import {
  inputEnabled,
  setDiv,
  token,
  message,
  enableInput,
  setToken,
  user,
  setUser
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showResidents } from "./residents.js";
import { paginate } from "./paginate.js";

let loginDiv = null;
let email = null;
let password = null;

export const handleLogin = () => {
  loginDiv = document.getElementById("logon-div");
  email = document.getElementById("email");
  password = document.getElementById("password");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");
  const rightHeaderDiv = document.getElementById("right-header");
  
  loginDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === logonButton) {
        enableInput(false);

        try {
          const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.value,
              password: password.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200) {
            message.textContent = `Logon successful.  Welcome ${data.user.name}`;
            setToken(data.token);
            setUser(data.user.name);

            rightHeaderDiv.style.display = "flex";
            rightHeaderDiv.children[0].textContent = `Logged in as ${user}`;

            email.value = "";
            password.value = "";

            showResidents("active").then(() => paginate());
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communications error occurred.";
        }

        enableInput(true);
      } else if (e.target === logonCancel) {
        email.value = "";
        password.value = "";
        showLoginRegister();
      }
    }
  });
};

export const showLogin = () => {
  email.value = null;
  password.value = null;
  setDiv(loginDiv);
};
