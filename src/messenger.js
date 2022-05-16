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

    return await this._api.post('goform/CommConfig', body, {
      maxRedirects: 0,
      headers: {
        Cookie: await this._getAuthCookie()
      }
    });
  }

  async deleteSms(id) {
    const body = new URLSearchParams();
    body.append('cmd', 'SmsUtil');
    body.append('action', 'deleteSMS');
    body.append('item', id);
    body.append('subitem', '1');

    return await this._api.post('goform/CommConfig', body, {
      maxRedirects: 0,
      headers: {
        Cookie: await this._getAuthCookie()
      }
    });
  }

  async getMessages() {
    const { data } = await this._api.get('web/sms.asp', {
      maxRedirects: 0,
      headers: {
        Cookie: await this._getAuthCookie()
      }
    });

    return this._parseMessages(data);
  }

  _parseMessages(data) {
    const messages = data
      .split(`//var sms_all = '`)?.[1]
      .split(`var sms_all = '`)?.[1]
      ?.split(`var new_sms_count = '`)?.[0]
      ?.trim()
      ?.replace(`,]';`, ']');

    if (!messages) return [];

    return JSON.parse(messages).map((message) => {
      return {
        id: Number.parseInt(message.id),
        phone: message.addr,
        body: Buffer.from(message.body, 'base64').toString('utf-8')
      };
    });
  }
}
