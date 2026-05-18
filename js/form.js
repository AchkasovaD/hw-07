document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".newsletter-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const emailInput = form.elements["email"];
    if (!emailInput.value.trim()) {
      alert("Будь ласка, заповніть поле email");
      return;
    }
    const formData = {
      email: emailInput.value.trim(),
    };
    console.log("Дані форми:", formData);

    let submissions = JSON.parse(
      localStorage.getItem("newsletterSubmissions") || "[]",
    );
    submissions.push(formData);
    localStorage.setItem("newsletterSubmissions", JSON.stringify(submissions));

    form.reset();
  });
});
