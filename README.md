# Interplanetary Wiki

**Note that this implementation has been superceded with a version called [WIKID](https://github.com/jamescarlyle/wikid), which does not require a separate IPFS daemon.**

This is a minimum viable web application to explore the read/write web on [IPFS](https://ipfs.io). There are many directions to take this but please fork or raise an issue if you'd like to see a particular change.

The product is a Wiki that has no central server. All of the Wiki content is held on IPFS itself, and the Wiki html + Javascript files can also be held and served from IPFS via an IPFS gateway, or served to the browser from a local filesystem or local webserver.

The Wiki supports a subset of markdown syntax: specifically the following

```
# Heading 1-6
* Unordered lists
1. Ordered lists
WikiNames (automatically create links to other Wiki pages)
[markdown links](http://somewhere.else.com)
Paragraphs (separated by 2 new lines)
New lines (separated by 1 new line)
```
More complete markdown syntax support will be added in future.

## Getting started

In order to use the Wiki, simply download all the files in this repository using the following command
```
$ git clone https://github.com/jamescarlyle/ipfs-wiki.git
```

Then start the IPFS daemon
```
$ ipfs daemon
```

Then start a local webserver. For example, a simple webserver on OS X can be started with
```
$ sudo python -m SimpleHTTPServer 80
```

Then load the index.html page. At this stage, it should be possible to create a new Wiki and add pages. If not, please raise an issue.
```
http://localhost/index.html
```

## Technical Details

The page can also be loaded via IPFS itself (note that the hash will change):
```
https://ipfs.io/ipfs/QmYUxBeZfL1BQc8zdqudfAEt61ntouccNKmaNhz95Drfw7/#!/home#start
```

But then if the local daemon is specified, the following error will be seen
```
Mixed Content: The page at 'https://ipfs.io/ipfs/QmYUxBeZfL1BQc8zdqudfAEt61ntouccNKmaNhz95Drfw7/#!/home#start' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://localhost:5001/api/v0/object/put/'. This request has been blocked; the content must be served over HTTPS.
```
There is a current dependency on the IPFS daemon which provides the ability to fetch and save Wiki content through the IPFS API. The Wiki app is preconfigured to talk to the API on localhost port 5001 (this is the default port for the IPFS API), in order to both fetch content and save changes. Browsers require that if an IPFS gateway is used to serve the Javascript, it needs to use the same protocol as the API, i.e. http rather than https.

If you want to run the daemon and allow it to be writable by users of the Wiki who are not using the same host and port to serve the html and Javascript, then CORS must be configured on the IPFS daemon, so that the API will allow requests from Javascript hosted on other origins. See [Wikipedia on CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for more. So if you serve the HTML and Javascript using the local IPFS daemon, thus:
```
http://localhost:8080/ipfs/QmYUxBeZfL1BQc8zdqudfAEt61ntouccNKmaNhz95Drfw7/
```

then you will see the following error
```
XMLHttpRequest cannot load http://localhost:5001/api/v0/object/put/. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8080' is therefore not allowed access. The response had HTTP status code 403.
```

This can be corrected with the following configuration:
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
```

The Wiki works by managing a "context" or "umbrella" for all the Wiki pages that link directly to each other. Behind the scenes, this is an IPFS Object with an array of Links mapping WikiNames to hashes.  The Wiki pages themselves are IPFS Objects with Data but no Links.

Technically speaking, when rendering a page, the context is loaded first, so that the hash of the page can be looked up, and then requested. When saving a page, the page is saved first,
its hash obtained, then the parent context is updated with the new hash for the page. Then the context hash itself will change, so the URL path of the browser changes to reflect the new context.

A Wiki (page collection or context) is an Object in IPFS terms:
```
For a context, the Object stores the following
{
  "Data": ...name of context,
  "Links": [
    {"Name": ...page name, "Hash": ...hash of page}
  ]
}
```
For an individual page, the Object stores the following
```
{
  "Data": ...content of page in markdown,
  "Links": [
    {"Name": ...datestamp of previous version, "Hash": ...hash of previous context}
  ]
}
```
