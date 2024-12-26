// const connection = require("../Config");


// const download = (req, res) => {
//     const { id } = req.params;                                  
//     const sql = "SELECT * FROM Files WHERE id = ?";

//     connection.query(sql, [id], (err, result) => {
//         if (err) {
//             console.error("Error fetching file:", err);
//             res.status(500).json({ message: "Error fetching data", error: err });
//         } else {
//             res.status(200).json(result);
//         }
//     });
// };





// module.exports = { upload, download };



