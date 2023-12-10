const token =
	"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcxYzJjMjBkOGEyMDAwMThhNDhhMmQiLCJpYXQiOjE3MDIyMDczMzUsImV4cCI6MTcwMzQxNjkzNX0.FNryDBM2cb_srdSx8s7TsPyXftK5bztj_8wb2tqT0YE";

// Endpoint API per i prodotti
const BaseUrl = "https://striveschool-api.herokuapp.com/api/product/";
let carrello = JSON.parse(localStorage.getItem("carrello")) || [];

const load = document.getElementById("loading");

// Funzione per recuperare i prodotti e renderizzarli a schermo
const fetchData = () => {
	load.style.display = "block";
	fetch(BaseUrl, {
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
		.then((products) => {
			const productsContainer = document.getElementById("products");
			productsContainer.innerHTML = " ";

			products.forEach((cell) => {
				const cardElement = creaCard(cell);
				productsContainer.appendChild(cardElement);
				load.style.display = "none";
			});
		})
		.catch((err) => {
			console.log("HUSTON ABBIAMO UN PROBLEMA: ", err);
			load.style.display = "none";
		});
};

// Funzione per creare la card di un prodotto
function creaCard(cell) {
	const col = document.createElement("div");
	col.className = "col-12 col-sm-6 col-md-4 col-lg-3 flex-grow-1 my-3";

	const card = document.createElement("div"); // creo un div con classe
	card.className = "card h-100  mb-5";

	const img = document.createElement("img");
	img.src = cell.imageUrl;
	img.className = "card-img-top";
	img.alt = cell.description;

	const cardBody = document.createElement("div"); // creo un div con classe
	cardBody.className = "card-body d-flex flex-column justify-content-between align-items-center bg-inf";

	const title = document.createElement("h5"); // creo un h5 con classe e contenuto
	title.className = "card-title";
	title.textContent = cell.name;

	const subTitle = document.createElement("p");
	subTitle.className = "card-description";
	subTitle.textContent = cell.description;

	const price = document.createElement("p"); // creo un p con classe e con contenuto il prezzo
	price.className = "card-text";
	price.textContent = `Prezzo: €${cell.price}`;

	// Creo un div per contenere i bottoni
	const buttonGroup = document.createElement("div");
	buttonGroup.className = "d-flex align-items-baseline justify-content-center flex-wrap my-gap";

	// Creo il bottone "Compra ora"
	const btnBuy = document.createElement("button");
	btnBuy.className = "btn btn-Buy px-3 py-1 mb-1";
	btnBuy.textContent = "Buy";
	btnBuy.onclick = () => {
		aggiungiAlCarrello(cell); // Aggiunge il cell al carrello
	};

	const btnFind = document.createElement("button");
	btnFind.className = "btn btn-Find px-3 py-1 mb-1";
	btnFind.textContent = "Find out More";
	btnFind.onclick = () => {
		window.location.href = `details.html?productId=${cell._id}`;
	};

	const btnEdit = document.createElement("button");
	btnEdit.className = "btn btn-Edit px-3 py-1 mb-1";
	btnEdit.textContent = "Edit";
	btnEdit.onclick = () => {
		// Reindirizza alla pagina di modifica con l'ID del prodotto come query parameter
		window.location.href = `edit_product.html?productId=${cell._id}&action=edit`;
	};

	// Creo il bottone "Scarta"
	const btnDiscard = document.createElement("button");
	btnDiscard.className = "btn btn-Discard px-3 py-1";
	btnDiscard.textContent = "Discard";
	btnDiscard.onclick = () => {
		window.location.href = `edit_product.html?productId=${cell._id}&action=discard`;
		// btnEdit.classList.add("d-none");
	};

	buttonGroup.appendChild(btnBuy);
	buttonGroup.appendChild(btnDiscard);
	buttonGroup.appendChild(btnEdit);
	buttonGroup.appendChild(btnFind);
	cardBody.appendChild(title);
	cardBody.appendChild(subTitle);
	cardBody.appendChild(price);
	cardBody.appendChild(buttonGroup);
	card.appendChild(img);
	card.appendChild(cardBody);
	col.appendChild(card);

	return col;
}

// Chiamata iniziale per popolare la pagina con i prodotti
fetchData();

function getProductIdFromUrl() {
	const queryParams = new URLSearchParams(window.location.search);
	return queryParams.get("productId");
}

class Product {
	constructor(name, description, brand, imageUrl, price) {
		this.name = name;
		this.description = description;
		this.brand = brand;
		this.imageUrl = imageUrl;
		this.price = price;
		// _id, userId, createdAt, updatedAt, e __v sono generati dal server e quindi non servono
	}

	// Metodo per inviare il prodotto all'API
	save() {
		return fetch(BaseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			body: JSON.stringify(this),
		});
	}
}

function aggiungiAlCarrello(cell) {
	carrello.push(cell);
	localStorage.setItem("carrello", JSON.stringify(carrello));

	// Aggiorna il carrello
	const listCarr = document.getElementById("lista-carrello");
	const carrElem = document.createElement("li");
	carrElem.className = "list-group-item d-flex justify-content-between align-items-center my-1 rounded-2 text-dark";
	carrElem.textContent = `${cell.name} - €${cell.price}`;

	// tasto rimuovi nel carrello
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

document.addEventListener("DOMContentLoaded", function () {
	caricaCarrello();
	// Creo un div che fungerà da contenitore per il pulsante
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

// Funzione di ricerca
const ricercaProdotti = (evento) => {
	evento.preventDefault();
	const termineDiRicerca = document.querySelector("#searchForm input[type='search']").value.trim().toLowerCase();

	if (termineDiRicerca) {
		load.style.display = "block";

		fetch(BaseUrl, {
			headers: {
				Authorization: token,
			},
		})
			.then((response) => response.json())
			.then((products) => {
				const productsContainer = document.getElementById("products");
				productsContainer.innerHTML = ""; // Pulisce i prodotti esistenti

				const prodottiFiltrati = products.filter((cell) => cell.name.toLowerCase().includes(termineDiRicerca));

				if (prodottiFiltrati.length === 0) {
					productsContainer.innerHTML = "<p>Nessun prodotto trovato.</p>";
				} else {
					prodottiFiltrati.forEach((cell) => {
						const cardElement = creaCard(cell);
						productsContainer.appendChild(cardElement);
					});
				}
			})
			.catch((err) => {
				console.error("Errore nella ricerca: ", err);
			})
			.finally(() => {
				load.style.display = "none"; // Nasconde il loader
			});
	}
};

// Collegamento del form di ricerca con la funzione di ricerca
document.getElementById("searchForm").addEventListener("submit", ricercaProdotti);

/// ATTENZIONE NON DECOMMENTARE SE NON NECESSARIO /////
// SE DECOMMENTATA CREA 20 CELL RANDOM
// function createAndSendProducts() {
// 	const productNames = ["Nokia", "Samsung", "Apple", "Xiaomi", "Huawei"];
// 	const descriptions = [
// 		"Indestructible cellphone",
// 		"Amazing camera",
// 		"Incredible battery life",
// 		"High performance",
// 		"Elegant design",
// 	];

// 	for (let i = 0; i < 21; i++) {
// 		// Genero un nome, una descrizione e un prezzo casuali
// 		const name = `${productNames[Math.floor(Math.random() * productNames.length)]} Model ${i}`;
// 		const description = descriptions[Math.floor(Math.random() * descriptions.length)];
// 		const price = Math.floor(Math.random() * 500) + 100; // Prezzo random tra 100 e 600
// 		const imageUrl = `https://picsum.photos/seed/${Math.random()}/300/300`;

// 		const newProduct = new Product(name, description, "Generic Brand", imageUrl, price);

// 		// Invia il nuovo prodotto all'API
// 		newProduct
// 			.save()
// 			.then((response) => response.json())
// 			.then((data) => {
// 				console.log("Prodotto creato:", data);
// 			})
// 			.catch((error) => {
// 				console.error("Errore durante la creazione del prodotto:", error);
// 			});
// 	}
// }

// createAndSendProducts();
