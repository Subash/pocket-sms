import test from 'ava';
import Messenger from '../src/messenger.js';

function fromEnv(key) {
  if (typeof process.env[key] === 'string') {
    return process.env[key];
  }

  throw new Error(`process.env doesn't have the key ${key}`);
}

test('sendMessage()', async (t) => {
  const messenger = new Messenger({
    deviceUrl: fromEnv('DEVICE_URL'),
    username: fromEnv('DEVICE_USERNAME'),
    password: fromEnv('DEVICE_PASSWORD')
  });

  await messenger.sendMessage(fromEnv('TEST_PHONE_NUMBER'), 'Hello World');
  t.pass();
});
