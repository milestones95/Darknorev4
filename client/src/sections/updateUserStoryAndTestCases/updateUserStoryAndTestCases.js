import {Label} from "@mui/icons-material";
import { Typography, Box, Grid, TextField } from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {getUserStoryById, updateUserStory} from "src/services/userStory";
import {TestScenarios} from "../createTests/testScenarios";
import {SelectScenario} from "../createTests/scenario-select";
import {ViewTestScenarios} from "../viewTestScenarios/viewTestScenarios";
import {LoadingButton} from "@mui/lab";
import {TestCreationData} from "src/contexts/test-creation-context";

export const UpdateUserStoryAndTestCases = (props) => {
  const {testCases, userStory} = props;
  const {addUserStory} = useContext(TestCreationData)
  const [displayedScenarios, setDisplayedScenarios] = useState("All");
  const [savingUserStoryDetails, setSavingUserStoryDetails] = useState(false);
  const [savingAcceptanceCriteria, setSavingAcceptanceCriteria] = useState(false);
  const [updatedUserStoryDetails, setUpdatedUserStoryDetails] = useState("");
  const [updatedAcceptanceCriteria, setUpdatedAcceptanceCriteria] = useState("");
  const [showSimilarTestCasesModal, setShowSimilarTestCasesModal] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [similarTestCases, setSimilarTestCases] = useState(JSON.stringify({}));

  const getUserStoryId = () => {
    const searchTerm = new URLSearchParams(window.location.search);
    return searchTerm.get("userStoryId");
  }

  useEffect(() => {
    if (userStory) {
      setUpdatedUserStoryDetails(userStory.user_story_details);
      setUpdatedAcceptanceCriteria(userStory.acceptance_criteria);      
    }
  }, [userStory]);

  return (
    <form onSubmit={() => {
      console.log("Submited");
    }}>
      <Typography variant="h4" style={{marginTop: -20}}>
        {userStory && userStory.name}
      </Typography>
      <Box sx={{m: -1.5}}>
        <Grid container>
          <Grid xs={12}>
            <Grid xs={8} sx={{margin: "10px", marginTop: 5}}>
              <Grid style={{display: "flex", flexDirection: "row"}}>
                <Typography typeof="label" marginLeft={1}>User Story</Typography>
                {savingUserStoryDetails ? <LoadingButton style={{color: "#6366F1", backgroundColor: "#f5f6f9", width: "100px", paddingLeft: 30, marginLeft: 10, paddingTop: 0, paddingBottom: 0}} loading={savingUserStoryDetails} loadingPosition={"start"}>
                  Saving...
                </LoadingButton> : null}
              </Grid>
              <TextField
                fullWidth
                fullHeight
                name="userStoryDescription"
                multiline
                rows={4}
                required
                style={{marginTop: 10, backgroundColor: "#fff", borderRadius: 8}}
                defaultValue={userStory && userStory.user_story_details}
                onChange={async (event) => {
                  setTimeout(async () => {
                    setSavingUserStoryDetails(true);
                    setUpdatedUserStoryDetails(event.target.value);
                    const userStoryId = getUserStoryId();
                    try {
                      const response = await updateUserStory(userStoryId, {
                        user_story_details: event.target.value
                      });
                    } catch (error) {
                      console.log("Error while updating user_story_details in user story table:-", error);
                    }
                    setSavingUserStoryDetails(false);
                  }, 1500);
                }}
                />
            </Grid>
            <Grid xs={8} sx={{margin: "10px", marginTop: 2}}>
              <Grid style={{display: "flex", flexDirection: "row"}}>
                <Typography typeof="label" marginLeft={1}>Acceptance Criteria</Typography>
                {savingAcceptanceCriteria ? <LoadingButton style={{color: "#6366F1", backgroundColor: "#f5f6f9", width: "100px", paddingLeft: 30, marginLeft: 10, paddingTop: 0, paddingBottom: 0}} loading={savingAcceptanceCriteria} loadingPosition={"start"}>
                  Saving...
                </LoadingButton> : null}
              </Grid>
              {/* <Typography typeof="label">Acceptance Criteria</Typography> */}
              <TextField
                fullWidth
                fullHeight
                name="acceptanceCriteria"
                multiline
                rows={4}
                required
                style={{marginTop: 10, backgroundColor: "#fff", borderRadius: 8}}
                defaultValue={userStory && userStory.acceptance_criteria}
                onChange={async (event) => {
                  setSavingAcceptanceCriteria(true);
                  setUpdatedAcceptanceCriteria(event.target.value);
                  setTimeout(async () => {
                    const userStoryId = getUserStoryId();
                    try {
                      const response = await updateUserStory(userStoryId, {
                        acceptance_criteria: event.target.value
                      });
                    } catch (error) {
                      console.log("Error while updating user_story_details in user story table:-", error);
                    }
                    setSavingAcceptanceCriteria(false);
                  }, 1500);
                }}
              />
            </Grid>
            <Grid xs={12} sx={{margin: "10px", marginTop: 2}}>
              <SelectScenario
                setDisplayedScenarios={setDisplayedScenarios}
              ></SelectScenario>
            </Grid>
            <Grid xs={12} sx={{margin: "10px", marginTop: 2}}>
              <ViewTestScenarios
                items={testCases ? testCases : []}
                isForDisplay={true}
                displayedScenarios={displayedScenarios}
                setTestCases = {props.setTestCases}
                updatedUserStoryDetails={updatedUserStoryDetails}
                updatedAcceptanceCriteria={updatedAcceptanceCriteria}
                showSimilarTestCasesModal={showSimilarTestCasesModal}
                setShowSimilarTestCasesModal={setShowSimilarTestCasesModal}
                selectedTestCase={selectedTestCase}
                setSelectedTestCase={setSelectedTestCase}
                similarTestCases={similarTestCases}
                setSimilarTestCases={setSimilarTestCases}
              >
              </ViewTestScenarios>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  )
}