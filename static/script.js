document.addEventListener("DOMContentLoaded", () => {
    const chatBody = document.getElementById("chat-body");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const voiceInputButton = document.getElementById("voice-input-button");
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    voiceInputButton.addEventListener("click", startVoiceInput);

    function startVoiceInput() {
        recognition.start();
    }

    recognition.onresult = (event) => {
        const userVoiceInput = event.results[0][0].transcript;
        userInput.value = userVoiceInput;
        sendMessage();
    };

    function sendMessage() {
        const condition = document.getElementById("condition").value;
        const severity = document.getElementById("severity").value;
        const userMessage = userInput.value;

        if (userMessage.trim() !== "") {
            displayMessage(userMessage, "user-message");
            userInput.value = "";
            scrollToBottom();
            getChatbotResponse(condition, severity, userMessage);
        }
    }

    function displayMessage(message, className) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");

        const messageElement = document.createElement("div");
        messageElement.classList.add("message", className);
        messageElement.innerHTML = `<p>${message}</p>`;

        messageContainer.appendChild(messageElement);
        chatBody.appendChild(messageContainer);
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function getChatbotResponse(condition, severity, userMessage) {
        fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `condition=${encodeURIComponent(condition)}&severity=${encodeURIComponent(severity)}&message=${encodeURIComponent(userMessage)}`
        })
        .then(response => response.json())
        .then(data => {
            const chatbotResponse = data.response;
            displayMessage(chatbotResponse, "assistant-message");
            scrollToBottom();
            speakResponse(chatbotResponse);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
    

    function speakResponse(response) {
        const speechSynthesis = window.speechSynthesis;
        const speechOutput = new SpeechSynthesisUtterance(response);
        speechSynthesis.speak(speechOutput);
    }
});
