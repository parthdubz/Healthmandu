// Health Chatbot JavaScript
class HealthChatbot {
  constructor() {
    this.chatMessages = document.getElementById("chatMessages")
    this.chatInput = document.getElementById("chatInput")
    this.sendButton = document.getElementById("sendButton")
    this.charCount = document.getElementById("charCount")

    this.initializeEventListeners()
    this.loadChatbot()

    // Health knowledge base
    this.healthKnowledge = {
      symptoms: {
        fever: {
          remedies: [
            "Rest and stay hydrated",
            "Take paracetamol as directed",
            "Use cool compresses",
            "Drink plenty of fluids",
          ],
          nepali_remedies: ["Tulsi tea with honey", "Ginger and turmeric paste", "Steam inhalation with eucalyptus"],
        },
        headache: {
          remedies: ["Rest in a dark room", "Apply cold or warm compress", "Stay hydrated", "Gentle neck massage"],
          nepali_remedies: ["Peppermint oil on temples", "Ginger tea", "Ajwain (carom seeds) with warm water"],
        },
        cold: {
          remedies: ["Rest and sleep", "Warm salt water gargle", "Stay hydrated", "Use humidifier"],
          nepali_remedies: [
            "Honey and ginger tea",
            "Turmeric milk",
            "Steam with mint leaves",
            "Garlic and honey mixture",
          ],
        },
        cough: {
          remedies: ["Honey and warm water", "Stay hydrated", "Use throat lozenges", "Avoid irritants"],
          nepali_remedies: [
            "Tulsi and honey",
            "Ginger and black pepper tea",
            "Mulethi (licorice) root",
            "Warm turmeric milk",
          ],
        },
        "stomach ache": {
          remedies: [
            "Rest and avoid solid foods",
            "Stay hydrated with clear fluids",
            "Apply warm compress",
            "Eat bland foods",
          ],
          nepali_remedies: ["Jeera (cumin) water", "Ajwain with warm water", "Mint tea", "Rice water"],
        },
      },
      wellness_tips: [
        "Drink 8-10 glasses of water daily, especially in Kathmandu's dry climate",
        "Practice yoga or meditation for 15-20 minutes daily to manage stress",
        "Include seasonal fruits and vegetables in your diet for better immunity",
        "Take morning walks when air quality is better (6-8 AM)",
        "Get 7-8 hours of quality sleep for optimal health",
        "Wash hands frequently to prevent infections",
        "Avoid smoking and limit alcohol consumption",
        "Regular health check-ups are important for early detection",
      ],
      kathmandu_specific: [
        "Use air purifiers during pollution peaks",
        "Wear masks when air quality is poor (AQI > 150)",
        "Stay indoors during dust storms",
        "Drink boiled or filtered water to avoid waterborne diseases",
        "Include vitamin C rich foods to combat pollution effects",
        "Use moisturizers due to dry climate",
        "Be aware of altitude effects if you're new to Kathmandu",
      ],
    }
  }

