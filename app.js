// ===== SETTINGS =====
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // <-- replace with your real number (no +)

// ===== PRELOADER =====
const preloader = document.getElementById("preloader");
window.addEventListener("load", () => {
  setTimeout(() => {
    preloader?.classList.add("hide");
    setTimeout(() => preloader?.remove(), 500);
  }, 650);
});

// ===== MOBILE MENU =====
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle?.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
});

// Close menu on link click (mobile)
document.querySelectorAll(".nav-link").forEach(a => {
  a.addEventListener("click", () => links?.classList.remove("open"));
});

// ===== CURSOR GLOW =====
const glow = document.querySelector(".cursor-glow");
window.addEventListener("mousemove", (e) => {
  if (!glow) return;
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.12 });
reveals.forEach((el) => io.observe(el));

// ===== HERO COUNTERS =====
let countersStarted = false;
const counterEls = document.querySelectorAll(".stat-num[data-count]");
const startCounters = () => {
  if (countersStarted) return;
  countersStarted = true;

  counterEls.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const value = Math.floor(t * target);
      el.textContent = value;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  });
};

const hero = document.querySelector(".hero");
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) startCounters(); });
}, { threshold: 0.35 });
if (hero) heroObserver.observe(hero);

// ===== WHATSAPP HELPERS =====
function openWhatsApp(message){
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Book a visit button
document.getElementById("bookVisitBtn")?.addEventListener("click", () => {
  const msg = `Hi Naimish Club, I want to book a visit. Please share available time slots.`;
  openWhatsApp(msg);
});

// Contact WhatsApp button
document.getElementById("whatsAppEnquire")?.addEventListener("click", () => {
  const msg = `Hi Naimish Club, I want to know membership plans and a quick visit time.`;
  openWhatsApp(msg);
});

// ===== 3D TILT EFFECT =====
const tiltEls = document.querySelectorAll(".tilt");
tiltEls.forEach(el => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateY = ((x - midX) / midX) * 6;
    const rotateX = -((y - midY) / midY) * 6;

    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  el.addEventListener("mouseleave", () => {
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  });
});

// ===== FACILITY MODAL =====
const modal = document.getElementById("facilityModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalIcon = document.getElementById("modalIcon");
const modalClose = document.querySelector(".modal-close");
const modalWhatsApp = document.getElementById("modalWhatsApp");

let lastFacilityTitle = "";

document.querySelectorAll(".facility").forEach((btn) => {
  btn.addEventListener("click", () => {
    lastFacilityTitle = btn.dataset.title || "Facility";
    modalTitle.textContent = lastFacilityTitle;
    modalDesc.textContent = btn.dataset.desc || "";
    const icon = btn.dataset.icon || "fa-star";
    modalIcon.innerHTML = `<i class="fa-solid ${icon}"></i>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

modalWhatsApp?.addEventListener("click", () => {
  const msg = `Hi Naimish Club, I want details about ${lastFacilityTitle}. Please share timing and charges.`;
  openWhatsApp(msg);
});

// ===== GALLERY LIGHTBOX (NEXT/PREV) =====
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lightboxImg");
const lbClose = document.querySelector(".lightbox-close");
const lbPrev = document.querySelector(".lightbox-nav.prev");
const lbNext = document.querySelector(".lightbox-nav.next");

const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
let currentIndex = 0;

function openLightbox(index){
  currentIndex = index;
  const src = galleryItems[currentIndex].dataset.img;
  lbImg.src = src;
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
}
function closeLightbox(){
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  lbImg.src = "";
}
function prevImg(){
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}
function nextImg(){
  currentIndex = (currentIndex + 1) % galleryItems.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, idx) => item.addEventListener("click", () => openLightbox(idx)));
lbClose?.addEventListener("click", closeLightbox);
lb?.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
lbPrev?.addEventListener("click", (e) => { e.stopPropagation(); prevImg(); });
lbNext?.addEventListener("click", (e) => { e.stopPropagation(); nextImg(); });

document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevImg();
  if (e.key === "ArrowRight") nextImg();
});

// ===== PRICING TOGGLE =====
const toggleBtns = document.querySelectorAll(".toggle-btn");
const priceEls = document.querySelectorAll(".price");

function setPlan(plan){
  toggleBtns.forEach(b => b.classList.toggle("active", b.dataset.plan === plan));
  priceEls.forEach(p => {
    const month = p.dataset.month;
    const year = p.dataset.year;
    if (plan === "yearly") {
      p.innerHTML = `₹${Number(year).toLocaleString("en-IN")} <span>/ year</span>`;
    } else {
      p.innerHTML = `₹${Number(month).toLocaleString("en-IN")} <span>/ month</span>`;
    }
  });
}
toggleBtns.forEach(btn => btn.addEventListener("click", () => setPlan(btn.dataset.plan)));
setPlan("monthly");

// ===== BACK TO TOP =====
const toTop = document.querySelector(".to-top");
window.addEventListener("scroll", () => {
  if (!toTop) return;
  toTop.classList.toggle("show", window.scrollY > 600);
});
toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute("id");
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  });
},{ rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });

sections.forEach(s => navObserver.observe(s));

// ===== TOAST ON FORM SUBMIT =====
const toast = document.getElementById("toast");
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  form.reset();
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
});

// ===== TESTIMONIAL SLIDER =====
const slides = document.getElementById("slides");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");
const dotsWrap = document.getElementById("dots");

let slideIndex = 0;
const slideCount = slides ? slides.children.length : 0;

function renderDots(){
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  for (let i=0; i<slideCount; i++){
    const d = document.createElement("button");
    d.className = "dot-btn" + (i === slideIndex ? " active" : "");
    d.setAttribute("aria-label", `Go to slide ${i+1}`);
    d.addEventListener("click", () => goToSlide(i));
    dotsWrap.appendChild(d);
  }
}
function goToSlide(i){
  if (!slides) return;
  slideIndex = (i + slideCount) % slideCount;
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
  renderDots();
}
prevBtn?.addEventListener("click", () => goToSlide(slideIndex - 1));
nextBtn?.addEventListener("click", () => goToSlide(slideIndex + 1));

renderDots();
goToSlide(0);

// Auto slide
let autoTimer = setInterval(() => goToSlide(slideIndex + 1), 4500);
const sliderBox = document.querySelector(".slider");
sliderBox?.addEventListener("mouseenter", () => clearInterval(autoTimer));
sliderBox?.addEventListener("mouseleave", () => autoTimer = setInterval(() => goToSlide(slideIndex + 1), 4500));

// Swipe (mobile)
let startX = 0;
sliderBox?.addEventListener("touchstart", (e) => startX = e.touches[0].clientX, { passive: true });
sliderBox?.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;
  if (Math.abs(diff) > 40){
    if (diff > 0) goToSlide(slideIndex - 1);
    else goToSlide(slideIndex + 1);
  }
}, { passive: true });
