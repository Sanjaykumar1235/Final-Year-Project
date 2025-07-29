// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import MeetingPage from "./pages/meeting";
import CreateMeetingPage from "./pages/CreateMeeting";
import SendMessagePage from "./pages/CreateSms";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/meetings" element={<MeetingPage />} />
        <Route path="/create-meeting" element={<CreateMeetingPage />} />
        <Route path="/send-sms" element={<SendMessagePage />} />





      </Routes>
    </Router>
  );
}

export default App;
