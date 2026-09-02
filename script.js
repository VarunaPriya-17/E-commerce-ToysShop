// Global Product Data
const products = [
    { id: 1, name: "Super Robot X-99", price: 29.99, category: "action", image: "robot.jpg", description: "An incredible robot action figure with moving joints and glowing eyes. Perfect for intergalactic adventures." },
    { id: 2, name: "Magic Building Blocks", price: 14.99, category: "educational", image: "blocks.jpg", description: "Colorful building blocks to stimulate creativity and spatial reasoning. Contains 100 assorted pieces." },
    { id: 3, name: "Fluffy Teddy Bear", price: 24.99, category: "plush", image: "teddy.jpg", description: "A classic, super-soft teddy bear ready for warm hugs and bedtime stories." },
    { id: 4, name: "Turbo Race Car", price: 19.99, category: "action", image: "car.jpg", description: "A sleak, die-cast metal toy race car. Built for speed and exciting miniature races." },
    { id: 5, name: "Space Rocket Ship", price: 34.99, category: "educational", image: "rocket.png", description: "Explore the stars with this realistic rocket ship model. Includes astronaut figures!" },
    { id: 6, name: "Sturdy Red Tricycle", price: 49.99, category: "outdoor", image: "tricycle.jpg", description: "A durable red tricycle perfect for toddlers learning to pedal and balance outdoors." },
    { id: 7, name: "Classic Wooden Train", price: 39.99, category: "educational", image: "train.jpg", description: "A beautifully crafted wooden train set that inspires hours of imaginative play." },
    { id: 8, name: "Baby Dinosaur Plush", price: 18.99, category: "plush", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=600", description: "A soft and friendly baby dinosaur plush toy to keep your little ones accompanied." }
];

let cart = JSON.parse(localStorage.getItem('wonderToysCart')) || [];

// DOM Elements
const productGrid = document.getElementById('productGrid'); // Home
const shopGrid = document.getElementById('shopGrid'); // Shop page full grid
const cartIcon = document.querySelector('.cart-icon');
const mobileCartIcon = document.querySelector('.mobile-cart-icon'); // For mobile menu
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountElements = document.querySelectorAll('.cart-count');
const cartTotalElement = document.getElementById('cartTotal');
const productDetailsContainer = document.getElementById('productDetailsContainer'); // Details page
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// Checkout DOM Elements
const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
const checkoutForm = document.getElementById('checkoutForm');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const checkoutTotalDisplay = document.getElementById('checkoutTotalDisplay');

// Utilities
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}

