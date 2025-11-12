document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('upload-button');
    const imageUploadInput = document.getElementById('image-upload-input');
    const chatWindow = document.getElementById('chat-window');

    uploadButton.addEventListener('click', () => {
        imageUploadInput.click();
    });

    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    function addMessageToChat(messageHTML, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'assistant-message');
        messageDiv.innerHTML = messageHTML;
        
        messageContainer.appendChild(messageDiv);
        chatWindow.appendChild(messageContainer);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return messageDiv;
    }

    async function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            // Display user's image
            addMessageToChat(`<p>Uploaded Image:</p><img src="${e.target.result}" alt="User uploaded image">`, 'user');

            // Show thinking indicator
            const thinkingMessage = addMessageToChat('<p class="thinking-message">Generating alt text...</p>', 'assistant');

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('/generate-alt-text', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                
                // Remove thinking message and show result
                thinkingMessage.innerHTML = `<p>${data.altText}</p>`;

            } catch (error) {
                console.error('Error:', error);
                thinkingMessage.innerHTML = '<p>Sorry, I was unable to generate alt text for that image.</p>';
            }
        };
        reader.readAsDataURL(file);
    }
});
