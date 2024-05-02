import { useState, useEffect } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ViewProjects } from 'src/sections/viewProjects/view-projects';
import {CreateProject} from 'src/sections/createProject/create-project';
import {ViewUserStories} from 'src/sections/viewUserStories/view-user-stories';
import { getAllProjects } from 'src/services/project';
import {getAllUserStoriesByProjectId} from 'src/services/userStory';
import {useAuth} from 'src/hooks/use-auth';
import SnackBar from 'src/components/snackBar';
import Link from "next/link";

const Page = () => {
  const auth = useAuth();
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showListOfProjects, setShowListOfProjects] = useState(true);
  const [showListOfUserStories, setShowListOfUserStories] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isUserStoriesLoading, setIsUserStoriesLoading] = useState(true);
  const [snackBar, setSnackBar] = useState(null);

  const getProjectsByUserId = async () => {
    try {
      const response = await getAllProjects(auth.user.id);
      if(response.data)
      setProjects(response.data.sort(function(project1, project2) {
        return new Date(project2.created_at) - new Date(project1.created_at);
      }));
      setIsProjectsLoading(false);
    } catch (error) {
      setIsProjectsLoading(false);
      console.log("Error while getting project:-", error);
    }
  }

  const getProjectId = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("projectId");
  }

  const getProjectName = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("projectName");
  }

  const getUserStoriesByProjectId = async () => {
      try {
        if (window.location.pathname === "/" && window.location.search.includes("projectName")) {
          const projectId = getProjectId();
          const response = await getAllUserStoriesByProjectId(projectId);
          if(response.data) {
            setUserStories(response.data);
            }
          setIsUserStoriesLoading(false);
        }
      } catch (error) {
        console.log("Error while getting user stories:-", error);
        setIsUserStoriesLoading(false);
      }
    }
  
  useEffect(() => {
    getProjectsByUserId();
    getUserStoriesByProjectId();
    if (window.location.pathname === "/" && window.location.search === "") {
      setShowListOfProjects(true);
      setShowListOfUserStories(false);
    } else if (window.location.pathname === "/" && window.location.search.includes("projectName")){
      setShowListOfProjects(false);
      setShowListOfUserStories(true);
    }
  }, [showCreateProjectModal, window.location.search]);
  
  return (
    <>
      <Head>
        <title>
          View Tests | Darknore
        </title>
      </Head>
      { snackBar && <SnackBar message = { snackBar.message} severity = {snackBar.severity} setSnackBar = {setSnackBar} />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
              <Link href="/createTests">
                <Button variant="text" color="info" fullWidth style={{borderRadius: "10px", fontSize: "16px"}}>
                  View Dashboard
                </Button>
              </Link>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
