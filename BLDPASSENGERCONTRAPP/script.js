document.addEventListener("DOMContentLoaded", () => {
  
  let counts = {
    "u-turn": {
      "passenger-car": 0,
      bus: 0,
      truck: 0,
    },
    "left-turn": {
      "passenger-car": 0,
      bus: 0,
      truck: 0,
    },
    through: {
      "passenger-car": 0,
      bus: 0,
      truck: 0,
    },
    "right-turn": {
      "passenger-car": 0,
      bus: 0,
      truck: 0,
    },
  };

  
  let isTimerRunning = false;
  let elapsedTime = 0;
  let timerInterval = null;

  const tabTriggers = document.querySelectorAll(".tab-trigger");
  const tabContents = document.querySelectorAll(".tab-content");
  const countButtons = document.querySelectorAll(".count-btn");
  const resetButton = document.getElementById("reset-btn");
  const saveButton = document.getElementById("save-btn");
  const timerDisplay = document.getElementById("timer-display");
  const playButton = document.getElementById("play-btn");
  const pauseButton = document.getElementById("pause-btn");
  const stopButton = document.getElementById("stop-btn");
  const toastContainer = document.getElementById("toast-container");

  const loadCounts = () => {
    const savedCounts = localStorage.getItem("vehicleCounts");
    if (savedCounts) {
      counts = JSON.parse(savedCounts);
      updateAllCounts();
    }
  };

  const updateAllCounts = () => {
    Object.keys(counts).forEach((turnType) => {
      Object.keys(counts[turnType]).forEach((vehicleType) => {
        const countElement = document.getElementById(
          `${turnType}-${vehicleType}-count`
        );
        if (countElement) {
          countElement.textContent = counts[turnType][vehicleType];
        }
      });

      const turnTotal = getTotalCount(turnType);
      const turnTotalElement = document.getElementById(`${turnType}-total`);
      const tabCountElement = document.getElementById(`${turnType}-count`);

      if (turnTotalElement) turnTotalElement.textContent = turnTotal;
      if (tabCountElement) tabCountElement.textContent = turnTotal;
    });

    const overallTotal = getOverallTotal();
    const overallTotalElement = document.getElementById("overall-total");
    if (overallTotalElement) overallTotalElement.textContent = overallTotal;
  };

  const getTotalCount = (turnType) => {
    return Object.values(counts[turnType]).reduce(
      (sum, count) => sum + count,
      0
    );
  };

  const getOverallTotal = () => {
    return Object.keys(counts).reduce(
      (sum, turnType) => sum + getTotalCount(turnType),
      0
    );
  };

  const incrementCount = (turnType, vehicleType) => {
    counts[turnType][vehicleType]++;
    updateAllCounts();
  };

  const resetCounts = () => {
    counts = {
      "u-turn": {
        "passenger-car": 0,
        bus: 0,
        truck: 0,
      },
      "left-turn": {
        "passenger-car": 0,
        bus: 0,
        truck: 0,
      },
      through: {
        "passenger-car": 0,
        bus: 0,
        truck: 0,
      },
      "right-turn": {
        "passenger-car": 0,
        bus: 0,
        truck: 0,
      },
    };
    updateAllCounts();
    showToast("Counts Reset", "All vehicle counts have been reset to zero.");
  };

  const saveCounts = () => {
    localStorage.setItem("vehicleCounts", JSON.stringify(counts));
    showToast("Counts Saved", "Vehicle counts have been saved successfully.");
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!isTimerRunning) {
      isTimerRunning = true;
      playButton.classList.add("hidden");
      pauseButton.classList.remove("hidden");

      timerInterval = setInterval(() => {
        elapsedTime++;
        timerDisplay.textContent = formatTime(elapsedTime);
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isTimerRunning) {
      isTimerRunning = false;
      pauseButton.classList.add("hidden");
      playButton.classList.remove("hidden");

      clearInterval(timerInterval);
    }
  };

  const resetTimer = () => {
    pauseTimer();
    elapsedTime = 0;
    timerDisplay.textContent = formatTime(elapsedTime);
  };

  const showToast = (title, description) => {
    const toast = document.createElement("div");
    toast.className = "toast toast-success";
    toast.innerHTML = `
      <div class="toast-title">${title}</div>
      <div class="toast-description">${description}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-exit");
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);
  };

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const tabId = trigger.getAttribute("data-tab");

      tabTriggers.forEach((t) => t.classList.remove("active"));
      trigger.classList.add("active");

      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === `${tabId}-content`) {
          content.classList.add("active");
        }
      });
    });
  });

  countButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const turnType = button.getAttribute("data-turn");
      const vehicleType = button.getAttribute("data-vehicle");
      incrementCount(turnType, vehicleType);
    });
  });

  resetButton.addEventListener("click", resetCounts);

  saveButton.addEventListener("click", saveCounts);

  playButton.addEventListener("click", startTimer);
  pauseButton.addEventListener("click", pauseTimer);
  stopButton.addEventListener("click", resetTimer);

  loadCounts();
  updateAllCounts();
});
