const { exec } = require('child_process')
const { EV_KEY, STATE_PRESSED, STATE_RELEASED }= require('./constante');

const run = (command) => {
    exec(command)
}

const execute = (rule, value, last) => {
    switch (rule.on) {
        case STATE_PRESSED:
            if (value === 1 && last === 0) {
                run(rule.run);
            }
            return;
        case STATE_RELEASED:
            if (value === 0 && last >= 1) {
                run(rule.run);
            }
            return;
    }
}

const interpreter = mappings => {
    const state = {}
    
    return event => {
    console.log(mappings)

        if (event.groups.ev !== EV_KEY) return;

        const key = event.groups.key;

        const value = Number(event.groups.value);
        const last = state[key] || 0;
        state[key] = value;

        if (key in mappings) {
            const mapping = mappings[key];
            const rule = typeof mapping === 'string' ? { on: 'released', run: mapping } : mapping
            execute(rule, value, last)
        }

    }
} 


module.exports = interpreter;