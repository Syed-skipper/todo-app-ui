"use client";

import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Typography,
  TextField,
  Modal,
  Box,
  Grid2,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import config from "../config.json";
import TaskModal from "../../components/Modal";
import { useEffect, useState } from "react";
import "./group.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { md: "500px" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "6px",
};
export default function Group() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState([]);
  const [open, setOpen] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [openTask, setTaskOpen] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [modalType, setModalType] = useState("");
  const [error, setError] = useState("");
  const [groupData, setGroupData] = useState({
    name: "",
    invite_code: "",
    members: [],
  });

  const [tasks, setTasks] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "false",
    user: "",
    id: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 1000);
  }, [error]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    setToken(token);
    setUser(userId);
  }, []);

  const fetchGroup = async () => {
    try {
      let group = await axios.get(`${config.local_url}group/${user}`, {
        headers: {
          "access-token": token,
        },
      });
      setGroup(group.data);
      console.log(group);
    } catch (error) {
      setError(error.response.data);
    }
  };
  useEffect(() => {
    if (token) {
      fetchGroup();
    }
  }, [token]);

  const handleFromInput = (e) => {
    setGroupData({
      ...groupData,
      [e.target.name]: e.target.value,
      members: user,
    });
  };

  const handleInputChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
    console.log(taskData);
  };

  const handleClose = () => {
    setOpen(false);
    setTaskOpen(false);
    setEditFlag(false);
    setGroupData({
      name: "",
      invite_code: "",
      members: [],
    });
    setTaskData({
      title: "",
      description: "",
      due_date: "",
      status: "false",
      user: "",
      id: "",
    });
  };

  const handleOpenForm = (data) => {
    setModalType(data);
    setOpen(true);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.local_url}group`, groupData, {
        headers: { "access-token": token },
      });
      setOpen(false);
      fetchGroup();
    } catch (error) {
      setOpen(true);
      setError(error.response.data);
      console.log(error);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setModalType("join");
    setOpen(true);
    try {
      await axios.put(
        `${config.local_url}group/${user}`,
        { invite_code: groupData.invite_code },
        { headers: { "access-token": token } }
      );
      setOpen(false);
      fetchGroup();
    } catch (error) {
      setOpen(true);
      setError(error.response.data);
      console.log(error);
    }
  };

  const handleOpenGroup = async (id) => {
    try {
      let findData = await axios.get(`${config.local_url}group/all/${id}`, {
        headers: {
          "access-token": token,
        },
      });
      setShowTask(true);
      setSelectedGroupId(id);
      setTasks(findData.data);
      console.log(findData);
    } catch (error) {
      setError(error.response.data);
      console.log(error);
    }
  };

  const handleUpdateStatus = async (taskId, completed) => {
    try {
      await axios.put(
        `${config.local_url}todos/${taskId}`,
        { completed: !completed },
        { headers: { "access-token": token } }
      );
      handleOpenGroup(selectedGroupId);
    } catch (error) {
      setError(error.response.data);
      console.error("Error updating task:", error);
    }
  };

  const handleEdit = async (data) => {
    setTaskOpen(true);
    setEditFlag(true);
    const date = new Date(data.due_date);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);

    const localDateTime = date.toISOString().slice(0, 16);
    setTaskData({ ...data, due_date: localDateTime, id: data._id });
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${config.local_url}task/${taskId}`, {
        headers: { "access-token": token },
      });
      handleOpenGroup(selectedGroupId);
    } catch (error) {
      setError(error.response.data);
      console.error("Error deleting task:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!editFlag) {
        await axios.post(`${config.local_url}todos`, taskData, {
          headers: { "access-token": token },
        });
      } else {
        await axios.put(`${config.local_url}todos/${taskData.id}`, taskData, {
          headers: { "access-token": token },
        });
      }
      fetchGroup();
      handleOpenGroup(selectedGroupId);
      handleClose();
    } catch (error) {
      setError(error.response.data);
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await axios.delete(`${config.local_url}group/${id}`, {
        headers: { "access-token": token },
      });
      fetchGroup();
    } catch (error) {
      setError(error.response.data);
    }
  };
  return (
    <>
      <Box className="group-main">
        <Box className="group-btn">
          <Button variant="outlined" onClick={() => handleOpenForm("create")}>
            Create Group
          </Button>
          <Button variant="outlined" onClick={() => handleOpenForm("join")}>
            Join Group
          </Button>
        </Box>

        <Card
          variant="outlined"
          className="group-card-main"
          sx={{
            alignItems: group.length > 0 ? "none" : "center",
            justifyContent: group.length > 0 ? "space-between" : "center",
          }}
        >
          <Grid2
            container
            spacing={2}
            sx={{
              display: showTask ? "none" : "flex",
              fontSize: "12px !important",
            }}
          >
            {group.length > 0 ? (
              group.map((item, index) => (
                <Grid2 size={{ xs: 12, sm: 4, md: 4 }} key={index}>
                  <Card
                    className="group-card"
                    sx={{ padding: 2, height: "130px" }}
                    onClick={() => handleOpenGroup(item._id)}
                  >
                    <Typography>
                      <b>Group name :</b> {item.name}
                    </Typography>
                    <Typography>
                      <b>Invite code :</b> {item.invite_code}
                    </Typography>
                    <Typography>
                      <b>members :</b> {item.members.length}
                    </Typography>
                    <Button
                      sx={{ alignSelf: "center", fontSize: "10px" }}
                      size="small"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(item._id);
                      }}
                    >
                      Delete Group
                    </Button>
                  </Card>
                </Grid2>
              ))
            ) : (
              <Typography variant="h6" className="text-center py-4">
                No group available
              </Typography>
            )}
          </Grid2>

          {showTask ? (
            tasks.map((task, index) => (
              <Card key={index} className="task-card" sx={{ margin: "10px 0" }}>
                <CardContent className="flex items-center m-3 flex-col sm:flex-row justify-between gap-4 sm:gap-7 !px-0 !py-0 ">
                  <div className="flex items-center gap-5 w-2/5">
                    <Checkbox
                      checked={task.completed}
                      onClick={() =>
                        handleUpdateStatus(task._id, task.completed)
                      }
                    />
                    <Typography
                      sx={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {task.title}
                    </Typography>
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    {task.due_date}
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <EditIcon
                      sx={{
                        marginRight: { sm: "15px", xs: "10px" },
                        color: "#1976d2",
                      }}
                      onClick={() => handleEdit(task)}
                    />
                    <DeleteIcon
                      sx={{ marginRight: "15px", color: "red" }}
                      onClick={() => handleDelete(task)}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <></>
          )}

          <Box
            sx={{ display: showTask ? "flex" : "none" }}
            className="flex justify-end gap-3 mt-4"
          >
            <Button variant="outlined" onClick={() => setShowTask(false)}>
              Go Back
            </Button>
            <Button variant="contained" type="submit">
              Create
            </Button>
          </Box>
        </Card>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            component="form"
            autoComplete="off"
            sx={style}
            onSubmit={
              modalType === "create" ? handleCreateGroup : handleJoinGroup
            }
          >
            {modalType === "create" && (
              <>
                <Box className="mt-4 mb-3">
                  <Typography variant="subtitle1" color="#3f3f46">
                    Group Name
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    placeholder="Enter group name"
                    size="small"
                    name="name"
                    value={groupData.name}
                    onChange={handleFromInput}
                  />
                </Box>
                <Box className="mb-3">
                  <Typography variant="subtitle1" color="#3f3f46">
                    Invite Code
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    placeholder="Invite code"
                    size="small"
                    name="invite_code"
                    value={groupData.invite_code}
                    onChange={handleFromInput}
                  />
                </Box>
              </>
            )}

            {modalType === "join" && (
              <Box className="mt-4 mb-3">
                <Typography variant="subtitle1" color="#3f3f46">
                  Invite Code
                </Typography>
                <TextField
                  fullWidth
                  required
                  placeholder="Enter invite code"
                  size="small"
                  name="invite_code"
                  value={groupData.invite_code}
                  onChange={handleFromInput}
                />
              </Box>
            )}

            <Box className="flex justify-end gap-3 mt-4">
              <Button variant="outlined" onClick={handleClose}>
                Close
              </Button>
              <Button variant="contained" type="submit">
                {modalType === "create" ? "Create" : "Join"}
              </Button>
            </Box>
          </Box>
        </Modal>

        <TaskModal
          open={openTask}
          handleClose={handleClose}
          taskData={taskData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          editFlag={editFlag}
        />
      </Box>

      <Alert
        className="alert"
        sx={{ display: error ? "flex" : "none" }}
        severity="error"
      >
        {error}
      </Alert>
    </>
  );
}
