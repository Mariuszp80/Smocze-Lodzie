document.addEventListener("DOMContentLoaded", function() {
    const zawodyDiv = document.getElementById("zawody");
    const zawodyForm = document.getElementById("zawodyForm");

    function parseTimeToSeconds(timeString) {
        const parts = timeString.split(":").map(Number);
        return parts[0] * 60 + parts[1] + (parts[2] ? parts[2] / 100 : 0);
    }

    function loadResults() {
        const saved = localStorage.getItem("zawody");
        return saved ? JSON.parse(saved) : [];
    }

    function saveResults(zawody) {
        localStorage.setItem("zawody", JSON.stringify(zawody));
    }

    function displayResults() {
        if (!zawodyDiv) return;

        const zawody = loadResults();
        zawodyDiv.innerHTML = "";

        zawody.forEach(zawodyItem => {
            const zawodyElement = document.createElement("div");

            const sortedResults = [...zawodyItem.wyniki].sort((a, b) => {
                return parseTimeToSeconds(a.czas) - parseTimeToSeconds(b.czas);
            });

            sortedResults.forEach((wynik, index) => {
                wynik.miejsce = index + 1;
            });

            zawodyElement.innerHTML = \`
                <h2>\${zawodyItem.nazwa}</h2>
                <h3>Kategoria: \${zawodyItem.kategoria}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nr toru</th>
                            <th>Nazwa drużyny</th>
                            <th>Czas</th>
                            <th>Miejsce</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${sortedResults.map(wynik => \`
                            <tr>
                                <td>\${wynik.nrToru}</td>
                                <td>\${wynik.druzyna}</td>
                                <td>\${wynik.czas}</td>
                                <td>\${wynik.miejsce}</td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;
            zawodyDiv.appendChild(zawodyElement);
        });
    }

    if (zawodyForm) {
        zawodyForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const nazwa = document.getElementById("nazwaZawodow").value;
            const kategoria = document.getElementById("kategoria").value;
            const wynikiText = document.getElementById("wyniki").value;

            const wyniki = wynikiText.split("\n").map(line => {
                const parts = line.split(";");
                return {
                    nrToru: parts[0],
                    druzyna: parts[1],
                    czas: parts[2]
                };
            });

            const nowyZawod = {
                nazwa,
                kategoria,
                wyniki
            };

            const zawody = loadResults();
            zawody.push(nowyZawod);
            saveResults(zawody);

            alert("Dodano nowe zawody!");
            zawodyForm.reset();
        });
    }

    displayResults();
});