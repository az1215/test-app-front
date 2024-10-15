import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import clsx from "clsx";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    backgroundColor: "#2196f3",
  },
  // cardHeader: {
  //   backgroundColor: "#3f51b5",
  //   color: "#fff",
  // },
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

export default function UpdatePassword() {
  const location = useLocation();
  const classes = useStyles();
  const navigate = useNavigate();

  const [passwd1, setPasswd1] = useState("");
  const [passwd2, setPasswd2] = useState("");

  const [isErrPasswd1, setIsErrPasswd1] = useState(false);
  const [isErrPasswd2, setIsErrPasswd2] = useState(false);

  const [isShowPasswd1, setIsShowPasswd1] = useState(false);
  const handleClickShowPasswd1 = () => {
    setIsShowPasswd1(!isShowPasswd1);
  };
  const [isShowPasswd2, setIsShowPasswd2] = useState(false);
  const handleClickShowPasswd2 = () => {
    setIsShowPasswd2(!isShowPasswd2);
  };

  const handleMouseDownPasswd1 = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseDownPasswd2 = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [isShowSaveConfirm, setIsShowSaveConfirm] = useState(false);
  const [isShowMoveConfirm, setIsShowMoveConfirm] = useState(false);

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
            <CardHeader
              className={classes.cardHeader}
              title="初期パスワード変更"
            />
            <CardContent style={{ padding: "20px" }}>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  初期パスワードでのログインは初回のみ有効となります。
                  <br></br>新しいパスワードを設定してください。
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={isErrPasswd1}
                    variant="outlined"
                    margin="normal"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      新しいパスワード
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={isShowPasswd1 ? "text" : "password"}
                      required
                      value={passwd1}
                      error={isErrPasswd1}
                      onChange={(e) => {
                        setPasswd1(e.target.value);
                      }}
                      onBlur={(e) => {
                        if (e.target.value.trim() === "") {
                          setIsErrPasswd1(true);
                        } else {
                          setIsErrPasswd1(false);
                        }
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswd1}
                            onMouseDown={handleMouseDownPasswd1}
                            edge="end"
                          >
                            {isShowPasswd1 ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={140}
                    />
                  </FormControl>
                  <FormControl
                    fullWidth
                    error={isErrPasswd2}
                    variant="outlined"
                    margin="normal"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      新しいパスワードの再入力
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={isShowPasswd2 ? "text" : "password"}
                      required
                      value={passwd2}
                      error={isErrPasswd2}
                      onChange={(e) => {
                        setPasswd2(e.target.value);
                      }}
                      onBlur={(e) => {
                        if (e.target.value.trim() === "") {
                          setIsErrPasswd2(true);
                        } else {
                          setIsErrPasswd2(false);
                        }
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswd2}
                            onMouseDown={handleMouseDownPasswd2}
                            edge="end"
                          >
                            {isShowPasswd2 ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={200}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => {
                      if (isErrPasswd1 || isErrPasswd2) {
                        alert("入力してー");
                      } else if (passwd1 !== passwd2) {
                        alert("パスワードが一致しません");
                      } else {
                        setIsShowSaveConfirm(true);
                      }
                    }}
                  >
                    ログインパスワードを変更する
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </body>
      <div>
        <Dialog
          open={isShowSaveConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              パスワードを変更します。よろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsShowSaveConfirm(false);
              }}
              variant="contained"
              color="default"
            >
              いいえ
            </Button>
            <Button
              onClick={() => {
                const requestOptions = {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: location.state.user,
                    pass: passwd1,
                  }),
                };
                fetch("/updatePassword", requestOptions)
                  .then((res) => res.json())
                  .then((json) => {
                    if (json.result) {
                      setIsShowSaveConfirm(false);
                      setIsShowMoveConfirm(true);
                    }
                  })
                  .catch((error) => {
                    console.error("Error fetching data:", error);
                  });
              }}
              variant="contained"
              color="primary"
              autoFocus
            >
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={isShowMoveConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              パスワードを変更しました。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                navigate("/login");
              }}
              variant="contained"
              color="primary"
              autoFocus
            >
              ログインページに戻る
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
