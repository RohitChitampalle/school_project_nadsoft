import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ParentList = () => {
  const [parents, setParents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newParent, setNewParent] = useState({
    parent_name: "",
    parent_id: "",
  });
  const [editingParent, setEditingParent] = useState(null); // Track the parent being edited
  const [showConfirmation, setShowConfirmation] = useState(false); // State for delete confirmation modal
  const [deletingParentId, setDeletingParentId] = useState(null); // Track which parent to delete
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [limit, setLimit] = useState(10); // Items per page

  useEffect(() => {
    fetchParents();
  }, [currentPage, limit]);

  const fetchParents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8022/api/parent/list",
        {
          params: { page: currentPage, limit: limit },
        }
      );
      setParents(response.data.parents);
    } catch (error) {
      console.error("Error fetching parents:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewParent({ ...newParent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("parent_name", newParent.parent_name);
      formData.append("parent_id", newParent.parent_id);

      if (editingParent) {
        await axios.put(
          `http://localhost:8022/api/parent/update/${editingParent.parent_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:8022/api/parent/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setShowForm(false);
      fetchParents(); // Refresh the parent list
      setNewParent({ parent_name: "", parent_id: "" });
      setEditingParent(null); // Reset editing parent after submission
    } catch (error) {
      console.error("Error adding/updating parent:", error);
    }
  };

  const handleEdit = (parent) => {
    setEditingParent(parent);
    setNewParent({
      parent_name: parent.parent_name,
      parent_id: parent.parent_id,
    });
    setShowForm(true); // Show the form for editing
  };

  const handleDelete = async (parentId) => {
    try {
      await axios.delete(`http://localhost:8022/api/parent/delete/${parentId}`);
      fetchParents(); // Refresh the parent list after deletion
      closeConfirmation(); // Close the confirmation modal after deletion
    } catch (error) {
      console.error("Error deleting parent:", error);
    }
  };

  const openConfirmation = (parentId) => {
    setDeletingParentId(parentId); // Set the parent ID for deletion
    setShowConfirmation(true); // Show the confirmation modal
  };

  const closeConfirmation = () => {
    setShowConfirmation(false); // Close the confirmation modal
    setDeletingParentId(null); // Reset deleting parent ID
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
        <h2 className="mb-0">Parent Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add New Parent
        </button>
      </div>

      {showForm && (
        <div className="card mb-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>{editingParent ? "Edit Parent" : "Add Parent"}</h3>
            <button
              className="btn btn-danger"
              onClick={() => {
                setShowForm(false);
                setEditingParent(null);
              }}
            >
              Close
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="parent_name">Parent Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="parent_name"
                  name="parent_name"
                  value={newParent.parent_name}
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
                  value={newParent.parent_id}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-success mt-3">
                {editingParent ? "Update" : "Submit"}
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
              <th>ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent) => (
              <tr key={parent.parent_id}>
                <td>{parent.parent_name}</td>
                <td>{parent.parent_id}</td>
                <td>
                  <FaEdit
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => handleEdit(parent)}
                  />
                  <FaTrash
                    style={{ cursor: "pointer" }}
                    onClick={() => openConfirmation(parent.parent_id)}
                  />
                </td>
              </tr>
            ))}
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
                  currentPage * limit >= parents.length ? "disabled" : ""
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
              Are you sure you want to delete the parent:{" "}
              {
                parents.find((parent) => parent.parent_id === deletingParentId)
                  ?.parent_name
              }
              ?
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
                onClick={() => handleDelete(deletingParentId)}
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

export default ParentList;
