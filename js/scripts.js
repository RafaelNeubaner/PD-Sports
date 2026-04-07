document.addEventListener("DOMContentLoaded", () => {
	const themeToggle = document.getElementById("themeToggle");
	const body = document.body;
	const storageKey = "pd-sports-theme";
	const themeTargets = document.querySelectorAll(
		".btn-primary, .btn-outline, .btn-tamanho, .link"
	);

	const syncThemeClasses = (isDark) => {
		themeTargets.forEach((element) => {
			element.classList.toggle("darkmode", isDark);
		});
	};

	const setTheme = (isDark) => {
		body.classList.toggle("dark-mode", isDark);
		syncThemeClasses(isDark);

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
			setTheme(!body.classList.contains("dark-mode"));
		});
	}

	document.querySelectorAll(".btn-tamanho").forEach((button) => {
		button.addEventListener("click", () => {
			const group = button.parentElement;

			if (!group) {
				return;
			}

			group.querySelectorAll(".btn-tamanho").forEach((otherButton) => {
				otherButton.classList.remove("active");
			});

			button.classList.add("active");
		});
	});
});
