module.exports.OUTPUT_REGEX = /type\s(?<type>\d+)\s\((?<ev>EV_[^)]+)\),\scode\s(?<code>\d+)\s\((?<key>[^)]+)\),\svalue\s(?<value>\d+)/

module.exports.EV_KEY = 'EV_KEY'

module.exports.STATE_PRESSED = 'pressed';
module.exports.STATE_RELEASED = 'released';