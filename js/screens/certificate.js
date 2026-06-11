/* ============================================
   MOTION EXPLORER — Certificate Screen
   ============================================ */

const CertificateScreen = {
  init() {
    const dateEl = document.getElementById('cert-date');
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    const nameInput = document.getElementById('cert-name-input');
    const nameDisplay = document.getElementById('cert-name-display');
    
    if (nameInput && nameDisplay) {
      nameInput.addEventListener('input', (e) => {
        nameDisplay.textContent = e.target.value || 'Your Name Here';
      });
    }
  },

  cleanup() {
    // Nothing
  }
};
