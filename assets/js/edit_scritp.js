const token =
	"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcxYzJjMjBkOGEyMDAwMThhNDhhMmQiLCJpYXQiOjE3MDIyMDczMzUsImV4cCI6MTcwMzQxNjkzNX0.FNryDBM2cb_srdSx8s7TsPyXftK5bztj_8wb2tqT0YE";

class Product {
	constructor(name, description, brand, imageUrl, price) {
		this.name = name;
		this.description = description;
		this.brand = brand;
		this.imageUrl = imageUrl;
		this.price = price;
		// _id, userId, createdAt, updatedAt, e __v sono generati dal server e quindi non servono
	}
}

const queryParams = new URLSearchParams(window.location.search);
const resourceId = queryParams.get("productId");
const action = queryParams.get("action");
const titlePage = document.getElementById("titlePage");
const BaseUrl = "https://striveschool-api.herokuapp.com/api/product/" + resourceId;
const deleteBtn = document.getElementById("deleteButton");
const editBtn = document.getElementById("editButton");
const homeBtn = document.getElementById("homeButton");
let method;

if (action === "edit") {
	method = "PUT";
} else if (action === "discard") {
	method = "DELETE";
}
console.log("Method:", method);
console.log("URL: ", BaseUrl);

const showAlert = (message, colorCode = "primary") => {
	const alertBox = document.getElementById("alert-box");
	alertBox.innerHTML = `<div class="alert alert-${colorCode}" role="alert">
						${message}
						</div>`;
	setTimeout(() => {
		alertBox.innerHTML = "";
	}, 3000);
};

if (resourceId && action === "edit") {
	titlePage.innerText = "Edit Card";
	titlePage.classList.add("text-primary");
	deleteBtn.classList.add("d-none");
	homeBtn.classList.remove("d-none");
} else {
	titlePage.innerText = "Delete Card";
	titlePage.classList.add("text-danger");
	editBtn.classList.add("d-none");
}

window.addEventListener("DOMContentLoaded", () => {
	loadProductData(resourceId);

	function loadProductData(productId) {
		fetch(`${BaseUrl}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((productData) => {
				// Popolo il form
				document.getElementById("name").value = productData.name;
				document.getElementById("description").value = productData.description;
				document.getElementById("brand").value = productData.brand;
				document.getElementById("imageUrl").value = productData.imageUrl;
				document.getElementById("price").value = productData.price;

				// Popolo la card
				document.getElementById("previewName").textContent = productData.name;
				document.getElementById("previewDescription").textContent = productData.description;
				document.getElementById("previewBrand").textContent = productData.brand;
				document.getElementById("previewImage").src = productData.imageUrl;
				document.getElementById("previewPrice").textContent = "Prezzo: €" + productData.price;
			})
			.catch((error) => {
				console.error("There has been a problem with your fetch operation:", error);
			});
	}

	document.getElementById("name").addEventListener("input", function () {
		document.getElementById("previewName").textContent = this.value;
	});

	// Aggiornamento della descrizione
	document.getElementById("description").addEventListener("input", function () {
		document.getElementById("previewDescription").textContent = this.value;
	});

	// Aggiornamento del prezzo
	document.getElementById("price").addEventListener("input", function () {
		document.getElementById("previewPrice").textContent = "Prezzo: €" + this.value;
	});

	document.getElementById("brand").addEventListener("input", function () {
		document.getElementById("previewBrand").textContent = this.value;
	});

	// Aggiornamento dell'URL dell'immagine
	document.getElementById("imageUrl").addEventListener("input", function () {
		let imageUrl = this.value.trim();
		document.getElementById("previewImage").src = imageUrl;
	});

	document.getElementById("editForm").addEventListener("submit", function (e) {
		e.preventDefault();

		const productId = resourceId;

		const updatedProduct = {
			name: document.getElementById("name").value,
			description: document.getElementById("description").value,
			price: document.getElementById("price").value,
			brand: document.getElementById("brand").value,
			imageUrl: document.getElementById("imageUrl").value,
		};

		updateProduct(productId, updatedProduct);
	});

	loadProductData(resourceId);

	function updateProduct(productId, productData) {
		fetch(`${BaseUrl}`, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			body: JSON.stringify(productData),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Errore durante l'aggiornamento del prodotto");
				}
				return response.json();
			})
			.then((updatedProduct) => {
				console.log("Prodotto aggiornato:", updatedProduct);
				showAlert("Resource id: " + resourceId + " succes Edited!", "success");
			})
			.catch((error) => {
				console.error("Errore:", error);
			});
	}
});

function handleSubmit(event) {
	event.preventDefault(); // Impedisce il comportamento di invio di default

	const form = event.target;

	// Ottieni i valori dai campi del modulo
	const name = document.getElementById("name").value;
	const description = document.getElementById("description").value;
	const brand = document.getElementById("brand").value;
	const imageUrl = document.getElementById("imageUrl").value;
	const price = document.getElementById("price").value;

	const product = new Product(name, description, brand, imageUrl, price);

	product
		.save()
		.then((response) => {
			if (response.ok) {
				console.log("Prodotto aggiornato con successo!");
				window.location.href = "./index.html";
			} else {
				console.error("Errore nell'aggiornamento del prodotto");
			}
		})
		.catch((error) => {
			console.error("Errore di rete o altro errore:", error);
		});
}

const handleDelete = () => {
	//console.log("Clicked delete button"); // Log per debug
	const hasConfirmed = confirm("sei sicuro di voler eliminare il prodotto?");
	//console.log("Confirmation:", hasConfirmed); // Log per debug

	if (hasConfirmed) {
		fetch(BaseUrl, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
			.then((resp) => {
				if (resp.ok) {
					showAlert("Resource id: " + resourceId + " succes Deleted!", "danger");
					return resp.json();
				}
			})
			.then((deletedCellProduct) => {
				setTimeout(() => {
					window.location.assign("./index.html");
				}, 5000);
			});
	}
};
document.getElementById("deleteButton").addEventListener("click", handleDelete);
