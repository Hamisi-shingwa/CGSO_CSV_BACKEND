const fs = require("fs");
const path = require("path");
const deletePath = require("./deletePath")

const storage = path.join(__dirname, "./storage/uploaded");

const processUpload = async (files) => {
  try {
  
    const processedFiles = [];


    for (let file of files) {
      const content = fs.readFileSync(file.path, "utf-8");  

      let newFileName = file.originalname;

      if (content.includes("Installed audience")) {
        newFileName = "Installed_audience.csv";
      } else if (content.includes("User acquisition")) {
        newFileName = "user_acquisition.csv";
      } else if (content.includes("User loss")) {
        newFileName = "lostuser.csv";
      }
//validate if same file exist
       deletePath(fs, storage)
      const newFilePath = path.join("./storage/uploaded", newFileName);
    //   if (fs.existsSync(newFilePath)) {
    //     throw new Error(`Duplicate file detected: ${newFileName}. Please ensure files have unique content.`);
    //   }

      // Rename and move the file to the correct location
      fs.renameSync(file.path, newFilePath);

      // Add the file details to the processed list
      processedFiles.push({
        originalName: file.originalname,
        newName: newFileName,
        size: file.size,
        path: newFilePath,
      });
    }

    return processedFiles;  // Return an array of processed file details
  } catch (error) {
    console.error("Error processing files:", error);
    throw error;  // Rethrow error to be caught by the route handler
  }
};

module.exports = processUpload;
