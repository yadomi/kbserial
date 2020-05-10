const yaml = require('js-yaml')
const fs = require('fs');
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const interpreter = require('./interpreter');
const { OUTPUT_REGEX } = require('./constante')


let config;
try {
    config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
} catch (e) {
    console.log(e);
}

const port = new SerialPort(config.device, { baudRate: 115200 })
const parser = new Readline()

const interpret = interpreter(config.mapping);

port.pipe(parser)

port.on('error', function(err) {
    console.log('Error: ', err.message)
})

parser.on('data', line => {
    const match = line.match(OUTPUT_REGEX);
    if (match) interpret(match)
})

