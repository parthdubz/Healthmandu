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

// Counter animation
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

// Fetch AQI Data using World Air Quality Index API
async function fetchAQIData() {
  try {
    const response = await fetch("https://api.waqi.info/feed/kathmandu/?token=3a4de3c409e5e4a8dfebed640fbec023e748e572")
    const data = await response.json()

    if (data.status === "ok" && data.data) {
      const aqiValue = data.data.aqi

      // Update AQI display
      const aqiNumberElement = document.querySelector(".aqi-number")
      const aqiStatusElement = document.querySelector(".aqi-status")

      if (aqiNumberElement) {
        // Update the counter target and animate
        aqiNumberElement.dataset.target = aqiValue
        animateCounter(aqiNumberElement, aqiValue)
      }

      if (aqiStatusElement) {
        // Update status based on AQI level using standard AQI ranges
        let status = "Good"
        let statusClass = "good"

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

      console.log("Kathmandu AQI:", data)
      console.log("AQI value:", data.data.aqi)
    }
  } catch (error) {
    console.error("Error fetching AQI data:", error)
    // Keep default values on error
  }
}
