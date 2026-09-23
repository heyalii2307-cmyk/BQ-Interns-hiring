"use strict";
// Bano Qabil — Incubation Center Internship landing page
// Handles light/dark theme toggle with persistence + system-preference fallback,
// full-screen form validation, and dedicated success confirmation modal.

const STORAGE_KEY = "bano-qabil-theme";

function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
        return saved;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
}

function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    if (!toggleBtn)
        return;
    applyTheme(getPreferredTheme());
    toggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
    });
}

function initModals() {
    // Registration Form Modal Elements (Full-Screen)
    const registerOverlay = document.getElementById("register-overlay");
    const registerModal = registerOverlay?.querySelector(".modal");
    const modalBody = registerOverlay?.querySelector(".modal-body");
    const openBtns = document.querySelectorAll(".js-open-register");
    const registerCloseBtn = document.getElementById("register-close");
    const form = document.getElementById("register-form");

    // Dedicated Success Modal Elements
    const successOverlay = document.getElementById("success-overlay");
    const successModal = successOverlay?.querySelector(".modal");
    const successCloseX = document.getElementById("success-close-x");
    const successCloseBtn = document.getElementById("success-close-btn");

    if (!registerOverlay || !registerModal || !form || !modalBody || !successOverlay)
        return;

    let mouseDownOnRegOverlay = false;
    let mouseDownOnSuccessOverlay = false;

    // Form field references
    const nameInput = document.getElementById("reg-name");
    const dobInput = document.getElementById("reg-dob");
    const genderContainer = document.getElementById("gender-group-container");
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const addressInput = document.getElementById("reg-address");
    const emailInput = document.getElementById("reg-email");
    const phoneInput = document.getElementById("reg-phone");
    const guardianPhoneInput = document.getElementById("reg-guardian-phone");
    const cnicInput = document.getElementById("reg-cnic");
    const fatherNameInput = document.getElementById("reg-father-name");
    const courseSelect = document.getElementById("reg-course");
    const teacherInput = document.getElementById("reg-teacher");
    const campusSelect = document.getElementById("reg-campus");
    const marksInput = document.getElementById("reg-marks");
    const aboutInput = document.getElementById("reg-about");

    function getContainer(input) {
        if (!input) return null;
        return input.closest(".form-row, .form-row-split > div, .gender-group");
    }

    function getErrorElement(input) {
        if (!input) return null;
        return document.getElementById(`error-${input.id}`);
    }

    function setFieldError(input, message) {
        const container = getContainer(input);
        const errorEl = getErrorElement(input);
        if (container) {
            container.classList.add("has-error");
        }
        if (input && input.setAttribute) {
            input.setAttribute("aria-invalid", "true");
        }
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function clearFieldError(input) {
        const container = getContainer(input);
        const errorEl = getErrorElement(input);
        if (container) {
            container.classList.remove("has-error");
        }
        if (input && input.removeAttribute) {
            input.removeAttribute("aria-invalid");
        }
        if (errorEl) {
            errorEl.textContent = "";
        }
    }

    function clearGenderError() {
        if (genderContainer) {
            genderContainer.classList.remove("has-error");
        }
        const errorEl = document.getElementById("error-gender");
        if (errorEl) {
            errorEl.textContent = "";
        }
    }

    function setGenderError(message) {
        if (genderContainer) {
            genderContainer.classList.add("has-error");
        }
        const errorEl = document.getElementById("error-gender");
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function clearAllErrors() {
        const textInputs = [
            nameInput, dobInput, addressInput, emailInput, phoneInput,
            guardianPhoneInput, cnicInput, fatherNameInput, courseSelect,
            teacherInput, campusSelect, marksInput, aboutInput
        ];
        textInputs.forEach((field) => {
            if (field) clearFieldError(field);
        });
        clearGenderError();
    }

    function validateField(input) {
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

    function validateGender() {
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
    const liveInputs = [
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
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 13) val = val.substring(0, 13);
        let formatted = val;
        if (val.length > 5 && val.length <= 12) {
            formatted = `${val.substring(0, 5)}-${val.substring(5)}`;
        } else if (val.length > 12) {
            formatted = `${val.substring(0, 5)}-${val.substring(5, 12)}-${val.substring(12, 13)}`;
        }
        e.target.value = formatted;
    });

    // ===== Register Modal Controls (Full-Screen) =====
    function openRegisterModal() {
        form.reset();
        clearAllErrors();
        registerOverlay.hidden = false;
        modalBody.scrollTop = 0;
        document.body.style.overflow = "hidden";

        setTimeout(() => {
            nameInput?.focus();
        }, 100);
    }

    function closeRegisterModal() {
        registerOverlay.hidden = true;
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
    registerModal.addEventListener("click", (e) => e.stopPropagation());
    registerModal.addEventListener("mousedown", (e) => e.stopPropagation());

    registerOverlay.addEventListener("mousedown", (e) => {
        mouseDownOnRegOverlay = e.target === registerOverlay;
    });
    registerOverlay.addEventListener("click", (e) => {
        if (mouseDownOnRegOverlay && e.target === registerOverlay)
            closeRegisterModal();
        mouseDownOnRegOverlay = false;
    });

    // ===== Success Modal Controls =====
    function openSuccessModal() {
        successOverlay.hidden = false;
        document.body.style.overflow = "hidden";
        setTimeout(() => {
            successCloseBtn?.focus();
        }, 100);
    }

    function closeSuccessModal() {
        successOverlay.hidden = true;
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
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (!successOverlay.hidden) {
                closeSuccessModal();
            } else if (!registerOverlay.hidden) {
                closeRegisterModal();
            }
        }
    });

    // ===== Form Submission =====
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fieldsToValidate = [
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

        let firstInvalid = null;
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
