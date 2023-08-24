import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  SvgIcon,
  TextField
} from "@mui/material";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import {createNewProject} from "src/services/project";
import {useState, useContext} from "react";
import {useAuth} from "src/hooks/use-auth";
import {TestCreationData} from "src/contexts/test-creation-context";

export const CreateProject = props => {
  const {testCreationData, addProjectName} = useContext(TestCreationData);
  const auth = useAuth();
  const {
    showCreateProjectModal,
    setShowCreateProjectModal,
    setSnackBar
  } = props;
  const [projectName, setProjectName] = useState(
    testCreationData && testCreationData.projectName
  );
  const [showAlert, setShowAlert] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 0
  };

  const handleSubmitProject = async () => {
    try {
      if (!projectName) {
        setShowAlert(true);
      } else {
        addProjectName("");
        const response = await createNewProject({
          name: projectName,
          user_id: auth.user.id
        });
        setShowCreateProjectModal(false);
        if (response.status === 200)
          setSnackBar({
            message: "Project Created SuccessFully!",
            severity: "success"
          });
        else setSnackBar({message: "Something Went Wrong!", severity: "error"});
      }
    } catch (error) {
      console.log("Error while creating new project: " + error);
    }
  };

  return (
    <Modal
      open={showCreateProjectModal}
      onClose={() => setShowCreateProjectModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            height: "0px",
            backgroundColor: "#aaa",
            width: "100%",
            direction: "row",
            justifyContent: "space-between",
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
            marginTop={1}
          >
            <Stack spacing={1} />
            <div>
              <Button
                endIcon={
                  <SvgIcon
                    fontSize="medium"
                    style={{color: "#555", marginTop: 5}}
                  >
                    <XMarkIcon />
                  </SvgIcon>
                }
                variant="contained"
                style={{
                  backgroundColor: "transparent",
                  color: "#4338ca",
                  boxShadow: "0px 0px 0px"
                }}
                onClick={() => {
                  setShowCreateProjectModal(false);
                }}
              />
            </div>
          </Stack>
        </Box>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}
        >
          Enter the Project Name
        </Typography>
        <TextField
          required
          id="outlined-required"
          label="Name"
          style={{
            marginLeft: 10,
            marginBottom: 10,
            marginTop: 10,
            width: "95%",
            border: "1px solid #000",
            borderRadius: 8
          }}
          onChange={event => {
            setProjectName(event.target.value);
            addProjectName(event.target.value);
          }}
          defaultValue={testCreationData.projectName}
        />
        <Typography
          label
          style={{marginLeft: 15, color: "#F04438"}}
          hidden={!showAlert}
        >
          * Please enter the name
        </Typography>
        <Box
          sx={{
            display: "flex",
            margin: 1,
            marginBottom: 3,
            justifyContent: "center"
          }}
        >
          <Button
            style={{backgroundColor: "#6366F1", color: "#fff", marginRight: 15}}
            onClick={async () => {
              await handleSubmitProject();
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
