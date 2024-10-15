import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@mui/material/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
//icon
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
    },
    radio: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    textField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);
const Profile = () => {
  const classes = useStyles();

  // ウィンドウ高さ調節
  const [paperHeight, setPaperHeight] = useState(window.innerHeight - 145);
  useEffect(() => {
    const handleResize = () => {
      setPaperHeight(window.innerHeight - 145);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [value, setValue] = useState("1");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Paper className={classes.paper} style={{ height: paperHeight }}>
      <Box sx={{ px: 1, py: 2 }}>
        <div style={{ display: "flex" }}>
          <Typography style={{ lineHeight: "56px", width: "160px" }}>
            氏名（イニシャル）
          </Typography>
          <TextField
            type="text"
            variant="outlined"
            placeholder="姓"
            style={{ width: "100px", marginRight: "5px" }}
            className={classes.textField}
            size="small"
          />
          <TextField
            type="text"
            variant="outlined"
            placeholder="名"
            style={{ width: "100px" }}
            className={classes.textField}
            size="small"
          />
        </div>
        <div style={{ display: "flex" }}>
          <Typography style={{ lineHeight: "58px", width: "160px" }}>
            性別
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={value}
              onChange={handleChange}
              className={classes.radio}
              row
            >
              <FormControlLabel value="1" control={<Radio />} label="男" />
              <FormControlLabel value="2" control={<Radio />} label="女" />
            </RadioGroup>
          </FormControl>
        </div>
        <div style={{ display: "flex" }}>
          <Typography style={{ lineHeight: "48px", width: "160px" }}>
            生年月日
          </Typography>
          <TextField
            id="date"
            type="date"
            size="medium"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </Box>
    </Paper>
  );
};

export default Profile;
