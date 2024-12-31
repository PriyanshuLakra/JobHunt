import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../Store/Store";
import { clearAllApplicationErrors, deleteApplication, fetchJobSeekerApplications, resetApplicationSlice } from "../Store/Slices/applicationSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Spinner } from "./Spinner";
import { Link } from "react-router-dom";

const MyApplications = () => {
  const { user} = useSelector((state:any) => state.user);
  const { applications, loading, error, message} = useSelector((state: any) => {
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
  });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchJobSeekerApplications());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
      dispatch(fetchJobSeekerApplications());
    }
  }, [dispatch, error, message]);

  const handleDeleteApplication = (id:any) => {
    dispatch(deleteApplication(id));
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : applications && applications.length <= 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          You have not applied for any job.
        </h1>
      ) : (
        <>
          <div className="account_components">
            <h3>My Application For Jobs</h3>
            <div className="applications_container">
              {applications.map((element:any) => {
                return (
                  <div className="card" key={element.id}>
                    <p className="sub-sec">
                      <span>Job Title: </span> {element.jobInfo.title}
                    </p>
                    <p className="sub-sec">
                      <span>Name</span> {element.name}
                    </p>
                    <p className="sub-sec">
                      <span>Email</span> {user.email}
                    </p>
                    <p className="sub-sec">
                      <span>Phone: </span> {}
                    </p>
                    <p className="sub-sec">
                      <span>Address: </span> {element.address}
                    </p>
                    <p className="sub-sec">
                      <span>Coverletter: </span>
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
                          element.resume?.url
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

export default MyApplications;