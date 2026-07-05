// Aura Fashion Premium JS Logic

// Product Database
const PRODUCTS = [
  { id: 1, name: "Aura Oversized Back Print Tee", price: 1499, img: "aura_graphic_tee.png" },
  { id: 2, name: "Aura Essential Hoodie", price: 2199, img: "oversized_hoodie.png" },
  { id: 3, name: "Aura Cargo Wide Pants", price: 1899, img: "wide_leg_trousers.png" },
  { id: 4, name: "Aura Textured Shirt", price: 1799, img: "flannel_shirt.png" },
  { id: 5, name: "Aura Bomber Jacket", price: 2999, img: "outfit_transparent_v3.png" },
  { id: 6, name: "Aura Cap Black", price: 699, img: "aura_cap_black.png" }
];

// Cart State
let cart = [];

// DOM Elements
const mainHeader = document.getElementById("mainHeader");
const searchTrigger = document.getElementById("searchTrigger");
const searchOverlay = document.getElementById("searchOverlay");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

const profileTrigger = document.getElementById("profileTrigger");
const accountModal = document.getElementById("accountModal");
const modalClose = document.getElementById("modalClose");
const modalTabBtns = document.querySelectorAll(".modal-tab-btn");
const modalForms = document.querySelectorAll(".modal-form");

const cartTrigger = document.getElementById("cartTrigger");
const cartDrawer = document.getElementById("cartDrawer");
const cartDrawerClose = document.getElementById("cartDrawerClose");
const drawerOverlay = document.getElementById("drawerOverlay");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartBadge = document.getElementById("cartBadge");
const checkoutBtn = document.getElementById("checkoutBtn");

const mobileMenuTrigger = document.getElementById("mobileMenuTrigger");
const mobileNav = document.getElementById("mobileNav");
const mobileNavClose = document.getElementById("mobileNavClose");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

const newsletterForm = document.getElementById("newsletterForm");
const newsletterSuccess = document.getElementById("newsletterSuccess");

const successModal = document.getElementById("successModal");
const successModalClose = document.getElementById("successModalClose");

const interactiveOutfit = document.getElementById("interactiveOutfit");
const hotspots = document.querySelectorAll(".hotspot");
const labels = document.querySelectorAll(".handwritten-label");

// --- 1. Sticky Header Scroll Effect ---
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    mainHeader.classList.add("scrolled");
  } else {
    mainHeader.classList.remove("scrolled");
  }
});

// --- 2. Mobile Navigation Menu ---
mobileMenuTrigger.addEventListener("click", () => mobileNav.classList.add("open"));
mobileNavClose.addEventListener("click", () => mobileNav.classList.remove("open"));
mobileNavLinks.forEach(link => {
  link.addEventListener("click", () => mobileNav.classList.remove("open"));
});

