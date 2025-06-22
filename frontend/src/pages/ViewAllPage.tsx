import "../styles/viewAllPage.css";
import ProfileSideBar from "../components/ProfileSideBar";
import ViewAllContainer from "../components/ViewAllContainer";
import leave from "../assets/otherImages/leave.png";
const ViewAllPage = () => {
  return (
    <div className="body">
      <img id="leave_img" src={leave} alt="" />
      <div className="profile">
        <ProfileSideBar />
      </div>
      <div className="view-all-area">
        <ViewAllContainer />
      </div>
    </div>
  );
};

export default ViewAllPage;
