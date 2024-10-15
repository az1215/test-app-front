import { FC } from "react";
import Main from "./componenets/Main";
import SignIn from "./componenets/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Info from "./componenets/Info";
import UpdatePassword from "./componenets/UpdatePassword";
import AtndRegist from "./componenets/attendance/AtndRegist";
import PatternRegist from "./componenets/PatternRegist";
import AtndAdminMain from "./componenets/attendance";
import AtndApprovalDetail from "./componenets/attendance/AtndApprovalDetail";
import SkillSheetMain from "./componenets/skillsheet";
import { lazy } from "react";

// const AtndRegist = lazy(() => import("./componenets/AtndRegist"));
// const PatternRegist = lazy(() => import("./componenets/PatternRegist"));

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/login`} Component={SignIn} />
        <Route path={`/login/updatePassword`} Component={UpdatePassword} />
        <Route path={`/`} Component={Main}>
          <Route index Component={Info} />
          <Route path="/atndRegist" Component={AtndRegist} />
          <Route path="/patternRegist" Component={PatternRegist} />
          <Route path="/atndAdmin" Component={AtndAdminMain} />
          <Route path="/atndAdmin/unapproved" Component={AtndApprovalDetail} />
          <Route path="/skillsheet" Component={SkillSheetMain} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
