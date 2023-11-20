import React, { createContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { Home, Settings } from '@mui/icons-material'
import Tab from "@mui/material/Tab";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { HomePage } from "./components/home";
import { SettingsPage } from "./components/settings";
import { ReposProvider, useRepos } from "./components/ReposContext";
import { ConfigsRepo } from "./components/ConfigurationContext";

const App = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const clearStorage = () => {
    if (chrome.storage) {
      chrome.storage.sync.clear();
    }
  }

  // clearStorage();

  // useEffect(() => {
  //   (async () => {
  //     if (chrome.storage) {
  //       chrome.storage.sync.get(['repos'], (items) => {
  //         setRepos(items.repos)
  //       })
  //     } else {
  //       setRepos([]);
  //     }
  //   })();
  // }, []);



  return (
    <React.Fragment>
      <ConfigsRepo>
        <ReposProvider>
          <Box sx={{ width: '100%', height: '100%', typography: 'body1' }}>
            <CssBaseline />
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="Github Extension Tabs" centered>
                  <Tab icon={<Home />} aria-label="home" value="1" />
                  <Tab icon={<Settings />} aria-label="settings" value="2" />
                </TabList>
              </Box>
              <TabPanel sx={{ width: 'calc(100% - 24px)', height: 'calc(100% - 49px)' }} value="1">
                <HomePage></HomePage>
              </TabPanel>
              <TabPanel sx={{ width: 'calc(100% - 24px)', height: 'calc(100% - 49px)' }} value="2">
                <SettingsPage ></SettingsPage>
              </TabPanel>
            </TabContext>
          </Box>
        </ReposProvider>
      </ConfigsRepo>
    </React.Fragment>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
