import { Routes, Route } from "react-router-dom";
import FloatingTip from "@/components/FloatingTip";
import AutoResizeWindow from "./components/AutoResizeWindow";
import SettingsPage from "./pages/settings";
// import MouseEventsTest from "./components/test/MouseEventsTest";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AutoResizeWindow initialResize={false}>
            <FloatingTip />
          </AutoResizeWindow>
        }
      />
      <Route
        path="/settings"
        element={
          <AutoResizeWindow>
            <SettingsPage />
          </AutoResizeWindow>
        }
      />
      {/* <Route
        path="/test"
        element={
          <div className="w-full flex justify-center">
            <MouseEventsTest />
          </div>
        }
      /> */}
    </Routes>
  );
}

export default App;
