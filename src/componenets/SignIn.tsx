import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Stack from "@mui/material/Stack";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import OutlinedInput from "@material-ui/core/OutlinedInput";
//
import personal_name from "../public/personal_name.png";

import { setEmpInfo } from "../common/Global";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {},
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    borderRadius: "7px",
    alignItems: "center",
    marginBottom: "5px",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: "25ch",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [passwd, setPasswd] = useState("");

  const [isErrUserId, setIsErrUserId] = useState(false);
  const [isErrPasswd, setIsErrPasswd] = useState(false);

  const [isShowPasswd, setIsShowPasswd] = useState(false);
  const handleClickShowPasswd = () => {
    setIsShowPasswd(!isShowPasswd);
  };

  const handleMouseDownPasswd = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const login = () => {
    if (userId === "") {
      setIsErrUserId(true);
    } else {
      setIsErrUserId(false);
    }
    if (passwd === "") {
      setIsErrPasswd(true);
    } else {
      setIsErrPasswd(false);
    }
    if (userId === "" || passwd === "") {
      alert("入力してー");
    } else {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userId,
          pass: passwd,
        }),
      };

      // fetch("/saveLoginInfo", requestOptions)
      //   .then((res) => res.json())
      //   .catch((error) => {
      //     console.error("Error fetching data:", error);
      //   });

      fetch("/getUserInfo", requestOptions)
        .then((res) => res.json())
        .then((json) => {
          if (json.result) {
            if (json.initFlg) {
              navigate("/login/updatePassword", {
                state: {
                  user: userId,
                },
              });
            } else {
              setEmpInfo(json);
              navigate("/");
            }
          } else {
            alert("ユーザーIDまたはパスワードが違います。");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };
  return (
    <>
      <body
        style={{ height: "100vh", backgroundColor: "#eaeff1", display: "flex" }}
      >
        <Container
          maxWidth="sm"
          style={{ alignItems: "center", display: "flex" }}
        >
          <Card style={{ alignItems: "center", marginBottom: "50px" }}>
            <CardContent style={{ padding: "20px" }}>
              <Grid container alignItems="center">
                <Grid item xs={12} md={4}>
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      pl: { md: "0" },
                      pr: { md: "20px" },
                    }}
                  >
                    <img src={personal_name} />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container>
                    <Grid item xs={12}>
                      {/* <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="社員コードまたはメールアドレス"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        error={isErrUserId}
                        onBlur={(e) => {
                          setUserId(e.target.value);
                          if (e.target.value.trim() === "") {
                            setIsErrUserId(true);
                          } else {
                            setIsErrUserId(false);
                          }
                        }}
                      /> */}
                      <FormControl
                        fullWidth
                        error={isErrUserId}
                        variant="outlined"
                        margin="normal"
                      >
                        <InputLabel htmlFor="outlined-adornment-userId">
                          社員コードまたはメールアドレス
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-userId"
                          type="text"
                          required
                          value={userId}
                          error={isErrUserId}
                          onChange={(e) => {
                            setUserId(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.code === "Enter") login();
                          }}
                          labelWidth={250}
                        />
                      </FormControl>
                      <FormControl
                        fullWidth
                        error={isErrPasswd}
                        variant="outlined"
                        margin="normal"
                      >
                        <InputLabel htmlFor="outlined-adornment-password">
                          パスワード
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type={isShowPasswd ? "text" : "password"}
                          required
                          value={passwd}
                          error={isErrPasswd}
                          onChange={(e) => {
                            setPasswd(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.code === "Enter") login();
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPasswd}
                                onMouseDown={handleMouseDownPasswd}
                                edge="end"
                              >
                                {isShowPasswd ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          labelWidth={85}
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={login}
                      >
                        ログイン
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container justifyContent="flex-end">
                        <Link href="#" variant="body2">
                          パスワードを忘れた場合
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </body>
    </>
  );
}
