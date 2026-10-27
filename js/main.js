const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(button.getAttribute("aria-controls"));

    button.setAttribute("aria-expanded", String(!expanded));
    answer.hidden = expanded;
  });
});

const billingOptions = document.querySelectorAll(".billing-option");
const prices = document.querySelectorAll(".price strong[data-monthly]");
const billNotes = document.querySelectorAll(".bill-note");

billingOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const yearly = option.dataset.period === "yearly";

    billingOptions.forEach((item) => {
      const active = item === option;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    prices.forEach((price) => {
      price.textContent = `$${yearly ? price.dataset.yearly : price.dataset.monthly}`;
    });
    billNotes.forEach((note) => {
      note.textContent = yearly ? "Billed annually" : "Billed monthly";
    });
  });
});

document.querySelectorAll("[data-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    const planSelect = document.getElementById("plan");
    planSelect.value = link.dataset.plan;
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !expanded);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  });
});

const signupForm = document.querySelector("#signup-form");
const formMessage = document.querySelector("#form-message");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!signupForm.reportValidity()) return;

  const name = new FormData(signupForm).get("fullName").trim();
  formMessage.textContent = `Thanks, ${name}! Your details are ready. This demo form does not send them, but BEATZ HUB would be in touch next.`;
  signupForm.reset();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
