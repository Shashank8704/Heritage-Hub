/**
 * ThreadCraft — Main JavaScript
 * Handles all interactive UI behaviors across the site.
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. Fabric Card Selection (custom-design.html)
    // =========================================================
    const fabricCards = document.querySelectorAll('.fabric-card');
    if (fabricCards.length > 0) {
        fabricCards.forEach(card => {
            card.addEventListener('click', () => {
                fabricCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });
    }

    // =========================================================
    // 2. Color Dot Selection (custom-design.html)
    // =========================================================
    const colorPickers = document.querySelectorAll('.color-picker');
    if (colorPickers.length > 0) {
        colorPickers.forEach(picker => {
            const dots = picker.querySelectorAll('.color-dot');
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    dots.forEach(d => d.classList.remove('selected'));
                    dot.classList.add('selected');
                });
            });
        });
    }

    // =========================================================
    // 3. Payment Method Selection (checkout.html)
    // =========================================================
    const paymentOptions = document.querySelectorAll('.payment-option');
    if (paymentOptions.length > 0) {
        paymentOptions.forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            if (radio) {
                radio.addEventListener('change', () => {
                    paymentOptions.forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                });
            }
            // Also allow clicking the label itself
            option.addEventListener('click', () => {
                const r = option.querySelector('input[type="radio"]');
                if (r) {
                    r.checked = true;
                    paymentOptions.forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                }
            });
        });
    }

    // =========================================================
    // 4. Weaver Dashboard — Decline / Accept Buttons
    // =========================================================
    const declineBtn = document.querySelector('.btn-outline[style*="0.9rem"]');
    const acceptBtn = document.querySelector('.btn-primary[style*="0.9rem"]');

    // Only target the weaver dashboard buttons (check page context)
    if (document.title.includes('Weaver Dashboard')) {
        const actionButtons = document.querySelectorAll('button.btn');
        actionButtons.forEach(btn => {
            const text = btn.textContent.trim();
            if (text === 'Decline') {
                btn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to decline this custom design request?')) {
                        btn.closest('[style*="display: flex"]')?.closest('div[style*="background"]')?.remove();
                        showToast('Request declined successfully.');
                    }
                });
            }
            if (text.includes('Review') && text.includes('Accept')) {
                btn.addEventListener('click', () => {
                    if (confirm('Accept this custom design request from Ananya K.? You will be notified with the design details.')) {
                        const alertBox = btn.closest('[style*="display: flex"]')?.closest('div[style*="background"]');
                        if (alertBox) {
                            alertBox.innerHTML = `
                                <div style="display: flex; gap: 16px; align-items: center; width: 100%;">
                                    <div style="background: white; padding: 12px; border-radius: 50%; color: #1e8449;">
                                        <span class="material-icons-outlined">check_circle</span>
                                    </div>
                                    <div>
                                        <h3 style="margin-bottom: 4px; font-family: var(--font-body); color: #1e8449;">Request Accepted!</h3>
                                        <p style="color: var(--text-muted); font-size: 0.95rem;">You accepted the Custom Ikat Saree order from Ananya K. Check your Active Orders for details.</p>
                                    </div>
                                </div>
                            `;
                            alertBox.style.background = 'rgba(30, 132, 73, 0.1)';
                            alertBox.style.borderColor = 'rgba(30, 132, 73, 0.3)';
                        }
                    }
                });
            }
        });
    }

    // =========================================================
    // 5. Design Steps Progress (custom-design.html)
    // =========================================================
    const designSteps = document.querySelectorAll('.design-steps .step');
    const formSections = document.querySelectorAll('.form-section');
    if (designSteps.length > 0 && formSections.length > 0) {
        // Mark steps as completed when scrolling past sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(formSections).indexOf(entry.target);
                    designSteps.forEach((step, i) => {
                        step.classList.remove('active');
                        if (i < index) {
                            step.classList.add('completed');
                        } else if (i === index) {
                            step.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.5 });

        formSections.forEach(section => observer.observe(section));
    }

    // =========================================================
    // 6. Catalog — Filter & Sort (basic client-side)
    // =========================================================
    const catalogFilters = document.querySelectorAll('.filters-sidebar input[type="checkbox"]');
    const sortSelect = document.querySelector('.catalog-header select');

    if (catalogFilters.length > 0) {
        catalogFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                // Visual feedback — pulse the product grid
                const grid = document.querySelector('.product-grid');
                if (grid) {
                    grid.style.opacity = '0.5';
                    grid.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        grid.style.opacity = '1';
                    }, 300);
                }
            });
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const grid = document.querySelector('.product-grid');
            if (grid) {
                const cards = Array.from(grid.querySelectorAll('.product-card'));
                const selectedOption = sortSelect.value || sortSelect.options[sortSelect.selectedIndex].text;

                cards.sort((a, b) => {
                    const priceA = parseInt(a.querySelector('.price')?.textContent.replace(/[₹,]/g, '') || '0');
                    const priceB = parseInt(b.querySelector('.price')?.textContent.replace(/[₹,]/g, '') || '0');

                    if (selectedOption.includes('Low to High')) return priceA - priceB;
                    if (selectedOption.includes('High to Low')) return priceB - priceA;
                    return 0;
                });

                // Re-append sorted cards
                cards.forEach(card => grid.appendChild(card));

                // Visual feedback
                grid.style.opacity = '0.5';
                grid.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    grid.style.opacity = '1';
                }, 300);
            }
        });
    }

    // =========================================================
    // 7. Forgot Password Link (login.html)
    // =========================================================
    const forgotLink = document.querySelector('a[href="#"][style*="color: var(--primary)"]');
    if (forgotLink && document.title.includes('Login')) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Password reset link sent! Please check your email.');
        });
    }

    // =========================================================
    // 8. Smooth Scroll for Anchor Links
    // =========================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // =========================================================
    // 9. Mobile Hamburger Menu Toggle
    // =========================================================
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

});

// =========================================================
// Toast Notification Helper
// =========================================================
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.tc-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'tc-toast';
    toast.innerHTML = `
        <span class="material-icons-outlined" style="font-size: 20px;">check_circle</span>
        ${message}
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: var(--secondary, #2c3e50);
        color: white;
        padding: 14px 28px;
        border-radius: 30px;
        font-size: 0.95rem;
        font-family: 'Outfit', sans-serif;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
