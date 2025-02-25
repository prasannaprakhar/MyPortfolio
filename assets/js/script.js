"use strict";

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

/**
 * header sticky & go to top
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 10) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }
});

/**
 * navbar toggle
 */

const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");

navToggleBtn.addEventListener("click", function () {
  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
  elemToggleFunc(document.body);
});

/**
 * skills toggle
 */

const toggleBtnBox = document.querySelector("[data-toggle-box]");
const toggleBtns = document.querySelectorAll("[data-toggle-btn]");
const skillsBox = document.querySelector("[data-skills-box]");

for (let i = 0; i < toggleBtns.length; i++) {
  toggleBtns[i].addEventListener("click", function () {
    elemToggleFunc(toggleBtnBox);
    for (let i = 0; i < toggleBtns.length; i++) {
      elemToggleFunc(toggleBtns[i]);
    }
    elemToggleFunc(skillsBox);
  });
}

/**
 * dark & light theme toggle
 */

const themeToggleBtn = document.querySelector("[data-theme-btn]");

themeToggleBtn.addEventListener("click", function () {
  elemToggleFunc(themeToggleBtn);

  if (themeToggleBtn.classList.contains("active")) {
    document.body.classList.remove("dark_theme");
    document.body.classList.add("light_theme");

    localStorage.setItem("theme", "light_theme");
  } else {
    document.body.classList.add("dark_theme");
    document.body.classList.remove("light_theme");

    localStorage.setItem("theme", "dark_theme");
  }
});

/**
 * check & apply last time selected theme from localStorage
 */

if (localStorage.getItem("theme") === "light_theme") {
  themeToggleBtn.classList.add("active");
  document.body.classList.remove("dark_theme");
  document.body.classList.add("light_theme");
} else {
  themeToggleBtn.classList.remove("active");
  document.body.classList.remove("light_theme");
  document.body.classList.add("dark_theme");
}

// Download CV functionality
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("downloadCV")) {
    const link = document.createElement("a");
    link.href = "assets/Resume_Prasanna.pdf"; // Replace with the actual path to your CV PDF file
    link.download = "Prasanna_Prakhar_CV.pdf"; // The name for the downloaded file
    link.click();
  }
});

let downloadCVBtn = document.getElementById("downloadCVButton");

downloadCVBtn.addEventListener("click", function () {
  const newWindow = window.open(
    window.location.href.split("?")[0] + "?downloadCV=true",
    "_blank"
  );
  newWindow.focus();
});

// Project details
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = this.getAttribute("href");
  });
});

// Contact form submission
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const formData = new FormData(this);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    // https://pmcxblf8nc.execute-api.eu-north-1.amazonaws.com/dev Api Gateway URL then Lambda function
    // http://notificationLB-1788303549.eu-north-1.elb.amazonaws.com for ecs with loadbalancer
    // Send the data to the API
    fetch("http://notificationLB-1788303549.eu-north-1.elb.amazonaws.com/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Convert data to JSON string
    })
      .then((response) => response)
      .then((result) => {
        console.log("Success:", result);
        // Handle success (e.g., show a success message)
        if(result.ok){
          document.getElementById("contactForm").reset(); // Clear the form
          const successBanner = document.getElementById("successBanner");
          successBanner.style.display = "block"; // Show the success banner
        }else{
            // Handle error (e.g., show an error message)
          const failureBanner = document.getElementById("failureBanner");
          failureBanner.style.display = "block"; // Show the failure banner

        }
        // Hide the success banner after 3 seconds
        setTimeout(() => {
          successBanner.style.display = "none";
        }, 7000);

        // Scroll to the top of the page
        window.scrollTo({
          top: 300,
          behavior: "smooth",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
