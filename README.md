# ![logo](/logo/tot-64.png) Tot system
Tot is a two-level multimodal emotion detection system prepared to **manage different emotion detectors in one place, detect emotions using said recognizers and aggregate results from each emotion detection service**. ![logo16](/logo/tot-16.png) The **Tot** system acts like a **proxy** of emotion recognizers: each emotion recognition service implements an interface in Tot, and the requests that would be send to said service are sent to Tot. Tot will then communicate with the corresponding service (being it a third-party service offered over the Internet or an API to access a sensor in a device), gathering the results and aggregate them on command.

## Lanching Tot
Lanching Tot is quite simple. Once you've downloaded the repository, just run a

```
npm install
```
to install the node modules required and then a 
```
npm start
```
to start the API. As an express app, it runs on **port 3000** by default, but you can change this easily at the `www` file in `/bin/`. From this point on, you just send your requests to ![logo16](/logo/tot-16.png) **Tot** in order to analyse data, aggregate results, etc. Since Tot works as an API Rest in a certain port, it's completely **language agnostic**. The snippets below show different examples of how to communicate with Tot using different programming languages. While these snippets are written in *JavaScript*, *Python*, *Java* and *Ruby*, you can use whatever programming language you want, as long as it supports communications via HTTP requests.

```javascript
// Javascript (client)
$.ajax({
    url : 'http://localhost:3000/api/v1/',
    type : 'POST',
    success : function( data ) {              
		//...
	}
});
```

```javascript
// JavaScript (Server)
request({
	url: 'http://localhost:3000/api/v1/init',
	type: 'POST',
	body: {
		settingsFile: 'credentials.json'
	},
	json: true
}, function( error, response, body ){
	//...
});
```

```python
# Python
import requests
url = 'http://localhost:3000/api/v1/setup'
body = { 'delay': 3000 }
x = requests.post( url, data = body )
```

```java
// Java
RequestBody formBody = new FormBody.Builder()
	.add("mediaType", "image")
	.add("lookingFor", "['face']")
	.add("mediaPath", "C:\\Users\\user\\images\\image.jpg")
	.build();

Request request = new Request.Builder()
	.url("http://localhost:3000/api/v1/analyse")
	.post(formBody)
	.build();
```

```ruby
# Ruby
require 'httparty'
HTTParty.post("http://localhost:3000/api/v1/results")
```

Unless you change the directory, the root of the request will always be `/api/vX/`, being `X` the number of the version you want to use. For example, if you want to use `v1`, an `init` request would have `http://localhost:3000/api/v1/init` as `url`.

Once the server is running, the workflow would be as follows:

* **Requesting a cookie**. Call the root of the server to get an unique id. This id allows you to communicate with the rest of endpoints. Trying to communicate with these endpoints without including this unique id in the request will return an error (`Session wasn't initialized. Send request to "/" first`). This id is linked to an **user object** which will store the detectors' proxies, the data returned by these ones, etc.
* **Setting up the server**. After getting the id, call the `/init` endpoint to create the detectors' proxies. This endpoint links a [DetectorHandler](https://josemariagarcia95.github.io/tot-system/docs/v1/DetectorHandler.html) to the user object, allowing you to request emotion recognition for media files and the aggregation of the consequent results.
* **Requesting a media analyse looking for emotions**. Having your unique id, you will be able to request an emotion recognition over a media resource. **Requests to this endpoint don't return the results to these analysis**. 
* **Aggregating results**. Using the `/results` endpoint you can request the results to the server in several formats: aggregated, grouped by channel, results of a single detector, in PAD (translated) or RAW (as the detector produces them) format, etc.   
* **_(Optionally)_ Filtering detectors**. After creating the detectors, you can optionally filter out detectors in the `/setup` endpoint based on several criteria, like the service latency, the kind of media it supports, etc. 

See the next section to read more details about each endpoint.

