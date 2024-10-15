import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Badge from "@material-ui/core/Badge";
import CircularProgress from "@material-ui/core/CircularProgress";

import ProjectList from "./ProjectList";
import Profile from "./Profile";

import { userId } from "../../common/Global";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    blueCell: {
      color: "#3f51b5 !important",
    },
    redCell: {
      color: "#ff1744 !important",
    },
  })
);

/**
 * メイン画面
 */
const SkillsheetMain = () => {
  const classes = useStyles();

  // タブindex
  const [value, setValue] = React.useState(0);
  // タブ選択
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className={classes.root}>
        {/* {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "50px",
            }}
          >
            <CircularProgress />
          </div>
        ) : ( */}
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="プロジェクト一覧" id="tab1" aria-controls="tabpanel1" />
            <Tab label="プロフィール" id="tab2" aria-controls="tabpanel2" />
          </Tabs>
        </AppBar>
        {value === 0 && <ProjectList />}
        {value === 1 && <Profile />}
        {/* )} */}
      </div>
    </>
  );
};

export default SkillsheetMain;
