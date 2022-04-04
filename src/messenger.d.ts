export default class Messenger {
  constructor({
    deviceUrl,
    username,
    password
  }: {
    deviceUrl: string;
    username: string;
    password: string;
  });
  sendSms(phone: string, message: string): Promise<void>;
}
