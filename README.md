![](images/acesmall.png)

# ACE Fendesk Project

Fendesk is a server that simulates Zendesk for ACE Direct in a Suitcase or anyone who needs a Zendesk simulator.

### SSL Configuration

1. ACE software uses SSL which requires a valid key and certificate
1. The location of the SSL key and certificate can be specified in the config.json by using the https:certificate and https:private_key parameters in the form of folder/file (e.g., ssl/mycert.pem and ssl/mykey.pem)
1. Additional information can be found in the ACE Direct Platform Release document

### App Configuration

1. To use this with the esb, the esb must recognize this requester/submitter id: *12223334444*.

### Getting Started

1. Clone this repository
1. Download and install [Node.js](https://nodejs.org/en/)
1. Install the required Node.js modules: cd into the userver directory, run `npm install`
1. Edit config.json
1. From the command line:
    * cd fendesk
    * npm install
    * npm install apidoc -g
    * apidoc -i routes/ -o apidoc/
    * node app.js

#### Running the Server

Usage: nodejs app.js

#### Testing the Server 

```
user@yourmachine:~$  curl -k --request GET https://IP address:port/  # check connectivity

user@yourmachine:~$  curl -k -H "Content-Type: application/json" -X POST -d '{"ticket":{"subject":"television","description":"Big Bang Theory is inaccurate","requester":{"name":"Albert","email":"al@someemail.org","phone":"1112223333","user_fields":{"last_name":"Einstein"}}}}' https://IP address:port/api/v2/tickets.json  # add

user@yourmachine:~$  curl -k -H "Content-Type: application/json" -X PUT -d '{"ticket":{"subject":"television (updated)","description":"Sheldon is funny","requester":{"name":"Albert","email":"al@someemail.org","phone":"1112223333","user_fields":{"last_name":"Einstein"}},"status":"new","comment":{"public":true,"body":"this is the comment body"},"resolution":"this is the resolution"}}' https://IP address:port/api/v2/tickets/1.json  # update

user@yourmachine:~$  curl -k --request GET https://IP address:port/api/v2/tickets/2837.json  # get

user@yourmachine:~$  curl -k --request DELETE https://IP address:port/api/v2/tickets/1.json  # delete
```
