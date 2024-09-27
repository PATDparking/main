let currentField = '';
let currentAction = '';

// Funkce pro otevření modalu
function openModal(fieldId, action) {
    currentField = fieldId;
    currentAction = action;
    
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal-title").innerText = action === 'add' ? 'Vložit částku' : 'Vybrat částku';
}

// Funkce pro zavření modalu
function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("modal-input").value = ''; // Vyčistit input
}

// Funkce pro potvrzení a uložení hodnoty z modalu
function submitModal() {
    const value = parseInt(document.getElementById("modal-input").value) || 0;
    const inputField = document.getElementById(currentField);
    let currentValue = parseInt(inputField.value) || 0;

    if (currentAction === 'add') {
        currentValue += value;
        saveToDepositHistory(currentField, value); // Uložení do historie vkladů
    } else if (currentAction === 'subtract') {
        currentValue = Math.max(currentValue - value, 0); // Nenechat jít do mínusu
        saveToWithdrawalHistory(currentField, value); // Uložení do historie výběrů
    }

    inputField.value = currentValue;
    
    calculateTotal(); // Přepočítat celkovou částku
    closeModal(); // Zavřít modal
}

// Funkce pro ukládání hodnot do LocalStorage
function saveInputValues() {
    const inputs = [
        "nom100", "nom200", "nom500", "nom1000", "nom2000", "nom5000",
        "nom1", "nom2", "nom5", "nom10", "nom20", "nom50", "username" // Přidáno "username"
    ];
    inputs.forEach(id => {
        const value = document.getElementById(id).value || 0;
        localStorage.setItem(id, value);
    });
}

// Funkce pro načtení hodnot z LocalStorage
function loadInputValues() {
    const inputs = [
        "nom100", "nom200", "nom500", "nom1000", "nom2000", "nom5000",
        "nom1", "nom2", "nom5", "nom10", "nom20", "nom50", "username" // Přidáno "username"
    ];
    inputs.forEach(id => {
        const value = localStorage.getItem(id) || "";
        document.getElementById(id).value = value;
    });
}

// Funkce pro aktualizaci celkových částek při načtení stránky
function updateTotalsOnLoad() {
    const inputs = [
        "nom100", "nom200", "nom500", "nom1000", "nom2000", "nom5000",
        "nom1", "nom2", "nom5", "nom10", "nom20", "nom50"
    ];

    inputs.forEach(id => {
        const value = parseInt(document.getElementById(id).value) || 0;
        let totalField = document.getElementById(`total${id.slice(3)}`);
        let multiplier = parseInt(id.slice(3));
        totalField.innerText = value * multiplier;
    });
}

// Funkce pro ukládání historie výpočtů do LocalStorage
function saveToHistory(data, total, username) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push({ username, data, total, date: new Date().toLocaleString() });
    localStorage.setItem("history", JSON.stringify(history));
    displayHistory();
}

// Funkce pro zobrazení historie
function displayHistory() {
    const historyContainer = document.getElementById("history");
    const history = JSON.parse(localStorage.getItem("history")) || [];
    historyContainer.innerHTML = ""; // Vyčistit předchozí historii

    // Iterace přes historii a zobrazení každého záznamu jako blok
    history.forEach((item, index) => {
        const entry = document.createElement("div");
        entry.classList.add("history-entry");
        entry.style.border = "1px solid #ccc"; // Přidání okraje pro oddělení
        entry.style.margin = "10px 0"; // Vzdálenost mezi záznamy
        entry.style.padding = "10px"; // Vnitřní okraj
        
        const nominals = JSON.stringify(item.data, null, 2).replace(/"/g, '');
        entry.innerHTML = `
            <strong>Datum:</strong> ${item.date}<br>
            <strong>Jméno:</strong> ${item.username}<br>
            <strong>Nominály:</strong><pre>${nominals}</pre><br>
            <strong>Celkem:</strong> ${item.total} Kč<br>
            <button onclick="deleteHistoryEntry(${index})">Smazat</button>
        `;
        
        historyContainer.appendChild(entry); // Přidat záznam do kontejneru
    });
}


// Funkce pro smazání záznamu z historie
function deleteHistoryEntry(index) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.splice(index, 1);
    localStorage.setItem("history", JSON.stringify(history));
    displayHistory();
}

