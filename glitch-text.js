class GlitchText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'text', 'font-size', 'font-family', 'text-color', 'glitch-color1', 
      'glitch-color2', 'background-color', 'text-alignment', 'animation-speed', 
      'heading-tag'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.handleResize = () => this.render();
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
  }

  splitText() {
    const text = this.getAttribute('text') || 'Glitchy Text Effect';
    const container = this.shadowRoot.querySelector('.animated-title');
    container.innerHTML = ''; // Clear previous content

    const splitedText = text.split(' ');
    splitedText.forEach((word, i) => {
      const span = document.createElement('span');
      span.classList.add('animated-word');
      span.setAttribute('data-text', word);
      span.style.opacity = 1;
      span.classList.add('animate');
      container.appendChild(span);

      word.split('').forEach((letter) => {
        const letterSpan = document.createElement('span');
        letterSpan.classList.add('animated-element');
        letterSpan.setAttribute('aria-hidden', 'true');
        letterSpan.innerHTML = letter === ' ' ? '&nbsp;' : letter;
        span.appendChild(letterSpan);
      });
    });
  }

  render() {
    const text = this.getAttribute('text') || 'Glitchy Text Effect';
    const fontSize = parseFloat(this.getAttribute('font-size')) || 4; // In vw
    const fontFamily = this.getAttribute('font-family') || 'Orbitron';
    const textColor = this.getAttribute('text-color') || '#d500f9'; // Neon purple
    const glitchColor1 = this.getAttribute('glitch-color1') || '#00e5ff'; // Neon cyan
    const glitchColor2 = this.getAttribute('glitch-color2') || '#aa00ff'; // Darker purple
    const backgroundColor = this.getAttribute('background-color') || '#212121'; // Dark gray
    const textAlignment = this.getAttribute('text-alignment') || 'center';
    const animationSpeed = parseFloat(this.getAttribute('animation-speed')) || 10; // Higher = slower
    const headingTag = this.getAttribute('heading-tag') || 'h1';

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

        :host {
          width: 100vw;
          height: 100vh;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${backgroundColor};
          overflow: hidden;
        }

        .animated-title {
          color: ${textColor};
          font-size: ${fontSize}vw;
          margin: 0;
          width: 80vw; /* Constrain for wrapping */
          text-align: ${textAlignment};
          font-family: ${fontFamily}, monospace;
          animation: textGlitch 3s ease-in-out infinite alternate;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
          line-height: 1.2;
        }

        .animated-title span {
          display: inline-block;
          min-width: 1rem;
        }

        .animated-word {
          opacity: 0;
        }

        .animate {
          opacity: 1;
        }

        .animate .animated-element {
          opacity: 0;
          transform: translateY(2px);
          animation: displayLetter 0.5s ease-in-out 0.5s forwards alternate;
          letter-spacing: 1px;
        }

        ${Array.from({ length: 100 }, (_, i) => `
          .animate:nth-child(3n+${i + 1}) .animated-element {
            animation-delay: ${Math.random() * animationSpeed / 10}s;
          }
        `).join('')}

        @keyframes displayLetter {
          0% {
            transform: translateY(2px);
            color: ${textColor};
            opacity: 0;
          }
          10% {
            opacity: 1;
            color: ${glitchColor1};
          }
          20% {
            opacity: 0;
            color: ${textColor};
            transform: translateY(0px);
          }
          50% {
            opacity: 1;
            color: ${glitchColor2};
            transform: translateY(1px);
          }
          60% {
            opacity: 1;
            color: ${textColor};
            transform: translateY(1px);
          }
          100% {
            transform: translateY(0);
            color: ${textColor};
            opacity: 1;
          }
        }

        @keyframes textGlitch {
          0% { opacity: 1; }
          94% { opacity: 1; transform: translateX(0px); }
          95% { opacity: 0.1; }
          96% { opacity: 1; transform: translateX(1px); }
          97% { opacity: 0.1; }
          100% { opacity: 1; transform: translateX(0px); }
        }
      </style>
      <${headingTag} class="animated-title" aria-label="${text}"></${headingTag}>
    `;

    this.splitText(); // Split and animate the text after rendering
  }
}

customElements.define('glitch-text', GlitchText);
