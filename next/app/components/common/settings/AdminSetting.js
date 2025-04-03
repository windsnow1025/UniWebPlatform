import React, {useEffect, useState} from "react";
import UserLogic from "../../../../src/common/user/UserLogic";
import AnnouncementLogic from "../../../../src/announcement/AnnouncementLogic";
import CustomDataGrid from "../CustomDataGrid";
import {Button, IconButton, Tooltip} from "@mui/material";
import {RawEditableState} from "../../../../src/common/message/EditableState";
import TextContent from "../../message/content/text/TextContent";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const AdminSetting = () => {
  const userLogic = new UserLogic();
  const announcementLogic = new AnnouncementLogic();

  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

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
    {field: "id", headerName: "ID", flex: 0.1},
    {field: "username", headerName: "Username", flex: 0.2},
    {field: "email", headerName: "Email", flex: 0.3},
    {
      field: "emailVerified",
      headerName: "Email Verified",
      type: "boolean",
      flex: 0.1,
      editable: true
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.1,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['admin', 'user']
    },
    {
      field: "credit",
      headerName: "Credit",
      type: "number",
      flex: 0.1,
      editable: true
    },
  ];

  const fetchData = async () => {
    try {
      const users = await userLogic.fetchUsers();
      return users.map(user => ({
        ...user,
        role: user.roles[0]
      }))
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    }
  };

  const updateRow = async (row) => {
    try {
      await userLogic.updateUserPrivileges(
        row.username,
        row.emailVerified,
        [row.role],
        row.credit
      );
    } catch (error) {
      console.error("Error updating user credit:", error);
      throw error;
    }
  };

  const deleteRow = async (id) => {
    try {
      await userLogic.deleteUserById(id);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  return (
    <div>
      <h2>Admin Settings</h2>

      {/* Announcement Editing Section */}
      <div>
        <div className="flex items-center">
          <h3 className="mr-2">Edit Announcement</h3>
          <Tooltip title={showPreview ? "Edit Mode" : "Preview Mode"}>
            <IconButton aria-label="toggle-preview" onClick={togglePreview} size="small">
              {showPreview ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
            </IconButton>
          </Tooltip>
        </div>
        <TextContent
          content={announcement}
          setContent={setAnnouncement}
          rawEditableState={showPreview ? RawEditableState.AlwaysFalse : RawEditableState.AlwaysTrue}
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
        deleteRow={deleteRow}
      />
    </div>
  );
};

export default AdminSetting;