// Render Products for Home Page (limit to 4) and Shop Page (all/filtered)
function renderProducts() {
    // If on home page
    if (productGrid) {
        productGrid.innerHTML = '';
        products.slice(0, 3).forEach(product => {
            productGrid.appendChild(createProductCard(product));
        });
    }

    // If on shop page
    if (shopGrid) {
        shopGrid.innerHTML = '';
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('category');
        const priceFilter = urlParams.get('price'); // e.g., 'under20', '20to40', 'over40'

        let filteredProducts = products;

        if (categoryFilter && categoryFilter !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);

            // Update the category title if it exists on the shop page (optional UX improvement)
            const shopTitle = document.querySelector('.page-header h1');
            const shopSubtitle = document.querySelector('.page-header p');
            if (shopTitle) {
                const catNames = {
                    'educational': 'Educational Toys',
                    'plush': 'Soft & Plush Toys',
                    'action': 'Action Figures & Vehicles',
                    'outdoor': 'Outdoor Play'
                };
                shopTitle.textContent = catNames[categoryFilter] || 'Toy Collection';
                if (shopSubtitle) shopSubtitle.textContent = `Showing products in ${shopTitle.textContent}`;
            }
        }

        if (priceFilter) {
            if (priceFilter === 'under20') {
                filteredProducts = filteredProducts.filter(p => p.price < 20);
            } else if (priceFilter === '20to40') {
                filteredProducts = filteredProducts.filter(p => p.price >= 20 && p.price <= 40);
            } else if (priceFilter === 'over40') {
                filteredProducts = filteredProducts.filter(p => p.price > 40);
            }
        }

        // Highlight active filter in sidebar
        const filterLinks = document.querySelectorAll('.filter-list a');
        filterLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Reset all first
            link.style.color = 'var(--text-color)';
            link.style.fontWeight = 'normal';

            // Re-apply active
            if (href) {
                if (categoryFilter && href.includes(`category=${categoryFilter}`)) {
                    link.style.color = 'var(--primary-color)';
                    link.style.fontWeight = '800';
                } else if (!categoryFilter && !priceFilter && href === 'shop.html') {
                    link.style.color = 'var(--primary-color)';
                    link.style.fontWeight = '800';
                } else if (priceFilter && href.includes(`price=${priceFilter}`)) {
                    link.style.color = 'var(--primary-color)';
                    link.style.fontWeight = '800';
                }
            }
        });

        // Update count text
        const countDisplay = document.querySelector('.shop-content p b');
        if (countDisplay) {
            countDisplay.textContent = filteredProducts.length;
        }

        if (filteredProducts.length === 0) {
            shopGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem;"><h3>No toys found matching these filters.</h3><a href="shop.html" class="btn-secondary" style="margin-top:1rem;">Clear Filters</a></div>';
        } else {
            filteredProducts.forEach(product => {
                shopGrid.appendChild(createProductCard(product));
            });
        }
    }
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
        <a href="product-details.html?id=${product.id}" class="product-link">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-overlay">
                    <span>View Details</span>
                </div>
            </div>
        </a>
        <div class="product-info">
            <h3 class="product-title"><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id}, event)">Add to Cart</button>
        </div>
    `;
    return card;
}

// Product Details Page Logic
function renderProductDetails() {
    if (!productDetailsContainer) return; // Only run on product-details.html
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId || isNaN(productId)) {
        productDetailsContainer.innerHTML = '<h2>Product not found. <a href="shop.html">Return to Shop</a></h2>';
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        productDetailsContainer.innerHTML = '<h2>Product not found. <a href="shop.html">Return to Shop</a></h2>';
        return;
    }

    productDetailsContainer.innerHTML = `
        <div class="details-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="details-info">
            <div class="breadcrumb">
                <a href="index.html">Home</a> > <a href="shop.html">Shop</a> > <span>${product.name}</span>
            </div>
            <h1>${product.name}</h1>
            <p class="details-price">${formatCurrency(product.price)}</p>
            <p class="details-desc">${product.description}</p>
            
            <div class="quantity-selector">
                <label for="qty">Quantity:</label>
                <input type="number" id="qty" value="1" min="1" max="10">
            </div>
            
            <button class="add-to-cart-btn large" onclick="addMultipleToCart(${product.id})">Add to Cart</button>
            <div class="perks">
                <div class="perk"><i class="fa-solid fa-truck"></i> Free Shipping on orders over $50</div>
                <div class="perk"><i class="fa-solid fa-rotate-left"></i> 30-Day Easy Returns</div>
                <div class="perk"><i class="fa-solid fa-shield-halved"></i> 100% Safe & Secure Checkout</div>
            </div>
        </div>
    `;
}

// Cart Functionality
function addToCart(productId, event) {
    if (event) event.stopPropagation();
    const product = products.find(p => p.id === productId);
    if (product) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        animateCartIcon();
    }
}

function addMultipleToCart(productId) {
    const qtyInput = document.getElementById('qty');
    const quantity = parseInt(qtyInput.value) || 1;
    const product = products.find(p => p.id === productId);
    if (product) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }
        updateCart();
        cartOverlay.classList.add('active'); // Open cart to show user
    }
}

// Expose globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.addMultipleToCart = addMultipleToCart;
window.changeQuantity = changeQuantity;

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    localStorage.setItem('wonderToysCart', JSON.stringify(cart));

    // Update count labels
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = totalItems);

    // Update Modal
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>Your cart is empty.</p>
                <a href="shop.html" class="btn-secondary" onclick="document.getElementById('cartOverlay').classList.remove('active')">Start Shopping</a>
            </div>
        `;
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4><a href="product-details.html?id=${item.id}" style="color:inherit; text-decoration:none;">${item.name}</a></h4>
                    <div class="cart-item-price">${formatCurrency(item.price)}</div>
                    <div class="qty-controls">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    if (cartTotalElement) cartTotalElement.textContent = formatCurrency(total);
}

function animateCartIcon() {
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

// Modal & Mobile Menu Listeners
if (cartIcon) {
    cartIcon.addEventListener('click', () => cartOverlay.classList.add('active'));
}

if (mobileCartIcon) {
    mobileCartIcon.addEventListener('click', () => {
        cartOverlay.classList.add('active');
        mobileMenu.classList.remove('active'); // close mobile menu if open
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) cartOverlay.classList.remove('active');
    });
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const i = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            i.classList.remove('fa-bars');
            i.classList.add('fa-xmark');
        } else {
            i.classList.remove('fa-xmark');
            i.classList.add('fa-bars');
        }
    });
}

