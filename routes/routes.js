/**
* Defines the different RESTful web services that can be called.
*
* @param (type) app Instance of express
* @returns (undefined) Not used
*/

/*
* Tickets are stored as .json files on disk. This is probably not thread-safe,
* but this is just Fendesk (emulator), so it's okay.
*/

var appRouter = function(app,fs,ip,port) {
    
    var tpath = 'api/v2/tickets';
    var ipaddr = ip.address();
    
    //is server running?
    app.get('/', function(req, res) {
        return res.status(200).send({'message': 'Welcome to Fendesk.'});
    });
  
    //add ticket - This overwrites the ticket file if it already exists on disk.
    app.post('/api/v2/tickets.json',function(req, res) {
        console.log('Got a POST (add) request at /api/v2/tickets.json');
        
        //if counter.json does not exist, create it with counter value 0
        if (!fs.existsSync(tpath + '/counter.json')) {
            console.log('creating counter.json first time...');
            fs.writeFileSync(tpath + '/counter.json', JSON.stringify({ "counter": 0 }, null, 2) , 'utf-8');
        }
        
        var obj = JSON.parse(fs.readFileSync(tpath + '/counter.json', 'utf8'));
        var newticketid = obj.counter + 1;
        var dte = new Date().toISOString().replace(/\..+/, '') + 'Z';
        
        var responseJson = {
                "url": "https://" + ipaddr + ":" + port + "/api/v2/tickets/" + newticketid + ".json",
                "id": newticketid,
                "external_id": null,
                "via": {
                    "channel": "api",
                    "source": {
                        "from": {},
                        "to": {},
                        "rel": null
                    }
                },
                "created_at": dte,
                "updated_at": dte,
                "type": null,
                "subject":     req.body.ticket.subject,
                "raw_subject": req.body.ticket.subject,
                "description": req.body.ticket.description,
                "priority": null,
                "status": "new",
                "recipient": null,
                "requester_id": 12223334444,
                "submitter_id": 12223334444,
                "assignee_id": null,
                "organization_id": null,
                "group_id": 12345678,
                "collaborator_ids": [],
                "forum_topic_id": null,
                "problem_id": null,
                "has_incidents": false,
                "is_public": true,
                "due_at": null,
                "tags": [],
                "custom_fields": [{
                    "id": req.body.ticket.custom_fields[0].id,
                    "value":req.body.ticket.custom_fields[0].value 
                },
                {
                    "id": req.body.ticket.custom_fields[1].id,
                    "value":req.body.ticket.custom_fields[1].value 
                }],
                "satisfaction_rating": null,
                "sharing_agreement_ids": [],
                "fields": [{
                    "id": 87654321,
                    "value": null
                }],
                "brand_id": 123456,
                "allow_channelback": false
            };
        
        //write to file
        fs.writeFile(tpath + '/' + newticketid + '.json', JSON.stringify(responseJson, null, 2) , 'utf-8');
        
        //update counter file
        fs.writeFile(tpath + '/counter.json', JSON.stringify({ "counter": newticketid }, null, 2) , 'utf-8');
        console.log('created ' + newticketid + '.json');
        
        return res.status(200).send(responseJson);
    });  
  
    //update ticket
    app.put('/api/v2/tickets/:id.json',function(req, res) {
        console.log('Got a PUT (update) request at /api/v2/tickets/' + req.params.id + '.json');
        
        var ticketid = req.params.id;

        // does file exist?
        if (!fs.existsSync(tpath + '/' + ticketid + '.json')) {
            console.log('file does not exist: ' + tpath + '/' + ticketid + '.json');
            return res.status(404).send({'message': ticketid + '.json not found'});            
        }        
        var dte = new Date().toISOString().replace(/\..+/, '') + 'Z';
        var responseJson = JSON.parse(fs.readFileSync(tpath + '/' + ticketid + '.json', 'utf8'));

        responseJson.subject = req.body.ticket.subject;
        responseJson.description = req.body.ticket.description;
        responseJson.updated_at = dte;
        responseJson.custom_fields[0].id = req.body.ticket.custom_fields[0].id;
        responseJson.custom_fields[0].value = req.body.ticket.custom_fields[0].value;
        responseJson.custom_fields[1].id = req.body.ticket.custom_fields[1].id;
        responseJson.custom_fields[1].value = req.body.ticket.custom_fields[1].value;
        
        //write to file
        fs.writeFile(tpath + '/' + ticketid + '.json', JSON.stringify(responseJson, null, 2) , 'utf-8');

        return res.status(200).send(responseJson);
    });

    //get a ticket
    app.get('/api/v2/tickets/:id.json', function(req, res) {

        console.log('Got a GET (query) request at /api/v2/tickets/' + req.params.id + '.json');

        var ticketid = req.params.id;
        
        //if {id}.json file does not exist...
        if (!fs.existsSync(tpath + '/' + ticketid + '.json')) {
            console.log('file does not exist: ' + tpath + '/' + ticketid + '.json');
            return res.status(404).send({'message': ticketid + '.json not found'});
        }        
        
        var retrievedJson = JSON.parse(fs.readFileSync(tpath + '/' + ticketid + '.json', 'utf8'));
 
        res.status(200).send(retrievedJson);
    }); 

    //delete a ticket
    app.delete('/api/v2/tickets/:id.json', function (req, res) {

        console.log('Got a DELETE request at /api/v2/tickets/' + req.params.id + '.json');
    
        var ticketid = req.params.id;
    
        // does file exist?
        if (!fs.existsSync(tpath + '/' + ticketid + '.json')) {
            console.log('file does not exist: ' + tpath + '/' + ticketid + '.json');
            return res.status(404).send({'message': ticketid + '.json not found'});            
        }
       
        fs.unlinkSync(tpath + '/' + ticketid + '.json');
        res.status(200).send({'message': 'success'});
    });
		
    //search for all tickets with custom vrs field equal to parameter
		//e.g., http://host:port/api/v2/search.json?query=fieldvalue:22222222+type:ticket
    app.get('/api/v2/search.json', function(req, res) {

        console.log('Got a GET (search) request at /api/v2/search.json');

				//require a query field for now
        var queryField;
				var terms;
				var terms2;
				var vrsnum;
				try {
					queryField = req.param('query');
					terms = queryField.split(" ");
					terms2 = terms[0].split(":");
					vrsnum = terms2[1];
				} catch (err) {
					return res.status(404).send({'message': 'invalid query parameter'});
				}				

				//get all tickets that have vrsnum as a custom field value
				var tpath = "api/v2/tickets";
				var returnJson = [];
				fs.readdir(tpath, function(err, filenames) {
					if (err) {
						return res.status(404).send({'message': 'error reading files'});
					}
					filenames.forEach(function(filename) {
						if (filename.endsWith(".json") && filename !== 'counter.json') {
							var retrievedJson = JSON.parse(fs.readFileSync(tpath + '/' + filename, 'utf8'));
							filevrsnum = retrievedJson.custom_fields[1].value;
							if (filevrsnum === vrsnum) {
								returnJson.push(JSON.parse(retrievedJson));
							}
						}
					});
					res.status(200).send(returnJson);					
				});
				
    }); 		

}

module.exports = appRouter;
