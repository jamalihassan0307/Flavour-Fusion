const users = {
  "admin@gmail.com": {
    password: "1234",
    role: "admin",
  },
  "user@gmail.com": {
    password: "1234",
    role: "user",
  },
};

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  if (users[email] && users[email].password === password) {
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        email: email,
        role: users[email].role,
      })
    );
    window.location.href = "dashboard.html";
  } else {
    errorMessage.textContent = "Invalid email or password";
  }
}
