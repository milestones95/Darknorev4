import {Container, Stack, Typography} from "@mui/material";
import {GridList} from "@material-ui/core";
import {useState} from "react";

export const ViewUserStories = props => {
  const getProjectId = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("projectId");
  }

  const getProjectName = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("projectName");
  }

  return (
    <GridList cellHeight={120} cols={6} style={{width: "100%"}}>
      {props.userStories.map((value, index) => {
        return (
          <Container
            key={index}
            onClick={() => {
              window.location.assign("/viewTests?userStoryId=" + value.id + "&projectId=" + getProjectId() + "&projectName=" + getProjectName());
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
            >
            </Container>
            <Stack spacing={1} style={{flexDirection: "column-reverse", marginLeft: 12, marginBottom: 12, marginRight: 12}}>
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