// --- 3. 2.5D Mouse Tracking Parallax Effect ---
if (interactiveOutfit) {
  interactiveOutfit.addEventListener("mousemove", (e) => {
    const rect = interactiveOutfit.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2; // offset from center x
    const y = e.clientY - rect.top - rect.height / 2; // offset from center y
    
    // Scale down factors for subtle, elegant tilting
    const tiltX = (y / (rect.height / 2)) * -6; // tilt up/down
    const tiltY = (x / (rect.width / 2)) * 6;   // tilt left/right
    
    interactiveOutfit.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  interactiveOutfit.addEventListener("mouseleave", () => {
    interactiveOutfit.style.transform = "rotateX(0deg) rotateY(0deg)";
    // Close active tooltips
    document.querySelectorAll(".hotspot-tooltip").forEach(t => t.classList.remove("active"));
  });
}

// --- 4. Dynamic Annotation Lines Drawing ---
function drawAnnotationLines() {
  const svg = document.getElementById("annotationsSvg");
  if (!svg || !interactiveOutfit) return;
  
  const containerRect = interactiveOutfit.getBoundingClientRect();
  
  const connections = [
    { key: "coat", hotspot: "hotspot-coat", label: "label-coat", pathId: "path-coat", controlOffset: { x: -30, y: 10 } },
    { key: "sweater", hotspot: "hotspot-sweater", label: "label-sweater", pathId: "path-sweater", controlOffset: { x: 30, y: -10 } },
    { key: "trousers", hotspot: "hotspot-trousers", label: "label-trousers", pathId: "path-trousers", controlOffset: { x: 40, y: 0 } },
    { key: "sneakers", hotspot: "hotspot-sneakers", label: "label-sneakers", pathId: "path-sneakers", controlOffset: { x: -40, y: 20 } }
  ];
  
  connections.forEach(conn => {
    const hsEl = document.getElementById(conn.hotspot);
    const labelEl = document.getElementById(conn.label);
    const pathEl = document.getElementById(conn.pathId);
    
    if (hsEl && labelEl && pathEl) {
      const hsRect = hsEl.getBoundingClientRect();
      const labelRect = labelEl.getBoundingClientRect();
      
      // Calculate centers relative to container
      const startX = (hsRect.left + hsRect.width / 2) - containerRect.left;
      const startY = (hsRect.top + hsRect.height / 2) - containerRect.top;
      
      // Determine closest label edge
      let endX, endY;
      if (startX < (labelRect.left - containerRect.left)) {
        // Label is to the right
        endX = labelRect.left - containerRect.left;
        endY = (labelRect.top + labelRect.height / 2) - containerRect.top;
      } else {
        // Label is to the left
        endX = labelRect.right - containerRect.left;
        endY = (labelRect.top + labelRect.height / 2) - containerRect.top;
      }
      
      // Draw smooth quadratic curve path
      const controlX = (startX + endX) / 2 + conn.controlOffset.x;
      const controlY = (startY + endY) / 2 + conn.controlOffset.y;
      
      pathEl.setAttribute("d", `M ${endX} ${endY} Q ${controlX} ${controlY} ${startX} ${startY}`);
    }
  });
}

// Initial draw, draw on resize, and transition end
window.addEventListener("load", drawAnnotationLines);
window.addEventListener("resize", drawAnnotationLines);
document.querySelectorAll(".hotspot, .handwritten-label").forEach(el => {
  el.addEventListener("transitionend", drawAnnotationLines);
});

// Interactive Hotspot Event Bindings
hotspots.forEach(hs => {
  hs.addEventListener("mouseenter", () => {
    const productKey = hs.getAttribute("data-product");
    
    // Deactivate all tooltips first
    document.querySelectorAll(".hotspot-tooltip").forEach(t => t.classList.remove("active"));
    
    // Activate current
    const tooltip = document.getElementById(`tooltip-${productKey}`);
    const label = document.getElementById(`label-${productKey}`);
    const path = document.getElementById(`path-${productKey}`);
    
    if (tooltip) tooltip.classList.add("active");
    if (label) label.classList.add("active");
    if (path) path.classList.add("active");
  });
  
  hs.addEventListener("click", (e) => {
    e.stopPropagation();
    const productKey = hs.getAttribute("data-product");
    const tooltip = document.getElementById(`tooltip-${productKey}`);
    tooltip.classList.toggle("active");
  });
});

// Tooltip helper
window.addToCartDirect = function(name, price, size, img) {
  cart.push({
    id: Date.now() + Math.random(),
    name: name,
    price: price,
    size: size,
    img: img,
    qty: 1
  });
  
  // Close tooltips
  document.querySelectorAll(".hotspot-tooltip").forEach(t => t.classList.remove("active"));
  
  updateCartUI();
  openCartDrawer();
};

// --- 5. Cart Management Logic ---

// Open/Close Cart Drawer
function openCartDrawer() {
  cartDrawer.classList.add("open");
  drawerOverlay.classList.add("open");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
}

cartTrigger.addEventListener("click", openCartDrawer);
cartDrawerClose.addEventListener("click", closeCartDrawer);
drawerOverlay.addEventListener("click", () => {
  closeCartDrawer();
  accountModal.classList.remove("open");
});

// Add products to cart via product grid cards
const productCards = document.querySelectorAll(".product-card");
productCards.forEach(card => {
  const pId = parseInt(card.getAttribute("data-id"));
  const pName = card.getAttribute("data-name");
  const pPrice = parseInt(card.getAttribute("data-price"));
  const pImg = card.getAttribute("data-img");
  
  const sizeOverlay = card.querySelector(".size-selector-overlay");
  const sizeBtns = card.querySelectorAll(".size-opt-btn");
  const addToCartBtn = card.querySelector(".add-to-cart-btn");
  const wishlistBtn = card.querySelector(".wishlist-btn");
  
  let selectedSize = null;
  
  // Size selection
  sizeBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      sizeBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = btn.innerText;
      
      // Auto-add to cart once size is selected
      addItem(pName, pPrice, selectedSize, pImg);
      
      // Close overlay
      setTimeout(() => {
        btn.classList.remove("selected");
        selectedSize = null;
      }, 300);
    });
  });
  
  // Wishlist toggle
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      wishlistBtn.classList.toggle("active");
    });
  }
  
  // Add to cart click triggers size overlay focus
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Animate size overlay show
      sizeOverlay.style.bottom = "0";
      // Auto fallback if clicked again without selecting
      if (selectedSize) {
        addItem(pName, pPrice, selectedSize, pImg);
      } else {
        // Pulse size options to guide user
        sizeOverlay.style.boxShadow = "0 -4px 10px rgba(212, 175, 55, 0.3)";
        setTimeout(() => {
          sizeOverlay.style.boxShadow = "none";
        }, 800);
      }
    });
  }
});