  initializeEventListeners() {
    // Send message on button click
    this.sendButton.addEventListener("click", () => this.sendMessage())

    // Send message on Enter key
    this.chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    })

    // Character count
    this.chatInput.addEventListener("input", () => {
      const count = this.chatInput.value.length
      this.charCount.textContent = `${count}/500`

      if (count > 450) {
        this.charCount.style.color = "#e53e3e"
      } else {
        this.charCount.style.color = "#a0aec0"
      }
    })
  }

  loadChatbot() {
    // Add loaded class to body for animation
    setTimeout(() => {
      document.body.classList.add("loaded")
    }, 100)
  }

  sendMessage() {
    const message = this.chatInput.value.trim()
    if (!message) return

    // Add user message
    this.addMessage(message, "user")

    // Clear input
    this.chatInput.value = ""
    this.charCount.textContent = "0/500"
    this.charCount.style.color = "#a0aec0"

    // Show typing indicator
    this.showTypingIndicator()

    // Generate bot response
    setTimeout(
      () => {
        this.hideTypingIndicator()
        const response = this.generateResponse(message)
        this.addMessage(response, "bot")
      },
      1500 + Math.random() * 1000,
    )
  }

  sendQuickMessage(message) {
    this.chatInput.value = message
    this.sendMessage()
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${sender}-message`

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.textContent = sender === "user" ? "👤" : "🤖"

    const content = document.createElement("div")
    content.className = "message-content"

    const messageText = document.createElement("div")
    messageText.className = "message-text"
    messageText.innerHTML = text

    const messageTime = document.createElement("div")
    messageTime.className = "message-time"
    messageTime.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    content.appendChild(messageText)
    content.appendChild(messageTime)
    messageDiv.appendChild(avatar)
    messageDiv.appendChild(content)

    this.chatMessages.appendChild(messageDiv)
    this.scrollToBottom()
  }

  showTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "message bot-message"
    typingDiv.id = "typing-indicator"

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.textContent = "🤖"

    const content = document.createElement("div")
    content.className = "message-content"

    const typingIndicator = document.createElement("div")
    typingIndicator.className = "typing-indicator"

    const typingDots = document.createElement("div")
    typingDots.className = "typing-dots"

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div")
      dot.className = "typing-dot"
      typingDots.appendChild(dot)
    }

    typingIndicator.appendChild(typingDots)
    content.appendChild(typingIndicator)
    typingDiv.appendChild(avatar)
    typingDiv.appendChild(content)

    this.chatMessages.appendChild(typingDiv)
    this.scrollToBottom()
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase()

    // Check for greetings
    if (message.includes("hello") || message.includes("hi") || message.includes("namaste")) {
      return `नमस्ते! I'm here to help with your health questions. You can ask me about:<br><br>• Common symptoms and remedies<br>• Traditional Nepali home remedies<br>• Wellness tips for Kathmandu<br>• General health advice<br><br>What would you like to know?`
    }

    // Check for symptoms
    for (const [symptom, data] of Object.entries(this.healthKnowledge.symptoms)) {
      if (message.includes(symptom)) {
        const remedies = data.remedies.map((r) => `• ${r}`).join("<br>")
        const nepaliRemedies = data.nepali_remedies.map((r) => `• ${r}`).join("<br>")

        return `For <strong>${symptom}</strong>, here are some helpful remedies:<br><br><strong>General Remedies:</strong><br>${remedies}<br><br><strong>Traditional Nepali Remedies:</strong><br>${nepaliRemedies}<br><br>⚠️ If symptoms persist or worsen, please consult a healthcare professional.`
      }
    }

    // Check for immunity/boost immunity
    if (message.includes("immunity") || message.includes("immune")) {
      return `🛡️ <strong>Natural Ways to Boost Immunity:</strong><br><br>• Eat vitamin C rich foods (amla, citrus fruits)<br>• Include turmeric and ginger in your diet<br>• Practice yoga and meditation<br>• Get adequate sleep (7-8 hours)<br>• Stay hydrated<br>• Eat seasonal fruits and vegetables<br>• Avoid processed foods<br><br><strong>Nepali Immunity Boosters:</strong><br>• Chyawanprash daily<br>• Tulsi tea<br>• Garlic and honey mixture<br>• Giloy juice<br><br>Regular exercise and stress management are also crucial for strong immunity!`
    }

    // Check for diet/nutrition
    if (message.includes("diet") || message.includes("nutrition") || message.includes("food")) {
      return `🥗 <strong>Healthy Diet Tips for Kathmandu:</strong><br><br><strong>Include Daily:</strong><br>• Dal (lentils) for protein<br>• Seasonal vegetables and fruits<br>• Whole grains (brown rice, quinoa)<br>• Nuts and seeds<br>• Plenty of water<br><br><strong>Local Superfoods:</strong><br>• Gundruk (fermented leafy greens)<br>• Buckwheat (local grain)<br>• Yak cheese (if available)<br>• Local honey<br>• Seasonal fruits<br><br><strong>Avoid:</strong><br>• Excessive processed foods<br>• Too much oil and salt<br>• Street food during monsoon<br><br>Eat fresh, local, and seasonal for best health!`
    }

    // Check for exercise/fitness
    if (message.includes("exercise") || message.includes("fitness") || message.includes("workout")) {
      return `💪 <strong>Exercise Tips for Kathmandu:</strong><br><br><strong>Best Times:</strong><br>• Early morning (6-8 AM) for better air quality<br>• Evening after 5 PM<br><br><strong>Recommended Activities:</strong><br>• Morning walks in parks<br>• Yoga and pranayama<br>• Indoor workouts during pollution<br>• Stair climbing (great for hills!)<br>• Swimming if available<br><br><strong>Precautions:</strong><br>• Check air quality before outdoor exercise<br>• Stay hydrated<br>• Start slowly if new to altitude<br>• Wear masks if AQI > 150<br><br>Consistency is key - even 30 minutes daily makes a difference!`
    }

    // Check for stress/mental health
    if (message.includes("stress") || message.includes("anxiety") || message.includes("mental")) {
      return `🧘‍♀️ <strong>Managing Stress & Mental Health:</strong><br><br><strong>Daily Practices:</strong><br>• 10-15 minutes meditation<br>• Deep breathing exercises<br>• Regular sleep schedule<br>• Connect with nature<br>• Talk to friends/family<br><br><strong>Traditional Methods:</strong><br>• Yoga and pranayama<br>• Chanting or mantras<br>• Herbal teas (chamomile, tulsi)<br>• Oil massage (abhyanga)<br><br><strong>When to Seek Help:</strong><br>• Persistent sadness or anxiety<br>• Sleep problems<br>• Loss of interest in activities<br><br>Mental health is as important as physical health. Don't hesitate to seek professional help if needed.`
    }

    // Check for emergency
    if (message.includes("emergency") || message.includes("urgent") || message.includes("serious")) {
      return `🚨 <strong>For Medical Emergencies:</strong><br><br><strong>Call Immediately:</strong><br>• Ambulance: <strong>102</strong><br>• Police: <strong>100</strong><br>• Fire: <strong>101</strong><br><br><strong>Major Hospitals in Kathmandu:</strong><br>• Bir Hospital: 01-4221119<br>• TU Teaching Hospital: 01-4412303<br>• Norvic Hospital: 01-4258554<br>• Grande Hospital: 01-5159266<br><br><strong>Emergency Signs:</strong><br>• Difficulty breathing<br>• Chest pain<br>• Severe bleeding<br>• Loss of consciousness<br>• High fever with confusion<br><br>Don't delay - seek immediate medical attention for serious symptoms!`
    }

    // Check for weather/pollution related
    if (message.includes("pollution") || message.includes("air quality") || message.includes("weather")) {
      const tips = this.healthKnowledge.kathmandu_specific
      const tipsList = tips.map((tip) => `• ${tip}`).join("<br>")

      return `🌫️ <strong>Health Tips for Kathmandu's Environment:</strong><br><br>${tipsList}<br><br><strong>Air Quality Guidelines:</strong><br>• Good (0-50): Safe for outdoor activities<br>• Moderate (51-100): Sensitive people should limit outdoor activities<br>• Unhealthy (101-200): Everyone should limit outdoor activities<br>• Very Unhealthy (201+): Avoid outdoor activities<br><br>Check daily AQI and plan activities accordingly!`
    }

    // Default wellness tip
    const randomTip =
      this.healthKnowledge.wellness_tips[Math.floor(Math.random() * this.healthKnowledge.wellness_tips.length)]

    return `I'd be happy to help with your health question! While I didn't find specific information about "${userMessage}", here's a helpful wellness tip:<br><br>💡 ${randomTip}<br><br>You can ask me about:<br>• Common symptoms (fever, headache, cold, cough)<br>• Home remedies and traditional treatments<br>• Diet and nutrition advice<br>• Exercise and fitness tips<br>• Stress management<br>• Health tips for Kathmandu's environment<br><br>What specific health topic would you like to know about?`
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight
  }
}

// Global function for quick buttons
function sendQuickMessage(message) {
  if (window.healthChatbot) {
    window.healthChatbot.sendQuickMessage(message)
  }
}

// Initialize chatbot when page loads
document.addEventListener("DOMContentLoaded", () => {
  window.healthChatbot = new HealthChatbot()
})

// Global send message function
function sendMessage() {
  if (window.healthChatbot) {
    window.healthChatbot.sendMessage()
  }
}
