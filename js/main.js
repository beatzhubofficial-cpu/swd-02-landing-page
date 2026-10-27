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
 * Initializes the sign-up form's local demo confirmation.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");

  document.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      const planSelect = document.getElementById("plan");
      if (planSelect) planSelect.value = link.dataset.plan;
    });
  });

  if (!signupForm || !formMessage) return;

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signupForm.reportValidity()) return;

    const name = new FormData(signupForm).get("fullName").trim();
    formMessage.textContent = `Thanks, ${name}! Your details are ready. This demo form does not send them, but BEATZ HUB would be in touch next.`;
    signupForm.reset();
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
