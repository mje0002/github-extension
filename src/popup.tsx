import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { Home, Settings } from '@mui/icons-material'
import { HomePage } from "./components/home";
import { SettingsPage } from "./components/settings";
import { ReposProvider } from "./components/ReposContext";
import { ConfigsRepo } from "./components/ConfigurationContext";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const App = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const options = [
    { text: 'Home', icon: <Home /> },
    { text: 'Settings', icon: <Settings /> }
  ]

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
          <Box sx={{ display: 'flex', width: '100%', height: '100%', typography: 'body1' }}>
            <CssBaseline />
            <Drawer
              variant="permanent"
              sx={{
                width: 150,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 150, boxSizing: 'border-box' },
              }}
            >
              <Box sx={{ overflow: 'auto' }}>
                <List>
                  {options.map((item, index) => (
                    <ListItem key={item.text} disablePadding onClick={(e) => handleChange(e, index)}>
                      <ListItemButton>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
            <Box component="main" className="main-content" sx={{ flexGrow: 1, p: 1 }}>
              {(value == 0) ? <HomePage></HomePage> : <SettingsPage></SettingsPage>}
            </Box>
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
