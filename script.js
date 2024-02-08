// script.js - Shared JavaScript functions

// Assuming you have a list of products
const products = [
    { name: 'Metal Pipe', price: 20.00, image: 'metalpipe.jpg' },
    { name: 'Product 2', price: 5.99, image: 'product2.jpg' },
    { name: 'Product 3', price: 30.99, image: 'product3.jpg' },
    { name: 'Product 4', price: 15.99, image: 'product4.jpg' },
    { name: 'Product 5', price: 9.99, image: 'product5.jpg' },
    { name: 'Product 6', price: 1, image: 'product6.jpg' },
    { name: 'Product 7', price: 1, image: 'product7.jpg' },
    { name: 'Product 8', price: 1, image: 'product8.jpg' },
    { name: 'Product 9', price: 1, image: 'product9.jpg' },
    { name: 'Product 10', price: 1, image: 'product10.jpg' }
    // { name: '', price: , image: '' }
    // Add more products as needed
];

// Function to handle Enter key press in the search bar
function handleSearchKey(event) {
    if (event.key === 'Enter') {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.toLowerCase();
        const matchingProduct = findMatchingProduct(query);

        if (matchingProduct) {
            scrollToProduct(matchingProduct);
            document.getElementById('sorryMessage').style.display = 'none';
        } else {
            document.getElementById('sorryMessage').style.display = 'block';
        }
    }
}

// Function to filter products based on the search query
function searchProducts(event) {
    console.log(event.key); // Log the pressed key (check if 'Enter' is logged)

    if (event.key === 'Enter') {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim().toLowerCase(); // Trim and convert to lowercase
        const matchingProduct = findMatchingProduct(query);

        const modal = document.getElementById('productModal');
        const sorryMessage = document.getElementById('sorryMessage');

        if (query !== '') {
            if (matchingProduct) {
                // Display product details in the modal
                displayProductDetails(matchingProduct);
                sorryMessage.style.display = 'none';
            } else {
                sorryMessage.style.display = 'block';
            }
        } else {
            // Clear the modal and sorry message when the search bar is empty
            modal.style.display = 'none';
            sorryMessage.style.display = 'none';
        }
    }
}

// Function to display product details in the modal
function displayProductDetails(product) {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');

    // Update modal content with product details
    modalContent.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}">
        <p>Price: $${product.price.toFixed(2)}</p>
        <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
        <button onclick="closeModal()">Close</button>
    `;

    // Display the modal
    modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
}

// Function to find a matching product based on the search query
function findMatchingProduct(query) {
    // Remove spaces from the search query
    const queryWithoutSpaces = query.replace(/\s/g, '');

    return products.find(product =>
        // Remove spaces from the product name before comparing
        product.name.toLowerCase().replace(/\s/g, '').includes(queryWithoutSpaces)
    );
}

// Function to scroll to the found product
function scrollToProduct(product) {
    const productElement = document.getElementById(`product_${product.name.replace(/\s/g, '_')}`);
    if (productElement) {
        productElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to load cart data from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay();
    }
}

// Function to update the cart display
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

    let total = 0;

    for (const [productName, { price, quantity, image }] of Object.entries(cart)) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="product-info">
                <img src="${image}" alt="${productName}">
                <div class="text-info">
                    <p>${productName} - $${price.toFixed(2)}</p> 
                    <p>Quantity: ${quantity}</p>
                    <button class="remove-button" onclick="removeFromCart('${productName}')">Remove</button>
                </div>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);

        // Calculate and update the total price
        total += price * quantity;
    }

    // Display the total price
    const totalPriceDiv = document.getElementById('total-price');
    totalPriceDiv.innerText = `Total: $${total.toFixed(2)}`;
}

// Function to save cart data to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add items to the cart
function addToCart(productName, price, image) {
    if (cart[productName]) {
        // If the product is already in the cart, increase the quantity
        cart[productName].quantity += 1;
    } else {
        // If the product is not in the cart, add it with quantity 1
        cart[productName] = { price, quantity: 1, image };
    }

    // Save the cart data to localStorage
    saveCartToLocalStorage();

    // Update the cart display
    updateCartDisplay();
}

// Function to remove items from the cart
function removeFromCart(productName) {
    // Decrease the quantity of the product in the cart
    if (cart[productName]) {
        cart[productName].quantity -= 1;

        // Remove the product from the cart if the quantity is 0
        if (cart[productName].quantity === 0) {
            delete cart[productName];
        }
    }

    // Save the cart data to localStorage
    saveCartToLocalStorage();

    // Update the cart display
    updateCartDisplay();
}

// Function to display products
function displayProducts(products) {
    const productsContainer = document.getElementById('featured-products');
    productsContainer.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.id = `product_${product.name.replace(/\s/g, '_')}`; // Add an ID for each product
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
        `;
        productsContainer.appendChild(productDiv);
    });
}

// Call the loadCartFromLocalStorage function when the page loads
loadCartFromLocalStorage();
