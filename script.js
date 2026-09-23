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

    const STORAGE_DRAFT_KEY = "bano-qabil-registration-draft";

    function saveFormDraft() {
        try {
            const selectedGender = document.querySelector('input[name="gender"]:checked')?.value || "";
            const draft = {
                name: nameInput?.value || "",
                dob: dobInput?.value || "",
                gender: selectedGender,
                cnic: cnicInput?.value || "",
                father_name: fatherNameInput?.value || "",
                address: addressInput?.value || "",
                email: emailInput?.value || "",
                phone: phoneInput?.value || "",
                guardian_phone: guardianPhoneInput?.value || "",
                course: courseSelect?.value || "",
                teacher: teacherInput?.value || "",
                campus: campusSelect?.value || "",
                marks: marksInput?.value || "",
                about: aboutInput?.value || "",
                currentStep: currentStep || 1
            };
            const hasData = Object.entries(draft).some(([k, v]) => k !== "currentStep" && v !== "");
            if (hasData) {
                localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
            }
        } catch (e) {}
    }

    function loadFormDraft() {
        try {
            const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
            if (!raw) return false;
            const draft = JSON.parse(raw);
            if (!draft || typeof draft !== "object") return false;

            if (draft.name && nameInput) nameInput.value = draft.name;
            if (draft.dob && dobInput) dobInput.value = draft.dob;
            if (draft.gender) {
                genderRadios.forEach((r) => {
                    r.checked = r.value === draft.gender;
                });
            }
            if (draft.cnic && cnicInput) cnicInput.value = draft.cnic;
            if (draft.father_name && fatherNameInput) fatherNameInput.value = draft.father_name;
            if (draft.address && addressInput) addressInput.value = draft.address;
            if (draft.email && emailInput) emailInput.value = draft.email;
            if (draft.phone && phoneInput) phoneInput.value = draft.phone;
            if (draft.guardian_phone && guardianPhoneInput) guardianPhoneInput.value = draft.guardian_phone;
            if (draft.course && courseSelect) courseSelect.value = draft.course;
            if (draft.teacher && teacherInput) teacherInput.value = draft.teacher;
            if (draft.campus && campusSelect) campusSelect.value = draft.campus;
            if (draft.marks && marksInput) marksInput.value = draft.marks;
            if (draft.about && aboutInput) aboutInput.value = draft.about;

            if (draft.currentStep && draft.currentStep >= 1 && draft.currentStep <= TOTAL_STEPS) {
                currentStep = draft.currentStep;
                updateStepUI();
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    function clearFormDraft() {
        try {
            localStorage.removeItem(STORAGE_DRAFT_KEY);
        } catch (e) {}
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
            let digitsOnly = val.replace(/\D/g, "");
            if (digitsOnly.startsWith("92") && digitsOnly.length === 12) {
                digitsOnly = digitsOnly.substring(2);
            } else if (digitsOnly.startsWith("0") && digitsOnly.length === 11) {
                digitsOnly = digitsOnly.substring(1);
            }
            if (digitsOnly.length !== 10) {
                setFieldError(input, "Phone number must contain 10 digits (e.g. 300 1234567).");
                return false;
            }
            if (digitsOnly[0] !== "3") {
                setFieldError(input, "Pakistani mobile number must start with 3 (e.g. 300 1234567).");
                return false;
            }
            if (/^30{9}$/.test(digitsOnly) || /^(\d)\1{9}$/.test(digitsOnly)) {
                setFieldError(input, "Please enter a valid phone number.");
                return false;
            }
            clearFieldError(input);
            return true;
        }

        if (input === guardianPhoneInput) {
            if (val) {
                let digitsOnly = val.replace(/\D/g, "");
                if (digitsOnly.startsWith("92") && digitsOnly.length === 12) {
                    digitsOnly = digitsOnly.substring(2);
                } else if (digitsOnly.startsWith("0") && digitsOnly.length === 11) {
                    digitsOnly = digitsOnly.substring(1);
                }
                if (digitsOnly.length !== 10) {
                    setFieldError(input, "Guardian number must contain 10 digits (e.g. 300 1234567).");
                    return false;
                }
                if (digitsOnly[0] !== "3") {
                    setFieldError(input, "Guardian number must start with 3 (e.g. 300 1234567).");
                    return false;
                }
                if (/^30{9}$/.test(digitsOnly) || /^(\d)\1{9}$/.test(digitsOnly)) {
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
                setFieldError(input, "CNIC must contain exactly 13 digits (e.g. 42101-1234567-1).");
                return false;
            }
            if (digitsOnly[0] !== "4") {
                setFieldError(input, "CNIC must start with 4 (e.g. 42101-1234567-1).");
                return false;
            }
            // Reject dummy / all zeros / repetitive test patterns
            if (/^40{12}$/.test(digitsOnly) || /^(\d)\1{12}$/.test(digitsOnly) || /^4(\d)\1{11}$/.test(digitsOnly)) {
                setFieldError(input, "Please enter a valid, non-dummy CNIC number.");
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

    // Attach real-time validation and error clearing + auto-save
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
            saveFormDraft();
        });
    });

    [courseSelect, campusSelect, dobInput].forEach((select) => {
        select?.addEventListener("change", () => {
            const container = getContainer(select);
            if (container?.classList.contains("has-error")) {
                validateField(select);
            }
            saveFormDraft();
        });
    });

    genderRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            if (genderContainer?.classList.contains("has-error")) {
                validateGender();
            }
            saveFormDraft();
        });
    });

    // Auto format CNIC: 42101-1234567-1 (max 13 digits)
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
        saveFormDraft();
    });

    // Phone formatters for +92 prefix inputs
    function setupPhoneFormatter(input) {
        if (!input) return;
        input.addEventListener("input", (e) => {
            let val = e.target.value.replace(/\D/g, "");
            if (val.startsWith("92") && val.length > 10) {
                val = val.substring(2);
            } else if (val.startsWith("0") && val.length > 10) {
                val = val.substring(1);
            }
            if (val.length > 10) val = val.substring(0, 10);
            let formatted = val;
            if (val.length > 3) {
                formatted = `${val.substring(0, 3)} ${val.substring(3)}`;
            }
            e.target.value = formatted;
            saveFormDraft();
        });
    }

    setupPhoneFormatter(phoneInput);
    setupPhoneFormatter(guardianPhoneInput);

    // ===== Multi-Step Form Controls =====
    let currentStep = 1;
    const TOTAL_STEPS = 4;
    const stepTitles = [
        "Personal Information",
        "Contact Information",
        "Course Details",
        "About You"
    ];

    const prevBtn = document.getElementById("form-prev-btn");
    const nextBtn = document.getElementById("form-next-btn");
    const submitBtn = document.getElementById("register-submit-btn");
    const stepIndicator = document.getElementById("form-step-indicator");
    const stepPercent = document.getElementById("form-step-percent");
    const progressFill = document.getElementById("form-progress-fill");
    const progressBar = document.getElementById("form-progress-bar");

    function updateStepUI() {
        for (let i = 1; i <= TOTAL_STEPS; i++) {
            const stepEl = document.getElementById(`form-step-${i}`);
            if (stepEl) {
                if (i === currentStep) {
                    stepEl.hidden = false;
                    stepEl.classList.add("active");
                } else {
                    stepEl.hidden = true;
                    stepEl.classList.remove("active");
                }
            }
        }

        const percentage = Math.round((currentStep / TOTAL_STEPS) * 100);

        if (stepIndicator) {
            stepIndicator.textContent = `Step ${currentStep} of ${TOTAL_STEPS} — ${stepTitles[currentStep - 1]}`;
        }
        if (stepPercent) {
            stepPercent.textContent = `${percentage}%`;
        }
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        if (progressBar) {
            progressBar.setAttribute("aria-valuenow", String(currentStep));
        }

        if (prevBtn) {
            prevBtn.style.display = currentStep > 1 ? "inline-flex" : "none";
        }

        if (currentStep === TOTAL_STEPS) {
            if (nextBtn) nextBtn.style.display = "none";
            if (submitBtn) submitBtn.style.display = "inline-flex";
        } else {
            if (nextBtn) nextBtn.style.display = "inline-flex";
            if (submitBtn) submitBtn.style.display = "none";
        }
    }

    function goToStep(stepNum) {
        if (stepNum < 1 || stepNum > TOTAL_STEPS) return;
        currentStep = stepNum;
        updateStepUI();
        saveFormDraft();

        if (modalBody) {
            modalBody.scrollTo({ top: 0, behavior: "smooth" });
        }

        setTimeout(() => {
            if (currentStep === 1) nameInput?.focus();
            else if (currentStep === 2) addressInput?.focus();
            else if (currentStep === 3) courseSelect?.focus();
            else if (currentStep === 4) aboutInput?.focus();
        }, 100);
    }

    function validateStep(stepNum) {
        let firstInvalid = null;
        let hasError = false;

        function checkField(field) {
            if (field) {
                const isValid = validateField(field);
                if (!isValid) {
                    hasError = true;
                    if (!firstInvalid) firstInvalid = field;
                }
            }
        }

        if (stepNum === 1) {
            checkField(nameInput);
            checkField(dobInput);
            const isGenderValid = validateGender();
            if (!isGenderValid) {
                hasError = true;
                if (!firstInvalid) {
                    firstInvalid = document.getElementById("gender-male") || genderContainer;
                }
            }
            checkField(cnicInput);
            checkField(fatherNameInput);
        } else if (stepNum === 2) {
            checkField(addressInput);
            checkField(emailInput);
            checkField(phoneInput);
            checkField(guardianPhoneInput);
        } else if (stepNum === 3) {
            checkField(courseSelect);
            checkField(teacherInput);
            checkField(campusSelect);
            checkField(marksInput);
        } else if (stepNum === 4) {
            checkField(aboutInput);
        }

        if (hasError && firstInvalid) {
            firstInvalid.focus?.();
            firstInvalid.scrollIntoView?.({ behavior: "smooth", block: "center" });
            return false;
        }

        return !hasError;
    }

    nextBtn?.addEventListener("click", () => {
        if (validateStep(currentStep)) {
            goToStep(currentStep + 1);
        }
    });

    prevBtn?.addEventListener("click", () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });

    // ===== Register Modal Controls (Full-Screen) =====
    function openRegisterModal() {
        clearAllErrors();
        const hasDraft = loadFormDraft();
        if (!hasDraft) {
            goToStep(1);
        }
        registerOverlay.hidden = false;
        modalBody.scrollTop = 0;
        document.body.style.overflow = "hidden";

        setTimeout(() => {
            if (currentStep === 1) nameInput?.focus();
            else if (currentStep === 2) addressInput?.focus();
            else if (currentStep === 3) courseSelect?.focus();
            else if (currentStep === 4) aboutInput?.focus();
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

        // If user triggers submit (e.g. Enter key) on an earlier step, validate and advance
        if (currentStep < TOTAL_STEPS) {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
            return;
        }

        // On the final step, validate all steps from 1 to 4
        for (let s = 1; s <= TOTAL_STEPS; s++) {
            if (!validateStep(s)) {
                if (currentStep !== s) {
                    goToStep(s);
                    validateStep(s);
                }
                return; // Submission failed -> data remains in localStorage!
            }
        }

        // All fields are valid and submission succeeded:
        // 1. Close the registration form modal cleanly
        closeRegisterModal();

        // 2. Remove saved draft from localStorage ONLY after successful submission
        clearFormDraft();

        // 3. Reset form and reset step state
        form.reset();
        currentStep = 1;
        updateStepUI();

        // 4. Open the dedicated Success Confirmation Modal
        openSuccessModal();
    });

    // Load any saved draft on initialization
    loadFormDraft();
}

function initMobileMenu() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const drawer = document.getElementById("mobile-nav-drawer");
    if (!menuBtn || !drawer) return;

    function toggleMenu(open) {
        const isOpen = open !== undefined ? open : drawer.hidden;
        drawer.hidden = !isOpen;
        menuBtn.classList.toggle("active", isOpen);
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    }

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    drawer.querySelectorAll("a, button").forEach((item) => {
        item.addEventListener("click", () => {
            toggleMenu(false);
        });
    });

    document.addEventListener("click", (e) => {
        if (!drawer.hidden && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
            toggleMenu(false);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initModals();
    initMobileMenu();
});
