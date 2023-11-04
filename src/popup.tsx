import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { Home, Settings } from '@mui/icons-material'
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { HomePage } from "./home";

const App = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const store = ["laughing-happiness",
    "account-documents-api",
    "account-documents-service",
    "account_balance_monitoring",
    "adequate_crypto_address",
    "college_savings_app",
    "college_savings_portal",
    "fundamerica.github.io",
    "fundamerica_apps",
    "fundamerica_chef",
    "fundamerica_lookml",
    "Optimus-Backend",
    "optimus-FE",
    "outertrust",
    "platform-nestjs-authentication"];

  return (
    <React.Fragment>
      {/* <Box sx={{ pb: 7 }}>
        <CssBaseline />
        <Tabs value={value} onChange={handleChange} aria-label="icon tabs example">
          <Tab icon={<Settings />} aria-label="settings" />
          <Tab icon={<Home />} aria-label="home" />
        </Tabs>
      </Box> */}
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <CssBaseline />
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="Github Extension Tabs" centered>
              <Tab icon={<Home />} aria-label="home" value="1" />
              <Tab icon={<Settings />} aria-label="settings" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <HomePage repos={store}></HomePage>
          </TabPanel>
          <TabPanel value="2">
            Settings
          </TabPanel>
        </TabContext>
      </Box>
    </React.Fragment>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
