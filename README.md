# Simple API-Gateway Docker

## Overview

Very simple light weight api-gateway for docker.  
You can use in local environemnt or in CI.  
All you need to do is set configuration yaml file.

## Requirements

- Docker

### Local Use

- Node.js
- npm

## Usage

### Create Config File

You need to create api-gateway config file in yaml.
[here](https://github.com/HayatoTakahashi129/simple-Rest-API-Gateway-Docker/blob/deveop/configs/apiConfig.yaml) is the exmaple.

#### set proxy path

[Here](https://github.com/HayatoTakahashi129/simple-Rest-API-Gateway-Docker/blob/deveop/configs/apiConfig.yaml) is the example for config yaml file.  
Set `${path}`.`${method}` for each configuration.

- `routeFqdn` : request will be send to this path.
- `authorization` : you can set configuration about authorization. See [here](#authorization) for more details.

#### Authorization

You can set configuration of Authorization in `${path}`.`${method}`.`authorization`.  
These are the keywords you can set.

- `header` : get authorization token from this keyword in the request header.
- `type` : you can set what kind of authorization you want to use.
  - `jwt` : this will check if the token is valid as jwt or not.  
    ※this project only check if there is 2 dots in the token and exp is expired or not.

## Author

[HayatoTakahashi129](https://github.com/HayatoTakahashi129)

## Licence

[MIT](https://github.com/HayatoTakahashi129/simple-Rest-API-Gateway-Docker/blob/deveop/LICENSE)
