const connection = require('../Models/model');
const multer = require('multer');

// Configure Multer to store uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');
//----------------------------------Parent------------------------------------------------------------------
const handleGetParent = (req, res) => {
    try {
        // Extract query parameters for pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10

        // Calculate the offset for SQL query
        const offset = (page - 1) * limit;

        // Query to fetch paginated parents along with total count
        let query = `SELECT SQL_CALC_FOUND_ROWS * FROM Parent LIMIT ?, ?;
                     SELECT FOUND_ROWS() as total;`;

        // Execute the query with pagination parameters
        connection.query(query, [offset, limit], (err, results) => {
            if (err) {
                // If there's an error, return a 501 status code with the error message
                return res.status(501).json([{ "Error": err.sqlMessage }]);
            }

            // Extract results from the first query
            const parents = results[0];

            // Extract total count from the second query
            const totalCount = results[1][0].total;

            // If successful, return a 200 status code with paginated results and metadata
            return res.status(200).json({
                parents,
                totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit)
            });
        });
    } catch (error) {
        // If there's an unexpected error, return a 501 status code with the error details
        return res.status(501).json([{ "Error Name": error.name, "Error Message": error.message }]);
    }
};


const handleAddNewParent = (req, res) => {
    try {
        // Execute Multer middleware to handle file upload
        upload(req, res, (err) => {
            if (err) {
                // If there's an error uploading the image, return a 400 status code with the error message
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }

            // Extract user data from the request body
            const { parent_name } = req.body;
            // const image = req.file ? req.file.buffer : null;

            // Validate user input (optional)
            if (!parent_name) {
                return res.status(400).json({ message: 'Name are required fields' });
            }

            // Construct the SQL query to insert the new user into the database
            const query = 'INSERT INTO Parent (parent_name) VALUES (?)';
            const values = [parent_name];

            // Execute the query to insert the new user
            connection.query(query, values, (err, results) => {
                if (err) {
                    // If there's an error, return a 500 status code with the error message
                    return res.status(500).json({ message: 'Error inserting user', error: err });
                }
                // If successful, return a 201 status code with a success message
                return res.status(201).json({ message: 'User inserted successfully', userId: results.insertId });
            });
        });
    } catch (error) {
        // If there's an unexpected error, return a 500 status code with the error details
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
};



const handleEditParent = (req, res) => {
    try {
        // Execute Multer middleware to handle file upload
        upload(req, res, (err) => {
            if (err) {
                // If there's an error uploading the image, return a 400 status code with the error message
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }

            // Extract user data from the request body
            const { parent_name } = req.body;
            const parentId = req.params.id;
            // const image = req.file ? req.file.buffer : null;

            // Validate user input (optional)
            if (!parent_name) {
                return res.status(400).json({ message: 'Name is a required field' });
            }

            // Construct the SQL query to update the existing user in the database
            const query = 'UPDATE Parent SET parent_name = ? WHERE parent_id = ?';
            const values = [parent_name, parentId];

            // Execute the query to update the user
            connection.query(query, values, (err, results) => {
                if (err) {
                    // If there's an error, return a 500 status code with the error message
                    return res.status(500).json({ message: 'Error updating user', error: err });
                }

                if (results.affectedRows === 0) {
                    // If no rows were affected, the parent ID doesn't exist
                    return res.status(404).json({ message: 'Parent not found' });
                }

                // If successful, return a 200 status code with a success message
                return res.status(200).json({ message: 'User updated successfully' });
            });
        });
    } catch (error) {
        // If there's an unexpected error, return a 500 status code with the error details
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
};

const handleDeleteParent = (req, res) => {
    try {
        // Extract parent ID from the request parameters
        const parentId = req.params.id;

        // Construct the SQL query to delete the parent from the database
        const query = 'DELETE FROM Parent WHERE parent_id = ?';
        const values = [parentId];

        // Execute the query to delete the parent
        connection.query(query, values, (err, results) => {
            if (err) {
                // If there's an error, return a 500 status code with the error message
                return res.status(500).json({ message: 'Error deleting parent', error: err });
            }

            if (results.affectedRows === 0) {
                // If no rows were affected, the parent ID doesn't exist
                return res.status(404).json({ message: 'Parent not found' });
            }

            // If successful, return a 200 status code with a success message
            return res.status(200).json({ message: 'Parent deleted successfully' });
        });
    } catch (error) {
        // If there's an unexpected error, return a 500 status code with the error details
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
};
//--------------------------------student----------------------------------------------

// const handleGetStudent = (req, res) => {
//     try {
//         let query = 'SELECT * FROM Student';
//         // Execute the query to fetch all users from the database
//         connection.query(query, (err, results, fields) => {
//             if (err) {
//                 // If there's an error, return a 501 status code with the error message
//                 return res.status(501).json([{ "Error": err.sqlMessage }]);
//             }
//             // Extract column names from the fields object
//             const columnNames = fields.map(field => field.name);
//             // If successful, return a 200 status code with the list of users and column names
//             return res.status(200).json({ results });
//         });
//     } catch (error) {
//         // If there's an unexpected error, return a 501 status code with the error details
//         return res.status(501).json([{ "Error Name": error.name, "Error Message": error.message }]);
//     }
// };

const handleGetStudent = (req, res) => {
    try {
        // Extract query parameters for pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10

        // Calculate the offset for SQL query
        const offset = (page - 1) * limit;

        // Query to fetch paginated students along with total count
        let query = `SELECT SQL_CALC_FOUND_ROWS * FROM Student LIMIT ?, ?;
                     SELECT FOUND_ROWS() as total;`;

        // Execute the query with pagination parameters
        connection.query(query, [offset, limit], (err, results) => {
            if (err) {
                // If there's an error, return a 501 status code with the error message
                return res.status(501).json([{ "Error": err.sqlMessage }]);
            }

            // Extract results from the first query
            const students = results[0];

            // Extract total count from the second query
            const totalCount = results[1][0].total;

            // If successful, return a 200 status code with paginated results and metadata
            return res.status(200).json({
                students,
                totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit)
            });
        });
    } catch (error) {
        // If there's an unexpected error, return a 501 status code with the error details
        return res.status(501).json([{ "Error Name": error.name, "Error Message": error.message }]);
    }
};

const handleAddNewStudent = (req, res) => {
    try {
        // Execute Multer middleware to handle file upload
        upload(req, res, (err) => {
            if (err) {
                // If there's an error uploading the image, return a 400 status code with the error message
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }

            // Extract user data from the request body
            const { student_name,student_age,parent_id,student_address } = req.body;
            // const image = req.file ? req.file.buffer : null;

            // Validate user input (optional)
            if (!student_name || !student_age || !parent_id || !student_address) {
                return res.status(400).json({ message: 'Studentname,age,and address are required fields' });
            }

            // Construct the SQL query to insert the new user into the database
            const query = 'INSERT INTO Student (student_name, student_age, parent_id, student_address) VALUES (?, ?, ?, ?)';
            const values = [student_name, student_age, parent_id, student_address];

            // Execute the query to insert the new user
            connection.query(query, values, (err, results) => {
                if (err) {
                    // If there's an error, return a 500 status code with the error message
                    return res.status(500).json({ message: 'Error inserting user', error: err });
                }
                // If successful, return a 201 status code with a success message
                return res.status(201).json({ message: 'User inserted successfully', userId: results.insertId });
            });
        });
    } catch (error) {
        // If there's an unexpected error, return a 500 status code with the error details
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
};


const handleDeleteStudent = (req, res) => {
    try {
        // Extract student ID from the request parameters
        const studentId = req.params.id;


        // Construct the SQL query to delete the student from the database
        const query = 'DELETE FROM Student WHERE student_id = ?';
        const values = [studentId];

        // Execute the query to delete the student
        connection.query(query, values, (err, results) => {
            if (err) {
                // If there's an error, return a 500 status code with the error message
                return res.status(500).json({ message: 'Error deleting student', error: err });
            }

            if (results.affectedRows === 0) {
                // If no rows were affected, the student ID doesn't exist
                return res.status(404).json({ message: 'Student not found' });
            }

            // If successful, return a 200 status code with a success message
            return res.status(200).json({ message: 'Student deleted successfully' });
        });
    } catch (error) {
        // If there's an unexpected error, return a 500 status code with the error details
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
};


const handleEditStudent = (req, res) => {
    try {
        // Extract data from the request body
        const { student_name, student_age, parent_id, student_address } = req.body;
        console.log("Student details ==>",student_name,student_age,parent_id,student_address)
        const studentId = req.params.id;


        // Update the SQL query to include the image (if uploaded)
        let query;
        let values;

        if (studentId) {
            query = `
                UPDATE Student 
                SET student_name = ?, student_age = ?, parent_id = ?, student_address = ?
                WHERE student_id = ?
            `;
            values = [student_name, student_age, parent_id, student_address, studentId];
        } else {
            query = `
                UPDATE Student 
                SET student_name = ?, student_age = ?, parent_id = ?, student_address = ?
                WHERE student_id = ?
            `;
            values = [student_name, student_age, parent_id, student_address, studentId];
        }

        // Execute the query to update the student
        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Error updating student:', err);
                return res.status(500).json({ message: 'Error updating student', error: err });
            }

            // Successful update
            return res.status(200).json({ message: 'Student updated successfully' });
        });
    } catch (error) {
        console.error('Internal Server Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    handleGetParent,
    handleAddNewParent,
    handleDeleteParent,
    handleEditParent,
    handleGetStudent,
    handleAddNewStudent,
    handleEditStudent,
    handleDeleteStudent
}