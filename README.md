![](images/acesmall.png)

# ACE Fendesk Project

Fendesk is a server that simulates Zendesk for ACE Direct in a Suitcase or anyone who needs a Zendesk simulator.

### SSL Configuration

1. ACE software uses SSL which requires a valid key and certificate
1. The location of the SSL key and certificate can be specified in the config.json by using the https:certificate and https:private_key parameters in the form of folder/file (e.g., ssl/mycert.pem and ssl/mykey.pem)
1. Additional information can be found in the ACE Direct Platform Release document

### Getting Started

1. Clone this repository
1. Download and install [Node.js](https://nodejs.org/en/)
1. Install the required Node.js modules: cd into the userver directory, run `npm install`
1. From the command line:
    * cd fendesk
    * npm install
    * npm install apidoc -g
    * apidoc -i routes/ -o apidoc/
    * node app.js

#### Running the Server

Usage: nodejs app.js [ port ]

#### Testing the Server in AWS


