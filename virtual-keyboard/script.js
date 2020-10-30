window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

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
        capsLock: false,
        shift: false,
        lang: false,
        speech: false
    },

    keysList: [],

    keysListEn: [
        ['1', '!'],
        ['2', '@'],
        ['3', '#'],
        ['4', '$'],
        ['5', '%'],
        ['6', '^'],
        ['7', '&'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+'], 'backspace', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', ['\\', '|'],
        'capslock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
        'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', ['/', '?'], 'shift', 'done',
        'en', 'micro', 'space', 'left', 'right'
    ],

    keysListRu: [
        ['1', '!'],
        ['2', '@'],
        ['3', '#'],
        ['4', '$'],
        ['5', '%'],
        ['6', '^'],
        ['7', '&'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+'],
        'backspace', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', ["\\", "/"],
        'capslock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'enter',
        'shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ['.', ','], 'shift', 'done',
        'ru', 'micro', 'space', 'left', 'right'
    ],

    init() {
        this.elements.main = document.createElement('div');
        this.elements.keyboardKeysContainer = document.createElement('div');

        this.elements.main.classList.add('keyboard', 'keyboard__hidden');
        this.elements.keyboardKeysContainer.classList.add('keyboard__keys');

        this.elements.keyboardKeysContainer.appendChild(this._createKeys());

        this.elements.main.appendChild(this.elements.keyboardKeysContainer);
        document.body.appendChild(this.elements.main);

        this.elements.keyboardKeysList = this.elements.keyboardKeysContainer.querySelectorAll('.keyboard__key');

        document.querySelector('.textarea').addEventListener('focus', () => {
            this.open(document.querySelector('.textarea').value, currentValue => {
                document.querySelector('.textarea').value = currentValue;
            });
        });
    },

    _triggerHandlers(handlerName) {
        if (typeof this.eventHandlers[handlerName] == 'function') {
            this.eventHandlers[handlerName](this.properties.value);
        }

    },

    open(defaultValue = '', onInput, onClose) {
        this.properties.value = defaultValue;
        this.eventHandlers.onInput = onInput;
        this.eventHandlers.onClose = onClose;

        this.elements.main.classList.remove('keyboard__hidden');
    },

    close() {
        this.properties.value = '';

        this.elements.main.classList.add('keyboard__hidden');
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (let key of this.elements.keyboardKeysList) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _toggleShift() {
        this.properties.shift = !this.properties.shift;

        for (let i = 0; i < this.elements.keyboardKeysList.length; i++) {

            if (this.elements.keyboardKeysList[i].childElementCount === 0) {
                if (Array.isArray(this.keysList[i])) {
                    this.elements.keyboardKeysList[i].textContent = this.properties.shift ? this.keysList[i][1] : this.keysList[i][0];
                }
            }
        }

        let index = 0;
        for (let key of this.elements.keyboardKeysList) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
            index++;
        }
    },

    _toggleLang() {
        this.properties.lang = !this.properties.lang;

        for (let i = 0; i < this.elements.keyboardKeysList.length; i++) {
            if (this.elements.keyboardKeysList[i].childElementCount === 0) {
                if (!Array.isArray(this.keysList[i])) {
                    this.elements.keyboardKeysList[i].textContent = this.properties.lang ? this.keysListRu[i] : this.keysListEn[i];
                }
            }
        }
    },

    _recordingResult(e) {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        document.querySelector('textarea').value = transcript;
    },

    _startRecording() {
        recognition.start();
    },

    _toggleSpeech() {
        this.properties.speech = !this.properties.speech;

        if (this.properties.speech) {
            recognition.start();
            recognition.addEventListener('result', this._recordingResult);
            recognition.addEventListener('end', this._startRecording);
        } else {
            recognition.abort();
            recognition.removeEventListener('result', this._recordingResult);
            recognition.removeEventListener('end', this._startRecording);
        }
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();

        const setIcon = (buttonName) => {
            return `<i class="material-icons">${buttonName}</i>`;
        };

        this.properties.lang ? this.keysList = this.keysListRu : this.keysList = this.keysListEn;

        this.keysList.forEach(key => {
            const button = document.createElement('button');
            button.classList.add('keyboard__key');

            const addBreakLine = ['backspace', "\\", 'enter', 'done'].indexOf(key) !== -1;

            switch (key) {

                case 'backspace':
                    {
                        button.classList.add('keyboard__key-wide', 'keyboard__backspace');
                        button.innerHTML = setIcon('backspace');

                        button.addEventListener('click', () => {
                            document.querySelector('.textarea').focus();
                            this.properties.value = this.properties.value.substring(0, this.properties.length - 1);
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }

                case 'capslock':
                    {
                        button.classList.add('keyboard__key-wide');
                        button.innerHTML = setIcon('keyboard_capslock');

                        button.addEventListener('click', () => {
                            document.querySelector('.textarea').focus();
                            button.classList.toggle('keyboard__key-activatable');
                            this._toggleCapsLock();
                        });

                        break;
                    }

                case 'enter':
                    {
                        button.classList.add('keyboard__key-wide');
                        button.innerHTML = setIcon('keyboard_return');

                        button.addEventListener('click', () => {
                            document.querySelector('.textarea').focus();
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
                            document.querySelector('.textarea').focus();
                            this.properties.value += ' ';
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }

                case 'left':
                    {
                        button.innerHTML = setIcon('chevron_left');

                        button.addEventListener('click', () => {
                            document.querySelector('.textarea').focus();
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }

                case 'right':
                    {
                        button.innerHTML = setIcon('chevron_right');

                        button.addEventListener('click', () => {
                            document.querySelector('.textarea').focus();
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }

                case 'micro':
                    {
                        button.innerHTML = setIcon('mic');

                        button.addEventListener('click', () => {
                            this._toggleSpeech();
                            document.querySelector('.textarea').focus();
                            button.classList.toggle('keyboard__key-activatable');
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }


                case 'shift':
                    {
                        button.classList.add('keyboard__key-wide');
                        button.innerHTML = setIcon('arrow_drop_up');

                        button.addEventListener('click', () => {
                            document.querySelector('.textarea').focus();
                            button.classList.toggle('keyboard__key-activatable');
                            this._toggleShift();
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }

                case 'en':
                    {
                        button.textContent = this.properties.lang ? 'ru' : 'en';

                        button.addEventListener('click', () => {
                            document.querySelector('.textarea').focus();
                            this._toggleLang();
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }

                case 'ru':
                    {
                        button.textContent = this.properties.lang ? 'ru' : 'en';

                        button.addEventListener('click', () => {
                            document.querySelector('.textarea').focus();
                            this._toggleLang();
                            this._triggerHandlers('onInput');
                        });

                        break;
                    }

                case 'done':
                    {
                        button.classList.add('keyboard__done');
                        button.innerHTML = setIcon('check_circle');

                        button.addEventListener('click', () => {
                            this._triggerHandlers('onclose');
                            this.close();
                        });

                        break;
                    }

                default:
                    {
                        button.textContent = (this.properties.shift) ? key[1] : key[0];

                        button.addEventListener('click', () => {
                            document.querySelector('.textarea').focus();
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
    },
};

window.addEventListener('DOMContentLoaded', () => {
    keyboard.init();
});