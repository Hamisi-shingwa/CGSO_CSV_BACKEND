const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const ProcessCSV = (req, res) => {
  const filePath = path.join(__dirname, '../storage/uploaded/');
  const files = ['installed_audience.csv', 'user_acquisition.csv', 'lostuser.csv'];

  let result = [];
  let dates = {};

  let filesProcessed = 0;

  files.forEach((file) => {
    fs.createReadStream(path.join(filePath, file))
      .pipe(csv())
      .on('data', (row) => {
        const date = row.Date;

        if (!dates[date]) {
          dates[date] = {
            Date: date,
            Installed_Audience: {},
            User_Acquisition: {},
            Lost_Users: {}
          };
        }

        // get firstROw(header)
        const headerKeys = Object.keys(row);
        const columnNames = headerKeys.slice(1, headerKeys.length - 1); 
  

        // Step 2: Check if is firs row 
        columnNames.forEach((column) => {
          if (row[column] && row[column].includes(":")){
           //This not important now
          } else {
            // if is not the row with (:) within
            if (column.includes("Installed audience")) {
              dates[date].Installed_Audience[column] = row[column];
            } else if (column.includes("User acquisition")) {
              dates[date].User_Acquisition[column] = row[column];
            } else if (column.includes("User loss")) {
              dates[date].Lost_Users[column] = row[column];
            }
          }
        });
      })
      .on('end', () => {
        filesProcessed++;

        // Once all files are processed, check the result
        if (filesProcessed === files.length) {
          //convert dates to array
          result = Object.values(dates); 
          console.log(result.length, "Datas proccessed successfuull"); 

          return res.json({ processedData: result });
        }
      })
      .on('error', (err) => {
        // Handle any errors during file reading
        return res.status(500).json({ error: 'Error reading file', details: err.message });
      });
  });
};

module.exports = ProcessCSV;
