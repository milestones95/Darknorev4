import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ApkUploadPage from "src/sections/ApkUploadPage/ApkUploadPage";
import {
  getAllSessions
} from "../../src/services/appTesting";
import {useAuth} from "src/hooks/use-auth";

const Page = () => {
  const [rawData, setRawData] = useState([]);
  const [data, setData] = useState([]);
  const auth = useAuth();

  let completedCount = 0;
  let failedCount = 0;

data?.forEach((test) => {
  if (test.tStatus === "completed"|| test.tStatus === "passed") {
    completedCount++;
  } else {
    failedCount++;
  }
});
const chartData = {
  labels: ["Passed", "Failed"],
  datasets: [
    {
      label: "No. of Results",
      data: [completedCount, failedCount],
      backgroundColor: ["#34a853", "#ea4335"],
      borderColor: ["#34a853", "#ea4335"],
      borderWidth: 2,
    },
  ],
};

  useEffect(() => {
    if (rawData) {
      const data = rawData[0]?.map((item, index) => {
        const date = new Date(item.start_timestamp);
        const formattedTime = date.toLocaleString();
        return {
          id: index + 1,
          tName: item.name,
          tStatus: item.status_ind,
          tTime: formattedTime,
          tDetails: item,
        };
      });
      setData(data);
    }
  }, [rawData]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await getAllSessions(auth.user.id);
        setRawData([response[0].session]);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      }
    };

    fetchTests()
  }, []);

  return (
    <>
      <Head>
        <title>Create Tests | Darknore</title>
      </Head>

      <Grid container spacing={2} py={4}>
          <ApkUploadPage
            onComplete={(data) => {
              setRawData([data]);
            }}
          />
      </Grid>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
