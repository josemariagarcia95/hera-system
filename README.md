# Tot system
Two-level multimodal system to detect emotions.

## About the API
The core of the API is inside the `routes/vX` folders. Each `vX` folder (`v1`, `v2`, `v3`, etc.) contains an `api.js` file and a `src` folder. The `api.js` file contains the handlers of each endpoint:

* `/init`
	* `GET`. Reads configuration from `credentials.json `, initialize each emotion detector and performs a benchmarking task to test the state of the network and the detectors. See [DetectorHandler.prototype.addDetector](#DetectorHandler.prototype.addDetector)
* `/setup`
* `/analyse`
* `/results`
* `/results/:channel`
* `/results-raw`
* `/results-raw/:channel`

## Lanching the API

# Documentation

## `src/core.js`

### createDetector

### DetectorHandler

#### DetectorHandler.prototype.addDetector

#### DetectorHandler.prototype.analyseMedia

#### DetectorHandler.prototype.quitCategory

#### DetectorHandler.prototype.filter

#### DetectorHandler.prototype.getChannelResults

#### DetectorHandler.prototype.getDetectors

#### DetectorHandler.prototype.mergeResults

## `src/detectors/detector.js`

### Detector

#### Detector.prototype.initialize

#### Detector.prototype.extractEmotions

#### Detector.prototype.translateToPAD

#### Detector.prototype.addResults

#### Detector.prototype.cleanResults

#### Detector.prototype.getResults

## `src/detectors/channel-example`

### `src/detectors/channel-example/benchmark-files`

### `src/detectors/channel-example/example.js`

#### module.exports.initialize

#### module.exports.extractEmotions

#### module.exports.translateToPAD






