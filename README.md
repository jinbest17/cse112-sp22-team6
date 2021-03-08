# cse110-w21-group34

## Source Documentation (JSDocs)

[https://4r53n.github.io/cse110-w21-group34/](https://4r53n.github.io/cse110-w21-group34/)

JSDocs for main are automatically generated and hosted to GitHub Pages to
the link above or [here](https://4r53n.github.io/cse110-w21-group34/).

## Running
The application uses *ES modules* which require CORS. Therefore, the server
needs to be hosted to add all script functionality.

To run the app, run the following npm script in the project directory:
```
$ npm run host
```

You can also use any other server hosting utility. If you use [VSCode](https://code.visualstudio.com/),
you can use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
extension to open `source/index.html`.

## Testing
Currently, there are tests for both unit testing in [Jest](https://jestjs.io/)
and E2E testing in [Cypress](https://www.cypress.io/). They cover different
aspects, so both are used.

- To run unit tests, run Jest in the project directory:
```
$ npm run test
```

- To run E2E tests, host the server using `npm run host`, then run Cypress in the
project directory:
```
$ npm run cypress
```

**Note**: If you do not want to use the host script, the app must be hosted on
`127.0.0.1:5500`.
