![npm](https://img.shields.io/npm/v/shake-detector)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/shake-detector)
![NPM](https://img.shields.io/npm/l/shake-detector)
![GitHub top language](https://img.shields.io/github/languages/top/serglider/shake-detector)

<!--- https://shields.io/ badges -->

# shake-detector

Mobile device shakes detection

-   [Setup](#setup)
-   [IOS limitation](#ios)
-   [Options](#options)
-   [API](#api)
-   [Chaining](#chaining)
-   [Shake event](#shake-event)
-   [Documentation](#docs)
-   [License](#license)

<a name="setup"/>

## Setup

#### NPM

```bash
npm i shake-detector
```

```js
import ShakeDetector from 'shake-detector';
// ...
const shakeDetector = new ShakeDetector();
```

#### CDN

```html
<script src="https://unpkg.com/shake-detector"></script>
```

```js
const shakeDetector = new window.ShakeDetector();
```

<a name="ios"/>

## IOS limitation

IOS (since 12.2) requires a user's permission to listen to the motion events, and it could be obtained only in response to user interaction. `ShakeDetector` will do nothing on IOS 12.2+ in case that such permission was not granted.

There are two options:

1. Notify `ShakeDetector` that your page has the permission

```js
shakeDetector.confirmPermissionGranted();
shakeDetector.start();
```

2. Request the permission via `ShakeDetector`

```js
const requestTrigger = document.getElementById('requestTrigger');
// requestPermission argument is optional
// default is document.documentElement
shakeDetector.requestPermission(requestTrigger).then(() => {
    shakeDetector.start();
});
```

In this case `ShakeDetector` will set a one-time click event listener and will request the permission on click.

<a name="options"/>

## Options

```js
const options = {
    threshold: 8,
    debounceDelay: 500,
};
const shakeDetector = new ShakeDetector(options);
```

|          Option |  Type  | Default |     Measure     | Description                                                                              |
| --------------: | :----: | ------: | :-------------: | :--------------------------------------------------------------------------------------- |
|     `threshold` | number |      15 | m/s<sup>2</sup> | device acceleration that will be registered as a shake                                   |
| `debounceDelay` | number |    1000 |       ms        | shake won't be registered if this amount of time has not passed after the previous shake |

<a name="api"/>

## API

|                     Method |            Arguments            |           Return            | Description                                                                                           |
| -------------------------: | :-----------------------------: | :-------------------------: | :---------------------------------------------------------------------------------------------------- |
|                `subscribe` |     listener<br>{function}      | `ShakeDetector`<br>instance | Adds a handler to the shake event handlers pool                                                       |
|              `unsubscribe` |     listener<br>{function}      | `ShakeDetector`<br>instance | Removes a handler from the shake event handlers pool                                                  |
|                    `start` |             {void}              | `ShakeDetector`<br>instance | Starts monitoring the motion event                                                                    |
|                     `stop` |             {void}              | `ShakeDetector`<br>instance | Stops monitoring the motion event                                                                     |
| `confirmPermissionGranted` |             {void}              | `ShakeDetector`<br>instance | [Notifies the detector that permission to listen to the motion events has already been granted](#ios) |
|        `requestPermission` | triggerElement<br>{HTMLElement} |      Promise<boolean>       | [Requests a user's permission to listen to the motion events](#ios)                                   |

<a name="chaining"/>

## Chaining

All `ShakeDetector` methods except `requestPermission` return its instance for chaining.

```js
const onShake = () => {
    console.log('shake!');
};
new ShakeDetector().confirmPermissionGranted().subscribe(onShake).start();
```

<a name="shake-event"/>

## Shake event

Once shake is detected, `ShakeDetector` fire an event on `window`. One can use it instead of the subscription via `subscribe` method.

```js
const onShake = () => {
    console.log('shake!');
};
const shakeDetector = new ShakeDetector();
shakeDetector.start();
window.addEventListener(ShakeDetector.SHAKE_EVENT, onShake);
```

<a name="docs"/>

## Documentation

Please find the full docs [here](https://serglider.github.io/shake-detector/)

<a name="License"></a>

<a name="license"/>

## License

Copyright © 2021, [Sergey Chernykh](https://github.com/serglider).
Released under the [MIT License](LICENSE).
