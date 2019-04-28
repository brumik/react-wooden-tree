# React Wooden Tree 

[![Build Status](https://travis-ci.com/brumik/react-wooden-tree.svg?branch=master)](https://travis-ci.com/brumik/react-wooden-tree)

The tree can be used with redux and of course without it. With the correct
usage of redux the tree renders the changes faster.

For detailed information visit the docs page: (and turn off inherited methods)
[https://brumik.github.io/react-wooden-tree/](https://brumik.github.io/react-wooden-tree/).

## Dependencies
* [React](https://reactjs.org/)
* [React Dom](https://www.npmjs.com/package/react-dom)
* [Redux](https://redux.js.org/) and [React-Redux](https://react-redux.js.org/) - only if you want to use with redux
* [Font Awesome](https://fontawesome.com/) - only if using default icons

## Install
The component can be installed with `npm`:
```bash
npm install --save react-wooden-tree
```
or you can download manually from [GitHub](https://github.com/brumik/react-wooden-tree).

## Basic usage
See the `demo-app` folder for the examples
* `App.tsx` - This is the redux example
* `App-NonRedux.tsx`

To make it work first in the main directory run `npm install` and `
npm run build` to generate the package as the demo application uses 
local build. Then run `npm install` from `/demo-app` and `npm run start`
to start the application.

All the helper methods and definitions
are documented on the [docs page](https://brumik.github.io/react-wooden-tree/).
