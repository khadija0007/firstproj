// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the interactive sections
    const contactInfoSection = document.getElementById('contactInfoSection');
    const learnMoreSection = document.getElementById('learnMoreSection');

    // Get references to the buttons
    const contactMeBtn = document.getElementById('contactMeBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');

    /**
     * Toggles the visibility of a given section by controlling its opacity and height.
     * This creates a smooth slide-down/slide-up effect along with fade-in/fade-out.
     * @param {HTMLElement} sectionElement - The HTML element (section) to toggle.
     */
    function toggleSectionVisibility(sectionElement) {
        // Check if the section is currently hidden (opacity-0 and h-0)
        if (sectionElement.classList.contains('opacity-0')) {
            // Show the section
            sectionElement.classList.remove('opacity-0', 'h-0');
            sectionElement.classList.add('opacity-100'); // Let CSS handle natural height
            // We'll set a max-height to allow content to push it open,
            // or dynamically set height if content is fixed.
            // For varying content, max-height and overflow-hidden is usually better
            // as it handles different content sizes.
            sectionElement.style.maxHeight = sectionElement.scrollHeight + 'px'; // Expand to content height
        } else {
            // Hide the section
            sectionElement.style.maxHeight = '0'; // Collapse
            sectionElement.classList.remove('opacity-100');
            sectionElement.classList.add('opacity-0');
            // After transition, reset height to h-0 and overflow-hidden for true collapse
            // A short delay ensures the transition plays before resetting h-0
            setTimeout(() => {
                sectionElement.classList.add('h-0');
            }, 500); // Matches transition duration
        }
    }

    // Add event listener for the "Contact Me" button
    contactMeBtn.addEventListener('click', () => {
        // First, ensure the "Learn More" section is hidden if it's open
        if (learnMoreSection && learnMoreSection.classList.contains('opacity-100')) {
            toggleSectionVisibility(learnMoreSection);
        }
        // Then, toggle the "Contact Info" section
        toggleSectionVisibility(contactInfoSection);
    });

    // Add event listener for the "Learn More" button
    learnMoreBtn.addEventListener('click', () => {
        // First, ensure the "Contact Info" section is hidden if it's open
        if (contactInfoSection && contactInfoSection.classList.contains('opacity-100')) {
            toggleSectionVisibility(contactInfoSection);
        }
        // Then, toggle the "Learn More" section
        toggleSectionVisibility(learnMoreSection);
    });

    // Optional: Hide all expandable sections on initial load
    // They are already hidden by default with opacity-0 and h-0 in HTML,
    // but this ensures consistency if the HTML changes or JS runs late.
    // Also, setting max-height to 0 initially is crucial for the transition.
    contactInfoSection.style.maxHeight = '0';
    learnMoreSection.style.maxHeight = '0';

    // To ensure Lucide icons are rendered properly after DOM is loaded.
    // This is typically handled by the script tag in HTML, but good practice
    // if dynamic elements were being added.
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
});
