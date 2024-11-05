const exp = require('express')
const path = require('path')
const fs = require('fs')

var app = exp()

app.use(exp.static(path.join(__dirname, "Static")));

const hostname = '127.0.0.1'
const port = '10000'

function vincoloBilancio(px, py, reddito) {
    let combinazioni = [];

    for (let x = 0; x <= Math.floor(reddito / px); x++) {
        let y = (reddito - (px * x)) / py;

        if (Number.isInteger(y)) {
            combinazioni.push({ x: x, y: y });
        }
    }

    return combinazioni;
}

app.get("/", function (req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200);

    const filepath = path.join(__dirname, "Static", "Homepage.html");
    res.write(fs.readFileSync(filepath, "utf-8"));

    res.end();
});

app.get('/api/vincolo-bilancio', (req, res) => { //http://localhost:10000/api/vincolo-bilancio?px=10&py=5&reddito=100
    const px = parseFloat(req.query.px);
    const py = parseFloat(req.query.py);
    const reddito = parseFloat(req.query.reddito);

    if (isNaN(px) || isNaN(py) || isNaN(reddito)) {
        return res.status(400).json({ error: "Parametri non validi. Assicurati di fornire px, py e reddito come numeri." });
    }

    const combinazioniPossibili = vincoloBilancio(px, py, reddito);

    res.json({ combinazioni: combinazioniPossibili });
});

var server = app.listen(port, hostname, ()=>{
    console.log(`app listening on http://${hostname}:${port}`)
})