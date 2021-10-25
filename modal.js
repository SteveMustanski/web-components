class Modal extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.isOpen = false;
    this.shadowRoot.innerHTML = `
    <style>
      #backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0,0,0,0.75);
        z-index: 10;
        opacity: 0;
        pointer-events: none;
      }

      :host([opened]) #backdrop,
      :host([opened]) #modal {
        opacity: 1;
        pointer-events: all;
      }

      :host([opened]) #modal {
        top: 15vh;
      }

      #modal {
        position: fixed;
        top: 10vh;
        left: 25%;
        width: 50%;
        z-index: 100;
        background: white;
        border-radius: 3px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease-out;
      }

      header {
        padding: 1rem;
        border-bottom: 1px solid #ccc;
      }

      ::slotted(h1) {
        font-sze: 1.25rem;
        margin: 0;
      }

      #main {
        padding: 1rem;
      }

      #actions {
        border-top: 1px solid #ccc;
        padding: 1rem;
        display: flex;
        justify-content: flex-end;
      }

      #actions button {
        margin: 0 0.25rem;
      }
    </style>
    <div id="backdrop"></div>
    <div id="modal">
      <header>
        <slot name="title">Please Confirm</slot>
      </header>
      <section id="main">
        <slot></slot>
      </section>
      <section id="actions">
        <button id="cancel-btn">Cancel</button>
        <button id="confirm-btn">OK</button>
      </section>
    </div>
    `;

    const slots = this.shadowRoot.querySelectorAll('slot');
    slots[1].addEventListener('slotchange', event => {
      console.dir(slots[1].assignedNodes());
    });

    const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
    const confirmButton = this.shadowRoot.querySelector('#confirm-btn');
    const backdrop = this.shadowRoot.querySelector('#backdrop');
    
    backdrop.addEventListener('click', this._cancel.bind(this));
    cancelButton.addEventListener('click', this._cancel.bind(this));
    confirmButton.addEventListener('click', this._confirm.bind(this));

    // cancelButton.addEventListener('cancel', () => {
    //   console.log('cancel from componet');
    // })
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'opened') {
      this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    }


  static get observedAttributes() {
    return ['opened'];
  }

  open() {
    this.setAttribute('opened', '');
  }

  hide() {
    if (this.hasAttribute('opened')) {
      this.removeAttribute('opened')
    }
    this.isOpen = false;
  }

  _cancel(event) {
    this.hide();
    const cancelEvent = new Event('cancel', {bubbles: true, composed: true}); // composed = may leave shadowdom
    event.target.dispatchEvent(cancelEvent);
  }

  // this event is on the modal because of this.dispatchEvent and not on the event as in cancel
  // any code listening to events on the component outside of it can receive the dispatch
  // the _cancel method could also be written this way
  _confirm() { 
    this.hide();
    const confirmEvent = new Event('confirm');
    this.dispatchEvent(confirmEvent);
  }
}

customElements.define('sm-modal', Modal);