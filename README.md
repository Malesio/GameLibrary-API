# Web Applications Architectures - Project - API

- Nathan Collobert, D21124942
- Ewen Elain, D21124947

--- 

## Installation

### Node dependencies

You will need an up-to-date version of Node to run
the backend API (the latest LTS should work just fine), along with a package manager to install dependencies from a `package.json` file, such as `npm` or `yarn`.

Restore dependences from the `package.json` file:

```bash
npm install
```
or
```
yarn install
```

### MongoDB server

Next, ensure that a MongoDB server is running on your local machine or any other remotely accessible machine on your network. You can also deploy a dedicated MongoDB server using `docker-compose` and the `docker-compose.yml` configuration file provided:

```bash
# Start the MongoDB server in the background
docker-compose up -d
```

### Environment configuration

Several key variables can or should be modified by the user to fit their own setup. Such variables are found and can be modified in the `.env` configuration file provided.

## Running

Once fully configured, start off the API server with `npm start` or `yarn start`.

## Testing

Test suites can be executed by running `npm test` or `yarn test`.