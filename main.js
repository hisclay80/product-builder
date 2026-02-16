class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .generator-button {
                    background-color: var(--primary-color);
                    color: var(--white);
                    border: none;
                    padding: 1rem 2rem;
                    font-size: 1.2rem;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px var(--shadow-color-1);
                }

                .generator-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 8px var(--shadow-color-2);
                }

                .numbers-display {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 2rem;
                }

                .number-ball {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: var(--white);
                    animation: pop-in 0.5s ease-in-out forwards;
                    transform: scale(0);
                }

                @keyframes pop-in {
                    to {
                        transform: scale(1);
                    }
                }
            </style>
            <button class="generator-button">Generate Numbers</button>
            <div class="numbers-display"></div>
        `;

        this.shadowRoot.querySelector('.generator-button').addEventListener('click', () => this.generateNumbers());
    }

    generateNumbers() {
        const numbersDisplay = this.shadowRoot.querySelector('.numbers-display');
        numbersDisplay.innerHTML = '';
        const numbers = new Set();
        while(numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        Array.from(numbers).sort((a, b) => a - b).forEach((number, index) => {
            const ball = document.createElement('div');
            ball.classList.add('number-ball');
            ball.textContent = number;
            ball.style.animationDelay = `${index * 0.1}s`;

            const hue = (360 / 45) * number;
            ball.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;

            numbersDisplay.appendChild(ball);
        });
    }
}

customElements.define('lotto-generator', LottoGenerator);
