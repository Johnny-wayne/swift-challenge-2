document.addEventListener("DOMContentLoaded", function () {
  animateProgressBars();

  setupNavigation();

  setupHeaderButtons();

  setupMissionCardHovers();
});

function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-fill");

  progressBars.forEach((bar, index) => {
    const targetWidth = bar.style.width;
    bar.style.width = "0%";

    setTimeout(() => {
      bar.style.width = targetWidth;
    }, index * 200 + 500);
  });
}

function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active");
      });

      this.parentElement.classList.add("active");

      console.log("Navegando para:", this.querySelector("span").textContent);
    });
  });
}

function setupHeaderButtons() {
  const headerButtons = document.querySelectorAll(".header-btn");

  headerButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1.05)";
      }, 100);
      setTimeout(() => {
        this.style.transform = "";
      }, 200);

      const icon = this.querySelector("i");
      if (icon.classList.contains("fa-bell")) {
        console.log("Notificações clicadas");
        showNotification("Você tem 3 novas notificações!");
      } else if (icon.classList.contains("fa-user")) {
        console.log("Perfil do utilizador clicado");
        showNotification("Perfil do utilizador");
      } else if (icon.classList.contains("fa-th")) {
        console.log("Menu de aplicações clicado");
        showNotification("Menu de aplicações");
      }
    });
  });
}

function setupMissionCardHovers() {
  const missionCards = document.querySelectorAll(".mission-card");

  missionCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 8px 25px rgba(220, 38, 38, 0.15)";

      if (this.classList.contains("completed")) {
        this.style.boxShadow = "0 8px 25px rgba(22, 163, 74, 0.15)";
      }
    });

    card.addEventListener("mouseleave", function () {
      this.style.boxShadow = "";
    });

    card.addEventListener("click", function () {
      const missionTitle = this.querySelector(".mission-title").textContent;
      const isCompleted = this.classList.contains("completed");

      if (isCompleted) {
        showNotification(`Missão "${missionTitle}" já foi concluída!`);
      } else {
        showNotification(`Clicou na missão: "${missionTitle}"`);
      }
    });
  });
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2a2a2a;
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid #3a3a3a;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains("light-theme");

  if (isDark) {
    body.classList.remove("light-theme");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.add("light-theme");
    localStorage.setItem("theme", "light");
  }
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
}
function updateMissionProgress(missionIndex, newProgress) {
  const missionCards = document.querySelectorAll(".mission-card");
  if (missionIndex < missionCards.length) {
    const card = missionCards[missionIndex];
    const progressFill = card.querySelector(".progress-fill");
    const progressLabel = card.querySelector(".progress-label span:last-child");

    progressFill.style.width = newProgress + "%";
    progressLabel.textContent = newProgress + "%";

    if (newProgress >= 100) {
      card.classList.add("completed");
      const timeElement = card.querySelector(".mission-time");
      timeElement.innerHTML =
        '<i class="fas fa-check"></i><span>Concluído</span>';
      timeElement.classList.add("completed");

      showNotification("Missão concluída! Parabéns!");
    }
  }
}

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case "1":
        e.preventDefault();
        document.querySelector(".nav-item:nth-child(1) .nav-link").click();
        break;
      case "2":
        e.preventDefault();
        document.querySelector(".nav-item:nth-child(2) .nav-link").click();
        break;
      case "3":
        e.preventDefault();
        document.querySelector(".nav-item:nth-child(3) .nav-link").click();
        break;
      case "4":
        e.preventDefault();
        document.querySelector(".nav-item:nth-child(4) .nav-link").click();
        break;
    }
  }
});
loadSavedTheme();