function addItem(name, price, size, img) {
  // Check if item with same size already exists
  const existing = cart.find(item => item.name === name && item.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: name,
      price: price,
      size: size,
      img: img,
      qty: 1
    });
  }
  updateCartUI();
  openCartDrawer();
}

function updateCartUI() {
  // Update Badge
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.innerText = totalItems;
  
  // Render Cart list
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your bag is empty.</div>';
    cartSubtotal.innerText = "₹0";
    checkoutBtn.disabled = true;
    return;
  }
  
  checkoutBtn.disabled = false;
  let itemsHtml = "";
  let subtotal = 0;
  
  cart.forEach((item, index) => {
    subtotal += item.price * item.qty;
    itemsHtml += `
      <div class="cart-item">
        <img src="assets/${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-size">Size: ${item.size}</span>
          </div>
          <div class="cart-item-qty-row">
            <div class="qty-controls">
              <button class="qty-btn" onclick="updateQty(${index}, -1)">&minus;</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="updateQty(${index}, 1)">&plus;</button>
            </div>
            <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</span>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${index})">Remove</button>
        </div>
      </div>
    `;
  });
  
  cartItemsContainer.innerHTML = itemsHtml;
  cartSubtotal.innerText = `₹${subtotal.toLocaleString()}`;
}

window.updateQty = function(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
};

window.removeCartItem = function(index) {
  cart.splice(index, 1);
  updateCartUI();
};

// --- 6. Checkout Process ---
checkoutBtn.addEventListener("click", () => {
  // Clear cart state
  cart = [];
  updateCartUI();
  closeCartDrawer();
  
  // Open checkout success modal
  successModal.classList.add("open");
});

successModalClose.addEventListener("click", () => {
  successModal.classList.remove("open");
});

// --- 7. Search Overlay Logic ---
searchTrigger.addEventListener("click", () => {
  searchOverlay.classList.add("open");
  setTimeout(() => searchInput.focus(), 300);
});

searchClose.addEventListener("click", () => {
  searchOverlay.classList.remove("open");
  searchInput.value = "";
  searchResults.innerHTML = "";
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  if (query.length < 2) {
    searchResults.innerHTML = "";
    return;
  }
  
  // Filter products
  const matches = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(query) || 
    query.includes("tee") && p.name.includes("Tee") ||
    query.includes("hoodie") && p.name.includes("Hoodie") ||
    query.includes("shirt") && p.name.includes("Shirt") ||
    query.includes("sneaker") && p.name.includes("Sneaker") ||
    query.includes("trouser") && p.name.includes("Trouser")
  );
  
  if (matches.length === 0) {
    searchResults.innerHTML = '<div class="search-no-results">No matching products found.</div>';
    return;
  }
  
  let resultsHtml = "";
  matches.forEach(p => {
    resultsHtml += `
      <div class="search-item" onclick="scrollToProduct(${p.id})">
        <img src="assets/${p.img}" alt="${p.name}" class="search-item-img">
        <div class="search-item-info">
          <h4>${p.name}</h4>
          <p>₹${p.price.toLocaleString()}</p>
        </div>
      </div>
    `;
  });
  searchResults.innerHTML = resultsHtml;
});