// Funkce pro ukládání historie vkladů
function saveToDepositHistory(fieldId, amount) {
    let history = JSON.parse(localStorage.getItem(`${fieldId}DepositHistory`)) || [];
    history.push({ amount, date: new Date().toLocaleString() });
    localStorage.setItem(`${fieldId}DepositHistory`, JSON.stringify(history));
    displayDepositHistory(fieldId);
}

// Funkce pro ukládání historie výběrů
function saveToWithdrawalHistory(fieldId, amount) {
    let history = JSON.parse(localStorage.getItem(`${fieldId}WithdrawalHistory`)) || [];
    history.push({ amount, date: new Date().toLocaleString() });
    localStorage.setItem(`${fieldId}WithdrawalHistory`, JSON.stringify(history));
    displayWithdrawalHistory(fieldId);
}

// Funkce pro zobrazení historie vkladů
function displayDepositHistory(fieldId) {
    const historyContainer = document.getElementById(`history${fieldId.slice(3)}`);
    const history = JSON.parse(localStorage.getItem(`${fieldId}DepositHistory`)) || [];
    historyContainer.innerHTML = ""; // Vyčistit předchozí historii

    history.forEach((item, index) => {
        const entry = document.createElement("div");
        entry.innerText = `Vloženo: ${item.amount} Kč, Datum: ${item.date}`;

        // Přidání tlačítka pro smazání záznamu
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Smazat";
        deleteButton.onclick = function () {
            deleteDepositHistoryEntry(fieldId, index);
        };

        entry.appendChild(deleteButton); // Přidat tlačítko do záznamu
        historyContainer.appendChild(entry);
    });
}

// Funkce pro smazání záznamu z historie vkladů
function deleteDepositHistoryEntry(fieldId, index) {
    let history = JSON.parse(localStorage.getItem(`${fieldId}DepositHistory`)) || [];
    history.splice(index, 1); // Odebrat záznam na daném indexu
    localStorage.setItem(`${fieldId}DepositHistory`, JSON.stringify(history));
    displayDepositHistory(fieldId); // Aktualizovat zobrazení
}


// Funkce pro zobrazení historie výběrů
function displayWithdrawalHistory(fieldId) {
    const historyContainer = document.getElementById(`history${fieldId.slice(3)}`);
    const history = JSON.parse(localStorage.getItem(`${fieldId}WithdrawalHistory`)) || [];
    historyContainer.innerHTML = ""; // Vyčistit předchozí historii

    history.forEach((item, index) => {
        const entry = document.createElement("div");
        entry.innerText = `Vybráno: ${item.amount} Kč, Datum: ${item.date}`;

        // Přidání tlačítka pro smazání záznamu
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Smazat";
        deleteButton.onclick = function () {
            deleteWithdrawalHistoryEntry(fieldId, index);
        };

        entry.appendChild(deleteButton); // Přidat tlačítko do záznamu
        historyContainer.appendChild(entry);
    });
}

// Funkce pro smazání záznamu z historie výběrů
function deleteWithdrawalHistoryEntry(fieldId, index) {
    let history = JSON.parse(localStorage.getItem(`${fieldId}WithdrawalHistory`)) || [];
    history.splice(index, 1); // Odebrat záznam na daném indexu
    localStorage.setItem(`${fieldId}WithdrawalHistory`, JSON.stringify(history));
    displayWithdrawalHistory(fieldId); // Aktualizovat zobrazení
}


