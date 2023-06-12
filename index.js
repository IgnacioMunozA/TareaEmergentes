// Create express app
var express = require("express")
var app = express()
var db = require('./database.js')
var dball = require("./promised_db.js").dball

var md5 = require("md5")
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Create a new company
app.post("/api/company/", (req, res, next) => {
    var data = {
        company_name: req.body.company_name,
        company_api_key: req.body.company_api_key
    }
    var sql1 ='INSERT INTO Company(company_name,company_api_key) VALUES (?,?)'
    var params1 =[data.company_name, data.company_api_key]            
    db.get(sql1, params1, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        if(row != null){
           console.log(row);
           var sql ='INSERT INTO Sensor_Data (value, timestamp, sensor_id) VALUES (?,?,?)'
           var params =[data.value, data.timestamp, data.sensor_id]
           db.run(sql, params, function (err, result) {
               if (err){
                   res.status(400).json({"error": err.message})
                   return;
               }
               res.status(201).send('Status: Created')
           });
        }
      });
})

//////// GET location /////////////////////////////////////////


app.get("/api/location/:company_api_key", (req, res, next) => {
    var sql = "select location_id, location_name, location_country, location_city, location_meta from Location, Company where Company.company_api_key =? and Company.ID = Location.company_id"
    var params = [
        req.params.company_api_key
    ]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

//////// GET location by id ///////////////////////////////////

app.get("/api/location/:company_api_key/:location_id", (req, res, next) => {
    var sql = "select location_id, location_name, location_country, location_city, location_meta from Location, Company where Company.company_api_key =? and Location.location_id =?  and Company.ID = Location.company_id"
    var params = [ req.params.company_api_key, req.params.location_id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row            
        })
      });
});


/////// PUT location (UPDATE) /////////////////////////////////

app.put("/api/location/:location_id/:company_api_key", (req, res, next) => {
    var data = {
        location_name: req.body.location_name,
        location_country: req.body.location_country,
        location_city: req.body.location_city,
        location_meta: req.body.location_meta
    }
    db.run(
        `UPDATE Location SET 
           location_name = COALESCE(?, location_name), 
           location_country = COALESCE(?, location_country),
           location_city = COALESCE(?, location_city),
           location_meta = COALESCE(?, location_meta)
           WHERE location_id = ? `,
        [data.location_name, data.location_country, data.location_city, data.location_meta,  req.params.location_id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})



/////// DELETE location  //////////////////////////////////////

app.delete("/api/location/:company_api_key/:location_id", (req, res, next) => {
    db.run(
        'DELETE FROM Location where location_id= ? and (select location_id from Location where company_id=(select ID from Company where company_api_key=?) )',
        [req.params.location_id, req.params.company_api_key],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})




/////// GET sensor ////////////////////////////////////////////

app.get("/api/sensor/:company_api_key", (req, res, next) => {
    var sql = "SELECT  sensor_id, sensor_name, sensor_category, sensor_meta, sensor_api_key FROM Sensor, Location, Company WHERE Company.company_api_key = ? AND Company.ID = Location.company_id AND Location.location_id = Sensor.location_id"
    var params = [req.params.company_api_key]
    db.all
    (sql, params
    , (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});


/////// GET sensor by id //////////////////////////////////////

app.get("/api/sensor/:company_api_key/:sensor_id", (req, res, next) => {
   
    var sql = "SELECT  sensor_id, sensor_name, sensor_category, sensor_meta, sensor_api_key FROM Sensor, Location, Company WHERE Company.company_api_key = ? AND Company.ID = Location.company_id AND Location.location_id = Sensor.location_id AND Sensor.sensor_id = ?"
    var params = [req.params.company_api_key,req.params.sensor_id]
    db.all
    (sql, params
    , (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});




///// update sensor //////////////////////////////////

app.put("/api/sensor/:sensor_id/:company_api_key", (req, res, next) => {
    var data = {   
        sensor_name: req.body.sensor_name,
        sensor_category: req.body.sensor_category,
        sensor_meta: req.body.sensor_meta,
        sensor_api_key: req.body.sensor_api_key
    }

    db.run(
        `UPDATE Sensor SET
                sensor_name = COALESCE(?, sensor_name),
                sensor_category = COALESCE(?, sensor_category),
                sensor_meta = COALESCE(?, sensor_meta),
                sensor_api_key = COALESCE(?, sensor_api_key)
                WHERE sensor_id = ?`,
        [ data.sensor_name, data.sensor_category, data.sensor_meta, data.sensor_api_key,req.params.sensor_id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                req:req.params,
                changes: this.changes
            })
    });

})
////////////// delete sensor //////////////////////////
app.delete("/api/sensor/:company_api_key/:sensor_id", (req, res, next) => {
    db.run(
        'DELETE  FROM Sensor WHERE sensor_id= ? AND location_id =(SELECT location_id FROM Location WHERE company_id =(SELECT ID FROM Company WHERE company_api_key=?))',
        [req.params.sensor_id, req.params.company_api_key], 
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})



/////// POST sensor data ///////////////////
 
app.post("/api/v1/sensor_data/:sensor_api_key/:sensor_id", (req, res, next) => {
    var errors=[]
    if (!req.body.timestamp){
        errors.push("No timestamp specified");
    }
    if (!req.body.value){
        errors.push("No value specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        timestamp: req.body.timestamp,
        value: req.body.value,
        sensor_id : req.body.sensor_id
    }
    var sql1 = 'SELECT sensor_id FROM Sensor WHERE sensor_api_key =?'
    var params1= [req.params.sensor_api_key]
    db.get(sql1, params1, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        if(row != null){
           console.log(row);
           var sql ='INSERT INTO Sensor_Data (value, timestamp, sensor_id) VALUES (?,?,?)'
           var params =[data.value, data.timestamp, data.sensor_id]
           db.run(sql, params, function (err, result) {
               if (err){
                   res.status(400).json({"error": err.message})
                   return;
               }
               res.status(201).send('Status: Created')
           });
        }
        else{
            console.log("El Sensor API KEY ingesado no es valido");
        }
      });

})


/////// GET sensor data ///////////////////

app.get("/api/v1/sensor_data/:company_api_key", async (req, res, next) => {
  var Data = {
    to: req.body.to,
    from: req.body.from,
    sensor_id: req.body.sensor_id,
  };
  var tmp = [];

  for (var value in Data.sensor_id) {
    var sql = `select value,timestamp, Sensor_Data.sensor_id 
                from Sensor_Data, Company, Location, Sensor 
                where  Sensor_Data.timestamp >= ? 
                AND Sensor_Data.timestamp <= ? 
                And Sensor_Data.sensor_id = ?
                AND Sensor.sensor_id = Sensor_Data.sensor_id 
                and  Location.location_id = Sensor.location_id 
                and Company.ID = Location.company_id 
                and Company.company_api_key = ?`;
    var params = [
      Data.from,
      Data.to,
      Data.sensor_id[value],
      req.params.company_api_key,
    ];
    const val = await dball(sql, params);
    tmp.push(val);
  }
  res.json({
    message: "success",
    data: tmp,
  });
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});