# Tot system
Two-level multimodal system to detect emotions.

You can read the code documentation [here](https://josegarciaclm95.github.io/tot-system/docs/v1/)


## About the API
The core of the API is inside the `routes/vX` folders. Each `vX` folder (`v1`, `v2`, `v3`, etc.) contains an `api.js` file and a `src` folder. The `api.js` file contains the handlers of each endpoint:

* `/init`
	* `GET`. Reads configuration from `credentials.json `, initialize each emotion detector and performs a benchmarking task to test the state of the network and the detectors. See [DetectorHandler.prototype.addDetector](#DetectorHandler.prototype.addDetector)
* `/setup`
	* `POST`. This endpoint gives you another opportunity to customize the services to use. For instance, during the initialization in `/init` a benchmarking process is carried out. This process sets the value of the attributes `realTime` (boolean attribute which indicates if the service answers in real time) and `delay` (how many miliseconds does the service take to answer). `/setup` receives, in the request body, up to 3 parameters.
		* `type`: detector types array you want to keep. Detector categories contained in this array will be deleted.
		* `realTime`: boolean attribute representing the `realTime` attribute. Only detectors with a matching value of it will be kept.
		* `delay`: response time threshold. Detectors whose delay attribute is bigger than the one in the `/setup` request will be deleted. 
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

# Appendix

## credentials.json sample file
`credentials.json.sample`
```json
	{
		"detector-name-that-will-become-the-id": {
			"category": "face/voice/body/eda/...",
			"media": [ "types", "of", "media", "the service", "accepts", "for", "analysis", "such us", "image", "video", "text", "sound", "..." ],
			"realTime": boolean,
			"url": "https://endpoint-of-the-service-if-any",
			"otherOptions": {
				"key": "you may add all the data/optios you need in the otherOptions object"
			},
			"callbacks": "./route/to/the/file/where/the/callbacks/are/defined.js"
		}
	}
```