// Hlavní funkce pro výpočet
function calculateTotal() {
    const nom100 = parseInt(document.getElementById("nom100").value) || 0;
    const nom200 = parseInt(document.getElementById("nom200").value) || 0;
    const nom500 = parseInt(document.getElementById("nom500").value) || 0;
    const nom1000 = parseInt(document.getElementById("nom1000").value) || 0;
    const nom2000 = parseInt(document.getElementById("nom2000").value) || 0;
    const nom5000 = parseInt(document.getElementById("nom5000").value) || 0;

    const nom1 = parseInt(document.getElementById("nom1").value) || 0;
    const nom2 = parseInt(document.getElementById("nom2").value) || 0;
    const nom5 = parseInt(document.getElementById("nom5").value) || 0;
    const nom10 = parseInt(document.getElementById("nom10").value) || 0;
    const nom20 = parseInt(document.getElementById("nom20").value) || 0;
    const nom50 = parseInt(document.getElementById("nom50").value) || 0;

    const total100 = nom100 * 100;
    const total200 = nom200 * 200;
    const total500 = nom500 * 500;
    const total1000 = nom1000 * 1000;
    const total2000 = nom2000 * 2000;
    const total5000 = nom5000 * 5000;

    const total1 = nom1 * 1;
    const total2 = nom2 * 2;
    const total5 = nom5 * 5;
    const total10 = nom10 * 10;
    const total20 = nom20 * 20;
    const total50 = nom50 * 50;

    document.getElementById("total100").innerText = total100;
    document.getElementById("total200").innerText = total200;
    document.getElementById("total500").innerText = total500;
    document.getElementById("total1000").innerText = total1000;
    document.getElementById("total2000").innerText = total2000;
    document.getElementById("total5000").innerText = total5000;

    document.getElementById("total1").innerText = total1;
    document.getElementById("total2").innerText = total2;
    document.getElementById("total5").innerText = total5;
    document.getElementById("total10").innerText = total10;
    document.getElementById("total20").innerText = total20;
    document.getElementById("total50").innerText = total50;

    const total = total100 + total200 + total500 + total1000 + total2000 + total5000 +
                  total1 + total2 + total5 + total10 + total20 + total50;

    document.getElementById("totalAmount").innerText = total;

    saveInputValues();
    localStorage.setItem("totalAmount", total);
}

// Funkce volaná po kliknutí na tlačítko Spočítat
function calculateAndSave() {
    calculateTotal();

    const username = document.getElementById("username").value || "Neznámé";

    const data = {
        nom100: parseInt(document.getElementById("nom100").value) || 0,
        nom200: parseInt(document.getElementById("nom200").value) || 0,
        nom500: parseInt(document.getElementById("nom500").value) || 0,
        nom1000: parseInt(document.getElementById("nom1000").value) || 0,
        nom2000: parseInt(document.getElementById("nom2000").value) || 0,
        nom5000: parseInt(document.getElementById("nom5000").value) || 0,
        nom1: parseInt(document.getElementById("nom1").value) || 0,
        nom2: parseInt(document.getElementById("nom2").value) || 0,
        nom5: parseInt(document.getElementById("nom5").value) || 0,
        nom10: parseInt(document.getElementById("nom10").value) || 0,
        nom20: parseInt(document.getElementById("nom20").value) || 0,
        nom50: parseInt(document.getElementById("nom50").value) || 0
    };

    const total = parseInt(document.getElementById("totalAmount").innerText) || 0;

    saveToHistory(data, total, username);
}

// Inicializační funkce po načtení stránky
window.onload = function() {
    loadInputValues();
    updateTotalsOnLoad();
    displayHistory();
    const totalAmount = localStorage.getItem("totalAmount") || 0;
    document.getElementById("totalAmount").innerText = totalAmount;

    // Zobrazit historii pro každé pole
    const fields = [
        "nom100", "nom200", "nom500", "nom1000", "nom2000", "nom5000",
        "nom1", "nom2", "nom5", "nom10", "nom20", "nom50"
    ];

    fields.forEach(fieldId => {
        displayDepositHistory(fieldId);
        displayWithdrawalHistory(fieldId);
    });

    // Přidat event listener pro automatickou aktualizaci celkových částek
    updateTotalOnChange();
};

// Funkce pro aktualizaci celkové částky při změně hodnoty v polích
function updateTotalOnChange() {
    const inputs = [
        "nom100", "nom200", "nom500", "nom1000", "nom2000", "nom5000",
        "nom1", "nom2", "nom5", "nom10", "nom20", "nom50"
    ];
    
    inputs.forEach(id => {
        document.getElementById(id).addEventListener("input", calculateTotal);
    });
}
