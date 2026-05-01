async function fetchPlanets(link, token) {
    const parent = document.body.querySelector('.planets');
    parent.innerHTML = "";
    const loader = createLoader();
    parent.appendChild(loader);
    try {
        const response = await fetch(link, {
            headers: new Headers({
                "Authorization": "Bearer " + token
            })
        });
        if (response.ok) {
            const data = await response.json();
            const container = document.body.querySelector('.planets');
            for (const planet of data.results) {
                const planetInfo = await getPlanetInfo(planet, token);
                container.appendChild(createPlanet(planetInfo));
            }
            container.querySelector('.loader').remove();
        } else {
            alert(`Planets response: ${response.status}`);
        }
    } catch (error) {
        alert(`Planets fetch error: ${error}`);
    }
}

async function getPlanetInfo(planet, token) {
    try {
        const planetResponse = await fetch(planet.url, {
            headers: new Headers({
                "Authorization": "Bearer " + token
            })
        });
        if (planetResponse.ok) {
            const planetData = await planetResponse.json();
            const {
                name, rotation_period, orbital_period, diameter, climate,
                gravity, terrain, surface_water, population, animated_image
            } = planetData.result.properties;

            return {
                name, rotation_period, orbital_period, diameter, climate,
                gravity, terrain, surface_water, population, animated_image
            };
        } else {
            alert(`Planet ${planet.uid} response: ${planetResponse.status}`);
        }
    } catch (error) {
        alert(`Planet ${planet.uid} fetch error: ${error}`);
    }
}

function createPlanet(planetInfo) {
    const planet = document.createElement('div');
    planet.classList.add('planet');
    planet.innerHTML = `<h1 class="name">Planet ${planetInfo.name}</h1>
        <img class="gif" src="${planetInfo.animated_image}" alt="planet image">
        <div class="info"><p>Rotation period: ${planetInfo.rotation_period}</p>
            <p>Orbital period: ${planetInfo.orbital_period}</p>
            <p>Diameter: ${planetInfo.diameter}</p>
            <p>Climate: ${planetInfo.climate}</p>
            <p>Gravity: ${planetInfo.gravity}</p>
            <p>Terrain: ${planetInfo.terrain}</p>
            <p>Surface water: ${planetInfo.surface_water}</p>
            <p>Population: ${planetInfo.population}</p>
        </div>
        <h2>Films:</h2>
        <div class="films"></div>`;
    return planet;
}

function createLoader() {
    const loader = document.createElement('img');
    loader.classList.add('loader');
    loader.src = "loading.gif";
    loader.alt = 'Loading...';
    return loader;
}

function openPrevious(link) {
    if (currentPage > 1) {
        currentPage--;
        fetchPlanets(link + currentPage, token);
    }
}

function openNext(link) {
    if (currentPage < 6) {
        currentPage++;
        fetchPlanets(link + currentPage, token);
    }
}

const prevButton = document.querySelector('.prev');
prevButton.addEventListener('click', () => openPrevious(url, currentPage));

const nextButton = document.querySelector('.next');
nextButton.addEventListener('click', () => openNext(url, currentPage));

const form = document.getElementById('loginForm');
form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const login = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login, password})
        });
        if (response.ok) {
            const data = await response.text();
            console.log('Login successful: ', data);
            localStorage.setItem('token', data);
            window.location.reload();
        } else {
            alert(`Login failed: ${response.status}`);
        }
    } catch (error) {
        console.error('An error occurred:', error);
        alert(`Error: ${error}`);
    }
});

const token = localStorage.getItem('token');
const url = '/api/planets?limit=10&page=';
let currentPage = 1;

if (token == null) {
    const form = document.getElementById("loginForm");
    const buttons = document.querySelector('.buttons');
    form.classList.toggle("hidden");
    buttons.classList.toggle("hidden");
} else {
    fetchPlanets(url + currentPage, token);
}