const express = require("express");
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const processUpload = require("./controller/processUploadedFiles"); 
const deletePath = require("./controller/deletePath");
const { promises } = require("dns");


const storage = path.join(__dirname, "./storage/uploaded");

// deletePath(fs, storage)


const upload = multer({ dest: "./storage/uploaded" });  


const Route = express.Router();


Route.use(express.json());
Route.use(express.urlencoded({ extended: true }));

 
Route.get("/csv", require("./controller/controller"));


Route.post("/upload", upload.array("files", 3), async (req, res) => {
  try {
    // Check if files are received
    // deletePath(fs, storage)
    if (!req.files || req.files.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Please upload exactly 3 CSV files.",
      });
    }

    // Process files using your custom logic (like renaming, checking duplicates, etc.)
    const processedFiles = await processUpload(req.files);

    // Send response with processed files information
    res.status(200).json({
      success: true,
      message: "Files uploaded and processed successfully.",
      files: processedFiles,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({
      success: false,
      message: "There was an error processing the files.",
    });
  }
});

module.exports = Route;
