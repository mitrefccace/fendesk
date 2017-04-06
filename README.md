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

user@yourmachine:~$  curl -k -H "Content-Type: application/json" -X POST -d '{"ticket":{"subject": "My printer is on fire!","comment": {"body": "The smoke is very colorful."}}}' https://IP address:port/api/v2/tickets.json  # add

user@yourmachine:~$  curl -k -H "Content-Type: application/json" -X PUT -d '{"ticket":{"subject":"new subject","description":"new description","requester": {"name": "Newname","email":"new@mail.org","phone": "1-800-newn","user_fields": {"last_name": "Newlname"}},"status": "open","comment": "new comment","resolution": "new resolution"}}' https://IP address:port/api/v2/tickets/1.json  # update

user@yourmachine:~$  curl -k --request GET https://IP address:port/api/v2/tickets/2837.json  # get

user@yourmachine:~$  curl -k --request DELETE https://IP address:port/api/v2/tickets/1.json  # delete
```
