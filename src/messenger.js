import axios from 'axios';

export default class Messenger {
  constructor({ deviceUrl, username, password }) {
    this._username = username;
    this._password = password;
    this._api = axios.create({
      baseURL: deviceUrl
    });
  }

  async _getAuthCookie() {
    const body = new URLSearchParams();
    body.append('user_name', this._username);
    body.append('user_password', this._password);

    const result = await this._api.post('goform/Login', body, {
      validateStatus: (status) => status === 302, // redirects after processing request
      maxRedirects: 0
    });

    if (!result.headers['set-cookie']) {
      throw new Error('Invalid username or password.');
    }

    return result.headers['set-cookie'][0].split(';')[0];
  }

  async sendSms(phone, message) {
    const body = new URLSearchParams();
    body.append('cmd', 'SmsUtil');
    body.append('action', 'sendsms');
    body.append('item', phone);
    body.append('subitem', Buffer.from(message, 'utf-8').toString('base64'));

    await this._api.post('goform/CommConfig', body, {
      maxRedirects: 0,
      headers: {
        Cookie: await this._getAuthCookie()
      }
    });
  }
}
