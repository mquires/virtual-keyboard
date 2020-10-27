const keyboard = {
    elements: {
        main: null,
        keyboardKeysContainer: null,
        keyboardKeysList: []
    },

    eventHandlers: {
        onInput: null,
        onClose: null
    },

    properties: {
        value: '',
        capsLock: false
    },

    init() {
        this.elements.main = document.createElement('div');
        this.elements.keyboardKeysContainer = document.createElement('div');

        this.elements.main.classList.add('keyboard');
        this.elements.keyboardKeysContainer.classList.add('keyboard__keys');

        this.elements.keyboardKeysContainer.appendChild(this._createKeys());

        this.elements.main.appendChild(this.elements.keyboardKeysContainer);
        document.body.appendChild(this.elements.main);
    },

    _triggerHandlers() {

    },

    _toggleCapsLock() {

    },

    _createKeys() {
        const fragment = document.createDocumentFragment();

        const keysList = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
            'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
            'capslock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
            'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
            'space'
        ];

        const setIcon = (buttonName) => {
            return `<i class="material-icons">${buttonName}</i>`;
        };

        keysList.forEach(key => {
            const button = document.createElement('button');
            button.classList.add('keyboard__key');

            const addBreakLine = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;

            switch (key) {
                case 'backspace':
                    {
                        button.classList.add('keyboard__key-wide');
                        button.innerHTML = setIcon('backspace');

                        button.addEventListener('click', () => {
                            this.properties.value = button.substring(0, this.properties.length - 1);
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }

                case 'capslock':
                    {
                        button.classList.add('keyboard__key-wide');
                        button.innerHTML = setIcon('keyboard_capslock');

                        button.addEventListener('click', () => {
                            this._toggleCapsLock();
                            button.classList.toggle(this.properties.capsLock);
                        });

                        break;
                    }

                case 'enter':
                    {
                        button.classList.add('keyboard__key-wide');
                        button.innerHTML = setIcon('keyboard_return');

                        button.addEventListener('click', () => {
                            this.properties.value += '\n';
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }

                case 'space':
                    {
                        button.classList.add('keyboard__key-extra-wide');
                        button.innerHTML = setIcon('space_bar');

                        button.addEventListener('click', () => {
                            this.properties.value += ' ';
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }

                case 'done':
                    {
                        button.innerHTML = setIcon('check_circle');

                        button.addEventListener('click', () => {
                            this._triggerHandlers('onclose');
                            this.close();
                        });

                        break;
                    }

                default:
                    {
                        button.textContent = key;

                        button.addEventListener('click', () => {
                            this.properties.value += button.textContent;
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }
            }

            fragment.appendChild(button);

            if (addBreakLine) {
                fragment.appendChild(document.createElement('br'));
            }


        });

        return fragment;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    keyboard.init();
});