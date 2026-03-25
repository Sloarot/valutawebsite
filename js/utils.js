// Utility functions

// Helper function to safely escape HTML and prevent XSS
export function escapeHtml(unsafe) {
  const div = document.createElement("div");
  div.textContent = unsafe;
  return div.innerHTML;
}

// Initialize sliding banner animation
export function initializeSlidingBanner() {
  const banner = document.querySelector(".sliding-banner");

  if (banner) {
    // Wait 1 second after page load
    setTimeout(() => {
      // Slide in (0.3 seconds)
      banner.style.transition = "transform 0.3s ease-out";
      banner.style.transform = "translateY(0)";

      // Wait 2 seconds while visible
      setTimeout(() => {
        // Slide out (0.3 seconds)
        banner.style.transition = "transform 0.3s ease-in";
        banner.style.transform = "translateY(-100%)";
      }, 4000);
    }, 1000);
  }
}

// Revolut tooltip functions
export function showRevolutInfo(event) {
  if (event) {
    event.stopPropagation(); // Prevent row click events
  }
  const modal = document.getElementById("revolutTooltip");
  if (modal) {
    modal.style.display = "block";
  }
}

export function closeRevolutInfo() {
  const modal = document.getElementById("revolutTooltip");
  if (modal) {
    modal.style.display = "none";
  }
}

// Close modal when clicking outside of it
export function setupModalClickHandler() {
  window.onclick = function (event) {
    const modal = document.getElementById("revolutTooltip");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}
