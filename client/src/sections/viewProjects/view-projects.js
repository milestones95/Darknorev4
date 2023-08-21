import {Container, Stack, Typography} from "@mui/material";
import {GridList} from "@material-ui/core";
import {useContext} from "react";
import {TestCreationData} from "src/contexts/test-creation-context";

export const ViewProjects = props => {
  const {addProjectName} = useContext(TestCreationData);
  return (
    <GridList cellHeight={120} cols={6} style={{width: "100%"}}>
      {props.projects &&
        props.projects.map((value, index) => {
          return (
            <Container
              key={index}
              onClick={() => {
                addProjectName(value.name);
                window.location.assign(
                  "/?projectId=" + value.id + "&projectName=" + value.name
                );
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                margin: 10,
                marginRight: 50,
                marginBottom: 50,
                width: "180px",
                border: "3px solid #aaefff",
                padding: 0,
                borderRadius: 10,
                marginTop: 30,
                justifyContent: "space-between"
              }}
            >
              <Container
                style={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  width: "100px",
                  height: "10px",
                  marginLeft: -2.5,
                  marginTop: -10,
                  borderLeft: "3px solid #aaefff",
                  borderTop: "3px solid #aaefff",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  paddingTop: 25,
                  paddingLeft: 10
                }}
              />
              <Stack
                spacing={1}
                style={{marginLeft: 12, marginBottom: 12, marginRight: 12}}
              >
                <Typography>
                  {value.name}
                </Typography>
              </Stack>
            </Container>
          );
        })}
    </GridList>
  );
};
