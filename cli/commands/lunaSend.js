import * as log from '../log.js';
import chalk from 'chalk';
import WebosTvHelper from '../../lib/tools/WebosTvHelper.js';

export const command = 'luna-send <ip> <mac> <message> [payload]';
export const description = 'Send a message to the Luna bus of the TV';
export const builder = {
  timeout: {
    required: false,
    alias: 't',
    type: 'number',
    description: 'The call timeout in ms. Default: 5000ms'
  },
  debug: {
    required: false,
    alias: 'd',
    type: 'boolean',
    description: 'Enable debug output'
  }
};

export const handler = async (argv) => {
  const {
    ip,
    mac,
    message,
    payload,
    timeout,
    debug
  } = argv;

  try {
    const parsedPayload = payload ? JSON.parse(payload) : {};
    log.info(`Connecting to tv at ${chalk.yellow(ip)}`);
    let lgTvCtrl = await WebosTvHelper.connect(ip, mac, debug, timeout);
    log.info(`Connected! Sending luna message: ${chalk.blueBright.bold(message)} - ${chalk.cyan.bold(JSON.stringify(parsedPayload))}`);
    await lgTvCtrl.lunaSend(message, parsedPayload);
    log.success(`Luna message sent!`);
  } catch (err) {
    log.error(err.message);
  }

  process.exit(0);
};
