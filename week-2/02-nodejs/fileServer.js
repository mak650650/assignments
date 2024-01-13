/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module
  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files
  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt
    - For any other route not defined in the server return 404
    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 5000;
const HOST = '127.0.0.1';

app.use((req,res ,next)=>{
  const isPath = req.path === '/files' || req.path.startsWith('/files/');
  if(!isPath){
    res.status(404).send('Route not found');
  }
  next();
});

// '/files' for getting all the content inside the directory
app.get('/files',(req, res)=>{
  const PATH = path.join(__dirname+`/files`);
  
  const APP = {
    "readDirectoryContent":()=>{
      return new Promise(function(resolve,reject){
        fs.readdir(PATH,(err,data)=>{
          resolve(data)
          if(err){
            reject(err)
          }
        })      
      })
    },
  }
  APP["readDirectoryContent"]().then((data)=>{   
      res.send(data)
  },()=>{res.statusCode(500).json({error:"Failed to retrive file"});})
 
});

// '/files/filename' give the content of filename
app.get('/files/:filename',(req,res)=>{
  // res.send(req.params.filename)
  const PATH = path.join(__dirname+`/files/${req.params.filename}`);
  const APP = {
    "readFileContent":()=>{ 
      return new Promise(function(resolve,reject){
        fs.readFile(PATH,(err,data)=>{
          if(err){
            reject(err);
          }
          resolve(data)
        })
      });
    },
  }

  APP['readFileContent']().then((data)=>{
    res.send(data.toString())
  },(err)=>{
    return res.status(404).send('File not found')
  })


});




app.listen(PORT ,()=>{
  console.log(`Server is live on ${HOST}:${PORT}`);
})

module.exports = app;