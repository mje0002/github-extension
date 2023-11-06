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
import { SettingsPage } from "./settings";
import { Repo } from "./lib/repo";

const App = () => {
  const [value, setValue] = useState("1");
  const [repos, setRepos] = useState([] as Array<Repo>);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  chrome.storage.sync.set([{ name: "laughing-happiness", isEnabled: false, },
  { name: "account-documents-api", isEnabled: false, },
  { name: "account-documents-service", isEnabled: false, },
  { name: "account_balance_monitoring", isEnabled: false, },
  { name: "adequate_crypto_address", isEnabled: false, },
  { name: "college_savings_app", isEnabled: false, },
  { name: "college_savings_portal", isEnabled: false, },
  { name: "fundamerica.github.io", isEnabled: false, },
  { name: "fundamerica_apps", isEnabled: false, },
  { name: "fundamerica_chef", isEnabled: false, },
  { name: "fundamerica_lookml", isEnabled: false, },
  { name: "Optimus-Backend", isEnabled: false, },
  { name: "optimus-FE", isEnabled: false, },
  { name: "outertrust", isEnabled: false, },
  { name: "platform-nestjs-authentication", isEnabled: false, }]);

  useEffect(() => {
    (async () => {
      chrome.storage.sync.get(['repos'], (items) => {
        setRepos(items);
      });
    })();
  }, []);

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
            <SettingsPage repos={store}></SettingsPage>
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