window.scrollToProduct = function(productId) {
  searchOverlay.classList.remove("open");
  searchInput.value = "";
  searchResults.innerHTML = "";
  
  const el = document.getElementById("new-arrivals");
  if (el) el.scrollIntoView({ behavior: "smooth" });
  
  // Flash highlight effect on card
  setTimeout(() => {
    const cards = document.querySelectorAll(".product-card");
    cards.forEach(card => {
      if (parseInt(card.getAttribute("data-id")) === productId) {
        card.style.boxShadow = "0 0 20px var(--accent-gold)";
        card.style.borderColor = "var(--accent-gold)";
        setTimeout(() => {
          card.style.boxShadow = "none";
          card.style.borderColor = "var(--border-color)";
        }, 1500);
      }
    });
  }, 800);
};

// --- 8. Profile / Account Modal Logic ---
profileTrigger.addEventListener("click", () => accountModal.classList.add("open"));
modalClose.addEventListener("click", () => accountModal.classList.remove("open"));

// Tab Toggle
modalTabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    modalTabBtns.forEach(b => b.classList.remove("active"));
    modalForms.forEach(f => f.classList.remove("active"));
    
    btn.classList.add("active");
    const targetTab = btn.getAttribute("data-tab");
    document.getElementById(`${targetTab}Form`).classList.add("active");
  });
});

// Mock forms submit
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  accountModal.classList.remove("open");
  alert("Logged in successfully!");
});

document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  accountModal.classList.remove("open");
  alert("Account created successfully!");
});

// --- 9. Newsletter Form Submit ---
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value;
    newsletterForm.reset();
    
    // Show success animation
    newsletterSuccess.style.display = "block";
    setTimeout(() => {
      newsletterSuccess.style.display = "none";
    }, 4000);
  });
}

// view all products button redirects to the grid
const viewAllBtn = document.getElementById("viewAllProductsBtn");
if (viewAllBtn) {
  viewAllBtn.addEventListener("click", () => {
    const el = document.getElementById("new-arrivals");
    el.scrollIntoView({ behavior: "smooth" });
    alert("You are already viewing our latest drops! Premium Gen-G collection.");
  });
}

// --- 10. Testimonials Carousel Slider ---
const testimonialsCarousel = document.querySelector(".testimonials-carousel");
const dots = document.querySelectorAll(".carousel-dots .dot");

if (testimonialsCarousel && dots.length > 0) {
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-index"));
      
      // Update active dot
      dots.forEach(d => d.classList.remove("active"));
      dot.classList.add("active");
      
      // Slide carousel
      testimonialsCarousel.style.transform = `translateX(${index * -100}%)`;
    });
  });

  // Automatically reset transform on window resize to prevent alignment bugs
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
      testimonialsCarousel.style.transform = "none";
      dots.forEach((d, idx) => {
        if (idx === 0) d.classList.add("active");
        else d.classList.remove("active");
      });
    } else if (window.innerWidth > 600) {
      testimonialsCarousel.style.transform = "none";
    }
  });
}

// --- 11. Scroll To Top Button Logic ---
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
if (scrollToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });
  
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// --- 12. Products Grid Horizontal Scroll Hint Hide ---
const productsGridEl = document.getElementById("productsGrid");
const scrollHintArrowEl = document.getElementById("scrollHintArrow");
if (productsGridEl && scrollHintArrowEl) {
  productsGridEl.addEventListener("scroll", () => {
    if (productsGridEl.scrollLeft > 25) {
      scrollHintArrowEl.classList.add("hidden");
    } else {
      scrollHintArrowEl.classList.remove("hidden");
    }
  });
}

// --- 13. Circular Category Slider Arrow Scroll ---
const categorySlider = document.getElementById("categorySlider");
const categorySliderNext = document.getElementById("categorySliderNext");
if (categorySlider && categorySliderNext) {
  categorySliderNext.addEventListener("click", () => {
    // Scroll slider by 200px or loop back to start if at the end
    const maxScrollLeft = categorySlider.scrollWidth - categorySlider.clientWidth;
    if (categorySlider.scrollLeft >= maxScrollLeft - 10) {
      categorySlider.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      categorySlider.scrollBy({ left: 200, behavior: "smooth" });
    }
  });
}

