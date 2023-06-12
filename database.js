var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')

        db.run(`CREATE TABLE Admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username text UNIQUE, 
            password text 
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO Admin (username, password) VALUES (?,?)'
                db.run(insert, ["admin",md5("admin123")])
                db.run(insert, ["user",md5("user123")])
            }
        });  
        db.run(`CREATE TABLE Company (
            ID	INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name	TEXT,
            company_api_key	TEXT
        )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO Company (company_name, company_api_key) VALUES (?,?)'
                db.run(insert, ["SensoresTalcahuano","12345"])
                db.run(insert, ["SantiagoSecurity","67890"])
            }

        }
        );
        db.run(`CREATE TABLE Location (
            location_id       INTEGER PRIMARY KEY AUTOINCREMENT,
            company_id	      INTEGER,
            location_name	     TEXT,
            location_country	 TEXT,
            location_city	     TEXT,
            location_meta        TEXT,
            FOREIGN KEY(company_id) REFERENCES Company(ID)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO Location (company_id, location_name, location_country, location_city, location_meta) VALUES (?,?,?,?,?)'
                db.run(insert, [2,"SanBernardo","Chile","Santiago","Meta1"])
                db.run(insert, [2,"Quilicura","Chile","Santiago","Meta2"])
                db.run(insert, [1,"Concepcion","Chile","Concepcion","Meta3"])
                db.run(insert, [1,"Talcahuano","Chile","Concepcion","Meta4"])
            }

        }  
        );
        db.run(`CREATE TABLE Sensor (
            location_id	INTEGER,
            sensor_id INTEGER,
            sensor_name	TEXT,
            sensor_category	TEXT,
            sensor_meta    TEXT,
            sensor_api_key    TEXT
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO Sensor (location_id, sensor_id, sensor_name, sensor_category, sensor_meta, sensor_api_key) VALUES (?,?,?,?,?,?)'
                db.run(insert, [1,1,"Sensor1","Category1","Meta1","1234"])
                db.run(insert, [2,2,"Sensor2","Category2","Meta2","5678"])
                db.run(insert, [3,3,"Sensor3","Category3","Meta3","9012"])
                db.run(insert, [4,4,"Sensor4","Category4","Meta4","3456"])
            }
        }   
        );
        
        db.run(`CREATE TABLE Sensor_Data (
            value	INTEGER,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sensor_id	INTEGER,
            FOREIGN KEY(sensor_id) REFERENCES Sensor(sensor_id)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO Sensor_Data (value, timestamp, sensor_id) VALUES (?,?,?)'
                db.run(insert, [25,"1970-01-01 12:00:00.000" ,1])
                db.run(insert, [24,"1970-01-02 12:00:00.000" ,1])
                db.run(insert, [23,"1970-01-03 12:00:00.000" ,1])
                db.run(insert, [22,"1970-01-04 12:00:00.000" ,1])
                db.run(insert, [21,"1970-01-05 12:00:00.000" ,1])
                db.run(insert, [20,"1970-01-06 12:00:00.000" ,1])
                db.run(insert, [19,"1970-01-07 12:00:00.000" ,1])
                db.run(insert, [19,"1970-01-08 12:00:00.000" ,1])
                db.run(insert, [20,"1970-01-09 12:00:00.000" ,1])
                db.run(insert, [19,"1970-01-10 12:00:00.000" ,1])
                db.run(insert, [18,"1970-01-11 12:00:00.000" ,1])
                db.run(insert, [17,"1970-01-12 12:00:00.000" ,1])
                db.run(insert, [16,"1970-01-13 12:00:00.000" ,1])
                db.run(insert, [15,"1970-01-14 12:00:00.000" ,1])
                db.run(insert, [14,"1970-01-15 12:00:00.000" ,1])

                db.run(insert, [25,"1970-01-01 12:00:00.000" ,2])
                db.run(insert, [24,"1970-01-02 12:00:00.000" ,2])
                db.run(insert, [23,"1970-01-03 12:00:00.000" ,2])
                db.run(insert, [22,"1970-01-04 12:00:00.000" ,2])
                db.run(insert, [21,"1970-01-05 12:00:00.000" ,2])
                db.run(insert, [20,"1970-01-06 12:00:00.000" ,2])
                db.run(insert, [19,"1970-01-07 12:00:00.000" ,2])
                db.run(insert, [19,"1970-01-08 12:00:00.000" ,2])
                db.run(insert, [20,"1970-01-09 12:00:00.000" ,2])
                db.run(insert, [19,"1970-01-10 12:00:00.000" ,2])
                db.run(insert, [18,"1970-01-11 12:00:00.000" ,2])
                db.run(insert, [17,"1970-01-12 12:00:00.000" ,2])
                db.run(insert, [16,"1970-01-13 12:00:00.000" ,2])
                db.run(insert, [15,"1970-01-14 12:00:00.000" ,2])
                db.run(insert, [14,"1970-01-15 12:00:00.000" ,2])

                db.run(insert, [21,"1970-01-01 12:00:00.000" ,3])
                db.run(insert, [23,"1970-01-02 12:00:00.000" ,3])
                db.run(insert, [22,"1970-01-03 12:00:00.000" ,3])
                db.run(insert, [20,"1970-01-04 12:00:00.000" ,3])
                db.run(insert, [22,"1970-01-05 12:00:00.000" ,3])
                db.run(insert, [23,"1970-01-06 12:00:00.000" ,3])
                db.run(insert, [25,"1970-01-07 12:00:00.000" ,3])
                db.run(insert, [15,"1970-01-08 12:00:00.000" ,3])
                db.run(insert, [22,"1970-01-09 12:00:00.000" ,3])
                db.run(insert, [19,"1970-01-10 12:00:00.000" ,3])
                db.run(insert, [18,"1970-01-11 12:00:00.000" ,3])
                db.run(insert, [12,"1970-01-12 12:00:00.000" ,3])
                db.run(insert, [16,"1970-01-13 12:00:00.000" ,3])
                db.run(insert, [12,"1970-01-14 12:00:00.000" ,3])
                db.run(insert, [14,"1970-01-15 12:00:00.000" ,3])

                db.run(insert, [14,"1970-01-01 12:00:00.000" ,4])
                db.run(insert, [15,"1970-01-02 12:00:00.000" ,4])
                db.run(insert, [16,"1970-01-03 12:00:00.000" ,4])
                db.run(insert, [17,"1970-01-04 12:00:00.000" ,4])
                db.run(insert, [18,"1970-01-05 12:00:00.000" ,4])
                db.run(insert, [19,"1970-01-06 12:00:00.000" ,4])
                db.run(insert, [20,"1970-01-07 12:00:00.000" ,4])
                db.run(insert, [21,"1970-01-08 12:00:00.000" ,4])
                db.run(insert, [22,"1970-01-09 12:00:00.000" ,4])
                db.run(insert, [23,"1970-01-10 12:00:00.000" ,4])
                db.run(insert, [24,"1970-01-11 12:00:00.000" ,4])
                db.run(insert, [25,"1970-01-12 12:00:00.000" ,4])
                db.run(insert, [26,"1970-01-13 12:00:00.000" ,4])
                db.run(insert, [27,"1970-01-14 12:00:00.000" ,4])
                db.run(insert, [28,"1970-01-15 12:00:00.000" ,4])
            }
        }   
        );
        
    }
});


module.exports = db