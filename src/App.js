import { Home } from "./Pages/Home";
import { RepoDetails } from "./Components/RepoDetails"
import { Routes, Route} from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
      <Route path ="/" element={<Home/>}/>
      <Route path = "/repo_details" element = {<RepoDetails/>}/>
    </Routes>
    </>
    
  );
}

export default App;
