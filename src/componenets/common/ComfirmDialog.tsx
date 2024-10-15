import { useState, useEffect, useRef, FC } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

interface comfirmDialogProps {
  isShow: boolean;
  setIsShow: any;
  message: string;
  onClickOk: any;
}

/**
 * 確認ダイアログ
 */
const ComfirmDialog = (props: comfirmDialogProps) => {
  const { isShow, setIsShow, message, onClickOk } = props;
  const [isShowDialog, setIsShowDialog] = useState(false);

  useEffect(() => {
    setIsShowDialog(isShow);
  }, [isShow]);

  return (
    <div>
      <Dialog
        open={isShowDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsShowDialog(false);
              setIsShow(false);
            }}
            variant="contained"
            color="default"
          >
            いいえ
          </Button>
          <Button
            variant="contained"
            color="primary"
            autoFocus
            onClick={() => {
              setIsShowDialog(false);
              setIsShow(false);
              onClickOk();
            }}
          >
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ComfirmDialog;
