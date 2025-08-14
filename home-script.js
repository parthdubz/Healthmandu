// Enhanced tabs functionality with animations
const tabs = document.querySelectorAll(".tab")
const panels = document.querySelectorAll(".tabpanel")

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs & panels
    tabs.forEach((t) => t.classList.remove("active"))
    panels.forEach((p) => {
      p.classList.remove("active")
      p.style.opacity = "0"
    })

    // Add active class to clicked tab & related panel with animation
    tab.classList.add("active")
    const targetPanel = document.getElementById(tab.dataset.tab)

    setTimeout(() => {
      targetPanel.classList.add("active")
      targetPanel.style.opacity = "1"

      // Animate cards in the new panel
      const cards = targetPanel.querySelectorAll(".card")
      cards.forEach((card, index) => {
        card.style.opacity = "0"
        card.style.transform = "translateY(20px)"
        setTimeout(() => {
          card.style.transition = "all 0.5s ease"
          card.style.opacity = "1"
          card.style.transform = "translateY(0)"
        }, index * 100)
      })
    }, 150)
  })
})

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in")

      // Animate cards with stagger effect
      if (entry.target.classList.contains("tabs-container")) {
        const cards = entry.target.querySelectorAll(".card")
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("animate-in")
          }, index * 100)
        })
      }

      // Animate events with stagger effect
      if (entry.target.classList.contains("events-section")) {
        const events = entry.target.querySelectorAll(".event-card")
        events.forEach((event, index) => {
          setTimeout(() => {
            event.classList.add("animate-in")
          }, index * 150)
        })
      }
    }
  })
}, observerOptions)

// Observe scroll animate elements
document.querySelectorAll(".scroll-animate").forEach((el) => {
  observer.observe(el)
})

// Counter animation function
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  const timer = setInterval(() => {
    start += increment
    if (start >= target) {
      element.textContent = target
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(start)
    }
  }, 16)
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = Number.parseInt(entry.target.dataset.target)
      const numberElement = entry.target.querySelector(".stat-number") || entry.target
      animateCounter(numberElement, target)
      counterObserver.unobserve(entry.target)
    }
  })
})

document.querySelectorAll(".animate-counter").forEach((el) => {
  counterObserver.observe(el)
})

// Parallax effect for background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const parallax = document.body
  const speed = scrolled * 0.5
  parallax.style.backgroundPosition = `center ${speed}px`
})

// Add hover effects to interactive elements
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-8px) scale(1.02)"
  })

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)"
  })
})

// Add click ripple effect
document.querySelectorAll(".tab, .card").forEach((element) => {
  element.addEventListener("click", function (e) {
    const ripple = document.createElement("span")
    const rect = this.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    this.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  })
})

// Loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")

  // Fetch real data after page loads
  setTimeout(() => {
    fetchWeatherData()
    fetchAQIData()
  }, 1000) // Delay to let animations start first
})

setInterval(() => {
  fetchWeatherData()
  fetchAQIData()
}, 600000) // 10 minutes

// API Configuration
const WEATHER_API_KEY = "8a24cd69c593916ec95f65431a479820"
const KATHMANDU_LAT = 27.7172
const KATHMANDU_LON = 85.324

