import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useAppDispatch } from "../store/redux/store";
import { useEffect } from "react";
import { checkAuthStatus } from "./features/auth/authactions";
import AppRoutes from "./routes/Approutes";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
