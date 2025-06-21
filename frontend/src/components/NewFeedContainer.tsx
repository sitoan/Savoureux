import "../styles/newFeedContainer.css";
import NewFeed from "./NewFeed";
import NewFeedSideBar from "./NewFeedSideBar";
const NewFeedContainer = () => {
  return (
    <div id="container">
      <div id="newFeed">
        <NewFeed />
      </div>
      <div id="newFeedSideBar">{/* <NewFeedSideBar /> */}</div>
    </div>
  );
};

export default NewFeedContainer;
