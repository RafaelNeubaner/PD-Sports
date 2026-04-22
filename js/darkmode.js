document.addEventListener("DOMContentLoaded", () => {
	const themeToggle = document.getElementById("themeToggle");
	const body = document.body;
	const storageKey = "pd-sports-theme";
	const themeSelector = ".btnPrimary, .btnOutline, .btnTamanho, .link";
	const darkLogoName = "logo-dark.svg";
	const lightLogoName = "logo-light.svg";

	const syncThemeClasses = (isDark) => {
		const themeTargets = document.querySelectorAll(themeSelector);
		themeTargets.forEach((element) => {
			element.classList.toggle("darkmode", isDark);
		});
	};

	const syncLogos = (isDark) => {
		const logos = document.querySelectorAll("img#logo");
		if (logos.length === 0) {
			return;
		}

		logos.forEach((logo) => {
			const currentSrc = logo.getAttribute("src") || "";
			if (!currentSrc) {
				return;
			}

			const targetLogo = isDark ? darkLogoName : lightLogoName;
			const nextSrc = currentSrc.replace(/logo-(light|dark)\.svg(?=$|[?#])/i, targetLogo);

			if (nextSrc !== currentSrc) {
				logo.setAttribute("src", nextSrc);
			}
		});
	};

	const setTheme = (isDark) => {
		body.classList.toggle("darkMode", isDark);
		syncThemeClasses(isDark);
		syncLogos(isDark);

		if (themeToggle) {
			themeToggle.setAttribute("aria-pressed", String(isDark));
			const icon = themeToggle.querySelector("i");
			if (icon) {
				icon.className = isDark ? "bi bi-sun" : "bi bi-moon-stars";
			}
		}

		localStorage.setItem(storageKey, isDark ? "dark" : "light");
	};

	const savedTheme = localStorage.getItem(storageKey);
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	setTheme(savedTheme ? savedTheme === "dark" : prefersDark);

	if (themeToggle) {
		themeToggle.addEventListener("click", () => {
			setTheme(!body.classList.contains("darkMode"));
		});
	}

	document.querySelectorAll(".btnTamanho").forEach((button) => {
		button.addEventListener("click", () => {
			const group = button.parentElement;

			if (!group) {
				return;
			}

			group.querySelectorAll(".btnTamanho").forEach((otherButton) => {
				otherButton.classList.remove("active");
			});

			button.classList.add("active");
		});
	});
});
