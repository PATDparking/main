// Funkce pro uložení hodnot do LocalStorage včetně jména
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

// Funkce pro načtení hodnot z LocalStorage včetně jména
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

// Funkce pro ukládání historie výpočtů do LocalStorage včetně jména
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

    history.forEach((item, index) => {
        const entry = document.createElement("div");
        entry.classList.add("history-entry");
        
        // Vytvoření tabulky pro přehlednost
        const table = document.createElement("table");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Datum</th>
            <th>Jméno</th>
            <th>Nominály</th>
            <th>Celkem</th>
            <th>Akce</th>
        `;
        table.appendChild(headerRow);
        
        const dataRow = document.createElement("tr");
        const nominals = JSON.stringify(item.data, null, 2).replace(/"/g, '');
        dataRow.innerHTML = `
            <td>${item.date}</td>
            <td>${item.username}</td>
            <td><pre>${nominals}</pre></td>
            <td>${item.total} Kč</td>
            <td><button onclick="deleteHistoryEntry(${index})">Smazat</button></td>
        `;
        table.appendChild(dataRow);
        
        entry.appendChild(table);
        historyContainer.appendChild(entry);
    });
}

// Funkce pro smazání záznamu z historie
function deleteHistoryEntry(index) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.splice(index, 1);
    localStorage.setItem("history", JSON.stringify(history));
    displayHistory();
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

    // Celkové hodnoty pro každý nominál
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

    // Zobrazit jednotlivé celkové hodnoty
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

    // Celková částka všech nominálů
    const total = total100 + total200 + total500 + total1000 + total2000 + total5000 +
                  total1 + total2 + total5 + total10 + total20 + total50;

    // Zobrazit celkovou částku
    document.getElementById("totalAmount").innerText = total;

    // Uložit do LocalStorage
    saveInputValues();
    localStorage.setItem("totalAmount", total);
}

// Funkce volaná po kliknutí na tlačítko Spočítat, která také uloží výsledek do historie
function calculateAndSave() {
    calculateTotal();

    // Získání hodnoty jména
    const username = document.getElementById("username").value || "Neznámé";

    // Získání dat z formuláře
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

    // Získání celkové částky
    const total = parseInt(document.getElementById("totalAmount").innerText) || 0;

    // Uložit do historie včetně jména
    saveToHistory(data, total, username);
}
  
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

// Načíst hodnoty při načtení stránky
window.onload = function() {
    loadInputValues();
    updateTotalsOnLoad();  // Přidáno pro načtení celkových částek
    displayHistory();
    const totalAmount = localStorage.getItem("totalAmount") || 0;
    document.getElementById("totalAmount").innerText = totalAmount;

    // Přidat event listener pro automatickou aktualizaci celkových částek
    updateTotalOnChange();
};