## Communicating with the API's endpoints
The core of the API is inside the `routes/vX` folders. Each `vX` folder (`v1`, `v2`, `v3`, etc.) contains an `api.js` file and a `src` folder. The `api.js` file contains the middleware to handle each endpoint of the API. This middleware is imported in the API entry point, (`app.js` file).

* `/`
    * `GET`. Generates an user object with an unique id using [uniqid](https://www.npmjs.com/package/uniqid) and returns this id to the user in a cookie. **CALLING THIS ENDPOINT IS MANDATORY TO BE ABLE TO USE THE API**.
        * This endpoint has no parameters.
* `/init`
	* `POST`. Inits detectors for an user, using setting information either sent in the request or stored in some setting file. This endpoint initializes each emotion detector and performs a benchmarking task (see [DetectorHandler.prototype.addDetector](#detectorhandlerprototypeadddetector)) to test the state of the network and the detectors. See the [bottom](#settings.json-sample-file) of the page to see an example of how this setting information must be specified. If none of these parameters are present in the request, no detector proxy will be created. If they are both specified, only `settings` will be used.
    	* `settings {JSON}`. JSON object following the [aforementioned format](#settings.json-sample-file).
    	* `settingsPath {string}`. Path to file containing the setting information. Keep in mind that the route to the file starts at the root of the project(`tot-system/...`).
* `/analyse`
	* `POST`. Endpoint used to analyse media files. The request contains the path to the file which holds the affective information, the type of information that the file contains and the kind of information that the API must look for. 
		* `mediaType {Array}`: Kind of media which will be sent. Options can be "image", "video", "sound" and "text". However, any other type can be added to the API, since the media types that the API supports are specified on the `/init` endpoint, in the `media` attribute of each detector. 
		* `lookingFor {String}`: Feature we want to analyse. Options can be "face", "voice", "signal" and "body". Again, the capabilities of the API regarding this parameter are specified on the `/init` endpoint, in the `category` of each detector.
		* `mediaPath {String}`: Path pointing to the file that must be analysed. This path can be either local or remote. _Each detector must handle this path according to its characteristics_. For instance, if you have a detector which can only analyse online resources, and you want it to analyse some local file (some image took with the webcam, a sound file recorded with the microphone), you'll have to upload somewhere inside the `extractEmotions` callback of said detector. For instance, in `src/tools/upload-ftp.js` you can find code to upload a file to a web server via FTP.

**IMPORTANT. THIS ENDPOINT DOESN'T RETURN THE AFFECTIVE OUTPUT RESULTING FROM ANALYSING SOME FILE. IN ORDER TO RETRIEVE THAT DATA, THE `/results` ENDPOINT MUST BE USED.**

* `/results`
  * `POST`. This endpoint retrieves a single PAD result, being this the product of aggregating all the results from every detector and channel.
    * `channelsToMerge {Array|String}`. Array of channels that should be merged. E.g., `["face", "voice"]`. This parameters can also be a single string naming a channel ("face", "voice", "eda") or just "all".
    * `localStrategy {String}`. Strategy used to aggregate results locally. This strategy is used to by each detector of every channel present in `channelsToMerge` to aggregate its own results and then by every channel to aggregate those locally aggregated data.
    * `globalStrategy {String}`. Strategy used to aggregate the locally aggregated data. If any of these strategies doesn't exist, a default strategy (mean) is used.
* `/setup`
	* `POST`. This endpoint gives you another opportunity to customize the services to use. For instance, during the initialization in `/init` a benchmarking process is carried out. This process sets the value of the attributes `realTime` (boolean attribute which indicates if the service answers in real time) and `delay` (how many miliseconds does the service take to answer). This endpoint allows you to filter detectors that doesn't satisfy certain requirements, like working in real time, having a delay which is bigger than a fixed threshold, etc. `/setup` receives, in the request body, up to 3 parameters.
		* `type {Array}`:  Array of the detector categories you want to keep. Detector categories which are not in this array will be deteled. An empty array deteles every category. E.g., `["face", "voice"]`.
		* `realTime {Boolean}`: boolean attribute representing the `realTime` attribute. Only detectors with a matching value of it will be kept.
		* `delay`: response time threshold. Detectors whose delay attribute is bigger than the one in the `/setup` request will be deleted. 
<!---
* `/results/:channel`
  * `GET`. This endpoint retrieves all the results in PAD form of a single channel. This include each individual result and the fusion of all the results in that channel. Channels are defined by the different category values in the `credentials.json` file.
* `/results-raw`
  * `GET`. As `/results`, but returns the results as they are produced by each detector in their own format. Since formats may not be compatible, fusion is not carried out.
* `/results-raw/:channel`. 
  *  `GET`. As in `/results-raw`, but just for one channel.
-->
# Documentation

You can read the code documentation [here](https://josemariagarcia95.github.io/tot-system/docs/v1/), or you can access each specific method documentation through these links.

## `src/users.js`

### [userHandler](https://josemariagarcia95.github.io/tot-system/docs/v1/module-Users.html#.userHandler)



## `src/core.js`

### [createDetector](https://josemariagarcia95.github.io/tot-system/docs/v1/module-Core.html#.createDetector)

### [DetectorHandler](https://josemariagarcia95.github.io/tot-system/docs/v1/DetectorHandler.html)

#### [DetectorHandler.prototype.addDetector](https://josemariagarcia95.github.io/tot-system/docs/v1/DetectorHandler.html#.addDetector)

#### [DetectorHandler.prototype.analyseMedia](https://josemariagarcia95.github.io/tot-system/docs/v1/DetectorHandler.html#.analyseMedia)

#### [DetectorHandler.prototype.quitCategory](https://josemariagarcia95.github.io/tot-system/docs/v1/DetectorHandler.html#.quitCategory)

#### [DetectorHandler.prototype.filter](https://josemariagarcia95.github.io/tot-system/docs/v1/DetectorHandler.html#.filter)

#### [DetectorHandler.prototype.getChannelResults](https://josemariagarcia95.github.io/tot-system/docs/v1/DetectorHandler.html#.getChannelResults)

#### [DetectorHandler.prototype.getDetectors](https://josemariagarcia95.github.io/tot-system/docs/v1/DetectorHandler.html#.getDetectors)

#### [DetectorHandler.prototype.mergeResults]()

## `src/detectors/detector.js`

### [Detector](https://josemariagarcia95.github.io/tot-system/docs/v1/Detector.html)

#### [Detector.prototype.initialize](https://josemariagarcia95.github.io/tot-system/docs/v1/Detector.html#.initialize)

#### [Detector.prototype.extractEmotions](https://josemariagarcia95.github.io/tot-system/docs/v1/Detector.html#.extractEmotions)

#### [Detector.prototype.translateToPAD](https://josemariagarcia95.github.io/tot-system/docs/v1/Detector.html#.translateToPAD)

#### [Detector.prototype.addResults](https://josemariagarcia95.github.io/tot-system/docs/v1/Detector.html#.addResults)

#### [Detector.prototype.cleanResults](https://josemariagarcia95.github.io/tot-system/docs/v1/Detector.html#.cleanResults)

#### [Detector.prototype.getResults](https://josemariagarcia95.github.io/tot-system/docs/v1/Detector.html#.getResults)

## `src/detectors/channel-example`

### `src/detectors/channel-example/benchmark-files`

### `src/detectors/channel-example/example.js`

#### module.exports.initialize

#### module.exports.extractEmotions

#### module.exports.translateToPAD

# Appendix

## settings.json sample file
`settings.json.sample`
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
	},
	"detector-name-that-will-become-the-id-2": {
		...
	},
	"detector-name-that-will-become-the-id-3": {
		...
	}
}
```







