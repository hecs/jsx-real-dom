# jsx-real-dom

JSX runtime. No virtual DOM.

(Not published on NPM.)

Created because I got tired of the virtual DOM and needed something really simple that created real DOM nodes and had some essential features. Now we're just continuing to work on this for fun.

Features:

-   Less than 0.5kb (minified and compressed)
-   Event binding
-   Fragment
-   Refs: use getRefs(fragment) to get an object with refs. 
-   Attribute and Property support (example: class/className and for/htmlFor works)
-   SVG support for most cases. Always sets namespace 'http://www.w3.org/2000/svg'. JSX containing SVG needs to be in a separate files and that file needs to import a separate h-function. Look in /examples to find out how it can be used.

Do not have:

-   No state management or automatic DOM updates
-   No types in jsx for tags or attributes
-   Style objects doesn't know anything about units, use strings with units = { width: "200px" } instead of { width: 200 }

# Examples

In the examples folder
