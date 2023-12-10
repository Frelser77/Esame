const token =
	"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcxYzJjMjBkOGEyMDAwMThhNDhhMmQiLCJpYXQiOjE3MDIyMDczMzUsImV4cCI6MTcwMzQxNjkzNX0.FNryDBM2cb_srdSx8s7TsPyXftK5bztj_8wb2tqT0YE";

const BaseUrl = "https://striveschool-api.herokuapp.com/api/product/";

class Product {
	constructor(name, description, brand, imageUrl, price) {
		this.name = name;
		this.description = description;
		this.brand = brand;
		this.imageUrl = imageUrl;
		this.price = price;
	}

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

document.addEventListener("DOMContentLoaded", function () {
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

	// Gestione dell'invio del form
	const form = document.getElementById("productForm");
	form.addEventListener("submit", function (event) {
		event.preventDefault();

		const name = document.getElementById("name").value;
		const description = document.getElementById("description").value;
		const brand = document.getElementById("brand").value;
		const imageUrl = document.getElementById("imageUrl").value;
		const price = document.getElementById("price").value;

		const newProduct = new Product(name, description, brand, imageUrl, price);

		newProduct
			.save()
			.then((response) => {
				if (!response.ok) {
					throw new Error("Errore nella risposta del server");
				}
				return response.json();
			})
			.then((data) => {
				console.log("Prodotto creato:", data);
				const resourceId = data._id;
				showAlert("Resource id: " + resourceId + " succes Created!", "success");
				form.reset();
			})
			.catch((error) => {
				console.error("Errore durante la creazione del prodotto:", error);
				showAlert("Error during product creation: " + error, "danger");
			});
	});
});

const showAlert = (message, colorCode = "primary") => {
	const alertBox = document.getElementById("alert-box");
	alertBox.innerHTML = `<div class="alert alert-${colorCode}" role="alert">
						${message}
						</div>`;
	setTimeout(() => {
		alertBox.innerHTML = "";
	}, 3000);
};
