"use strict";

const API_URL = "https://aasan-rozgaar-backend.onrender.com";

const usernameElement = document.getElementById("username");
const balanceElement = document.getElementById("balance");
const statusElement = document.getElementById("statusMessage");

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettingsBtn = document.getElementById("closeSettings");
const gamesBtn = document.getElementById("gamesBtn");

function getSessionToken() {
    return (
        sessionStorage.getItem("userSessionToken") ||
        sessionStorage.getItem("sessionToken") ||
        ""
    );
}

function showStatus(message) {
    if (statusElement) {
        statusElement.textContent = message;
    }
}

async function apiRequest(path) {
    const token = getSessionToken();

    if (!token) {
        throw new Error("NO_SESSION");
    }

    const response = await fetch(API_URL + path, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        }
    });

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("SERVER_RESPONSE");
    }

    if (!response.ok || data.success !== true) {
        throw new Error(data.message || "ACCOUNT_CHECK_FAILED");
    }

    return data;
}

async function loadAccount() {
    usernameElement.textContent = "Checking account...";
    balanceElement.textContent = "Rs --";
    showStatus("Checking your secure login session...");

    try {
        // Verify the logged-in user with the existing backend.
        const accountData = await apiRequest("/api/me");

        if (
            !accountData.user ||
            !accountData.user.username
        ) {
            throw new Error("ACCOUNT_NOT_FOUND");
        }

        const username = accountData.user.username;

        usernameElement.textContent = username;
        showStatus("Login verified. Loading latest balance...");

        // Ask the backend for this authenticated user's balance.
        const balanceData = await apiRequest(
            "/api/balance/" + encodeURIComponent(username)
        );

        const balance = Number(balanceData.balance);

        if (!Number.isFinite(balance)) {
            throw new Error("BALANCE_UNAVAILABLE");
        }

        balanceElement.textContent = "Rs " + balance.toLocaleString(
            "en-PK",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

        showStatus("Account verified successfully.");
    } catch (error) {
        console.error("Games account check:", error);

        usernameElement.textContent = "Not verified";
        balanceElement.textContent = "Rs --";

        if (error.message === "NO_SESSION") {
            showStatus(
                "Please log in to Aasan Rozgaar first, then open Games again."
            );
        } else {
            showStatus(
                "Account could not be verified. Return to Aasan Rozgaar, log in again, and retry."
            );
        }
    }
}

// Settings panel
if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener("click", function () {
        settingsPanel.hidden = !settingsPanel.hidden;
    });
}

if (closeSettingsBtn && settingsPanel) {
    closeSettingsBtn.addEventListener("click", function () {
        settingsPanel.hidden = true;
    });
}

// The main GAMES button will be connected to the actual game
// after the game itself is built.
if (gamesBtn) {
    gamesBtn.addEventListener("click", function () {
        showStatus("The games section is being prepared.");
    });
}

loadAccount();