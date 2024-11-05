document.getElementById('vincoloForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Prendi i valori inseriti dall'utente
    const px = parseFloat(document.getElementById('px').value);
    const py = parseFloat(document.getElementById('py').value);
    const reddito = parseFloat(document.getElementById('reddito').value);

    // Variabili per memorizzare le quantità ottimali
    let optimalQuantitaX = 0;
    let optimalQuantitaY = 0;
    let minDifferenza = Infinity;

    // Calcolo delle quantità massime mantenendo il budget
    for (let x = 1; x <= Math.floor(reddito / px); x++) {  // Iniziamo da 1 per garantire che ci sia almeno una unità di X
        const budgetRimanente = reddito - (px * x);
        
        // Calcola la quantità massima di Y che si può acquistare con il budget rimanente
        const y = Math.floor(budgetRimanente / py);

        // Assicuriamoci che ci sia almeno una unità di Y
        if (y > 0) {
            // Calcola la differenza tra le quantità
            const differenza = Math.abs(x - y);
            
            // Aggiorna le quantità ottimali se la differenza è minore
            if (differenza < minDifferenza) {
                minDifferenza = differenza;
                optimalQuantitaX = x;
                optimalQuantitaY = y;
            }
        }
    }

    // Calcola i costi totali per X e Y
    const costoMaxX = optimalQuantitaX * px;
    const costoMaxY = optimalQuantitaY * py;
    const budgetRimanente = reddito - (costoMaxX + costoMaxY);

    // Mostra i risultati
    document.getElementById('costoMaxX').textContent = `Costo massimo per il bene X (${optimalQuantitaX} unità): €${costoMaxX.toFixed(2)}`;
    document.getElementById('costoMaxY').textContent = `Costo massimo per il bene Y (${optimalQuantitaY} unità): €${costoMaxY.toFixed(2)}`;
    document.getElementById('budgetRimanente').textContent = `Budget rimanente: €${budgetRimanente.toFixed(2)}`;

    // Chiamata all'API per ottenere le combinazioni
    try {
        const response = await fetch(`http://127.0.0.1:10000/api/vincolo-bilancio?px=${px}&py=${py}&reddito=${reddito}`);
        const data = await response.json();

        // Estrarre le combinazioni x e y
        const xValues = data.combinazioni.map(point => point.x);
        const yValues = data.combinazioni.map(point => point.y);

        // Genera il grafico
        renderChart(xValues, yValues);

        // Mostra la sezione dei risultati
        document.querySelector('.result-container').style.display = 'block';
        document.getElementById('quantitaMassimaX').textContent = `Massima quantità X: ${Math.floor(reddito / px)} unità`;
        document.getElementById('quantitaMassimaY').textContent = `Massima quantità Y: ${Math.floor(reddito / py)} unità`;

    } catch (error) {
        console.error("Errore nella chiamata all'API:", error);
    }
});

function renderChart(xValues, yValues) {
    // Verifica se esiste già un grafico, e se sì, distruggilo
    if (window.vincoloChart instanceof Chart) {
        window.vincoloChart.destroy();
    }

    // Crea il grafico
    const ctx = document.getElementById('vincoloChart').getContext('2d');
    window.vincoloChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'Vincolo di Bilancio',
                data: yValues,
                borderColor: 'rgba(0, 123, 255, 1)', // Blu più saturo
                backgroundColor: 'rgba(0, 123, 255, 0.2)', // Sfondo blu traslucido
                borderWidth: 2, // Spessore della linea
                pointRadius: 3, // Raggio dei punti (ridotto)
                pointBackgroundColor: 'rgba(0, 123, 255, 1)', // Colore dei punti
                fill: true // Riempire l'area sotto la linea
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Quantità del Bene X',
                        color: '#b0bec5'
                    },
                    ticks: {
                        color: '#b0bec5'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)', // Colore del reticolo
                        lineWidth: 1 // Spessore delle linee della griglia
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Quantità del Bene Y',
                        color: '#b0bec5'
                    },
                    ticks: {
                        color: '#b0bec5'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)', // Colore del reticolo
                        lineWidth: 1 // Spessore delle linee della griglia
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#b0bec5'
                    }
                }
            }
        }
    });
}