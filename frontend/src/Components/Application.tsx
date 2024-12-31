import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../Store/Store";
import { useEffect } from "react";
import { clearAllApplicationErrors, deleteApplication, fetchEmployerApplications, resetApplicationSlice } from "../Store/Slices/applicationSlice";
import { toast } from "react-toastify";
import { Spinner } from "./Spinner";
import { Link } from "react-router-dom";



const Applications = () => {
  const { applications, loading, error, message } = useSelector(
    (state: any) => {
      // Make sure jobInfo is an array before using .find()
      const mergedApplications = state.applications.applications.map((application: any) => {
        // Check if jobInfo is an array
        if (Array.isArray(state.applications.jobInfo)) {
          const job = state.applications.jobInfo.find(
            (job: any) => job.id === application.forWhichJobId
          );
          return {
            ...application,
            jobInfo: job || {}, // Attach jobInfo or an empty object if no match
          };
        } else {
          // If jobInfo is not an array, handle it as an object
          return {
            ...application,
            jobInfo: state.applications.jobInfo || {}, // Default to an empty object if not array
          };
        }
      });

      return {
        ...state.applications,
        applications: mergedApplications,
      };
    }
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
    dispatch(fetchEmployerApplications());
  }, [dispatch, error, message]);

  const handleDeleteApplication = (id:any) => {
    dispatch(deleteApplication(id));
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : applications && applications.length <= 0 ? (
        <h1>You have no applications from job seekers.</h1>
      ) : (
        <>
          <div className="account_components">
            <h3>Applications For Your Posted Jobs</h3>
            <div className="applications_container">
              {applications.map((element:any) => {
                return (
                  <div className="card" key={element.id}>
                    <p className="sub-sec">
                    <span>Job Title: </span> {element.jobInfo?.title || "N/A"}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Name: </span>{" "}
                      {element.name}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Email:</span>{" "}
                      {element.email}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Phone: </span>{" "}
                      {element.phone}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Address: </span>{" "}
                      {element.address}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's CoverLetter: </span>
                      <textarea
                        value={element.coverletter}
                        rows={5}
                        disabled
                      ></textarea>
                    </p>
                    <div className="btn-wrapper">
                      <button
                        className="outline_btn"
                        onClick={() => handleDeleteApplication(element.id)}
                      >
                        Delete Application
                      </button>
                      <Link
                        to={
                          element.resume && 
                          element.resume.url
                        }
                        className="btn"
                        target="_blank"
                      >
                        View Resume
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Applications;