const token =
	"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcxYzJjMjBkOGEyMDAwMThhNDhhMmQiLCJpYXQiOjE3MDE5NjQyODMsImV4cCI6MTcwMzE3Mzg4M30.Pwm4ZG_VoplT5M_Xw7oAwt9aeX83M7G0rn1_3ONiW9Y";

const BaseUrl = "https://striveschool-api.herokuapp.com/api/product/";

let carrello = JSON.parse(localStorage.getItem("carrello")) || [];

function creaCard(cell) {
	const col = document.createElement("div");
	col.className = "col-10";

	const card = document.createElement("div"); // creo un div con classe
	card.className = "card p-2 mb-5";
	card.id = cell._id;
	card.style = "max-height:600px";

	const img = document.createElement("img");
	img.src = cell.imageUrl;
	img.className = "card-img-top";
	img.alt = cell.description;

	const cardBody = document.createElement("div"); // creo un div con classe
	cardBody.className = "card-body d-flex flex-column justify-content-between align-items-center";

	const title = document.createElement("h5"); // creo un h5 con classe e contenuto
	title.className = "card-title";
	title.textContent = cell.name;

	const price = document.createElement("p"); // creo un p con classe e con contenuto il prezzo
	price.className = "card-text";
	price.textContent = `Prezzo: €${cell.price}`;

	// Creo un div per contenere i bottoni
	const buttonGroup = document.createElement("div");
	buttonGroup.className = "d-flex align-items-baseline justify-content-center flex-wrap my-gap";

	// Creo il bottone "Compra ora"
	const btnCompra = document.createElement("button");
	btnCompra.className = "btn btn-success  px-3 py-1 mb-1";
	btnCompra.textContent = "Buy";
	btnCompra.onclick = () => {
		aggiungiAlCarrello(cell); // Aggiunge il cell al carrello
	};

	buttonGroup.appendChild(btnCompra);
	cardBody.appendChild(title);
	cardBody.appendChild(price);
	cardBody.appendChild(buttonGroup);
	card.appendChild(img);
	card.appendChild(cardBody);
	col.appendChild(card);

	return col;
}

document.addEventListener("DOMContentLoaded", () => {
	const productId = getProductIdFromUrl();
	fetchProductDetails(productId);
	caricaCarrello();
	const divContainer = document.createElement("div");
	divContainer.className = "text-center mt-3"; // Aggiungi le classi per centraggio e margin-top

	// Creo il btn per svuotare il carrello
	const btnClear = document.createElement("button");
	btnClear.className = "btn btn-warning btn-sm fw-bold px-3 py-1";
	btnClear.textContent = "Clear cart";
	btnClear.onclick = funClear;

	// Aggiungo il btn al div contenitore
	divContainer.appendChild(btnClear);

	// Aggiungo il div contenitore sotto la lista del carrello
	document.getElementById("btn-Clear").appendChild(divContainer);
});

function getProductIdFromUrl() {
	const queryParams = new URLSearchParams(window.location.search);
	return queryParams.get("productId");
}

function fetchProductDetails(productId) {
	fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`, {
		headers: {
			Authorization: token,
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Errore nel reperimento dei dati");
			}
			return response.json();
		})
		.then((productDetails) => {
			displayProductDetails(productDetails);
		})
		.catch((err) => {
			console.error("Errore:", err);
		});
}

function displayProductDetails(product) {
	const detailsContainer = document.getElementById("product-details");
	detailsContainer.innerHTML = "";
	const cardElement = creaCard(product);
	detailsContainer.appendChild(cardElement);
	const descriptionContainer = document.querySelector(".description");
	descriptionContainer.innerHTML = product.description;
	descriptionContainer.className = "fs-3 text-dark mt-3";
}

function aggiungiAlCarrello(cell) {
	carrello.push(cell);
	localStorage.setItem("carrello", JSON.stringify(carrello));

	const listCarr = document.getElementById("lista-carrello");
	const carrElem = document.createElement("li");
	carrElem.className = "list-group-item d-flex justify-content-between align-items-center my-1 rounded-2 ";
	carrElem.textContent = `${cell.name} - €${cell.price}`;

	const btnRemove = document.createElement("button");
	btnRemove.className = "btn btn-danger btn-sm px-3 py-1";
	btnRemove.textContent = "Rimuovi";
	btnRemove.onclick = function () {
		rimuoviDalCarrello(cell, carrElem);
	};

	carrElem.appendChild(btnRemove);
	listCarr.appendChild(carrElem);
}

function rimuoviDalCarrello(cellDaRimuovere, elementoCarrello) {
	const indice = carrello.findIndex((c) => c._id === cellDaRimuovere._id);
	if (indice > -1) {
		carrello.splice(indice, 1);
		localStorage.setItem("carrello", JSON.stringify(carrello));
		elementoCarrello.remove();
	}
	aggiornaCarrelloUI();
}

function caricaCarrello() {
	carrello = JSON.parse(localStorage.getItem("carrello")) || [];
	aggiornaCarrelloUI();
}

function aggiornaCarrelloUI() {
	const listCarr = document.getElementById("lista-carrello");
	listCarr.innerHTML = ""; // Pulisci la lista del carrello UI
	carrello.forEach((cell) => {
		const carrElem = document.createElement("li");
		carrElem.className = "list-group-item d-flex justify-content-between align-items-center my-1 rounded-2 ";
		carrElem.textContent = `${cell.name} - €${cell.price}`;

		const btnRemove = document.createElement("button");
		btnRemove.className = "btn btn-danger btn-sm px-3 py-1";
		btnRemove.textContent = "Rimuovi";
		btnRemove.onclick = function () {
			rimuoviDalCarrello(cell, carrElem);
		};

		carrElem.appendChild(btnRemove);
		listCarr.appendChild(carrElem);
	});
}

function funClear() {
	carrello.length = 0;
	localStorage.setItem("carrello", JSON.stringify(carrello));
	document.getElementById("lista-carrello").innerHTML = "";
}
