import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {md: '500px'},
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "6px",
};

const TaskModal = ({ open, handleClose, taskData, handleInputChange, handleSubmit, editFlag }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <Box sx={modalStyle}>
        <CloseIcon className="float-right cursor-pointer" onClick={handleClose} />
        <Typography variant="h5" color="#3f3f46">
          {editFlag ? "Edit Task" : "Add Task"}
        </Typography>

        <Box className="mt-4 mb-3">
          <Typography variant="subtitle1" color="#3f3f46">
            Title
          </Typography>
          <TextField
            fullWidth
            required
            placeholder="Add a task name"
            size="small"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
          />
        </Box>

        <Box className="mb-3">
          <Typography variant="subtitle1" color="#3f3f46">
            Description
          </Typography>
          <TextField
            fullWidth
            required
            placeholder="Add a description"
            size="small"
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
          />
        </Box>

        <Box className="mb-3">
          <Typography variant="subtitle1" color="#3f3f46">
            Deadline
          </Typography>
          <input
            type="datetime-local"
            name="due_date"
            required
            value={taskData.due_date}
            onChange={handleInputChange}
          />
        </Box>

        <Box className="flex justify-end gap-3 mt-4">
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editFlag ? "Save Task" : "Add Task"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;
