# Nodejs Challege
Challenge to apply for a backend developer position on Skydropx.

## Requirements

For development, you will need Node.js and mongodb installed on your machine, a node global package or yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

### How to install mongodb

  Just go on [official Mongodb website](https://docs.mongodb.com/manual/installation/) and download the installer.

## Install

Before anything else, you must install nodemon, pm2 package and mocha package on your machine.
- ### Install nodemon package
Run on your terminal `npm i -g nodemon`, with this comand install global package.
- ### Install pm2 package
Run on your terminal `npm i -g pm2`, with this comand install global package.
- ### Install mocha package
Run on your terminal `npm i -g mocha`, with this comand install global package.

    $ git clone https://github.com/kevinjoel/nodejs-challenge
    $ cd nodejs-challenge
    $ npm install

## How to run

### Running Dev Server

Run on your terminal `npm run dev`, the server will restart everytime you make a change in your code.

### Running Production Server

For stuff like heroku deployment, aws elasticbeanstalk, or own server run, `npm run start`

### Other scripts

* `npm run test` - perform all available tests

Best rewards.