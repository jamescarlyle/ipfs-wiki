# ipfs-wiki

This is a minimal effort to promote the read/write web on IPFS, but I have plenty of plans for how to extend it.

The html + js files need to be served to the browser, either from a local filesystem, webserver or via an IPFS gateway. 

There is a current dependency
on a local daemon listening on port 5001 (this is the default port for the IPFS daemon), in order to both fetch content and
save changes. This means that the IPFS gateway used to serve the js also needs to use the same protocol, i.e. http 
rather than https.

The wiki works by managing a context (behind the scenes, an IPFS Object with an array of Links mapping WikiNames to hashes),
and the wiki pages themselves (behind the scences, an IPFS Object with Data but no Links). 

When rendering a page, the context
is loaded first, so that the hash of the page can be looked up, and then requested. When saving a page, the page is saved first,
its hash obtained, then the parent context is updated with the new hash for the page. Then the context hash itself will change,
so the URL path of the browser changes to reflect the new context.