// --- 14. HTML5 Canvas 3D WebP Sequence Scrollytelling ---
const scrollyContainer = document.getElementById("scrollytelling");
const scrollyCanvas = document.getElementById("scrollyCanvas");

if (scrollyContainer && scrollyCanvas) {
  const ctx = scrollyCanvas.getContext("2d");
  
  const totalFrames = 240;
  const currentFrame = index => `assets/sequence/frame_${index.toString().padStart(3, '0')}.webp`;
  
  // Preload all 240 frames in memory for zero-lag scrubbing
  const images = [];
  let loadedCount = 0;
  let activeFrameIndex = 1;

  // Selected Text Blocks
  const text1 = document.getElementById("scrolly-text-1");
  const text2 = document.getElementById("scrolly-text-2");
  const text3 = document.getElementById("scrolly-text-3");

  function preloadImages() {
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        // Keep updating canvas with progress bar or render frame
        resizeCanvas();
      };
      img.onerror = () => {
        console.error("Failed to load 3D frame " + i + " at: " + img.src);
      };
      images.push(img);
    }
  }

  // Draw specific frame onto canvas with object-fit: cover sizing
  function drawFrame(index) {
    const canvasWidth = scrollyCanvas.width;
    const canvasHeight = scrollyCanvas.height;
    const img = images[index - 1];

    if (!img || !img.complete) {
      // Clear screen
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw luxury AURA gold text and loading status
      ctx.fillStyle = "#d4af37";
      ctx.font = "bold 20px 'Bebas Neue', sans-serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "2px";
      ctx.fillText("LOADING 3D WORLD...", canvasWidth / 2, canvasHeight / 2 - 10);
      
      // Draw visual loading bar
      const barWidth = 160;
      const barHeight = 2;
      const progress = loadedCount / totalFrames;
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(canvasWidth / 2 - barWidth / 2, canvasHeight / 2 + 15, barWidth, barHeight);
      
      ctx.fillStyle = "#d4af37";
      ctx.fillRect(canvasWidth / 2 - barWidth / 2, canvasHeight / 2 + 15, barWidth * progress, barHeight);
      return;
    }
    const imgWidth = img.width;
    const imgHeight = img.height;

    const imgAspect = imgWidth / imgHeight;
    const canvasAspect = canvasWidth / canvasHeight;

    let renderWidth, renderHeight, xOffset, yOffset;

    if (canvasAspect > imgAspect) {
      renderWidth = canvasWidth;
      renderHeight = canvasWidth / imgAspect;
      xOffset = 0;
      yOffset = (canvasHeight - renderHeight) / 2;
    } else {
      renderWidth = canvasHeight * imgAspect;
      renderHeight = canvasHeight;
      xOffset = (canvasWidth - renderWidth) / 2;
      yOffset = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
    activeFrameIndex = index;
  }

  function resizeCanvas() {
    scrollyCanvas.width = window.innerWidth;
    scrollyCanvas.height = window.innerHeight;
    drawFrame(activeFrameIndex);
  }

  // Preload all assets
  preloadImages();

  window.addEventListener("resize", resizeCanvas);

  // Track window scroll to scrub frames
  window.addEventListener("scroll", () => {
    const containerTop = scrollyContainer.offsetTop;
    const containerHeight = scrollyContainer.offsetHeight;
    const scrollY = window.scrollY;

    // Calculate scroll percentage
    let scrollPercent = (scrollY - containerTop) / (containerHeight - window.innerHeight);
    scrollPercent = Math.max(0, Math.min(1, scrollPercent));

    // Map percentage to frame index
    const frameIndex = Math.max(1, Math.min(totalFrames, Math.floor(scrollPercent * (totalFrames - 1)) + 1));
    
    // Draw the mapped frame
    drawFrame(frameIndex);

    // Toggle active classes on text blocks based on scroll ranges
    if (scrollPercent < 0.3) {
      text1.classList.add("active");
      text2.classList.remove("active");
      text3.classList.remove("active");
    } else if (scrollPercent >= 0.3 && scrollPercent < 0.65) {
      text1.classList.remove("active");
      text2.classList.add("active");
      text3.classList.remove("active");
    } else {
      text1.classList.remove("active");
      text2.classList.remove("active");
      text3.classList.add("active");
    }
  });
}
