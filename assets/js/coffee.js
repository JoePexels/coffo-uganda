document.addEventListener("DOMContentLoaded", () => {
    // --- Variables ---
    const searchToggle = document.getElementById("search-toggle");
    const searchInput = document.getElementById("search-input");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navbar = document.getElementById("navbar");
    const cartCountElement = document.getElementById("cart-count");
    const goToTopButton = document.getElementById("go-to-top");
    
    // Sidebar Elements
    const mobileOverlay = document.getElementById("mobile-overlay");
    const mobileSidebar = document.getElementById("mobile-sidebar");
    const sidebarClose = document.getElementById("sidebar-close");
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    const sidebarOrderBtn = document.querySelector(".sidebar-order-btn");

    // --- Toggle Search Input ---
    if (searchToggle) {
        searchToggle.addEventListener("click", (e) => {
            e.preventDefault();
            searchInput.classList.toggle("active");
            if (searchInput.classList.contains("active")) searchInput.focus();
        });
    }

    // --- Search Functionality ---
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            const menuItems = document.querySelectorAll(".menu-item");
            menuItems.forEach((item) => {
                const itemName = item.querySelector("h3").textContent.toLowerCase();
                item.style.display = (itemName.includes(searchTerm) || searchTerm === "") ? "flex" : "none";
            });
            if (searchTerm) document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
        });
    }

    // --- Mobile Sidebar Logic ---
    const openSidebar = () => {
        mobileSidebar.classList.add("active");
        mobileOverlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent scrolling
    };

    const closeSidebar = () => {
        mobileSidebar.classList.remove("active");
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = "auto"; // Restore scrolling
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openSidebar);
    if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
    if (mobileOverlay) mobileOverlay.addEventListener("click", closeSidebar);

    // Close sidebar when a link or order button is clicked
    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href.startsWith("#")) {
                e.preventDefault();
                closeSidebar();
                const target = document.querySelector(href);
                if(target) setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 300);
            } else {
                closeSidebar();
            }
        });
    });

    if (sidebarOrderBtn) {
        sidebarOrderBtn.addEventListener("click", (e) => {
            e.preventDefault();
            closeSidebar();
            setTimeout(() => document.getElementById("menu").scrollIntoView({ behavior: "smooth" }), 300);
        });
    }

    // --- Navbar Background on Scroll ---
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });

    // --- Scroll Animation (Intersection Observer) ---
    const animateItems = document.querySelectorAll(".animate-on-scroll");
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateItems.forEach(item => observer.observe(item));

    // --- Cart Functionality ---
    const updateCartCount = () => {
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) cartCountElement.textContent = totalQuantity;
    };

    const orderButtons = document.querySelectorAll(".menu .order-btn");
    orderButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            const menuItem = this.closest(".menu-item");
            const itemName = menuItem.querySelector("h3").textContent;
            const itemPrice = menuItem.querySelector(".price").textContent;
            const itemImage = menuItem.querySelector("img").src;

            const cartItem = { name: itemName, price: itemPrice, image: itemImage, quantity: 1 };
            let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

            const existingItemIndex = cartItems.findIndex((item) => item.name === cartItem.name);
            if (existingItemIndex !== -1) {
                cartItems[existingItemIndex].quantity += 1;
            } else {
                cartItems.push(cartItem);
            }

            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            updateCartCount();

            // Button Animation
            this.innerHTML = "✓ Added";
            this.style.backgroundColor = "#4CAF50";
            this.style.color = "#fff";
            setTimeout(() => {
                this.innerHTML = "Order Now";
                this.style.backgroundColor = "";
                this.style.color = "";
            }, 1500);
        });
    });

    // --- Filter Menu Items ---
    const filterButtons = document.querySelectorAll(".filter-buttons .filter-btn");
    const menuItems = document.querySelectorAll(".menu-item");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            const filter = button.getAttribute("data-filter");

            menuItems.forEach((item) => {
                const category = item.getAttribute("data-category");
                item.style.display = (filter === "all" || category === filter) ? "flex" : "none";
            });
        });
    });

    // --- Go to Top Button ---
    window.addEventListener("scroll", () => {
        goToTopButton.style.display = window.scrollY > 300 ? "block" : "none";
    });

    if (goToTopButton) {
        goToTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // --- Initialize Cart Count on Page Load ---
    updateCartCount();
});
