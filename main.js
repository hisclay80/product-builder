class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                /* Inherit CSS variables from the document body */
                :host {
                    --primary-color: var(--document-primary-color, #4CAF50);
                    --secondary-color: var(--document-secondary-color, #FFC107);
                    --background-color: var(--document-background-color, #e0f2f1);
                    --text-color: var(--document-text-color, #263238);
                    --white: var(--document-white, #FFFFFF);
                    --shadow-color-1: var(--document-shadow-color-1, rgba(0, 0, 0, 0.15));
                    --shadow-color-2: var(--document-shadow-color-2, rgba(0, 0, 0, 0.25));
                    --border-color: var(--document-border-color, #B2DFDB);
                    --background-color-light: var(--document-background-color-light, #f5f5f5);
                }

                .lotto-sets-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin-top: 2rem;
                }
                .lotto-set {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    padding: 10px;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    background-color: var(--background-color-light);
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }
                .number-ball {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1rem;
                    font-weight: bold;
                    color: var(--white); /* Using a fixed white for numbers for contrast */
                    animation: pop-in 0.5s ease-in-out forwards;
                    transform: scale(0);
                    box-shadow: 0 2px 4px var(--shadow-color-1);
                    transition: box-shadow 0.3s ease;
                }

                @keyframes pop-in {
                    to {
                        transform: scale(1);
                    }
                }
            </style>
            <div class="lotto-sets-container">
                <!-- Lotto number sets will be displayed here -->
            </div>
        `;
    }

    _generateSingleSet() {
        const numbers = new Set();
        while(numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    generateLottoSets(numSets) {
        const lottoSetsContainer = this.shadowRoot.querySelector('.lotto-sets-container');
        lottoSetsContainer.innerHTML = ''; // Clear previous results

        for (let i = 0; i < numSets; i++) {
            const lottoSet = this._generateSingleSet();
            const lottoSetDiv = document.createElement('div');
            lottoSetDiv.classList.add('lotto-set');

            lottoSet.forEach((number, index) => {
                const ball = document.createElement('div');
                ball.classList.add('number-ball');
                ball.textContent = number;
                ball.style.animationDelay = `${index * 0.1}s`;

                const hue = (360 / 45) * number;
                ball.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;

                lottoSetDiv.appendChild(ball);
            });
            lottoSetsContainer.appendChild(lottoSetDiv);
        }
    }
}

customElements.define('lotto-generator', LottoGenerator);

// Theme Toggling Logic
const themeToggleButton = document.getElementById('checkbox');
const body = document.body;

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggleButton) themeToggleButton.checked = true;
    } else {
        body.classList.remove('dark-mode');
        if (themeToggleButton) themeToggleButton.checked = false;
    }
    // Update CSS variables for custom element
    const rootStyles = getComputedStyle(document.documentElement);
    document.documentElement.style.setProperty('--document-primary-color', rootStyles.getPropertyValue('--primary-color'));
    document.documentElement.style.setProperty('--document-secondary-color', rootStyles.getPropertyValue('--secondary-color'));
    document.documentElement.style.setProperty('--document-background-color', rootStyles.getPropertyValue('--background-color'));
    document.documentElement.style.setProperty('--document-text-color', rootStyles.getPropertyValue('--text-color'));
    document.documentElement.style.setProperty('--document-white', rootStyles.getPropertyValue('--white'));
    document.documentElement.style.setProperty('--document-shadow-color-1', rootStyles.getPropertyValue('--shadow-color-1'));
    document.documentElement.style.setProperty('--document-shadow-color-2', rootStyles.getPropertyValue('--shadow-color-2'));
    document.documentElement.style.setProperty('--document-border-color', rootStyles.getPropertyValue('--border-color'));
    document.documentElement.style.setProperty('--document-background-color-light', rootStyles.getPropertyValue('--background-color-light'));

}

function toggleTheme() {
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

// External logic to connect HTML elements with the custom element
document.addEventListener('DOMContentLoaded', () => {
    // Lotto Generator Logic
    const numSetsInput = document.getElementById('numSets');
    const generateBtn = document.getElementById('generateBtn');
    const lottoGeneratorElement = document.getElementById('lottoGenerator');

    generateBtn.addEventListener('click', () => {
        const numSets = parseInt(numSetsInput.value, 10);
        if (lottoGeneratorElement && !isNaN(numSets) && numSets >= 1 && numSets <= 5) {
            lottoGeneratorElement.generateLottoSets(numSets);
        } else {
            console.error('Invalid number of sets or lotto generator element not found.');
        }
    });

    // Generate 1 set on initial load
    if (lottoGeneratorElement) {
        lottoGeneratorElement.generateLottoSets(1);
    }

    // Theme Toggling Event Listener
    if (themeToggleButton) {
        themeToggleButton.addEventListener('change', toggleTheme);
    }

    // Load theme on page load
    loadTheme();
});
