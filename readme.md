# React Wooden Tree 

[![Build Status](https://travis-ci.com/brumik/react-wooden-tree.svg?branch=master)](https://travis-ci.com/brumik/react-wooden-tree)

The tree is bit more complex in the new version. You can use it with
redux and of course without it. 

For detailed information visit the docs page: (and turn off inherited methods)
[https://brumik.github.io/react-wooden-tree/](https://brumik.github.io/react-wooden-tree/).

## Dependencies
To use the Wooden Tree you need two dependencies:
* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/) and [React-Redux](https://react-redux.js.org/) - only if you want to use with redux
* [Font Awesome](https://fontawesome.com/) - only if using default icons

## Install
The component can be installed with `npm`:
```bash
npm install --save react-wooden-tree
```

or you can download manually from this repository.

## Basic usage
In the `demo-app` folder there are two examples:
* `App.tsx` - This is the redux example
* `App-NonRedux.tsx`

To make it work first in the main directory run `npm run build` to generate 
the package as the demo applications use the local one. Then run 
`npm install` from `/demo-app` and `npm run start` to start the application.

To switch between the redux and non redux version in the 
`demo-app/src/index` switch the comments (uncomment commented and comment
uncommented). 

All the helper methods and definitions
are documented on the [docs page](https://brumik.github.io/react-wooden-tree/).
