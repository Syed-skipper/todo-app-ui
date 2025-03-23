"use client";

import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Container,
  Box,
  Menu,
  Alert,
  Stack,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import config from "../config.json";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css";
import Group from "../group/page";
import TaskModal from "../../components/Modal";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Todo() {
  const [todo, setTodo] = useState([]);
  const [open, setOpen] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const router = useRouter();
  const [showGroup, setShowGroup] = useState(false);
  const [error, setError] = useState("");
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    console.log(page);
    if (page == "Group") {
      setShowGroup(true);
    } else {
      setShowGroup(false);
    }
  };

  const pages = ["My Todo", "Group"];

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "false",
    user: "",
    id: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user_name");
    setToken(storedToken);
    setUser(storedUser);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 1000);
  }, [error]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditFlag(false);
    setTaskData({
      title: "",
      description: "",
      due_date: "",
      status: "false",
      user: "",
      id: "",
    });
  };

  const fetchTodos = async (status) => {
    try {
      setActiveTab(status);
      let response = await axios.get(
        `${config.local_url}todos/${localStorage.getItem(
          "user_id"
        )}?status=${status}`,
        {
          headers: {
            "access-token": token,
          },
        }
      );
      setTodo(response.data);
    } catch (error) {
      setError(error.response.data);
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTodos(activeTab);
    }
  }, [token]);

  const handleInputChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!editFlag) {
        await axios.post(`${config.local_url}todos`, taskData, {
          headers: { "access-token": token },
        });
      } else {
        console.log(taskData);
        await axios.put(`${config.local_url}todos/${taskData.id}`, taskData, {
          headers: { "access-token": token },
        });
      }
      fetchTodos(activeTab);
      handleClose();
    } catch (error) {
      setError(error.response.data);
      console.error("Error adding task:", error);
    }
  };

  const handleEdit = (data) => {
    setOpen(true);
    setEditFlag(true);
    const date = new Date(data.due_date);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);

    const localDateTime = date.toISOString().slice(0, 16);
    setTaskData({ ...data, due_date: localDateTime, id: data._id });
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleUpdateStatus = async (item) => {
    try {
      let flag = !item.completed;
      await axios.put(
        `${config.local_url}todos/${item._id}`,
        { completed: flag },
        {
          headers: { "access-token": token },
        }
      );
    } catch (error) {
      setError(error.response.data);
      console.log(error);
    }
  };

  const handleDelete = async (data) => {
    try {
      await axios.delete(`${config.local_url}todos/${data._id}`, {
        headers: { "access-token": token },
      });
      fetchTodos(activeTab);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
          <Container
            maxWidth="xl"
            sx={{ padding: { md: "0px 10% !important", xs: "10px" } }}
          >
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".2rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Todo App
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => handleCloseNavMenu(page)}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".2rem",
                  color: "inherit",
                }}
              >
                Todo App
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => handleCloseNavMenu(page)}
                    sx={{ color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Button variant="contained" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <Box className="text-2xl font-bold m-5 w-[80%] mx-auto text-center flex items-center">
        Welcome {user}
      </Box>

      <Box
        sx={{
          display: showGroup ? "none" : "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="task-header">
          <div className="header1">Tasks</div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === "today" ? "active" : ""}`}
              onClick={() => fetchTodos("today")}
            >
              Today
            </button>
            <button
              className={`tab ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => fetchTodos("pending")}
            >
              Pending
            </button>
            <button
              className={`tab ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => fetchTodos("completed")}
            >
              Completed
            </button>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add task
          </Button>
        </div>

        <Card
          className="card"
          variant="outlined"
          sx={{ alignContent: todo.length ? "none" : "center" }}
        >
          {todo.length ? (
            todo.map((item, index) => (
              <Card
                key={index}
                className="task-card"
                style={{ margin: "10px 0" }}
              >
                <CardContent className="flex items-center flex-col m-3 sm:flex-row justify-between gap-4 sm:gap-7 !px-0 !py-0">
                  <div className="flex items-center gap-5 w-2/5">
                    <Checkbox
                      checked={item.completed}
                      onClick={() => handleUpdateStatus(item)}
                    />
                    <Typography
                      sx={{
                        textDecoration: item.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    {item.due_date}
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <EditIcon
                      sx={{
                        marginRight: { sm: "15px", xs: "10px" },
                        color: "#1976d2",
                      }}
                      onClick={() => handleEdit(item)}
                    />
                    <DeleteIcon
                      sx={{ marginRight: "15px", color: "red" }}
                      onClick={() => handleDelete(item)}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="h6" className="text-center py-4">
              No tasks available
            </Typography>
          )}
        </Card>
      </Box>
      {showGroup ? <Group /> : <></>}

      <Alert
        sx={{
          position: "fixed",
          bottom: 10,
          left: "10%",
          transform: "translateX(-10%)",
          zIndex: 9999,
          width: "100%",
          maxWidth: "50%",
          display: error ? "flex" : "none",
        }}
        severity="error"
      >
        {error}
      </Alert>

      <TaskModal
        open={open}
        handleClose={handleClose}
        taskData={taskData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editFlag={editFlag}
      />
    </div>
  );
}
