import React from "react";
import { Link } from "react-router-dom"; // If using React Router
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        {/* Student Information Tile */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Student Information</h5>
              <p className="card-text">View and manage student records.</p>
              <Link to="/students" className="btn btn-primary">
                Go to Students
              </Link>
            </div>
          </div>
        </div>

        {/* Parent Information Tile */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Parent Information</h5>
              <p className="card-text">View and manage parent records.</p>
              <Link to="/parents" className="btn btn-primary">
                Go to Parents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
