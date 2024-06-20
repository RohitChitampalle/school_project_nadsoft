import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const StudentList = () => {
  const [students, setStudents] = useState({ students: [], metadata: {} });
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_name: "",
    student_age: "",
    parent_id: "",
    student_address: "",
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // Default limit

  useEffect(() => {
    fetchStudents();
  }, [currentPage, limit]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8022/api/student/list`,
        {
          params: { page: currentPage, limit: limit },
        }
      );
      setStudents({
        students: response.data.students,
        metadata: {
          totalCount: response.data.totalCount,
          currentPage: currentPage,
          totalPages: response.data.totalPages,
        },
      });
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("student_name", newStudent.student_name);
      formData.append("student_age", newStudent.student_age);
      formData.append("parent_id", newStudent.parent_id);
      formData.append("student_address", newStudent.student_address);

      if (editingStudent) {
        await axios.put(
          `http://localhost:8022/api/student/update/${editingStudent.student_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:8022/api/student/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setShowForm(false);
      fetchStudents(); // Refresh the student list
      setNewStudent({
        student_name: "",
        student_age: "",
        parent_id: "",
        student_address: "",
      });
      setEditingStudent(null); // Reset editing student after submission
    } catch (error) {
      console.error("Error adding/updating student:", error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setNewStudent({
      student_name: student.student_name,
      student_age: student.student_age,
      parent_id: student.parent_id,
      student_address: student.student_address,
    });
    setShowForm(true); // Show the form for editing
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(
        `http://localhost:8022/api/student/delete/${studentId}`
      );
      fetchStudents(); // Refresh the student list after deletion
      closeConfirmation(); // Close the confirmation modal after deletion
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const openConfirmation = (studentId) => {
    setDeletingStudentId(studentId); // Set the student ID for deletion
    setShowConfirmation(true); // Show the confirmation modal
  };

  const closeConfirmation = () => {
    setShowConfirmation(false); // Close the confirmation modal
    setDeletingStudentId(null); // Reset deleting student ID
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <div className="container">
      <div className="my-3 d-flex justify-content-between align-items-center">
        <Link to="/" className="btn btn-primary">
          Back Home
        </Link>
        <h2 className="mb-0">Student List</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add New Student
        </button>
      </div>

      {showForm && (
        <div className="card mb-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>{editingStudent ? "Edit Student" : "Add Student"}</h3>
            <button
              className="btn btn-danger"
              onClick={() => {
                setShowForm(false);
                setEditingStudent(null);
              }}
            >
              Close
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="student_name">Student Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="student_name"
                  name="student_name"
                  value={newStudent.student_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="student_age">Student Age</label>
                <input
                  type="number"
                  className="form-control"
                  id="student_age"
                  name="student_age"
                  value={newStudent.student_age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="parent_id">Parent ID</label>
                <input
                  type="number"
                  className="form-control"
                  id="parent_id"
                  name="parent_id"
                  value={newStudent.parent_id}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="student_address">Student Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="student_address"
                  name="student_address"
                  value={newStudent.student_address}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-success mt-3">
                {editingStudent ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Parent ID</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.students.length > 0 ? (
              students.students.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.student_name}</td>
                  <td>{student.student_age}</td>
                  <td>{student.parent_id}</td>
                  <td>{student.student_address}</td>
                  <td>
                    <FaEdit
                      style={{ marginRight: "10px", cursor: "pointer" }}
                      onClick={() => handleEdit(student)}
                    />
                    <FaTrash
                      style={{ cursor: "pointer" }}
                      onClick={() => openConfirmation(student.student_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <span className="mr-2">Items per page:</span>
          <select
            className="form-control"
            style={{ width: "75px" }}
            value={limit}
            onChange={handleLimitChange}
          >
            <option value="2">2</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">{currentPage}</span>
              </li>
              <li
                className={`page-item ${
                  currentPage === students.metadata.totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <div
        className={`modal fade ${showConfirmation ? "show" : ""}`}
        style={{ display: showConfirmation ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="deleteConfirmationModal"
        aria-hidden={!showConfirmation}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteConfirmationModal">
                Confirm Delete
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={closeConfirmation}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete the student:{" "}
              {students.students &&
                students.students.find(
                  (student) => student.student_id === deletingStudentId
                )?.student_name}
              {/* Check if students.students is defined */}?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeConfirmation}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(deletingStudentId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
