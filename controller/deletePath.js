const path = require('path');

// Function to delete only the contents of the folder (not the folder itself)
function deleteFolderContents(fs, folderPath) {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);

    // Loop through each file and delete it
    files.forEach((file) => {
      const currentPath = path.join(folderPath, file);

      if (fs.statSync(currentPath).isDirectory()) {
        // If it's a directory, recursively delete its contents
        deleteFolderContents(fs, currentPath);
      } else {
        // If it's a file, delete it
        fs.unlinkSync(currentPath);
        console.log(`Deleted file: ${currentPath}`);
      }
    });

    console.log(`Contents of the folder ${folderPath} were deleted successfully.`);
  } else {
    console.log(`${folderPath} does not exist.`);
  }
}

module.exports = deleteFolderContents;
