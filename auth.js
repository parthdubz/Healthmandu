class HealthmanduAuth {
  constructor() {
    this.users = this.loadUsers()
    this.currentUser = this.getCurrentUser()
  }

  // Load users from localStorage
  loadUsers() {
    const users = localStorage.getItem("healthmandu_users")
    return users ? JSON.parse(users) : []
  }

  // Save users to localStorage
  saveUsers() {
    localStorage.setItem("healthmandu_users", JSON.stringify(this.users))
  }

  // Get current logged-in user
  getCurrentUser() {
    const user = localStorage.getItem("healthmandu_user")
    return user ? JSON.parse(user) : null
  }

  // Save current user session
  saveCurrentUser(user) {
    localStorage.setItem("healthmandu_user", JSON.stringify(user))
    this.currentUser = user
  }

  // Register new user
  register(username, email, password, confirmPassword) {
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      throw new Error("All fields are required")
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long")
    }

    // Check if user already exists
    const existingUser = this.users.find((user) => user.email === email || user.username === username)

    if (existingUser) {
      throw new Error("User with this email or username already exists")
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: this.hashPassword(password), // In real app, use proper hashing
      createdAt: new Date().toISOString(),
      profile: {
        name: "",
        location: "",
      },
    }

    this.users.push(newUser)
    this.saveUsers()

    // Auto login after registration
    const userSession = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      loginTime: new Date().toISOString(),
    }

    this.saveCurrentUser(userSession)
    return userSession
  }

  // Login user
  login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    const user = this.users.find((user) => user.email === email)

    if (!user) {
      throw new Error("User not found")
    }

    if (user.password !== this.hashPassword(password)) {
      throw new Error("Invalid password")
    }

    // Create user session
    const userSession = {
      id: user.id,
      username: user.username,
      email: user.email,
      loginTime: new Date().toISOString(),
    }

    this.saveCurrentUser(userSession)
    return userSession
  }

  // Logout user
  logout() {
    localStorage.removeItem("healthmandu_user")
    this.currentUser = null
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null
  }

  // Simple password hashing (use proper hashing in production)
  hashPassword(password) {
    // This is just for demo - use bcrypt or similar in production
    return btoa(password + "healthmandu_salt")
  }

  // Check authentication and redirect if needed
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = "index.html"
      return false
    }
    return true
  }
}

// Initialize auth system
const auth = new HealthmanduAuth()

// Global logout function
function logout() {
  auth.logout()
  showMessage("Logged out successfully!", "success")
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1000)
}

// Message display function
function showMessage(message, type = "info") {
  // Remove existing messages
  const existingMessage = document.querySelector(".message")
  if (existingMessage) {
    existingMessage.remove()
  }

  // Create new message element
  const messageDiv = document.createElement("div")
  messageDiv.className = `message message-${type}`
  messageDiv.textContent = message

  // Style the message
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  `

  // Set background color based on type
  if (type === "success") {
    messageDiv.style.background = "linear-gradient(135deg, #48bb78, #38a169)"
  } else if (type === "error") {
    messageDiv.style.background = "linear-gradient(135deg, #f56565, #e53e3e)"
  } else {
    messageDiv.style.background = "linear-gradient(135deg, #667eea, #764ba2)"
  }

  document.body.appendChild(messageDiv)

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.style.animation = "slideOut 0.3s ease"
      setTimeout(() => messageDiv.remove(), 300)
    }
  }, 3000)
}

// Handle login form submission
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginFormElement")
  const signupForm = document.getElementById("signupFormElement")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("loginEmail").value
      const password = document.getElementById("loginPassword").value

      try {
        const user = auth.login(email, password)
        showMessage(`Welcome back, ${user.username}!`, "success")

        setTimeout(() => {
          window.location.href = "home.html"
        }, 1500)
      } catch (error) {
        showMessage(error.message, "error")
      }
    })
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const username = document.getElementById("signupUsername").value
      const email = document.getElementById("signupEmail").value
      const password = document.getElementById("signupPassword").value
      const confirmPassword = document.getElementById("confirmPassword").value

      try {
        const user = auth.register(username, email, password, confirmPassword)
        showMessage(`Account created successfully! Welcome, ${user.username}!`, "success")

        setTimeout(() => {
          window.location.href = "home.html"
        }, 2000)
      } catch (error) {
        showMessage(error.message, "error")
      }
    })
  }

  // Check authentication on home page
  if (window.location.pathname.includes("home.html")) {
    if (auth.requireAuth()) {
      // Update greeting with user info
      const userGreeting = document.getElementById("userGreeting")
      if (userGreeting && auth.currentUser) {
        const now = new Date()
        const hour = now.getHours()
        let greeting = "नमस्ते!"

        if (hour < 12) greeting = "शुभ प्रभात! Good Morning"
        else if (hour < 17) greeting = "नमस्कार! Good Afternoon"
        else greeting = "शुभ साँझ! Good Evening"

        userGreeting.textContent = `${greeting} ${auth.currentUser.username}!`
      }
    }
  }
})
