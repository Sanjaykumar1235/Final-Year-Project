"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  InputAdornment,
  Avatar,
  Fade,
  Zoom,
  Tooltip,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import EmailIcon from "@mui/icons-material/Email"
import VideocamIcon from "@mui/icons-material/Videocam"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import LockIcon from "@mui/icons-material/Lock"
import PersonIcon from "@mui/icons-material/Person"
import AddIcon from "@mui/icons-material/Add"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import TrackChangesIcon from "@mui/icons-material/TrackChanges"
import SettingsIcon from "@mui/icons-material/Settings"
import ScheduleIcon from "@mui/icons-material/Schedule"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import SendIcon from "@mui/icons-material/Send"
import DoneIcon from "@mui/icons-material/Done"
import PhoneIcon from "@mui/icons-material/Phone"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"

const CreateMeetingPage = () => {
  const theme = useTheme()
  const [form, setForm] = useState({
    agenda: "",
    duration: "",
    password: "",
    schedule_for: "",
    trackingSource: "",
   
    senderPhoneNumber: "+918925186242", 
  })

  const [attendees, setAttendees] = useState([{ name: "", email: "", phone: "" }])
  const [meetingInfo, setMeetingInfo] = useState(null)
  const [inviteLinks, setInviteLinks] = useState([])
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailStatus, setEmailStatus] = useState({ open: false, message: "", severity: "success" })
  const [whatsappStatus, setWhatsappStatus] = useState({ open: false, message: "", severity: "success" })
  const [tabValue, setTabValue] = useState(0)
  const [copied, setCopied] = useState(null)
  const [animateForm, setAnimateForm] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorDetails, setErrorDetails] = useState({ title: "", message: "", details: "" })
  const [whatsappMethod, setWhatsappMethod] = useState("direct")


  const logError = (context, error) => {
    console.error(`[${context}] Error:`, error)
    if (error.response) {
      console.error(`[${context}] Response data:`, error.response.data)
      console.error(`[${context}] Response status:`, error.response.status)
    }
  }

  useEffect(() => {
    setAnimateForm(true)
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleAttendeeChange = (index, field, value) => {
    const updated = [...attendees]
    updated[index][field] = value
    setAttendees(updated)
  }

  const addAttendee = () => {
    setAttendees([...attendees, { name: "", email: "", phone: "" }])
  }

  const removeAttendee = (index) => {
    if (attendees.length > 1) {
      const updated = [...attendees]
      updated.splice(index, 1)
      setAttendees(updated)
    }
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatEmailBody = (name, joinUrl) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Zoom Meeting Invitation</h2>
      <p>Hello ${name},</p>
      <p>You are invited to a Zoom meeting.</p>
      <p><strong>Agenda:</strong> ${form.agenda}</p>
      <p><strong>Duration:</strong> ${form.duration} minutes</p>
      <p><strong>MeetingUuid:</strong> ${form.MeetingUuid}</p>
      <p><strong>MeetingUuid:</strong> ${form.MeetingId}</p>

       <p><strong>Password:</strong> ${meetingInfo?.password || form.password}</p>
      <p><strong>Join URL:</strong> <a href="${joinUrl}">${joinUrl}</a></p>
    </div>
  `

 
  const sendWhatsAppMessageDirect = async (phone, name, joinUrl) => {
    if (!phone || !phone.trim()) {
      return { success: false, message: "No phone number provided" }
    }

    try {

      let formattedPhone = phone.replace(/\D/g, "")
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+" + formattedPhone
      }

      const messageText = `Hello ${name},\n\nYou're invited to attend a Zoom meeting.\n\nAgenda: ${form.agenda}\nDuration: ${form.duration} minutes\nPassword: ${meetingInfo?.password || form.password}\n\nJoin URL: ${joinUrl}\n\nPlease join on time.`

    
      const payload = {
        credentialId: "278c377f-74dc-4fa5-a00a-8567b384bd33",
        data: {
          method: "POST",
          url: "https://api.wassenger.com/v1/messages",
          headers: {
            Token:"1e5d07272de5c2f16c08a2883a2bcba69006f085a53ab02f498c3c3bab583b01ee891efe0e3cde5e",
            "Content-Type": "application/json",
          },
          data: {
            device:"68243c25fecfcb38a4025762",
            phone: formattedPhone,
            message: messageText,
          },
        },
      }

      console.log("Sending WhatsApp with payload:", JSON.stringify(payload, null, 2))

      const res = await fetch("http://localhost:9000/wassenger/message/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      console.log("WhatsApp API response:", result)

      if (result.message === "wassenger message create executed successfully" || (result.result && result.result.id)) {
        return { success: true, message: `WhatsApp message sent to ${formattedPhone}` }
      } else {
        console.error("WhatsApp error:", result)

        
        setErrorDetails({
          title: "WhatsApp Sending Error",
          message: `Failed to send WhatsApp to ${formattedPhone}`,
          details: JSON.stringify(result, null, 2),
        })
        setErrorDialogOpen(true)

        return {
          success: false,
          message: `Failed to send WhatsApp to ${formattedPhone}: ${result.message || "API error"}`,
        }
      }
    } catch (err) {
      console.error("WhatsApp sending error:", err)

      setErrorDetails({
        title: "WhatsApp Sending Error",
        message: `Error sending WhatsApp to ${phone}`,
        details: err.message || "Unknown error",
      })
      setErrorDialogOpen(true)

      return { success: false, message: `Error sending WhatsApp to ${phone}: ${err.message}` }
    }
  }

 
  const sendWhatsAppMessageAlternative = async (phone, name, joinUrl) => {
    if (!phone || !phone.trim()) {
      return { success: false, message: "No phone number provided" }
    }

    try {

      let formattedPhone = phone.replace(/\D/g, "")
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+" + formattedPhone
      }

      const messageText = `Hello ${name},\n\nYou're invited to attend a Zoom meeting.\n\nAgenda: ${form.agenda}\nDuration: ${form.duration} minutes\nPassword: ${meetingInfo?.password || form.password}\n\nJoin URL: ${joinUrl}\n\nPlease join on time.`

     
      const payload = {
        phone: formattedPhone,
        message: messageText,
        meetingDetails: {
          agenda: form.agenda,
          duration: form.duration,
          password: meetingInfo?.password || form.password,
          joinUrl: joinUrl,
        },
      }

      console.log("Sending WhatsApp with alternative method:", JSON.stringify(payload, null, 2))

    
      const res = await fetch("http://localhost:9000/custom-whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      console.log("Alternative WhatsApp API response:", result)

      if (result.success) {
        return { success: true, message: `WhatsApp message sent to ${formattedPhone}` }
      } else {
        console.error("Alternative WhatsApp error:", result)
        return {
          success: false,
          message: `Failed to send WhatsApp to ${formattedPhone}: ${result.message || "API error"}`,
        }
      }
    } catch (err) {
      console.error("Alternative WhatsApp sending error:", err)
      return { success: false, message: `Error sending WhatsApp to ${phone}: ${err.message}` }
    }
  }

 
  const sendWhatsAppMessage = async (phone, name, joinUrl) => {
    if (whatsappMethod === "direct") {
      return sendWhatsAppMessageDirect(phone, name, joinUrl)
    } else {
      return sendWhatsAppMessageAlternative(phone, name, joinUrl)
    }
  }

  const sendEmailToAttendee = async (email, name, joinUrl) => {
    setLoading(true)
    try {
      const emailPayload = {
        to: email,
        subject: `Invitation: ${form.agenda}`,
        body: formatEmailBody(name, joinUrl),
      }

      const res = await fetch("http://localhost:9000/email/sends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload),
      })

      const result = await res.json()
      setLoading(false)

      if (result.success) {
        setEmailStatus({ open: true, message: `Email sent to ${email}`, severity: "success" })
        return true
      } else {
        setEmailStatus({ open: true, message: `Failed to send email to ${email}`, severity: "error" })
        return false
      }
    } catch (err) {
      console.error("Email sending error:", err)
      setLoading(false)
      setEmailStatus({ open: true, message: `Error sending to ${email}`, severity: "error" })
      return false
    }
  }

  const sendAllInvites = async () => {
    setLoading(true)
    let emailSuccessCount = 0,
      emailFailCount = 0
    let whatsappSuccessCount = 0,
      whatsappFailCount = 0

    for (const inv of inviteLinks) {
      if (inv.email) {
        const emailSuccess = await sendEmailToAttendee(inv.email, inv.name, inv.join_url)
        emailSuccess ? emailSuccessCount++ : emailFailCount++
      }

      if (inv.phone) {
        const whatsappResult = await sendWhatsAppMessage(inv.phone, inv.name, inv.join_url)
        if (whatsappResult.success) {
          whatsappSuccessCount++
        } else {
          whatsappFailCount++
        }
      }
    }

    setLoading(false)

    setEmailStatus({
      open: true,
      message: `${emailSuccessCount} emails sent, ${emailFailCount} failed`,
      severity: emailFailCount === 0 ? "success" : "warning",
    })

 
    setWhatsappStatus({
      open: true,
      message: `${whatsappSuccessCount} WhatsApp messages sent, ${whatsappFailCount} failed`,
      severity: whatsappFailCount === 0 ? "success" : "warning",
    })
  }

  const handleSubmit = async () => {
    setStatus("")
    setLoading(true)

    const payload = {
      credentialId: "df9fe6bb-99f9-47c8-8dee-216ced359556",
      data: {
        userId: "zy7OTJvFT8KkVfTCB04TwA",
        data: {
          agenda: form.agenda,
          duration: Number(form.duration),
          password: form.password,
          schedule_for: form.schedule_for,
          tracking_fields: [{ field: "source", value: form.trackingSource }],
          attendees: attendees.filter((a) => a.name && (a.email || a.phone)),
        },
      },
    }

    try {
      const res = await fetch("http://localhost:9000/zoom/meeting/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      console.log("Zoom API Response:", result)

      setLoading(false)

      const meeting = result.result?.response || result.response || result.meeting

      if (res.ok && meeting) {
        setMeetingInfo({
          id: meeting.id,
          start_url: meeting.start_url,
          join_url: meeting.join_url,
          password: meeting.password,
          
        })
        setForm((prev) => ({
          ...prev,
          MeetingUuid: meeting.uuid,
          MeetingId: meeting.id,
        }));

        const meetingInvitees = meeting.meeting_invitees || attendees

        setInviteLinks(
          meetingInvitees.map((a) => ({
            name: a.name,
            email: a.email,
            phone: a.phone,
            join_url: meeting.join_url + `&uname=${encodeURIComponent(a.name)}`,
          })),
        )

        setStatus("success")
        setTabValue(1)
        setEmailStatus({ open: true, message: "Meeting created successfully!", severity: "success" })
      } else {
        console.error("Zoom meeting creation failed:", result)
        setStatus("error")
        setEmailStatus({ open: true, message: "Failed to create meeting", severity: "error" })
      }
    } catch (err) {
      console.error("Meeting creation error:", err)
      console.log("Payload that caused error:", payload)
      setStatus("error")
      setEmailStatus({ open: true, message: "Error creating meeting", severity: "error" })
      setLoading(false)
    }
  }


  const sendWhatsAppToAttendee = async (phone, name, joinUrl) => {
    setLoading(true)
    try {
      const result = await sendWhatsAppMessage(phone, name, joinUrl)
      setLoading(false)
      setWhatsappStatus({
        open: true,
        message: result.message,
        severity: result.success ? "success" : "error",
      })
    } catch (error) {
      setLoading(false)
      setWhatsappStatus({
        open: true,
        message: `Error: ${error.message || "Unknown error occurred"}`,
        severity: "error",
      })
    }
  }

  const handleCloseSnackbar = () => {
    setEmailStatus({ ...emailStatus, open: false })
    setWhatsappStatus({ ...whatsappStatus, open: false })
  }

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false)
  }

  const gradientBg = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)"
  const cardGradientBg = "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)"
  const buttonGradient = "linear-gradient(to right,rgb(235, 9, 163), #8b5cf6, #d946ef)"
  const buttonHoverGradient = "linear-gradient(to right, #4f46e5, #7c3aed, #c026d3)"
  const tabsGradientBg = "linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))"

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Zoom in={animateForm} timeout={500}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -20,
              left: -20,
              right: -20,
              bottom: -20,
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
              zIndex: -1,
              borderRadius: "50%",
            },
          }}
        >
          <Box
            sx={{
              height: 64,
              width: 64,
              borderRadius: "20%",
              background: gradientBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)",
                top: 0,
                left: 0,
              },
            }}
          >
            <VideocamIcon sx={{ color: "white", fontSize: 32 }} />
          </Box>
          <Box>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                background: gradientBg,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0.5,
              }}
            >
              Create Zoom Meeting
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.8 }}>
              Schedule a new meeting and invite attendees via email and WhatsApp
            </Typography>
          </Box>
        </Box>
      </Zoom>

      {status === "success" && (
        <Fade in={true} timeout={500}>
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              "& .MuiAlert-icon": { fontSize: 24 },
              py: 1.5,
              border: "1px solid",
              borderColor: "success.light",
            }}
            icon={<CheckCircleIcon fontSize="inherit" />}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              Meeting created successfully!
            </Typography>
          </Alert>
        </Fade>
      )}

      {status === "error" && (
        <Fade in={true} timeout={500}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              "& .MuiAlert-icon": { fontSize: 24 },
              py: 1.5,
              border: "1px solid",
              borderColor: "error.light",
            }}
            icon={<ErrorIcon fontSize="inherit" />}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              Failed to create meeting. Please try again.
            </Typography>
          </Alert>
        </Fade>
      )}

      <Paper
        elevation={8}
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            background: tabsGradientBg,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                py: 2.5,
                fontSize: "1rem",
                fontWeight: "medium",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(99, 102, 241, 0.05)",
                },
              },
              "& .Mui-selected": {
                fontWeight: "bold",
                color: "#6366f1 !important",
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 1.5,
                background: gradientBg,
              },
            }}
          >
            <Tab label="Meeting Details" icon={<ScheduleIcon />} iconPosition="start" sx={{ textTransform: "none" }} />
            <Tab
              label="Meeting Results"
              icon={<EmailIcon />}
              iconPosition="start"
              disabled={!meetingInfo}
              sx={{ textTransform: "none" }}
            />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Fade in={tabValue === 0} timeout={500}>
            <Box>
              <Card
                sx={{
                  borderRadius: 0,
                  boxShadow: "none",
                  background: cardGradientBg,
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          height: 40,
                          width: 40,
                          borderRadius: "12px",
                          background: gradientBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.3)",
                        }}
                      >
                        <SettingsIcon sx={{ color: "white", fontSize: 20 }} />
                      </Box>
                      <Typography variant="h5" fontWeight="bold">
                        Meeting Information
                      </Typography>
                    </Box>
                  }
                  subheader={
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, ml: 6.5 }}>
                      Enter the details for your Zoom meeting
                    </Typography>
                  }
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    pb: 2,
                    pt: 3,
                    px: 3,
                  }}
                />
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Agenda"
                        value={form.agenda}
                        onChange={handleInputChange("agenda")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.primary.main,
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderWidth: 2,
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Duration (minutes)"
                        type="number"
                        value={form.duration}
                        onChange={handleInputChange("duration")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Meeting Password"
                        value={form.password}
                        onChange={handleInputChange("password")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Schedule For (Email)"
                        value={form.schedule_for}
                        onChange={handleInputChange("schedule_for")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Tracking Source"
                        value={form.trackingSource}
                        onChange={handleInputChange("trackingSource")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TrackChangesIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Divider
                    sx={{
                      my: 4,
                      "&::before, &::after": {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <Chip
                      label="Attendees"
                      icon={<GroupAddIcon />}
                      sx={{
                        background: gradientBg,
                        color: "white",
                        fontWeight: "bold",
                        "& .MuiChip-icon": { color: "white" },
                      }}
                    />
                  </Divider>

                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
                        <GroupAddIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> Attendees
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormControl sx={{ minWidth: 200, mr: 2 }}>
                          <InputLabel id="whatsapp-method-label">WhatsApp Method</InputLabel>
                          <Select
                            labelId="whatsapp-method-label"
                            value={whatsappMethod}
                            onChange={(e) => setWhatsappMethod(e.target.value)}
                            size="small"
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="direct">Direct API</MenuItem>
                            <MenuItem value="alternative">Alternative Method</MenuItem>
                          </Select>
                        </FormControl>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={addAttendee}
                          size="medium"
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: "medium",
                            borderWidth: 2,
                            "&:hover": {
                              borderWidth: 2,
                            },
                          }}
                        >
                          Add Attendee
                        </Button>
                      </Box>
                    </Box>

                    {attendees.map((attendee, index) => (
                      <Paper
                        key={index}
                        elevation={3}
                        sx={{
                          p: 3,
                          mb: 2,
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)",
                            transform: "translateY(-2px)",
                          },
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          alignItems: { xs: "flex-start", md: "center" },
                          gap: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                          <Avatar
                            sx={{
                              width: 50,
                              height: 50,
                              background: gradientBg,
                              boxShadow: "0 4px 8px rgba(99, 102, 241, 0.25)",
                            }}
                          >
                            {attendee.name ? attendee.name.charAt(0).toUpperCase() : "A"}
                          </Avatar>
                        </Box>

                        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Name"
                              value={attendee.name}
                              onChange={(e) => handleAttendeeChange(index, "name", e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Email"
                              value={attendee.email}
                              onChange={(e) => handleAttendeeChange(index, "email", e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Phone"
                              value={attendee.phone}
                              onChange={(e) => handleAttendeeChange(index, "phone", e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PhoneIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", alignItems: "center", mt: { xs: 1, md: 0 } }}>
                          <Tooltip title="Remove Attendee">
                            <IconButton
                              onClick={() => removeAttendee(index)}
                              disabled={attendees.length === 1}
                              color="error"
                              sx={{
                                background: alpha(theme.palette.error.main, 0.1),
                                "&:hover": {
                                  background: alpha(theme.palette.error.main, 0.2),
                                },
                              }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>
                    ))}
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleSubmit}
                      disabled={loading || !form.agenda || !form.duration}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VideocamIcon />}
                      sx={{
                        background: buttonGradient,
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                        "&:hover": {
                          background: buttonHoverGradient,
                          boxShadow: "0 15px 20px -3px rgba(99, 102, 241, 0.4)",
                        },
                      }}
                    >
                      {loading ? "Creating Meeting..." : "Create Zoom Meeting"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        )}

        {tabValue === 1 && meetingInfo && (
          <Fade in={tabValue === 1} timeout={500}>
            <Box>
              <Card
                sx={{
                  borderRadius: 0,
                  boxShadow: "none",
                  background: cardGradientBg,
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          height: 40,
                          width: 40,
                          borderRadius: "12px",
                          background: gradientBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.3)",
                        }}
                      >
                        <VideocamIcon sx={{ color: "white", fontSize: 20 }} />
                      </Box>
                      <Typography variant="h5" fontWeight="bold">
                        Meeting Details
                      </Typography>
                    </Box>
                  }
                  subheader={
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, ml: 6.5 }}>
                      Your Zoom meeting has been created successfully
                    </Typography>
                  }
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    pb: 2,
                    pt: 3,
                    px: 3,
                  }}
                />
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          height: "100%",
                          background: "white",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mb: 3, display: "flex", alignItems: "center" }}
                        >
                          <SettingsIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> Meeting Information
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <CalendarTodayIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />{" "}
                              Agenda:
                            </Typography>
                            <Typography variant="body1">{form.agenda}</Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <AccessTimeIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />{" "}
                              Duration:
                            </Typography>
                            <Typography variant="body1">{form.duration} minutes</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <AccessTimeIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />{" "}
                              Meeting UUID:
                            </Typography>
                            <Typography variant="body1">{form.MeetingUuid}</Typography>
                          </Box>


                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <LockIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} /> Password:
                            </Typography>
                            <Typography variant="body1">{meetingInfo.password}</Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <TrackChangesIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />{" "}
                              Meeting ID:
                            </Typography>


                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="body1">{meetingInfo.id}</Typography>
                              <Tooltip title={copied === "id" ? "Copied!" : "Copy to clipboard"}>
                                <IconButton
                                  size="small"
                                  onClick={() => copyToClipboard(meetingInfo.id, "id")}
                                  sx={{ ml: 1 }}
                                >
                                  {copied === "id" ? (
                                    <DoneIcon fontSize="small" color="success" />
                                  ) : (
                                    <ContentCopyIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>

                          </Box>

                          <Divider sx={{ my: 1 }} />

                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <OpenInNewIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} /> Start
                              URL:
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <TextField
                                fullWidth
                                size="small"
                                value={meetingInfo.start_url}
                                InputProps={{
                                  readOnly: true,
                                  sx: { borderRadius: 2, fontSize: "0.875rem" },
                                }}
                              />
                              <Tooltip title={copied === "start" ? "Copied!" : "Copy to clipboard"}>
                                <IconButton
                                  size="small"
                                  onClick={() => copyToClipboard(meetingInfo.start_url, "start")}
                                  sx={{
                                    background: alpha(theme.palette.primary.main, 0.1),
                                    "&:hover": {
                                      background: alpha(theme.palette.primary.main, 0.2),
                                    },
                                  }}
                                >
                                  {copied === "start" ? (
                                    <DoneIcon fontSize="small" color="success" />
                                  ) : (
                                    <ContentCopyIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>

                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <OpenInNewIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} /> Join
                              URL:
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <TextField
                                fullWidth
                                size="small"
                                value={meetingInfo.join_url}
                                InputProps={{
                                  readOnly: true,
                                  sx: { borderRadius: 2, fontSize: "0.875rem" },
                                }}
                              />
                              <Tooltip title={copied === "join" ? "Copied!" : "Copy to clipboard"}>
                                <IconButton
                                  size="small"
                                  onClick={() => copyToClipboard(meetingInfo.join_url, "join")}
                                  sx={{
                                    background: alpha(theme.palette.primary.main, 0.1),
                                    "&:hover": {
                                      background: alpha(theme.palette.primary.main, 0.2),
                                    },
                                  }}
                                >
                                  {copied === "join" ? (
                                    <DoneIcon fontSize="small" color="success" />
                                  ) : (
                                    <ContentCopyIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                            <Button
                              variant="contained"
                              size="large"
                              startIcon={<VideocamIcon />}
                              onClick={() => window.open(meetingInfo.start_url, "_blank")}
                              sx={{
                                background: buttonGradient,
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                                "&:hover": {
                                  background: buttonHoverGradient,
                                  boxShadow: "0 15px 20px -3px rgba(99, 102, 241, 0.4)",
                                },
                              }}
                            >
                              Start Meeting Now
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          height: "100%",
                          background: "white",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
                            <GroupAddIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> Attendees
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                            onClick={sendAllInvites}
                            disabled={loading || inviteLinks.length === 0}
                            size="small"
                            sx={{
                              background: buttonGradient,
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: "medium",
                              boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.3)",
                              "&:hover": {
                                background: buttonHoverGradient,
                              },
                            }}
                          >
                            {loading ? "Sending..." : "Send All Invites"}
                          </Button>
                        </Box>

                        <Box sx={{ maxHeight: 400, overflow: "auto", pr: 1 }}>
                          {inviteLinks.length > 0 ? (
                            inviteLinks.map((inv, index) => (
                              <Paper
                                key={index}
                                elevation={2}
                                sx={{
                                  p: 2,
                                  mb: 2,
                                  borderRadius: 2,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                  },
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                  <Avatar
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      background: gradientBg,
                                      mr: 1.5,
                                    }}
                                  >
                                    {inv.name ? inv.name.charAt(0).toUpperCase() : "A"}
                                  </Avatar>
                                  <Typography variant="subtitle1" fontWeight="medium">
                                    {inv.name}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                  {inv.email && (
                                    <Box
                                      sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                    >
                                      <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <EmailIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                          {inv.email}
                                        </Typography>
                                      </Box>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={loading ? <CircularProgress size={16} /> : <EmailIcon />}
                                        onClick={() => sendEmailToAttendee(inv.email, inv.name, inv.join_url)}
                                        disabled={loading}
                                        sx={{
                                          borderRadius: 2,
                                          textTransform: "none",
                                          fontSize: "0.75rem",
                                          borderColor: theme.palette.primary.main,
                                          color: theme.palette.primary.main,
                                          "&:hover": {
                                            borderColor: theme.palette.primary.dark,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                          },
                                        }}
                                      >
                                        Send Email
                                      </Button>
                                    </Box>
                                  )}

                                  {inv.phone && (
                                    <Box
                                      sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                    >
                                      <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <WhatsAppIcon fontSize="small" sx={{ mr: 1, color: "#25D366" }} />
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                          {inv.phone}
                                        </Typography>
                                      </Box>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={loading ? <CircularProgress size={16} /> : <WhatsAppIcon />}
                                        onClick={() => sendWhatsAppToAttendee(inv.phone, inv.name, inv.join_url)}
                                        disabled={loading}
                                        sx={{
                                          borderRadius: 2,
                                          textTransform: "none",
                                          fontSize: "0.75rem",
                                          borderColor: "#25D366",
                                          color: "#25D366",
                                          "&:hover": {
                                            borderColor: "#128C7E",
                                            backgroundColor: alpha("#25D366", 0.05),
                                          },
                                        }}
                                      >
                                        Send WhatsApp
                                      </Button>
                                    </Box>
                                  )}

                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      value={inv.join_url}
                                      InputProps={{
                                        readOnly: true,
                                        sx: { borderRadius: 2, fontSize: "0.75rem" },
                                      }}
                                    />
                                    <Tooltip title={copied === `link-${index}` ? "Copied!" : "Copy to clipboard"}>
                                      <IconButton
                                        size="small"
                                        onClick={() => copyToClipboard(inv.join_url, `link-${index}`)}
                                        sx={{
                                          background: alpha(theme.palette.primary.main, 0.1),
                                          "&:hover": {
                                            background: alpha(theme.palette.primary.main, 0.2),
                                          },
                                        }}
                                      >
                                        {copied === `link-${index}` ? (
                                          <DoneIcon fontSize="small" color="success" />
                                        ) : (
                                          <ContentCopyIcon fontSize="small" />
                                        )}
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>
                              </Paper>
                            ))
                          ) : (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                              No attendees added to this meeting
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        )}
      </Paper>

      <Snackbar
        open={emailStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={emailStatus.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {emailStatus.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={whatsappStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={whatsappStatus.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {whatsappStatus.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ErrorIcon color="error" />
          {errorDetails.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>{errorDetails.message}</DialogContentText>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "grey.100",
              borderRadius: 2,
              maxHeight: 300,
              overflow: "auto",
              fontFamily: "monospace",
              fontSize: "0.875rem",
            }}
          >
            {errorDetails.details}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} variant="contained" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default CreateMeetingPage