// Checkout Button functionality - Note: using querySelectorAll since the modal might be duplicated in DOM if hardcoded
const checkoutBtns = document.querySelectorAll('.checkout-btn:not([type="submit"])');
checkoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty! Add some awesome toys first.");
        } else {
            // Close Cart and Open Checkout Modal
            cartOverlay.classList.remove('active');
            if (checkoutModalOverlay) {
                // Set the total in the checkout form
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const subtotalDisplay = document.getElementById('checkoutSubtotalDisplay');
                if (subtotalDisplay) subtotalDisplay.textContent = formatCurrency(subtotal);

                const checkoutTotalDisplay = document.getElementById('checkoutTotalDisplay');
                if (checkoutTotalDisplay) checkoutTotalDisplay.textContent = formatCurrency(subtotal);

                // Reset to online payment default
                const codFeeRow = document.getElementById('codFeeRow');
                const onlineSection = document.getElementById('onlinePaymentSection');
                const confirmBtn = document.getElementById('confirmOrderBtn');
                const transactionId = document.getElementById('transactionId');

                if (codFeeRow) codFeeRow.style.display = 'none';
                if (onlineSection) onlineSection.style.display = 'block';
                if (confirmBtn) confirmBtn.textContent = 'Confirm Online Payment';
                if (transactionId) transactionId.value = ''; // Reset transaction id

                const onlineRadio = document.querySelector('input[name="paymentMethod"][value="online"]');
                if (onlineRadio) onlineRadio.checked = true;

                checkoutModalOverlay.classList.add('active');
            } else {
                alert("Checkout modal not found on this page.");
            }
        }
    });
});

// Setup Payment Method Listeners
const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const codFeeRow = document.getElementById('codFeeRow');
        const codFeeDisplay = document.getElementById('checkoutCodFeeDisplay');
        const onlineSection = document.getElementById('onlinePaymentSection');
        const confirmBtn = document.getElementById('confirmOrderBtn');
        const checkoutTotalDisplay = document.getElementById('checkoutTotalDisplay');

        if (e.target.value === 'cod') {
            const codFee = subtotal * 0.10;
            if (codFeeDisplay) codFeeDisplay.textContent = formatCurrency(codFee);
            if (codFeeRow) codFeeRow.style.display = 'flex';
            if (checkoutTotalDisplay) checkoutTotalDisplay.textContent = formatCurrency(subtotal + codFee);
            if (onlineSection) onlineSection.style.display = 'none';
            if (confirmBtn) confirmBtn.textContent = 'Confirm Cash on Delivery';
        } else {
            if (codFeeRow) codFeeRow.style.display = 'none';
            if (checkoutTotalDisplay) checkoutTotalDisplay.textContent = formatCurrency(subtotal);
            if (onlineSection) onlineSection.style.display = 'block';
            if (confirmBtn) confirmBtn.textContent = 'Confirm Online Payment';
        }
    });
});

// Checkout Form Submission
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = document.getElementById('coFirstName').value;
        const address = document.getElementById('coAddress').value;
        const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
        const method = paymentRadio ? paymentRadio.value : 'online';

        if (method === 'cod') {
            alert(`Order Placed Successfully via Cash on Delivery!\n\nThank you ${firstName}!\nWe will ship your toys to:\n${address}\n\nYou will pay the total amount (including 10% delivery charge) when the package arrives.`);
        } else {
            const transactionId = document.getElementById('transactionId').value;
            alert(`Payment Received! Order Placed Successfully!\n\nThank you ${firstName}!\nWe will ship your toys to:\n${address}\nTransaction Ref: ${transactionId || 'Not provided'}\n\nYour order is fully paid and on its way!`);
        }

        // Clear Cart
        cart = [];
        updateCart();

        // Close Modal and Reset Form
        checkoutModalOverlay.classList.remove('active');
        checkoutForm.reset();

        // Optional: Redirect to Home
        if (window.location.pathname.includes('shop.html') || window.location.pathname.includes('product-details.html') || window.location.pathname.includes('cart.html') || window.location.pathname.includes('contact.html') || window.location.pathname.includes('about.html')) {
            window.location.href = 'index.html';
        }
    });
}

// Close Checkout Modal
if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModalOverlay.classList.remove('active');
    });
}
if (checkoutModalOverlay) {
    checkoutModalOverlay.addEventListener('click', (e) => {
        if (e.target === checkoutModalOverlay) checkoutModalOverlay.classList.remove('active');
    });
}

// Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    renderProducts();
    renderProductDetails();
});
