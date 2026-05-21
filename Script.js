// Jab hum Google server ko request bhejte hain:
const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        // Aapka baki code...
    })
});

// ==========================================
// 1. CONFIGURATION (Sabse Upar Rahega)
// ==========================================
// !! YAHAN APNI REAL API KEY DALO !!
const GEMINI_API_KEY = "AIzaSyC0gU94wrHkWLsKgNpDiK0gxk4Vlu6Se7E"; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ==========================================
// 2. DOM ELEMENTS REGISTRY (TrebEdit ke Elements)
// ==========================================
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

// ==========================================
// 3. SYSTEM PROMPT (AI ko Engineering Rules Sikhane ke Liye)
// ==========================================
const SYSTEM_PROMPT = `You are an expert Indian Civil Engineering AI Assistant. 
Your objective is to solve technical queries regarding Steel, Concrete, and Formwork strictly using Indian Standard Codes (e.g., IS 456:2000, IS 800:2007, IS 14687, etc.).
For every answer provided, you must explicitly state the relevant IS Code and Clause number. 
Keep your response professional, precise, and structural-engineering oriented. Always prioritize execution safety and code guidelines.`;

// ==========================================
// 4. HELPER FUNCTIONS (Message Screen Par Dikhane ke Liye)
// ==========================================
function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv;
}

// Google aur YouTube ke links generate karne wala code (Yahan dalna hai)
function appendSearchTriggers(query) {
    const linkContainer = document.createElement('div');
    linkContainer.classList.add('search-helper-links');
    
    const googleQuery = encodeURIComponent(`${query} civil engineering IS code diagram`);
    const youtubeQuery = encodeURIComponent(`${query} civil engineering site execution`);
    
    linkContainer.innerHTML = `
        <strong><i class="fa-solid fa-magnifying-glass"></i> Visual Engineering References:</strong><br>
        <a href="https://www.google.com/search?tbm=isch&q=${googleQuery}" target="_blank"><i class="fa-solid fa-image"></i> View IS Code/Site Diagrams</a>
        <a href="https://www.youtube.com/results?search_query=${youtubeQuery}" target="_blank"><i class="fa-brands fa-youtube"></i> Watch Site Execution Videos</a>
    `;
    chatBox.appendChild(linkContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ==========================================
// 5. MAIN CORE LOGIC (Jo Error Fix Kiya Tha, Woh Yahan Hai)
// ==========================================
async function handleEngineeringQuery() {
    const queryText = userInput.value.trim();
    if (!queryText) return;

    // Screen par user ka question dikhao
    appendMessage(queryText, 'user-msg');
    userInput.value = '';

    // Loading status dikhao
    const loadingMessage = appendMessage("Reviewing IS Code books...", 'bot-msg');

    try {
        // Agar key change nahi ki toh pehle hi error pakad lega
        if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE" || !GEMINI_API_KEY) {
            throw new Error("Bhai, pehle apni real Gemini API Key paste karo script.js mein!");
        }

        // Google Gemini Server ko call karna
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${SYSTEM_PROMPT}\n\nUser Question: ${queryText}`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Agar Google side se koi error code aata hai toh handle karein
        if (data.error) {
            throw new Error(`Google API Error: ${data.error.message}`);
        }

        const aiResponseText = data.candidates[0].content.parts[0].text;
        
        // Loading hatakar AI ka real answer screen par daalna
        loadingMessage.innerHTML = `<p>${aiResponseText.replace(/\n/g, '<br>')}</p>`;
        
        // Google/YouTube Search Buttons niche attach karna
        appendSearchTriggers(queryText);

    } catch (error) {
        console.error(error);
        // Ab error direct screen par red color me dikhega
        loadingMessage.innerHTML = `<p style="color: red;"><i class="fa-solid fa-circle-exclamation"></i> Error: ${error.message}</p>`;
    }
}

// ==========================================
// 6. EVENT LISTENERS (Buttons Click handles - Sabse Aakhiri Mein)
// ==========================================
sendBtn.addEventListener('click', handleEngineeringQuery);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleEngineeringQuery();
});
