/*require the ibm_db module*/
var ibmdb = require('ibm_db');

console.log("Test program to access DB2 sample database");

/*Connect to the database server
  param 1: The DSN string which has the details of database name to connect to, user id, password, hostname, portnumber 
  param 2: The Callback function to execute when connection attempt to the specified database is completed
*/
ibmdb.open("DRIVER={DB2};DATABASE=SAMPLE;UID=Maple;PWD=Lonely110;HOSTNAME=localhost;port=50000", function(err, conn)
{
        if(err) {
          	console.error("error: ", err.message);
        } else {

		conn.query("select * from TESTING fetch first 1 rows only", function(err, rows, moreResultSets) {
            console.log("ID \t\t Name");
			console.log("--\t\t---------");

            for (var i=0;i<rows.length;i++){
				console.log(rows[i].ID, "     \t\t      ", rows[i].NAME);
			}
			console.log("-----------------------");

			conn.close(function(){
				console.log("Connection Closed");
			});
		});
	}
});
