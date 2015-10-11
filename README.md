# Interplanetary Wiki

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

In order to use the Wiki, simply download all the files in this repository using the following command
```
$ git clone https://github.com/jamescarlyle/ipfs-wiki.git
```

Then start the IPFS daemon
```
$ ipfs daemon
```

Then load the index.html page.

There is a current dependency on the IPFS daemon which provides the ability to fetch and save Wiki content through the IPFS API. The Wiki app is preconfigured to talk to the API on localhost port 5001 (this is the default port for the IPFS API), in order to both fetch content and
save changes. Browsers require that if an IPFS gateway is used to serve the Javascript, it needs to use the same protocol as the API, i.e. http rather than https. And CORS must be configured on the IPFS daemon, so that the API allows requests from Javascript hosted on other origins, if necessary.

The Wiki works by managing a "context" or "umbrella" for all the Wiki pages that link directly to each other. Behind the scenes, this is an IPFS Object with an array of Links mapping WikiNames to hashes.  The Wiki pages themselves are IPFS Objects with Data but no Links.

Technically speaking, when rendering a page, the context is loaded first, so that the hash of the page can be looked up, and then requested. When saving a page, the page is saved first,
its hash obtained, then the parent context is updated with the new hash for the page. Then the context hash itself will change, so the URL path of the browser changes to reflect the new context.
