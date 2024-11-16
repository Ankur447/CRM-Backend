const connection = require("../Config");

const upload = (file, callback) => {
    const { file_name, file_size, file_type, file_data } = file;

    // Corrected SQL query
    const sql = "INSERT INTO Files (file_name, file_size, file_type, file_data) VALUES (?, ?, ?, ?)";

    // Ensure that each placeholder ? has a corresponding value in the array
    connection.query(sql, [file_name, file_size, file_type, file_data], (err, result) => {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
const download = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM Files WHERE id = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching file:", err);
            res.status(500).json({ message: "Error fetching data", error: err });
        } else {
            res.status(200).json(result);
        }
    });
};

module.exports = { upload, download };



