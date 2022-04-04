### Send SMS with LTE Pocket Wifi Device

[Device on Daraz Nepal](https://www.daraz.com.np/products/4g-wifi-router-wireless-portable-pocket-wifi-mobile-hotspot-car-wi-fi-router-3g-4g-lte-with-sim-card-slot-with-145-inch-lcd-display-i107503833-s1028863069.html)

#### Usage

```js
import Messenger from '@sbspk/pocket-sms';

const messenger = new Messenger({
  deviceUrl: 'http://192.168.x.x',
  username: 'admin',
  password: 'hunter2'
});

await messenger.sendSms('98xxxxxxxx', 'Hello World');
```
