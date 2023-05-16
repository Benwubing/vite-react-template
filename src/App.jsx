import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Home from "./pages/queue/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import JoinQueue from "./pages/queue/JoinQueue";
import LeaveQueue from "./pages/leave/LeaveQueue";
import QueueDisplay from "./pages/queue/QueueDisplay";
import ViewQueue from "./pages/queue/ViewQueue";
import { Grid } from "semantic-ui-react";
import LandingPage from "./pages/landing/LandingPage";
import PreviewQueueDisplay from "./pages/queue/PreviewQueueDisplay";
import ProfilePage from "./pages/profiles/ProfilePage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Grid columns={2} centered>
          <Grid.Column mobile={16} computer={16}> 
            <Routes>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/leave" element={<LeaveQueue />}></Route>
               <Route path="/preview-display" element={<PreviewQueueDisplay />}></Route>
              <Route path="/join/:id/:hash" element={<JoinQueue />}></Route>
              <Route path="/join/:id/:hash/:group" element={<JoinQueue />}></Route>
              <Route path="/display/:id" element={<QueueDisplay />}></Route>
              <Route path="/view/:id" element={<ViewQueue />}></Route>
               <Route path="/profile" element={<ProfilePage />}></Route>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/" element={<LandingPage />}></Route>
            </Routes>
        </Grid.Column>
        </Grid>
       
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
