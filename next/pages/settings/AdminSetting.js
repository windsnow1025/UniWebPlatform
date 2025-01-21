import React from "react";
import UserLogic from "../../src/common/user/UserLogic";
import CustomDataGrid from "../../app/components/common/CustomDataGrid";

const AdminSetting = () => {
  const userLogic = new UserLogic();

  const columns = [
    { field: "id", headerName: "ID", flex: 0.2 },
    { field: "username", headerName: "Username", flex: 0.3 },
    { field: "credit", headerName: "Credit", type: 'number', flex: 0.3, editable: true },
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