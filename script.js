const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/bright',
    center: [18.1649, 40.3590],
    zoom: 16,
    pitch: 50,
    bearing: -20
});

map.on('load', () => {

    map.addSource('edifici-unisalento', {
        type: 'geojson',
        data: 'edifici.geojson'
    });

    map.addLayer({
        id: 'edifici-3d',
        type: 'fill-extrusion',
        source: 'edifici-unisalento',

        paint: {
            'fill-extrusion-color': '#B8A98A',
            'fill-extrusion-height': ['get', 'altezza'],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.85
        }
    });
    // Clic sugli edifici
    map.on('click', 'edifici-3d', (e) => {

        const nomeEdificio = e.features[0].properties.nome;

        new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${nomeEdificio}</strong>`)
            .addTo(map);
    });

    // Cambia il cursore quando passi sopra un edificio
    map.on('mouseenter', 'edifici-3d', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'edifici-3d', () => {
        map.getCanvas().style.cursor = '';
    });
});
// ===============================
// RICERCA DEI PLESSI
// ===============================

const plessi = [
    {
        nome: "Plesso Studium",
        ricerca: "studium",
        coordinate: [18.1649, 40.3590]
    },
    {
        nome: "Studium 5",
        ricerca: "studium 5",
        coordinate: [18.1649, 40.3590]
    },
    {
        nome: "Studium 6",
        ricerca: "studium 6",
        coordinate: [18.1651, 40.3591]
    },
    {
        nome: "Ecotekne",
        ricerca: "ecotekne",
        coordinate: [18.1025, 40.3335]
    },
    {
        nome: "Monastero degli Olivetani",
        ricerca: "olivetani",
        coordinate: [18.1708, 40.3528]
    },
    {
        nome: "Codacci Pisanelli",
        ricerca: "codacci pisanelli",
        coordinate: [18.1685, 40.3535]
    }
];

const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

searchInput.addEventListener("input", () => {

    const testo = searchInput.value.toLowerCase().trim();

    searchResults.innerHTML = "";

    if (testo === "") {
        return;
    }

    const risultati = plessi.filter(plesso =>
        plesso.nome.toLowerCase().includes(testo) ||
        plesso.ricerca.includes(testo)
    );

    risultati.forEach(plesso => {

        const risultato = document.createElement("div");

        risultato.className = "search-result";
        risultato.textContent = plesso.nome;

        risultato.addEventListener("click", () => {

            map.flyTo({
                center: plesso.coordinate,
                zoom: 17,
                pitch: 50,
                bearing: -20,
                duration: 1500
            });

            searchInput.value = plesso.nome;
            searchResults.innerHTML = "";
        });

        searchResults.appendChild(risultato);
    });
});