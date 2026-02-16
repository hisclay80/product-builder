class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
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
                    color: var(--white);
                    animation: pop-in 0.5s ease-in-out forwards;
                    transform: scale(0);
                    box-shadow: 0 2px 4px var(--shadow-color-1);
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

// External logic to connect HTML elements with the custom element
document.addEventListener('DOMContentLoaded', () => {
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
});
