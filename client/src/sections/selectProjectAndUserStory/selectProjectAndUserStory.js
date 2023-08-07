import { TextField, MenuItem, Grid, Menu } from "@mui/material";
import {useEffect, useState} from "react";
import {getAllProjects} from "src/services/project";
import {getAllUserStories} from "src/services/userStory";

export const SelectProjectAndUserStory = props => {
  const {selectedUserStory, setSelectedUserStory} = props;
  const [userStories, setUserStories] = useState([]);
  const [shouldCreateNewUserStory, setShouldCreateNewUserStory] = useState(false);
  const [disableUsetStoryDropdown, setDisableUsetStoryDropdown] = useState(true);

  const getAllCurrentUserStories = async () => {
    try {
      const response = await getAllUserStories();
      setUserStories(response.data);
    } catch (error) {
      console.log("Error while getting current users stories", error);
    }
  }

  useEffect(() => {
    getAllCurrentUserStories();
  }, [])

  return (
    <Grid container style={{display: "flex"}}>
      <Grid xs={5.7} style={{marginRight: "50px"}}>
        <TextField
          label="Enter User Story Name"
          onChange={async (event) => {
            setSelectedUserStory(event.target.value);
          }}
          fullWidth
        >
        </TextField>
      </Grid>
      <Grid xs={5.7}>
        <TextField
          label="Select Existing User Story"
          onChange={async (event) => {
            setSelectedUserStory(event.target.value);
          }}
          select={!shouldCreateNewUserStory}
          fullWidth
        >
          {userStories && userStories.map((userStory) => {
            return (
              <MenuItem key={userStory} value={userStory}>
                {userStory.name}
              </MenuItem>
            )
          })}
          <MenuItem key={"addNewUserStory"} value={"addNewUserStory"}>
            Create a New Project
          </MenuItem>
        </TextField>
      </Grid>
    </Grid>
  )
}