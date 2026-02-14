// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle?.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
});

// Cursor glow
const glow = document.querySelector(".cursor-glow");
window.addEventListener("mousemove", (e) => {
  if (!glow) return;
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.12 });
reveals.forEach((el) => io.observe(el));

// Animated counters (only once)
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

// Facility modal
const modal = document.getElementById("facilityModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalIcon = document.getElementById("modalIcon");
const modalClose = document.querySelector(".modal-close");

document.querySelectorAll(".facility").forEach((btn) => {
  btn.addEventListener("click", () => {
    modalTitle.textContent = btn.dataset.title || "Facility";
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

// Gallery lightbox with next/prev
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

// Pricing toggle
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

// Back to top
const toTop = document.querySelector(".to-top");
window.addEventListener("scroll", () => {
  if (!toTop) return;
  toTop.classList.toggle("show", window.scrollY > 600);
});
toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Active nav link highlighting
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

// Toast on form submit
const toast = document.getElementById("toast");
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  form.reset();
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
});
