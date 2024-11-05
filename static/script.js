
document.getElementById('vincoloForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const px = parseFloat(document.getElementById('px').value);
    const py = parseFloat(document.getElementById('py').value);
    const reddito = parseFloat(document.getElementById('reddito').value);

    let optimalQuantitaX = 0;
    let optimalQuantitaY = 0;
    let minDifferenza = Infinity;

    for (let x = 1; x <= Math.floor(reddito / px); x++) {
        const budgetRimanente = reddito - (px * x);
        
        const y = Math.floor(budgetRimanente / py);

        if (y > 0) {
            const differenza = Math.abs(x - y);
            
            if (differenza < minDifferenza) {
                minDifferenza = differenza;
                optimalQuantitaX = x;
                optimalQuantitaY = y;
            }
        }
    }

    const costoMaxX = optimalQuantitaX * px;
    const costoMaxY = optimalQuantitaY * py;
    const budgetRimanente = reddito - (costoMaxX + costoMaxY);

    document.getElementById('costoMaxX').textContent = `Costo massimo per il bene X (${optimalQuantitaX} unità): €${costoMaxX.toFixed(2)}`;
    document.getElementById('costoMaxY').textContent = `Costo massimo per il bene Y (${optimalQuantitaY} unità): €${costoMaxY.toFixed(2)}`;
    document.getElementById('budgetRimanente').textContent = `Budget rimanente: €${budgetRimanente.toFixed(2)}`;

    try {
        const response = await fetch(`http://127.0.0.1:10000/api/vincolo-bilancio?px=${px}&py=${py}&reddito=${reddito}`);
        const data = await response.json();

        const xValues = data.combinazioni.map(point => point.x);
        const yValues = data.combinazioni.map(point => point.y);

        renderChart(xValues, yValues);

        document.querySelector('.result-container').style.display = 'block';
        document.getElementById('quantitaMassimaX').textContent = `Massima quantità X: ${Math.floor(reddito / px)} unità`;
        document.getElementById('quantitaMassimaY').textContent = `Massima quantità Y: ${Math.floor(reddito / py)} unità`;

    } catch (error) {
        console.error("Errore nella chiamata all'API:", error);
    }
});

function renderChart(xValues, yValues) {
    if (window.vincoloChart instanceof Chart) {
        window.vincoloChart.destroy();
    }

    const ctx = document.getElementById('vincoloChart').getContext('2d');
    window.vincoloChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'Vincolo di Bilancio',
                data: yValues,
                borderColor: 'rgba(0, 123, 255, 1)',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                fill: true
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
                        color: 'rgba(255, 255, 255, 0.2)',
                        lineWidth: 1
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
                        color: 'rgba(255, 255, 255, 0.2)',
                        lineWidth: 1
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