# jsx-real-dom

JSX runtime. No virtual DOM.

(Not published on NPM.)

Created because I got tired of the virtual DOM and needed something really simple that created real DOM nodes and had some essential features.

Features:

-   Event binding
-   Fragment
-   Refs: use getRefs(fragment) to get an object with refs. Look in /examples for more detailed info.
-   Attribute and Property support (example: class/className and for/htmlFor works)
-   dangerouslySetInnerHTML (same syntax as react), but innerHTML also works

Do not have:

-   No state managment or automatic DOM updates
-   No types in jsx for tags or attributes
-   Style objects doesn't know anything about units, use strings with units = { width: "200px" } instead of { width: 200 }

# Examples

In the examples folder
