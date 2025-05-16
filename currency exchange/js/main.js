const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form #btn");
const loader = document.querySelector("form button:first-of-type");
dropList.forEach((list, index) => {
	for (currency_code in country_code) {
		let selected;
		if (index == 0) {
			selected = currency_code == "USD" ? "selected" : "";
		} else if (index == 1) {
			selected = currency_code == "EGP" ? "selected" : "";
		}
		let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
		list.innerHTML += optionTag;
	}
	list.addEventListener("change", e => {
		loadFlag(e.target);
	});
});
function loadFlag(element) {
	for (code in country_code) {
		if (code == element.value) {
			let imgTag = element.parentElement.querySelector("img"); // select the img element that is in the parent element
			imgTag.src = `https://flagsapi.com/${country_code[code]}/shiny/64.png`;
		}
	}
}
window.addEventListener("load", () => {
	getExchangeRate();
});
getButton.addEventListener("click", e => {
	e.preventDefault();
	getExchangeRate();
});
const exchangeIcon = document.querySelector(".icon");
exchangeIcon.addEventListener("click", () => {
	let current = fromCurrency.value;
	fromCurrency.value = toCurrency.value;
	toCurrency.value = fromCurrency.value;
	toCurrency.value = current;
	loadFlag(fromCurrency);
	loadFlag(toCurrency);
	getExchangeRate();
});
function getExchangeRate() {
	const amount = document.querySelector(".amount input");
	const exchangeRateTxt = document.querySelector(".exchange-rate");
	let amountVal = amount.value;
	if (amountVal === "" || amountVal === "0" || amountVal < 0 || isNaN(Number(amountVal))) {
		amount.value = "0";
		amountVal = 0;
	}

	// Show loader and hide button
	loader.classList.add("show");
	getButton.classList.add("hidden");

	exchangeRateTxt.innerText = "Retrieving the exchange rate...";

	let url = `https://v6.exchangerate-api.com/v6/0ba86546bb36671f235d49cb/latest/${fromCurrency.value}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			let exchangeRate = data.conversion_rates[toCurrency.value];
			let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
			exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
		})
		.catch(() => {
			exchangeRateTxt.innerText = "An error occurred!";
		})
		.finally(() => {
			// Hide loader and show button
			loader.classList.remove("show");
			getButton.classList.remove("hidden");
		});
}
