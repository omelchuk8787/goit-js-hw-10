import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const delay = parseInt(formData.get("delay").trim(), 10);
  const state = formData.get("state").trim();

  if (isNaN(delay) || delay < 0) {
    iziToast.error({
      title: "Error",
      message: "Please enter a valid positive delay",
    });
    return;
  }

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then((delay) => {
      iziToast.success({
        title: "✅ Success",
        message: `Fulfilled promise in ${delay}ms`,
      });
    })
    .catch((delay) => {
      iziToast.error({
        title: "❌ Rejected",
        message: `Rejected promise in ${delay}ms`,
      });
    });

  form.reset();
});
