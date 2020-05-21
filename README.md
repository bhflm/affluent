# affluent
Affluent challenge

This challenge was made for Affluent.io following these instructions: https://docs.google.com/document/d/1M_oxIgZ1-I2tK7PxvNgHctplTbdk4RxsHjRZk7r3LjY/edit#


## TLDR;

Challenge required to built a simple HTML website which previewed fetched from two different entities.

`Users`, from [reqres](https://reqres.in/). And `Metrics` from [Affluent](https://develop.pub.afflu.net/).  


## Getting Started

### Installing

Get the latest version of node from the [official website](https://nodejs.org/) or using [nvm](https://github.com/creationix/nvm).  
Nvm approach is preferred.

Install dependencies by running `npm i`.

### Starting app

As there's no "production" environment i just left the script to run `npm run dev`, for debugging with `nodemon`. You could either start it that way or just run `node server.js` from the root folder.

After this access to the view file is available from **localhost:8080**
(if Port 8080 wasn't modified, in that case, use your favorite port )


### Environments

By default, the environment will be **development**. There's no production ENV.

PORT is set by default to 8080, feel free to change it from the .ENV file.

### Environment variables

[Dotenv](https://www.npmjs.com/package/dotenv) is used for managing environment variables. They are stored in the `/.env` file. Take into account that the variables defined in the `bashrc` are not overrided.

The environment variables should be added to the `.env` file in the form of `NAME=VALUE`, as the following example:

```
PORT=8081
CLIENTS_API=http://api.clients.example.org/
```

**Remember not to push nor commit the `.env` file.**

## Built With

* [Express.js](https://expressjs.com/)
* [Puppeteer](https://pptr.dev/)

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Run the tests (`npm test`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create new Pull Request

## About

This project was written and is maintained by [German Bonin](https://github.com/bhflm).

## License

This project is licensed under the MIT License.
