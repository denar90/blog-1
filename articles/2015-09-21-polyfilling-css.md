---
template: article.html
title: "Polyfilling CSS: A Proposal"
date: 2015-09-21T09:48:08-07:00
---

I think it's fair to say that the biggest reason we haven't seen the same boom in the adoption of new CSS features as we've seen in JavaScript is a lack of a reasonable and performant ways to polyfill CSS. JavaScript is a dynamic language, so if a feature doesn't exists in a certain browser, you can often write code that replicates it pretty well. In CSS, it's not quite that easy.

Sure, [CSS Polyfills exist](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills#css-core-modules), but they pretty much all exist in isolation. What I mean by that is there's a certain amount of work that must go into polyfillying CSS, and every existing CSS polyfill repeats this effort.

## Why polyfilling CSS is hard

When you polyfill a feature in JavaScript, the process is pretty simple. I mean, obviously the implementation of certain polyfills is complex, but the concept is easy. You check to see if a value exists, and if it doesn't, you create it.

For example, a polyfill to add promises to unsporting browsers looks basicaly like this:

```js
if (!window.Promise) {
  window.Promise = /* Promisde code here... */
}
```

Now all code that references the global `Promise` object will just work as expected.

In CSS it's not quite so simple. Browsers don't expose their internal styling mechanisms, so there's now way to simply ask the browser "Do you support"






and pretty much every polyfill that exists duplicates this work, making these polyfills slow and bloated.

Most CSS polyfills today, even the good ones, share a couple of common needs:

* First of all, they have to download the stylesheets. This means that you have to do at least one request (it's usually cached, but it still means there's a delay before you see the results)
* You have to parse the stylesheets, looking for the





