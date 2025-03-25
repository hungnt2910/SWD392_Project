import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import { VideoCall, CalendarToday, Person, Launch } from "@mui/icons-material"
import axios from "axios"
import { portserver } from '../../../utils/portserver';
import { jwtDecode } from "jwt-decode"
// Types
interface User {
  id: string
  username: string
  phone: string | null
  address: string | null
  email: string
  status: boolean
}

interface Staff {
  id: string
  username: string
  phone: string | null
  address: string | null
  email: string
  status: boolean
}

interface Meeting {
  id: string
  link: string
  createdAt: string
  user: User
  staff: Staff
}

const GGMeet = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [staffId, setStaffId] = useState<string>("")

  // Fetch all meetings
  const fetchAllMeetings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${portserver}/ggmeet`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setMeetings(response.data)
    } catch (error) {
      console.error("Error fetching meetings:", error)
    } finally {
      setLoading(false)
    }
  }


  const fetchMeetingLink = async (userId: string, staffId: string) => {
    try {
      const response = await axios.post(`${portserver}/ggmeet/getMeet`, { user_id: userId, staff_id: staffId }, {

        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Full API Response:", response.data); // Debugging
      if (typeof response.data !== "string") {
        console.error("Invalid link format:", response.data.link);
        return null;
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching meeting link:", error);
      return null;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setStaffId(parseInt(decoded.userId, 10).toString());
      } catch (error) {
        console.error("Error decoding token:", error);
      }
      fetchAllMeetings();
    }
  }, []);

  console.log("Staff ID:", staffId)


  const handleJoinMeeting = async (meeting: Meeting) => {
    if (!staffId) {
      console.error("Staff ID is missing.");
      return;
    }
    if (meeting.staff) {
      return
    }

    setSelectedMeeting(meeting);
    setOpenDialog(true);
  };

  console.log("Selected meeting:", selectedMeeting)

  const confirmJoinMeeting = async () => {
    if (!selectedMeeting) return;

    const userId = selectedMeeting.user.id;
    const link = await fetchMeetingLink(userId, staffId);
    console.log("Meeting link:", link); // Debug

    if (link) {
      window.open(
        link.startsWith("http") ? link : `https://${link}`,
        "_blank"
      );
    } else {
      console.error("Failed to retrieve meeting link.");
    }

    setOpenDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        <VideoCall sx={{ mr: 1, verticalAlign: "middle" }} />
        Staff Meeting Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upcoming Meetings ({meetings.length})
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {meetings.map((meeting) => (
              <Grid item xs={12} md={6} lg={6} key={meeting.id}>
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                        {meeting.user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="h6">{meeting.user.username}</Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ my: 1.5 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Person sx={{ mr: 1, fontSize: 20 }} />
                        {meeting.user.email}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
                        Created: {formatDate(meeting.createdAt)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                        <VideoCall sx={{ mr: 1, fontSize: 20 }} />
                        Meeting ID: {meeting.id}
                      </Typography>
                    </Box>

                    <Chip label="Google Meet" color="primary" size="small" icon={<Launch />} sx={{ mt: 1 }} />
                  </CardContent>

                  <CardActions>
                    {meeting.staff ? <></> : <><Button
                      variant="contained"
                      fullWidth
                      startIcon={<VideoCall />}
                      onClick={() => handleJoinMeeting(meeting)}
                      sx={{ borderRadius: 2, py: 1 }}
                    >
                      Join Meeting
                    </Button></>}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {meetings.length === 0 && (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6">No meetings scheduled</Typography>
              <Typography variant="body2" color="text.secondary">
                When customers schedule meetings, they will appear here
              </Typography>
            </Paper>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Join Meeting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you ready to join the meeting with {selectedMeeting?.user.username}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmJoinMeeting} variant="contained" autoFocus>
            Join Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default GGMeet

