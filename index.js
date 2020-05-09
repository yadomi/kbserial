const yaml = require('js-yaml')
const fs = require('fs');
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const { exec } = require('child_process')

let config;
try {
    config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
} catch (e) {
    console.log(e);
}

const re = /type\s(?<type>\d+)\s\((?<ev>EV_[^)]+)\),\scode\s(?<code>\d+)\s\((?<key>[^)]+)\),\svalue\s(?<value>\d+)/
const port = new SerialPort(config.device, { baudRate: 115200 })
const parser = new Readline()

const run = (command) => {
    exec(command)
}

const execute = (rule, value, last) => {
    switch (rule.on) {
        case 'pressed':
            if (value === 1 && last === 0) {
                run(rule.run);
            }
            return;
        case 'released':
            if (value === 0 && last >= 1) {
                run(rule.run);
            }
            return;
    }
}

const interpreter = mappings => {
    const state = {}
    
    return event => {
        if (event.groups.ev !== 'EV_KEY') return;

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

const interpret = interpreter(config.mapping);

port.pipe(parser)

port.on('error', function(err) {
    console.log('Error: ', err.message)
})

parser.on('data', line => {
    const match = line.match(re);
    if (match) interpret(match)
})

