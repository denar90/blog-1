I was recently writing some code made a few requests to `IndexedDB` and then needed to send some data to an endpoint based on the results of the `IndexedDB` data.

Normally this is pretty simple stuff, but in this case I needed the code to work in two situations where the browser normally stops executing code:

- A user clicks a link or submits a form to a new page.
- A user closes the current tag.

In both of these cases I needed to run some asynchronous operations prior to sending an HTTP request, but I was pretty sure they wouldn't finish in time. After running a few tests, I easily confirmed that they didn't finish.

So what could I do?

In the case of a user clicking a link, you can call `preventDefault()` on the event and then manually retrigger it later. This isn't great for user experience, but at least it's possible. But in the case of a user closing a tab, there's pretty much no way you can stop that from happening (and showing one of those annoying "Are you sure you want to leave?" message wasn't an option).

A few years ago the W3C introduced the `navigator.sendBeacon()` method specifically to handle making request as the page is about to be unloaded; however, if those requests need to contain data stored in IndexedDB (which is only accessible asynchronously), `sendBeacon` won't help you.

## Web Workers?

My first thought was that I could make this


there were several situations where I knew the code would be running as the current browsing context was being unloaded.



Recently I encountered a problem I'd in Web developement I'd never faced before, and I couldn't find a solution to it.

I was surprised because it seemed like it must be a fairly common problem, I figured there *must* be a native platform solution.


This is what I wanted to do but couldn't:

```js
window.addEventListener('unload', function() {
  idb.get('app-namespace').then((data) => {
    const newData = updateData(data);
    return idb.set('app-namespace', newData).then(() => {
      return fetch('/path/to/analytics/endpoint/', {
        body: JSON.stringify(data)
      })
    });
  })
});
```






