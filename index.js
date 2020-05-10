
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const config = require('./config');
const interpreter = require('./interpreter');
const { OUTPUT_REGEX } = require('./constante')

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

