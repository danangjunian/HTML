document.addEventListener("DOMContentLoaded", () => {
            const steps = Array.from(document.querySelectorAll(".step"));
            const contents = Array.from(document.querySelectorAll(".step-content"));
            const optionButtons = Array.from(document.querySelectorAll(".option-button"));
            const prevButton = document.getElementById("prevStep");
            const nextButton = document.getElementById("nextStep");
            const titleEl = document.getElementById("wizardTitle");
            const subtitleEl = document.getElementById("wizardSubtitle");
            const pindahanSections = Array.from(document.querySelectorAll("[data-pindahan-section]"));
            const baruSections = Array.from(document.querySelectorAll("[data-baru-section]"));
            const wniSections = Array.from(document.querySelectorAll("[data-wni-section]"));
            const baruDocumentSections = Array.from(document.querySelectorAll("[data-baru-document]"));
            const pindahanDocumentSections = Array.from(document.querySelectorAll("[data-pindahan-document]"));
            const wnaDocumentSections = Array.from(document.querySelectorAll("[data-wna-document]"));
            const wniRequiredFields = Array.from(document.querySelectorAll("[data-wni-required]"));
            const baruRequiredFields = Array.from(document.querySelectorAll("[data-baru-required]"));
            const jenjangSelect = document.querySelector("[data-jenjang-select]");
            const jenjangPanels = Array.from(document.querySelectorAll("[data-jenjang-panel]"));
            const jenjangRequiredFields = Array.from(document.querySelectorAll("[data-jenjang-required]"));
            const nationalitySelect = document.querySelector("[data-nationality-select]");
            const form = document.querySelector(".wizard-form");

            const stepCopy = [
                {
                    title: "Pendaftaran Siswa",
                    subtitle: "Pilih jenis pendaftaran yang sesuai untuk memulai proses pendaftaran."
                },
                {
                    title: "Data Calon Siswa",
                    subtitle: "Lengkapi identitas calon siswa secara lengkap dan sesuai dokumen resmi."
                },
                {
                    title: "Data Keluarga & Riwayat",
                    subtitle: "Isikan informasi orang tua/wali serta riwayat pendidikan sebelumnya."
                },
                {
                    title: "Preferensi &amp; Dokumen",
                    subtitle: "Berikan preferensi tambahan dan lengkapi dokumen pendukung."
                }
            ];

            let currentStep = 1;
            const totalSteps = contents.length;
            let selectedType = null;
            let selectedNationality = nationalitySelect ? nationalitySelect.value || null : null;

            const updateJenjangPanels = () => {
                if (!jenjangSelect) {
                    return;
                }
                const isPindahan = selectedType === "pindahan";
                const currentValue = !isPindahan ? jenjangSelect.value : "";

                if (isPindahan && jenjangSelect.value) {
                    jenjangSelect.value = "";
                }

                jenjangPanels.forEach(panel => {
                    if (!isPindahan && currentValue && panel.dataset.jenjangPanel === currentValue) {
                        panel.style.display = "flex";
                    } else {
                        panel.style.display = "none";
                    }
                });

                jenjangRequiredFields.forEach(field => {
                    if (!isPindahan && currentValue && field.dataset.jenjangRequired === currentValue) {
                        field.setAttribute("required", "required");
                    } else {
                        field.removeAttribute("required");
                    }
                });
            };

            const updateNationalitySections = () => {
                const isWni = selectedNationality === "wni";
                wniSections.forEach(section => {
                    section.style.display = isWni ? "flex" : "none";
                });
                wniRequiredFields.forEach(field => {
                    if (isWni) {
                        field.setAttribute("required", "required");
                    } else {
                        field.removeAttribute("required");
                    }
                });
            };

            const updateDocumentSections = () => {
                const isPindahan = selectedType === "pindahan";
                const isWna = selectedNationality === "wna";
                baruDocumentSections.forEach(section => {
                    section.style.display = !isWna && !isPindahan ? "block" : "none";
                });
                pindahanDocumentSections.forEach(section => {
                    section.style.display = !isWna && isPindahan ? "block" : "none";
                });
                wnaDocumentSections.forEach(section => {
                    section.style.display = isWna ? "block" : "none";
                });
            };

            const updatePindahanSections = () => {
                const isPindahan = selectedType === "pindahan";
                pindahanSections.forEach(section => {
                    section.style.display = isPindahan ? "" : "none";
                    section.querySelectorAll("[data-pindahan-required]").forEach(field => {
                        if (isPindahan) {
                            field.setAttribute("required", "required");
                        } else {
                            field.removeAttribute("required");
                        }
                    });
                });
                baruSections.forEach(section => {
                    section.style.display = isPindahan ? "none" : "";
                });
                baruRequiredFields.forEach(field => {
                    if (!isPindahan) {
                        field.setAttribute("required", "required");
                    } else {
                        field.removeAttribute("required");
                    }
                });
                updateJenjangPanels();
            };

            const refreshVisibility = () => {
                updatePindahanSections();
                updateNationalitySections();
                updateDocumentSections();
            };

            const renderStep = () => {
                steps.forEach((step, index) => {
                    step.classList.toggle("active", index + 1 === currentStep);
                });

                contents.forEach(content => {
                    content.classList.toggle("active", Number(content.dataset.step) === currentStep);
                });

                const copy = stepCopy[currentStep - 1];
                if (copy) {
                    titleEl.textContent = copy.title;
                    subtitleEl.innerHTML = copy.subtitle;
                }

                prevButton.disabled = currentStep === 1;
                nextButton.disabled = currentStep === 1 && !selectedType;
                if (currentStep === totalSteps) {
                    nextButton.textContent = "Simpan Pendaftaran";
                } else {
                    nextButton.textContent = "Langkah Selanjutnya \u2192";
                }

                refreshVisibility();
            };

            optionButtons.forEach(button => {
                button.addEventListener("click", () => {
                    selectedType = button.dataset.type;
                    optionButtons.forEach(btn => btn.classList.toggle("selected", btn === button));
                    renderStep();
                });
            });

            if (nationalitySelect) {
                nationalitySelect.addEventListener("change", event => {
                    selectedNationality = event.target.value || null;
                    refreshVisibility();
                });
            }

            if (jenjangSelect) {
                jenjangSelect.addEventListener("change", updateJenjangPanels);
            }

            prevButton.addEventListener("click", () => {
                if (currentStep > 1) {
                    currentStep -= 1;
                    renderStep();
                }
            });

            nextButton.addEventListener("click", () => {
                if (currentStep < totalSteps) {
                    currentStep += 1;
                    renderStep();
                } else {
                    window.alert("Form pendaftaran siap dikirim. Silakan lanjutkan proses penyimpanan.");
                }
            });

            if (form) {
                form.addEventListener("submit", event => {
                    event.preventDefault();
                });
            }

            renderStep();
        });
