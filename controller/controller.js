const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const files = ['Installed_audience.csv', 'user_acquisition.csv', 'lostuser.csv'];
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

          Object.keys(row).slice(1, -1).forEach((column) => {
            if (!row[column].includes(":")) {
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
          if (filesProcessed === files.length) {
            resolve(Object.values(dates));
          }
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  });
};

const prevCSVPath = path.join(__dirname, '../storage/prevcsv/');
const uploadedCSVPath = path.join(__dirname, '../storage/uploaded/');

const concatedCSV = async (req, res) => {
  try {
    const [prevCSVData, uploadedCSV] = await Promise.all([
      processCSV(prevCSVPath),
      processCSV(uploadedCSVPath)
    ]);

    const uniqueData = uploadedCSV.filter(uploaded => 
      !prevCSVData.some(prev => prev.Date === uploaded.Date)
    );

    const result = [...prevCSVData, ...uniqueData];

    res.json({ processedData: result });
  } catch (error) {
    res.status(500).json({ error: 'Error processing CSV files', details: error.message });
  }
};

module.exports = concatedCSV;
