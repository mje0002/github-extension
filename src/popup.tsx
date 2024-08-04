import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ExpandLess, ExpandMore, Home, ManageAccounts, Settings, Storage } from '@mui/icons-material'
import { HomePage } from "./components/home";
import { ReposProvider } from "./components/ReposContext";
import { ConfigsRepo } from "./components/ConfigurationContext";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Drawer from '@mui/material/Drawer';
import { Collapse } from "@mui/material";
import { Configuration } from "./components/Configuration";
import { ReposPage } from "./components/ReposPage";

const App = () => {
  const [value, setValue] = useState(0);
  const [toggled, setToggled] = useState<{ [key: string]: boolean }>({ settings: false })

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleNavToggle = (event: React.SyntheticEvent, value: string) => {
    const old = { ...toggled };
    old[value] = !old[value];
    setToggled(old);
  }

  const options = [
    { key: 0, text: 'Home', icon: <Home /> },
    { text: 'Settings', icon: <Settings />, nested: [{ key: 1, text: 'Configuration', icon: <ManageAccounts /> }, { key: 2, text: 'Repos', icon: <Storage /> }] }
  ]

  const clearStorage = () => {
    if (chrome.storage) {
      chrome.storage.sync.clear();
    }
  }

  const renderMain = (value: number) => {
    switch (value) {
      case 0:
        return <HomePage></HomePage>;
      case 1:
        return <Configuration></Configuration>;
      case 2:
        return <ReposPage></ReposPage>;
      default:
        return <HomePage></HomePage>;
    }
  }

  return (
    <React.Fragment>
      <ConfigsRepo>
        <ReposProvider>
          <Box sx={{ display: 'flex', width: '100%', height: '100%', typography: 'body1' }}>
            <CssBaseline />
            <Drawer
              variant="permanent"
              sx={{
                width: 135,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 135, boxSizing: 'border-box' },
              }}
            >
              <List sx={{
                ['& .MuiListItemButton-root']: {
                  paddingLeft: .5,
                  paddingRight: 1,
                },
                ['& .MuiListItemIcon-root']: {
                  minWidth: 0,
                  marginRight: 1,
                },
                ['& .MuiSvgIcon-root']: {
                  fontSize: 20,
                },
              }}>
                {options.reduce((prev, curr) => {
                  if (curr.nested) {
                    const ele =
                      <ListItem key={curr.text} disablePadding sx={{ display: 'block' }} onClick={(e) => handleNavToggle(e, curr.text.toLowerCase())}>
                        <ListItemButton sx={{ py: 0, minHeight: 32 }}>
                          <ListItemIcon>
                            {curr.icon}
                          </ListItemIcon>
                          <ListItemText primary={curr.text} primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }} />
                          {toggled[curr.text.toLowerCase()] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                      </ListItem>;

                    prev.push(ele);
                    const setItems = curr.nested.map((item) => {
                      return <ListItem key={item.text} disablePadding sx={{ display: 'block' }} onClick={(e) => handleChange(e, item.key)}>
                        <ListItemButton sx={{ py: 0, minHeight: 32 }} selected={value === item.key}>
                          <ListItemIcon>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }} />
                        </ListItemButton>
                      </ListItem>;
                    });
                    const set = <Collapse key={curr.text.toLowerCase()} in={toggled[curr.text.toLowerCase()]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{
                        bgcolor: 'rgba(239, 239, 240, 0.5)'
                      }}>
                        {...setItems}
                      </List>
                    </Collapse>

                    prev.push(set);
                  } else {
                    const ele =
                      <ListItem key={curr.text} disablePadding sx={{ display: 'block' }} onClick={(e) => handleChange(e, curr.key)}>
                        <ListItemButton sx={{ py: 0, minHeight: 32 }} selected={value === curr.key}>
                          <ListItemIcon>
                            {curr.icon}
                          </ListItemIcon>
                          <ListItemText primary={curr.text} primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }} />
                        </ListItemButton>
                      </ListItem>;

                    prev.push(ele);
                  }

                  return prev;
                }, [] as JSX.Element[])}
              </List>
            </Drawer>
            <Box component="main" className="main-content" sx={{ flexGrow: 1, p: 1, height: "calc(100% - 35px)", overflow: "auto" }}>
              {renderMain(value)}
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
