/**
 * Initializes the responsive navigation menu and its keyboard behavior.
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primary-nav");

  if (!menuToggle || !primaryNav) return;

  const setMenuOpen = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    primaryNav.classList.toggle("is-open", isOpen);
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
};

/**
 * Initializes the single-open FAQ accordion with animated panel heights.
 */
const initAccordion = () => {
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach((button) => {
    const panelId = button.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;

    if (!panel) return;

    panel.addEventListener("transitionend", (event) => {
      if (event.target !== panel || event.propertyName !== "max-height") return;
      if (button.getAttribute("aria-expanded") === "true") {
        panel.style.maxHeight = "none";
      } else {
        panel.hidden = true;
      }
    });

    button.addEventListener("click", () => {
      const shouldExpand = button.getAttribute("aria-expanded") !== "true";

      faqButtons.forEach((otherButton) => {
        const otherPanelId = otherButton.getAttribute("aria-controls");
        const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;

        if (otherButton === button || !otherPanel || otherButton.getAttribute("aria-expanded") !== "true") return;

        otherButton.setAttribute("aria-expanded", "false");
        otherPanel.style.maxHeight = `${otherPanel.scrollHeight}px`;
        window.requestAnimationFrame(() => {
          otherPanel.style.maxHeight = "0px";
        });
      });

      button.setAttribute("aria-expanded", String(shouldExpand));

      if (shouldExpand) {
        panel.hidden = false;
        panel.style.maxHeight = "0px";
        window.requestAnimationFrame(() => {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        });
      } else {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        window.requestAnimationFrame(() => {
          panel.style.maxHeight = "0px";
        });
      }
    });
  });
};

/**
 * Initializes the monthly/yearly pricing selector and displayed savings.
 */
const initPricingToggle = () => {
  const billingOptions = document.querySelectorAll(".billing-option");
  const prices = document.querySelectorAll(".price strong[data-monthly][data-yearly]");
  const billNotes = document.querySelectorAll(".bill-note");
  const savingsBadge = document.querySelector(".save-tag");

  billingOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const isYearly = option.dataset.period === "yearly";

      billingOptions.forEach((billingOption) => {
        const isActive = billingOption === option;
        billingOption.classList.toggle("is-active", isActive);
        billingOption.setAttribute("aria-pressed", String(isActive));
      });

      prices.forEach((price) => {
        price.textContent = `$${isYearly ? price.dataset.yearly : price.dataset.monthly}`;
      });

      billNotes.forEach((note) => {
        note.textContent = isYearly ? "Billed annually" : "Billed monthly";
      });

      if (savingsBadge) {
        savingsBadge.textContent = "Save 20%";
        savingsBadge.hidden = !isYearly;
      }
    });
  });
};

/**
 * Adds a shadow class while the page is scrolled past the header threshold.
 */
const initHeaderShadow = () => {
  const header = document.querySelector(".site-header");

  if (!header) return;

  const updateHeaderShadow = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Validates sign-up fields, prevents duplicate emails, and saves entries locally.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");
  const nameInput = document.querySelector("#full-name");
  const emailInput = document.querySelector("#email");
  const planSelect = document.querySelector("#plan");
  const termsInput = document.querySelector("#terms");

  document.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      if (!planSelect) return;
      planSelect.value = link.dataset.plan;
      planSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  if (!signupForm || !formMessage || !nameInput || !emailInput || !planSelect || !termsInput) return;

  const fields = [nameInput, emailInput, planSelect, termsInput];

  const getFieldErrorElement = (field) => {
    const errorId = field.getAttribute("aria-describedby");
    return errorId ? document.getElementById(errorId) : null;
  };

  const setFieldError = (field, message) => {
    const errorElement = getFieldErrorElement(field);
    field.setAttribute("aria-invalid", String(Boolean(message)));

    if (!errorElement) return;

    errorElement.textContent = message;
    errorElement.hidden = !message;
  };

  const showFormMessage = (message, isError = false) => {
    formMessage.textContent = message;
    formMessage.classList.toggle("is-error", isError);
  };

  const validateField = (field) => {
    if (field === nameInput && nameInput.value.trim().length < 2) {
      return "Please enter a name with at least 2 characters.";
    }

    if (field === emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      return "Enter a valid email address.";
    }

    if (field === planSelect && !planSelect.value) {
      return "Choose a plan or service.";
    }

    if (field === termsInput && !termsInput.checked) {
      return "Please agree before continuing.";
    }

    return "";
  };

  const readSignups = () => {
    try {
      const savedSignups = localStorage.getItem("signups");
      if (savedSignups === null) return [];

      const parsedSignups = JSON.parse(savedSignups);
      if (!Array.isArray(parsedSignups)) {
        throw new TypeError('The "signups" value is not an array.');
      }

      return parsedSignups;
    } catch (error) {
      console.error("Could not read signups from localStorage.", error);
      return null;
    }
  };

  fields.forEach((field) => {
    field.setAttribute("aria-invalid", "false");

    const eventName = field === planSelect || field === termsInput ? "change" : "input";
    field.addEventListener(eventName, () => {
      setFieldError(field, validateField(field));
      showFormMessage("");
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showFormMessage("");

    const invalidFields = fields.filter((field) => {
      const error = validateField(field);
      setFieldError(field, error);
      return Boolean(error);
    });

    if (invalidFields.length > 0) {
      invalidFields[0].focus();
      return;
    }

    const signups = readSignups();
    if (!signups) {
      showFormMessage("We couldn’t access saved signups in this browser. Check local storage permissions and try again.", true);
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const normalizedEmail = email.toLowerCase();
    const duplicate = signups.some((signup) =>
      typeof signup?.email === "string" && signup.email.trim().toLowerCase() === normalizedEmail
    );

    if (duplicate) {
      setFieldError(emailInput, "You’ve already signed up with this email.");
      emailInput.focus();
      showFormMessage("You've already signed up", true);
      return;
    }

    const signup = {
      name,
      email,
      plan: planSelect.value,
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem("signups", JSON.stringify([...signups, signup]));
    } catch (error) {
      console.error("Could not save signup to localStorage.", error);
      showFormMessage("We couldn’t save your signup in this browser. Check available storage and try again.", true);
      return;
    }

    signupForm.reset();
    fields.forEach((field) => setFieldError(field, ""));
    showFormMessage(`Thanks, ${name}! Your signup has been saved.`, false);
  });
};

/**
 * Updates the copyright year to the current year.
 */
const initFooterYear = () => {
  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
};

/**
 * Initializes all page interactions after the document has been parsed.
 */
const init = () => {
  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initSignupForm();
  initFooterYear();
};

document.addEventListener("DOMContentLoaded", init);
