import React, { useEffect, useState } from "react";
import UserLogic from "../../src/common/user/UserLogic";
import AnnouncementLogic from "../../src/announcement/AnnouncementLogic";
import CustomDataGrid from "../../app/components/common/CustomDataGrid";
import { TextField, Button, Snackbar, Alert } from "@mui/material";

const AdminSetting = () => {
  const userLogic = new UserLogic();
  const announcementLogic = new AnnouncementLogic();

  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const fetchedAnnouncement = await announcementLogic.fetchAnnouncement();
        setAnnouncement(fetchedAnnouncement.content);
      } catch (error) {
        console.error("Error fetching announcement:", error);
      }
    };

    fetchAnnouncement();
  }, []);

  const handleUpdateAnnouncement = async () => {
    setLoading(true);
    try {
      await announcementLogic.updateAnnouncement(announcement);
    } catch (error) {
      console.error("Error updating announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  // User management columns
  const columns = [
    { field: "id", headerName: "ID", flex: 0.2 },
    { field: "username", headerName: "Username", flex: 0.3 },
    { field: "credit", headerName: "Credit", type: "number", flex: 0.3, editable: true },
  ];

  const fetchData = async () => {
    try {
      return await userLogic.fetchUsers();
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    }
  };

  const updateRow = async (row) => {
    try {
      await userLogic.updateUserCredit(row.username, row.credit);
    } catch (error) {
      console.error("Error updating user credit:", error);
      throw error;
    }
  };

  return (
    <div>
      <h2>Admin Settings</h2>

      {/* Announcement Editing Section */}
      <div>
        <h3>Edit Announcement</h3>
        <TextField
          label="Announcement"
          variant="outlined"
          fullWidth
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          disabled={loading}
        />
        <div className="my-2">
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateAnnouncement}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* User Management Section */}
      <h3>Edit User Credit</h3>
      <CustomDataGrid
        columns={columns}
        fetchData={fetchData}
        updateRow={updateRow}
        deleteRow={() => {}}
      />
    </div>
  );
};

export default AdminSetting;