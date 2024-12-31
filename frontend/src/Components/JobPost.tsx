import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../Store/Store";
import { clearAllJobErrors, postJob, resetJobSlice } from "../Store/Slices/jobSclice";
import { toast } from "react-toastify";
import { CiCircleInfo } from "react-icons/ci";


const JobPost = () => {
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [offers, setOffers] = useState("");
  const [jobNiche, setJobNiche] = useState("");
  const [salary, setSalary] = useState("");
  const [hiringMultipleCandidates, setHiringMultipleCandidates] = useState("");
  const [personalWebsite , setPersonalWebsite] = useState("")

  const nichesArray = [
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  const cities = [
    "All",
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Ahmedabad",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Bhopal",
    "Visakhapatnam",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra"
];


//   const { isAuthenticated, user } = useSelector((state:any) => state.user);
  const { loading, error, message } = useSelector((state:any) => state.jobs);
  const dispatch = useDispatch<AppDispatch>();

  const handlePostJob = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("jobType", jobType);
    formData.append("location", location);
    formData.append("companyName", companyName);
    formData.append("introduction", introduction);
    formData.append("responsibilities", responsibilities);
    formData.append("qualifications", qualifications);
    offers && formData.append("offers", offers);
    formData.append("jobNiche", jobNiche);
    formData.append("salary", salary);
    hiringMultipleCandidates &&
      formData.append("hiringMultipleCandidates", hiringMultipleCandidates);
    personalWebsite && 
      formData.append("personalWebsite",personalWebsite)


    dispatch(postJob(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
    }
  }, [dispatch, error, loading, message]);

  return (
    <div className="account_components">
      <h3>Post A Job</h3>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job Title"
        />
      </div>
      <div>
        <label>Job Type</label>
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="">Select Job Type</option>
          <option value="FullTime">Full-time</option>
          <option value="PartTime">Part-time</option>
        </select>
      </div>
      <div>
        <label>Location (City)</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Job Type</option>
          {cities.map((element) => {
            return <option value={element}>{element}</option>;
          })}
        </select>
      </div>
      <div>
        <label>Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company Name"
        />
      </div>
      <div>
        <label>Company/Job Introduction</label>
        <textarea
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          placeholder="Company / Job Introduction"
          rows={7}
        />
      </div>
      <div>
        <label>Responsibilities</label>
        <textarea
          value={responsibilities}
          onChange={(e) => setResponsibilities(e.target.value)}
          placeholder="Job Responsibilities"
          rows={7}
        />
      </div>
      <div>
        <label>Qualifications</label>
        <textarea
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          placeholder="Required Qualifications For Job"
          rows={7}
        />
      </div>
      <div>
        <div className="label-infoTag-wrapper">
          <label>What We Offer</label>
          <span>
            <CiCircleInfo /> Optional
          </span>
        </div>
        <textarea
          value={offers}
          onChange={(e) => setOffers(e.target.value)}
          placeholder="What are we offering in return!"
          rows={7}
        />
      </div>
      <div>
        <label>Job Niche</label>
        <select value={jobNiche} onChange={(e) => setJobNiche(e.target.value)}>
          <option value="">Select Job Niche</option>
          {nichesArray.map((element) => {
            return <option value={element}>{element}</option>;
          })}
        </select>
      </div>
      <div>
        <label>Salary</label>
        <input
          type="text"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="50000 - 800000"
        />
      </div>
      <div>
        <div className="label-infoTag-wrapper">
          <label>Hiring Multiple Candidates?</label>
          <span>
            <CiCircleInfo /> Optional
          </span>
        </div>
        <select
          value={hiringMultipleCandidates}
          onChange={(e) => setHiringMultipleCandidates(e.target.value)}
        >
          <option value="">Hiring Multiple Candidates?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div>
        <div className="label-infoTag-wrapper">
          <label>Personal Website Name</label>
          <span>
            <CiCircleInfo /> Optional
          </span>
        </div>
        <input
          type="text"
          value={personalWebsite}
          onChange={(e) => setPersonalWebsite(e.target.value)}
          placeholder="Peronsal Website"
        />
      </div>
      <div>
        <div className="label-infoTag-wrapper">
          <label>Personal Website Link (URL)</label>
          <span>
            <CiCircleInfo /> Optional
          </span>
        </div>
       
      </div>
      <div>
        <button
          style={{ margin: "0 auto" }}
          className="btn"
          onClick={handlePostJob}
          disabled={loading}
        >
          Post Job
        </button>
      </div>
    </div>
  );
};

export default JobPost;