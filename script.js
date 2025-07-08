document.addEventListener('DOMContentLoaded', () => {
    const recipientNameInput = document.getElementById('recipientName');
    const messageTextInput = document.getElementById('messageText');
    const fontStyleSelect = document.getElementById('fontStyle');
    const stickerOptions = document.querySelectorAll('.sticker-option');
    const generateButton = document.getElementById('generateGreeting');
    const submitButton = document.getElementById('submitGreeting');
    const shareLinkButton = document.getElementById('shareLinkButton');
    const cardContent = document.getElementById('cardContent');
    const greetingCard = document.getElementById('greetingCard');
    const selectedStickersPreview = document.getElementById('selectedStickersPreview');
    const celebrationOverlay = document.getElementById('celebrationOverlay');
    const revealGreetingButton = document.getElementById('revealGreeting');
    const mainContent = document.getElementById('mainContent');
    const backgroundMusic = document.getElementById('backgroundMusic'); // Get the audio element
    const developerInfo = document.getElementById('developerInfo');


    let selectedStickerSources = []; // Store only the sources

    // --- Initial Load: Show Celebration Overlay & Handle Music ---
    mainContent.classList.add('hidden'); // Hide main content initially
    developerInfo.classList.add('hidden'); // Hide footer too

    // Function to attempt playing music
    const playMusic = () => {
        // Most browsers block autoplay without user interaction.
        // This will try, and if blocked, will be handled when user clicks "Reveal Greeting".
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay started successfully
            }).catch(error => {
                // Autoplay was prevented. User interaction is needed.
                console.warn("Autoplay prevented. Music will play when 'Reveal Greeting' is clicked.");
                // You might add a visual cue (e.g., a mute/unmute button) for the user here.
            });
        }
    };

    // Try playing music as soon as possible
    playMusic();

    revealGreetingButton.addEventListener('click', () => {
        celebrationOverlay.classList.add('hidden'); // Hide overlay
        mainContent.classList.remove('hidden'); // Show main content
        developerInfo.classList.remove('hidden'); // Show footer

        // Ensure music plays when user interacts with the 'Reveal Greeting' button,
        // which often satisfies browser autoplay policies.
        playMusic(); 
    });

    // --- Sticker Selection Logic ---
    stickerOptions.forEach(sticker => {
        sticker.addEventListener('click', () => {
            const stickerSrc = sticker.dataset.stickerSrc;
            
            // Add to our list
            selectedStickerSources.push(stickerSrc);
            
            // Add to the preview area
            const previewImg = document.createElement('img');
            previewImg.src = stickerSrc;
            previewImg.classList.add('selected-sticker-item');
            selectedStickersPreview.appendChild(previewImg);
            
            // Briefly highlight original option
            sticker.style.border = '3px solid var(--secondary-color)';
            setTimeout(() => {
                sticker.style.border = '3px solid transparent';
            }, 500); 
        });
    });

    // --- Generate Greeting Button ---
    generateButton.addEventListener('click', () => {
        const name = recipientNameInput.value.trim();
        const message = messageTextInput.value.trim();
        const selectedFont = fontStyleSelect.value;

        // Clear previous content and stickers
        cardContent.innerHTML = '';
        greetingCard.querySelectorAll('.card-sticker').forEach(s => s.remove());
        
        // Remove existing font classes from cardContent
        cardContent.className = 'card-content'; // Reset classes
        greetingCard.className = 'greeting-card dynamic-frame'; // Reset classes
        
        // Apply selected font style to card content
        // Note: Corrected 'Press Start 2P' to 'PressStart2P' to match CSS class name
        cardContent.classList.add(`font-${selectedFont.replace(/\s/g, '')}`); 

        // Add personalized name
        const nameHeading = document.createElement('h3');
        if (name) {
            nameHeading.textContent = `Dear ${name},`;
        } else {
            nameHeading.textContent = `A Special Greeting for You!`;
        }
        cardContent.appendChild(nameHeading);

        // Add personalized message
        const messageParagraph = document.createElement('p');
        if (message) {
            messageParagraph.textContent = message;
        } else {
            messageParagraph.textContent = `Wishing you all the best on your special day!`;
        }
        cardContent.appendChild(messageParagraph);

        // Add selected stickers to the greeting card (random positions for now)
        selectedStickerSources.forEach(stickerSrc => {
            const stickerImg = document.createElement('img');
            stickerImg.src = stickerSrc;
            stickerImg.classList.add('card-sticker');

            // Random positioning within the card
            const cardRect = greetingCard.getBoundingClientRect();
            const stickerSize = 80; // Match CSS size
            
            const randomX = Math.random() * (cardRect.width - stickerSize);
            const randomY = Math.random() * (cardRect.height - stickerSize);

            stickerImg.style.left = `${randomX}px`;
            stickerImg.style.top = `${randomY}px`;
            
            greetingCard.appendChild(stickerImg);
        });
        
        // After generating, immediately enable the "Get Share Link" button
        shareLinkButton.classList.remove('hidden');
    });

    // --- Get Share Link Button (simulated) ---
    submitButton.addEventListener('click', () => {
        // Here's where you would normally send the data to your backend
        // (name, message, font, selectedStickerSources, and their positions/sizes if using Fabric.js)
        
        // For now, we'll just simulate a shareable URL
        const uniqueId = 'wishwoven_greeting_12345'; // This would be generated by your backend
        const shareableURL = `${window.location.origin}/greeting?id=${uniqueId}`; // Example URL structure

        shareLinkButton.dataset.shareUrl = shareableURL;
        
        // Immediately copy the link to clipboard
        navigator.clipboard.writeText(shareableURL)
            .then(() => {
                alert(`Your greeting is ready! The link has been copied to your clipboard. Share it with someone special:\n${shareableURL}`);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy link automatically. Please copy it manually: ' + shareableURL);
            });
    });

    // --- Copy Share Link Button (redundant if submitButton copies, but kept for clarity) ---
    shareLinkButton.addEventListener('click', () => {
        const shareUrl = shareLinkButton.dataset.shareUrl;
        if (shareUrl) {
            navigator.clipboard.writeText(shareUrl)
                .then(() => {
                    alert('Link copied to clipboard! You can now share it.');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy link. Please copy it manually: ' + shareUrl);
                });
        } else {
            alert('Please generate your greeting and click "Get Share Link" first.');
        }
    });
});