// Fetch Weather Data
async function fetchWeatherData() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Kathmandu,np&appid=${WEATHER_API_KEY}&units=metric`,
    )
    const data = await response.json()

    if (data.main && data.weather) {
      // Update temperature
      const tempElement = document.querySelector(".temp")
      const conditionElement = document.querySelector(".condition")

      if (tempElement && conditionElement) {
        tempElement.textContent = `${Math.round(data.main.temp)}°C`
        conditionElement.textContent = data.weather[0].description
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      }

      console.log("Weather data updated:", data)
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    // Keep default values on error
  }
}

// Create cloud element for AQI visualization
function createCloud(card, left) {
  const cloud = document.createElement("div")
  cloud.className = "cloud"
  cloud.style.width = 60 + Math.random() * 40 + "px"
  cloud.style.height = 30 + Math.random() * 20 + "px"
  cloud.style.top = Math.random() * 60 + "px"
  cloud.style.left = left + "px"
  cloud.style.animationDuration = 20 + Math.random() * 10 + "s"
  card.appendChild(cloud)
}

// Create building element for AQI visualization
function createBuilding(card, left) {
  const building = document.createElement("div")
  building.className = "building"
  const height = 60 + Math.random() * 80
  building.style.height = height + "px"
  building.style.left = left + "px"

  const lightsCount = Math.floor(Math.random() * 5)
  for (let i = 0; i < lightsCount; i++) {
    const light = document.createElement("div")
    light.className = "building-light"
    light.style.bottom = Math.random() * height + "px"
    light.style.left = Math.random() * 30 + "px"
    building.appendChild(light)
  }

  card.appendChild(building)
}

// Update AQI visual elements based on value
function updateAQIVisual(aqi) {
  const card = document.querySelector(".aqi-card")

  // Remove old elements
  card.querySelectorAll(".sun, .cloud, .building").forEach((el) => el.remove())

  if (aqi <= 50) {
    // Good
    card.style.background = "linear-gradient(to top, #a8e6cf, #dcedc1)"
    const sun = document.createElement("div")
    sun.className = "sun"
    sun.style.position = "absolute"
    sun.style.top = "20px"
    sun.style.right = "20px"
    sun.style.width = "50px"
    sun.style.height = "50px"
    card.appendChild(sun)
  } else if (aqi <= 100) {
    // Moderate
    card.style.background = "linear-gradient(to top, #fff3b0, #ffe066)"
    for (let i = 0; i < 5; i++) createBuilding(card, 20 + i * 60 + Math.random() * 20)
    for (let i = 0; i < 3; i++) createCloud(card, 20 + i * 50 + Math.random() * 20)
  } else if (aqi <= 150) {
    // Unhealthy for Sensitive
    card.style.background = "linear-gradient(to top, #fdd835, #f57c00)"
    const sun = document.createElement("div")
    sun.className = "sun"
    sun.style.position = "absolute"
    sun.style.top = "20px"
    sun.style.right = "20px"
    sun.style.width = "40px"
    sun.style.height = "40px"
    sun.style.background = "orange"
    card.appendChild(sun)
    for (let i = 0; i < 4; i++) createCloud(card, 20 + i * 40 + Math.random() * 20)
  } else if (aqi <= 200) {
    // Unhealthy
    card.style.background = "linear-gradient(to top, #f05454, #f08080)"
    for (let i = 0; i < 5; i++) createCloud(card, 10 + i * 35 + Math.random() * 15)
  } else {
    // Very Unhealthy
    card.style.background = "linear-gradient(to top, #8B0000, #B22222)"
    for (let i = 0; i < 6; i++) createCloud(card, 10 + i * 30 + Math.random() * 15)
  }
}

// Fetch AQI Data
async function fetchAQIData() {
  try {
    const response = await fetch("https://api.waqi.info/feed/patna/?token=3a4de3c409e5e4a8dfebed640fbec023e748e572")
    const data = await response.json()

    if (data.status === "ok" && data.data) {
      const aqiValue = data.data.aqi

      const aqiNumberElement = document.querySelector(".aqi-number")
      const aqiStatusElement = document.querySelector(".aqi-status")

      if (aqiNumberElement) animateCounter(aqiNumberElement, aqiValue)

      if (aqiStatusElement) {
        let status = "Good",
          statusClass = "good"
        if (aqiValue > 200) {
          status = "Very Unhealthy"
          statusClass = "unhealthy"
        } else if (aqiValue > 150) {
          status = "Unhealthy"
          statusClass = "unhealthy"
        } else if (aqiValue > 100) {
          status = "Unhealthy for Sensitive"
          statusClass = "sensitive"
        } else if (aqiValue > 50) {
          status = "Moderate"
          statusClass = "moderate"
        }

        aqiStatusElement.textContent = status
        aqiStatusElement.className = `aqi-status ${statusClass}`
      }

      updateAQIVisual(aqiValue)
    }
  } catch (error) {
    console.error("Error fetching AQI data:", error)
  }
}

// Initial fetch
fetchAQIData()

// Refresh every 15 minutes
setInterval(fetchAQIData, 900000)
