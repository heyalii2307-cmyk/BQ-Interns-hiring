// Bano Qabil — Incubation Center Internship landing page
// Handles light/dark theme toggle with persistence + system-preference fallback,
// full-screen form validation, and dedicated success confirmation modal.

type Theme = "light" | "dark";

const STORAGE_KEY = "bano-qabil-theme";

function getPreferredTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

function initThemeToggle(): void {
  const toggleBtn = document.getElementById("theme-toggle") as HTMLButtonElement | null;
  if (!toggleBtn) return;

  applyTheme(getPreferredTheme());

  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") as Theme;
    const next: Theme = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

function initModals(): void {
  // Registration Form Modal Elements (Full-Screen)
  const registerOverlay = document.getElementById("register-overlay") as HTMLDivElement | null;
  const registerModal = registerOverlay?.querySelector(".modal") as HTMLDivElement | null;
  const modalBody = registerOverlay?.querySelector(".modal-body") as HTMLDivElement | null;
  const openBtns = document.querySelectorAll<HTMLElement>(".js-open-register");
  const registerCloseBtn = document.getElementById("register-close") as HTMLButtonElement | null;
  const form = document.getElementById("register-form") as HTMLFormElement | null;

  // Dedicated Success Modal Elements
  const successOverlay = document.getElementById("success-overlay") as HTMLDivElement | null;
  const successModal = successOverlay?.querySelector(".modal") as HTMLDivElement | null;
  const successCloseX = document.getElementById("success-close-x") as HTMLButtonElement | null;
  const successCloseBtn = document.getElementById("success-close-btn") as HTMLButtonElement | null;

  if (!registerOverlay || !registerModal || !form || !modalBody || !successOverlay) return;

  let mouseDownOnRegOverlay = false;
  let mouseDownOnSuccessOverlay = false;

  // Form field references
  const nameInput = document.getElementById("reg-name") as HTMLInputElement | null;
  const dobInput = document.getElementById("reg-dob") as HTMLInputElement | null;
  const genderContainer = document.getElementById("gender-group-container") as HTMLElement | null;
  const genderRadios = document.querySelectorAll<HTMLInputElement>('input[name="gender"]');
  const addressInput = document.getElementById("reg-address") as HTMLInputElement | null;
  const emailInput = document.getElementById("reg-email") as HTMLInputElement | null;
  const phoneInput = document.getElementById("reg-phone") as HTMLInputElement | null;
  const guardianPhoneInput = document.getElementById("reg-guardian-phone") as HTMLInputElement | null;
  const cnicInput = document.getElementById("reg-cnic") as HTMLInputElement | null;
  const fatherNameInput = document.getElementById("reg-father-name") as HTMLInputElement | null;
  const courseSelect = document.getElementById("reg-course") as HTMLSelectElement | null;
  const teacherInput = document.getElementById("reg-teacher") as HTMLInputElement | null;
  const campusSelect = document.getElementById("reg-campus") as HTMLSelectElement | null;
  const marksInput = document.getElementById("reg-marks") as HTMLInputElement | null;
  const aboutInput = document.getElementById("reg-about") as HTMLTextAreaElement | null;

  type ValidatableInput = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

  function getContainer(input: ValidatableInput | null): HTMLElement | null {
    if (!input) return null;
    return input.closest(".form-row, .form-row-split > div, .gender-group");
  }

  function getErrorElement(input: ValidatableInput | null): HTMLElement | null {
    if (!input) return null;
    return document.getElementById(`error-${input.id}`);
  }

  function setFieldError(input: ValidatableInput, message: string): void {
    const container = getContainer(input);
    const errorEl = getErrorElement(input);
    if (container) {
      container.classList.add("has-error");
    }
    input.setAttribute("aria-invalid", "true");
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearFieldError(input: ValidatableInput): void {
    const container = getContainer(input);
    const errorEl = getErrorElement(input);
    if (container) {
      container.classList.remove("has-error");
    }
    input.removeAttribute("aria-invalid");
    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  function clearGenderError(): void {
    if (genderContainer) {
      genderContainer.classList.remove("has-error");
    }
    const errorEl = document.getElementById("error-gender");
    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  function setGenderError(message: string): void {
    if (genderContainer) {
      genderContainer.classList.add("has-error");
    }
    const errorEl = document.getElementById("error-gender");
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearAllErrors(): void {
    const textInputs: (ValidatableInput | null)[] = [
      nameInput, dobInput, addressInput, emailInput, phoneInput,
      guardianPhoneInput, cnicInput, fatherNameInput, courseSelect,
      teacherInput, campusSelect, marksInput, aboutInput
    ];
    textInputs.forEach((field) => {
      if (field) clearFieldError(field);
    });
    clearGenderError();
  }

  function validateField(input: ValidatableInput | null): boolean {
    if (!input) return true;
    const val = input.value ? input.value.trim() : "";

    if (input === nameInput) {
      if (!val) {
        setFieldError(input, "Please enter your full name.");
        return false;
      }
      if (val.length < 2) {
        setFieldError(input, "Full name must be at least 2 characters.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === dobInput) {
      if (!val) {
        setFieldError(input, "Please select your date of birth.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === addressInput) {
      if (!val) {
        setFieldError(input, "Please enter your complete address.");
        return false;
      }
      if (val.length < 5) {
        setFieldError(input, "Please enter a valid address.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === emailInput) {
      if (!val) {
        setFieldError(input, "Please enter your email address.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setFieldError(input, "Please enter a valid email address (e.g. name@example.com).");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === phoneInput) {
      if (!val) {
        setFieldError(input, "Please enter your phone number.");
        return false;
      }
      const digitsOnly = val.replace(/\D/g, "");
      if (digitsOnly.length < 9 || digitsOnly.length > 15) {
        setFieldError(input, "Please enter a valid phone number (e.g. 0300 1234567).");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === guardianPhoneInput) {
      if (val) {
        const digitsOnly = val.replace(/\D/g, "");
        if (digitsOnly.length < 9 || digitsOnly.length > 15) {
          setFieldError(input, "Please enter a valid guardian phone number.");
          return false;
        }
      }
      clearFieldError(input);
      return true;
    }

    if (input === cnicInput) {
      if (!val) {
        setFieldError(input, "Please enter your CNIC / B-Form number.");
        return false;
      }
      const digitsOnly = val.replace(/\D/g, "");
      if (digitsOnly.length !== 13) {
        setFieldError(input, "CNIC must contain 13 digits (e.g. 42101-1234567-1).");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === fatherNameInput) {
      if (!val) {
        setFieldError(input, "Please enter your father or guardian name.");
        return false;
      }
      if (val.length < 2) {
        setFieldError(input, "Name must be at least 2 characters.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === courseSelect) {
      if (!val) {
        setFieldError(input, "Please select your course.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === teacherInput) {
      if (!val) {
        setFieldError(input, "Please enter your teacher's name.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === campusSelect) {
      if (!val) {
        setFieldError(input, "Please select your campus.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === marksInput) {
      if (!val) {
        setFieldError(input, "Please enter your obtained marks or percentage.");
        return false;
      }
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) {
        setFieldError(input, "Please enter valid obtained marks.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input === aboutInput) {
      if (!val) {
        setFieldError(input, "Please write a brief intro about yourself.");
        return false;
      }
      if (val.length < 10) {
        setFieldError(input, "Please enter at least 10 characters.");
        return false;
      }
      clearFieldError(input);
      return true;
    }

    return true;
  }

  function validateGender(): boolean {
    let isSelected = false;
    genderRadios.forEach((radio) => {
      if (radio.checked) isSelected = true;
    });
    if (!isSelected) {
      setGenderError("Please select your gender.");
      return false;
    }
    clearGenderError();
    return true;
  }

  // Attach real-time validation and error clearing
  const liveInputs: (ValidatableInput | null)[] = [
    nameInput, dobInput, addressInput, emailInput, phoneInput,
    guardianPhoneInput, cnicInput, fatherNameInput, teacherInput,
    marksInput, aboutInput
  ];

  liveInputs.forEach((input) => {
    input?.addEventListener("input", () => {
      const container = getContainer(input);
      if (container?.classList.contains("has-error")) {
        validateField(input);
      }
    });
  });

  [courseSelect, campusSelect, dobInput].forEach((select) => {
    select?.addEventListener("change", () => {
      const container = getContainer(select);
      if (container?.classList.contains("has-error")) {
        validateField(select);
      }
    });
  });

  genderRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (genderContainer?.classList.contains("has-error")) {
        validateGender();
      }
    });
  });

  // Auto format CNIC: 42101-1234567-1
  cnicInput?.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    let val = target.value.replace(/\D/g, "");
    if (val.length > 13) val = val.substring(0, 13);
    let formatted = val;
    if (val.length > 5 && val.length <= 12) {
      formatted = `${val.substring(0, 5)}-${val.substring(5)}`;
    } else if (val.length > 12) {
      formatted = `${val.substring(0, 5)}-${val.substring(5, 12)}-${val.substring(12, 13)}`;
    }
    target.value = formatted;
  });

  // ===== Register Modal Controls (Full-Screen) =====
  function openRegisterModal(): void {
    form?.reset();
    clearAllErrors();
    if (registerOverlay) registerOverlay.hidden = false;
    if (modalBody) modalBody.scrollTop = 0;
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      nameInput?.focus();
    }, 100);
  }

  function closeRegisterModal(): void {
    if (registerOverlay) registerOverlay.hidden = true;
    document.body.style.overflow = "";
    clearAllErrors();
  }

  openBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openRegisterModal();
    });
  });

  registerCloseBtn?.addEventListener("click", closeRegisterModal);

  // Stop propagation inside register modal
  registerModal?.addEventListener("click", (e) => e.stopPropagation());
  registerModal?.addEventListener("mousedown", (e) => e.stopPropagation());

  registerOverlay.addEventListener("mousedown", (e) => {
    mouseDownOnRegOverlay = e.target === registerOverlay;
  });
  registerOverlay.addEventListener("click", (e) => {
    if (mouseDownOnRegOverlay && e.target === registerOverlay)
      closeRegisterModal();
    mouseDownOnRegOverlay = false;
  });

  // ===== Success Modal Controls =====
  function openSuccessModal(): void {
    if (successOverlay) successOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      successCloseBtn?.focus();
    }, 100);
  }

  function closeSuccessModal(): void {
    if (successOverlay) successOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  successCloseX?.addEventListener("click", closeSuccessModal);
  successCloseBtn?.addEventListener("click", closeSuccessModal);

  successModal?.addEventListener("click", (e) => e.stopPropagation());
  successModal?.addEventListener("mousedown", (e) => e.stopPropagation());

  successOverlay.addEventListener("mousedown", (e) => {
    mouseDownOnSuccessOverlay = e.target === successOverlay;
  });
  successOverlay.addEventListener("click", (e) => {
    if (mouseDownOnSuccessOverlay && e.target === successOverlay)
      closeSuccessModal();
    mouseDownOnSuccessOverlay = false;
  });

  // Handle Escape Key for both modals
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (successOverlay && !successOverlay.hidden) {
        closeSuccessModal();
      } else if (registerOverlay && !registerOverlay.hidden) {
        closeRegisterModal();
      }
    }
  });

  // ===== Form Submission =====
  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();

    const fieldsToValidate: (ValidatableInput | null)[] = [
      nameInput,
      dobInput,
      addressInput,
      emailInput,
      phoneInput,
      guardianPhoneInput,
      cnicInput,
      fatherNameInput,
      courseSelect,
      teacherInput,
      campusSelect,
      marksInput,
      aboutInput
    ];

    let firstInvalid: HTMLElement | null = null;
    let hasError = false;

    // Check text/select fields
    fieldsToValidate.forEach((field) => {
      if (field) {
        const isValid = validateField(field);
        if (!isValid) {
          hasError = true;
          if (!firstInvalid) {
            firstInvalid = field;
          }
        }
      }
    });

    // Check gender
    const isGenderValid = validateGender();
    if (!isGenderValid) {
      hasError = true;
      if (!firstInvalid) {
        firstInvalid = document.getElementById("gender-male") || genderContainer;
      }
    }

    if (hasError) {
      if (firstInvalid) {
        firstInvalid.focus?.();
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // All fields are valid:
    // 1. Close the registration form modal cleanly
    closeRegisterModal();

    // 2. Open the dedicated Success Confirmation Modal
    openSuccessModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initModals();
});
