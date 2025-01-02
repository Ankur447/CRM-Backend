// const express = require("express");
// const bodyParser = require("body-parser");
// const mysql = require("mysql2");
// const multer = require("multer");
// const fs = require("fs");
// const crypto = require("crypto");

// const app = express();





// // Encryption key (securely store this in an environment variable)
// const ENCRYPTION_KEY = crypto.randomBytes(32); // Replace this with your securely stored key
// const IV_LENGTH = 16; // AES block size

// // Function to encrypt data
// function encryptData(data) {
//     const iv = crypto.randomBytes(IV_LENGTH);
//     const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
//     const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
//     return { iv: iv.toString("hex"), data: encrypted.toString("hex") };
// }

// // Function to decrypt data
// function decryptData(encrypted, iv) {
//     const decipher = crypto.createDecipheriv(
//         "aes-256-cbc",
//         ENCRYPTION_KEY,
//         Buffer.from(iv, "hex")
//     );
//     const decrypted = Buffer.concat([
//         decipher.update(Buffer.from(encrypted, "hex")),
//         decipher.final()
//     ]);
//     return decrypted;
// }

// // Set up Multer for file upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });

// const upload = multer({ storage });

// // Upload PDF file endpoint
// app.post("/upload", upload.single("file"), 
// // Download and decrypt PDF file endpoint
// app.get("/files/:id", (req, res) => {
//     const fileId = req.params.id;

//     db.query("SELECT * FROM files WHERE id = ?", [fileId], (err, results) => {
//         if (err || results.length === 0) {
//             return res.status(404).send("File not found.");
//         }

//         const file = results[0];
//         const decryptedData = decryptData(file.file_data, file.iv); // Assuming IV is stored separately

//         res.setHeader("Content-Type", file.file_type);
//         res.setHeader(
//             "Content-Disposition",
//             `attachment; filename="${file.file_name}"`
//         );
//         res.send(decryptedData);
//     });
// });

// const uploadFile = (req, res) => {
//     const { filename, mimetype, path, size } = req.file;

//     // Read and encrypt the file
//     const fileData = fs.readFileSync(path);
//     const encrypted = encryptData(fileData);

//     // Insert encrypted data into the database
//     db.query(
//         "INSERT INTO files (file_name, file_type, file_size, file_data, uploaded_at) VALUES (?, ?, ?, ?, NOW())",
//         [filename, mimetype, size, encrypted.data],
//         (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send("Error saving file.");
//             }
//             res.send("File uploaded and encrypted successfully!");
//         }
//     );

//     // Remove the file from the local system
//     fs.unlinkSync(path);
// });

