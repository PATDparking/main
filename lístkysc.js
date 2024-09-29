// Pole s čísly stojanů
const stands = [91, 93, 95, 119, 83, 85, 87, 89, 65, 67, 103, 105, 69];

// Funkce pro přepínání stavu stojanu
function toggleOperationalStatus(standNumber) {
    const currentStatus = localStorage.getItem(`stand-${standNumber}-status`) || 'v provozu';
    const newStatus = currentStatus === 'v provozu' ? 'mimo provoz' : 'v provozu';
    
    localStorage.setItem(`stand-${standNumber}-status`, newStatus);
    updateOperationalStatus(standNumber, newStatus);

    // Změna barvy kontejneru podle stavu
    const standDiv = document.getElementById(`stand-${standNumber}`);
    if (newStatus === 'mimo provoz') {
        standDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; // Červená barva
    } else {
        standDiv.style.backgroundColor = ''; // Obnovení výchozí barvy
    }
}

// Funkce pro aktualizaci zobrazení stavu
function updateOperationalStatus(standNumber, status) {
    const toggleButton = document.getElementById(`toggle-${standNumber}`);
    const statusDisplay = document.getElementById(`operational-status-${standNumber}`);
    
    if (status === 'v provozu') {
        toggleButton.textContent = 'Vypnout';
        statusDisplay.textContent = 'V provozu';
        statusDisplay.style.color = 'green'; // Zelená pro provoz
    } else {
        toggleButton.textContent = 'Zapnout';
        statusDisplay.textContent = 'Mimo provoz';
        statusDisplay.style.color = 'red'; // Červená pro mimo provoz
    }
}

// Funkce pro vytvoření HTML struktury pro každý stojan
function createStand(standNumber) {
    const standDiv = document.createElement('div');
    standDiv.className = 'stand';
    standDiv.id = `stand-${standNumber}`;
    standDiv.innerHTML = `
        <h2>Stojan ${standNumber}</h2>
        <button id="edit-btn-${standNumber}" onclick="toggleEdit(${standNumber})">Změnit</button>
        <div class="slot-container">
            <!-- Slot 1 -->
            <div class="slot">
                <label for="slider-${standNumber}-1">Krabice 1:</label>
                <div class="slider-container">
                    <input type="range" id="slider-${standNumber}-1" class="slider" min="0" max="100" value="0" step="2.5" disabled onchange="updateStatus(${standNumber}, 1)" oninput="saveValue(${standNumber}, 1)">


                    <span id="status-${standNumber}-1" class="status">0%</span>
                </div>
            </div>
            <!-- Slot 2 -->
            <div class="slot">
                <label for="slider-${standNumber}-2">Krabice 2:</label>
                <div class="slider-container">
                    <input type="range" id="slider-${standNumber}-2" class="slider" min="0" max="100" value="0" step="2.5" disabled onchange="updateStatus(${standNumber}, 2)" oninput="saveValue(${standNumber}, 2)">

                    <span id="status-${standNumber}-2" class="status">0%</span>
                </div>
            </div>
        </div>
        
        <button id="toggle-${standNumber}" class="toggle-button" onclick="toggleOperationalStatus(${standNumber})">Vypnout</button>
        <span id="operational-status-${standNumber}" class="operational-status">Mimo provoz</span>
    `;
    return standDiv;
}

function roundValue(value) {
    if (value <= 10) {
        return Math.round(value * 4) / 4; // zaokroulení na 0.25
    }
    return Math.round(value / 10) * 10; // zaokroulení na celé desítky
}


function updateStatus(standNumber, slotNumber) {
    const slider = document.getElementById(`slider-${standNumber}-${slotNumber}`);
    const status = document.getElementById(`status-${standNumber}-${slotNumber}`);
    const value = parseFloat(slider.value);

    // Zaokroulení hodnoty
    const roundedValue = roundValue(value);
    
    // Zobrazení zaokroulené hodnoty
    status.textContent = `${roundedValue}%`;

    // Barva podle hodnoty
    if (roundedValue <= 10) {
        status.style.color = 'red';
    } else if (roundedValue <= 50) {
        status.style.color = 'orange';
    } else {
        status.style.color = 'green';
    }

    // Dynamické barvení posuvníku
    slider.style.background = `linear-gradient(to right, #007BFF ${roundedValue}%, #ddd ${roundedValue}%)`;
}


// Funkce pro ukládání hodnot posuvníků do localStorage
function saveValue(standNumber, slotNumber) {
    const slider = document.getElementById(`slider-${standNumber}-${slotNumber}`);
    localStorage.setItem(`stand-${standNumber}-slot-${slotNumber}`, slider.value);
}

// Funkce pro přepínání uzamčení/odemčení posuvníků
function toggleEdit(standNumber) {
    const slider1 = document.getElementById(`slider-${standNumber}-1`);
    const slider2 = document.getElementById(`slider-${standNumber}-2`);
    const button = document.getElementById(`edit-btn-${standNumber}`);

    if (slider1.disabled && slider2.disabled) {
        slider1.disabled = false;
        slider2.disabled = false;
        button.textContent = 'Uložit';
    } else {
        slider1.disabled = true;
        slider2.disabled = true;
        button.textContent = 'Změnit';
        saveValue(standNumber, 1);
        saveValue(standNumber, 2);
    }
}

// Funkce pro načtení hodnot z localStorage při načtení stránky
function loadValues() {
    stands.forEach(standNumber => {
        for (let i = 1; i <= 2; i++) {
            const value = localStorage.getItem(`stand-${standNumber}-slot-${i}`) || 0;
            document.getElementById(`slider-${standNumber}-${i}`).value = value;
            updateStatus(standNumber, i);
            document.getElementById(`slider-${standNumber}-${i}`).disabled = true; // Zamknutí posuvníků
        }

        const operationalStatus = localStorage.getItem(`stand-${standNumber}-status`) || 'v provozu';
        updateOperationalStatus(standNumber, operationalStatus);
// Nastavení barvy kontejneru podle stavu
const standDiv = document.getElementById(`stand-${standNumber}`);
if (operationalStatus === 'mimo provoz') {
    standDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; // Červená barva
} else {
    standDiv.style.backgroundColor = ''; // Obnovení výchozí barvy
}
});
}

// Generování všech stojanů
const standsContainer = document.getElementById('standsContainer');
stands.forEach(standNumber => {
    const stand = createStand(standNumber);
    standsContainer.appendChild(stand);
});

// Načtení uložených hodnot z localStorage při načtení stránky
window.onload = function() {
    loadValues();
};


