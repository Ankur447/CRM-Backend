const FileController = require('../Models/Admin')
const FileController2 = require('../Models/User')

 const  UploadFile=(req,res)=>{
    const file = {
        file_name: req.file.originalname,
        file_size: req.file.size,
        file_type: req.file.mimetype,
        file_data: req.file.buffer,  

    };
    console.log("File buffer:", req.file.buffer);
    FileController.upload(file,(err,result)=>{
  
        if (err) {
            return res.status(500).json({ message: "Error in uploading file", error: err });
        }
        res.status(201).json({ message: "File uploaded successfully" ,result:result});
       
    })
 }

 const { download } = require('../Models/Admin');

const downloadFile = (req, res) => {
    download(req, res, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error in downloading file", error: err });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ message: "File not found" });
        }

        const file = result[0];
        
        res.setHeader('Content-Type', file.file_type);
        res.setHeader('Content-Disposition', `attachment; filename="${file.file_name}"`);

        // Send the BLOB data as the file content
        res.send(file.file_data);
    });
};

module.exports = { downloadFile };

 module.exports = {UploadFile,downloadFile}