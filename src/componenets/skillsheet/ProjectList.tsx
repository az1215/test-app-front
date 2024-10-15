import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@mui/material/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Chip from "@material-ui/core/Chip";
import FormHelperText from "@material-ui/core/FormHelperText";
import Popover from "@material-ui/core/Popover";
import IconButton from "@mui/material/IconButton";

//icon
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import FilterListIcon from "@material-ui/icons/FilterList";
import SearchIcon from "@material-ui/icons/Search";

import ComfirmDialog from "../common/ComfirmDialog";

import { userId } from "../../common/Global";

const useMainStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { width: "100%" },
    container: { margin: 0 },
    box: {
      padding: theme.spacing(2),
      display: "flex",
      justifyContent: "space-between",
    },
    paper: { width: "100%" },
  })
);

interface projectData {
  projectId: string;
  startDate: string;
  endDate: string;
  endDate2: string;
  businessContent: string;
  programLang: string;
  framework: string;
  database: string;
  tool: string;
  developProcess: string;
}

interface listData {
  key: number;
  label: string;
}

const ProjectList = () => {
  const classes = useMainStyles();

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

  useEffect(() => {
    getProjectData();
  }, []);

  // 開発工程一覧
  const developProcessList: listData[] = [
    { key: 1, label: "プロジェクト管理" },
    { key: 2, label: "要件設定" },
    { key: 3, label: "基本設計" },
    { key: 4, label: "詳細設計" },
    { key: 5, label: "製造" },
    { key: 6, label: "単体テスト" },
    { key: 7, label: "結合テスト" },
    { key: 8, label: "システムテスト" },
    { key: 9, label: "運用・保守" },
  ];

  // プロジェクトデータ
  const [projectDatas, setProjectDatas] = useState<projectData[]>([]);
  // 次プロジェクトID
  const [nextProjectId, setNextProjectId] = useState<string>("0001");

  // 編集対象プロジェクトデータ
  const [editProjectData, setEditProjectData] = useState<projectData | null>(
    null
  );

  // プロジェクト登録モード
  const [mode, setMode] = useState<"insert" | "update">("insert");

  // プロジェクトデータ取得
  const getProjectData = () => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const params = {
      user: userId,
      year: year,
      month: month,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    };
    fetch("/getProjectData", requestOptions)
      //レスポンスをjsonとして受け取りjsオブジェクトを生成
      //生成したjsオブジェクトをdataに代入
      .then((res) => res.json())
      .then((json) => {
        if (json.length > 0) {
          let newData: projectData[] = [];
          if (json.length > 0) {
            json.forEach((project: projectData) => {
              newData.push(project);
            });
            setProjectDatas(newData);
            setFilterdProjectDatas(newData);
            let maxprojectId =
              Math.max.apply(
                null,
                newData.map((d) => parseInt(d.projectId))
              ) + 1;

            setNextProjectId(maxprojectId.toString().padStart(4, "0"));
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // プロジェクトデータ取得
  const deleteProjectData = (projectId: string) => {
    const params = {
      user: userId,
      projectId: projectId,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    };
    fetch("/deleteProjectData", requestOptions)
      //レスポンスをjsonとして受け取りjsオブジェクトを生成
      //生成したjsオブジェクトをdataに代入
      .then((res) => res.json())
      .then((json) => {
        alert("プロジェクトを削除しました。");
        getProjectData();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // ダイアログ表示管理state
  const [isShowDialog, setIsShowDialog] = useState(false);

  // 削除確認ダイアログ管理state
  const [isShowDelComfirm, setIsShowDelComfirm] = useState(false);
  const [delItemId, setDelItemId] = useState("");

  // 期間計算
  const calcPeriod = (startDate: string, endDate: string) => {
    const startYear = parseInt(startDate.slice(0, 4));
    const startMonth = parseInt(startDate.slice(-2));

    let endYear = 0;
    let endMonth = 0;
    if (endDate === "") {
      let date = new Date();
      endYear = date.getFullYear();
      endMonth = date.getMonth();
    } else {
      endYear = parseInt(endDate.slice(0, 4));
      endMonth = parseInt(endDate.slice(-2));
    }

    if (endDate === "") {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;

      if (startYear - currentYear > 0) {
        return "-";
      } else if (startYear === currentYear && startMonth - currentMonth > 0) {
        return "-";
      }
    }

    let years = endYear - startYear;
    let months = endMonth - startMonth + 1;

    if (months < 0) {
      years--;
      months += 12;
    }

    let reslut = "";
    if (years === 0) {
      reslut = `${months}ヵ月`;
    } else if (months === 0) {
      reslut = `${years}年`;
    } else {
      reslut = `${years}年${months}ヵ月`;
    }
    return reslut;
  };

  const getDispDate = (date: string, startDate: string = "") => {
    if (date) {
      let splitDate = date.split("-");
      return `${splitDate[0]}年${splitDate[1]}月`;
    } else {
      let today = new Date();
      let currentYear = today.getFullYear();
      let currentMonth = today.getMonth() + 1;

      let year = parseInt(startDate.slice(0, 4));
      let month = parseInt(startDate.slice(-2));

      if (year - currentYear > 0) {
        return "";
      } else if (year === currentYear && month - currentMonth > 0) {
        return "";
      } else {
        return "現在";
      }
    }
  };

  // テーブルソート
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = () => {
    let data = JSON.parse(JSON.stringify(filterdProjectDatas));
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    let descending = sortOrder === "desc" ? false : true;
    sortByKey(data, "startDate", descending);
    setFilterdProjectDatas(data);
  };

  // 並び替え
  function sortByKey<T extends projectData>(
    array: T[],
    key: keyof T,
    descending: boolean
  ): T[] {
    return array.sort((a, b) => {
      if (a[key] < b[key]) {
        return descending ? 1 : -1;
      }
      if (a[key] > b[key]) {
        return descending ? -1 : 1;
      }
      return 0;
    });
  }

  // テーブルフィルター

  // フィルター後プロジェクトデータ
  const [filterdProjectDatas, setFilterdProjectDatas] = useState<projectData[]>(
    []
  );

  // 期間フィルター
  const [anchorElPeriod, setAnchorElPeriod] =
    React.useState<HTMLButtonElement | null>(null);
  const handleClickPeriod = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPeriod(event.currentTarget);
  };
  const handleClosePeriod = () => {
    setAnchorElPeriod(null);
  };
  const openPeriod = Boolean(anchorElPeriod);

  // 業務内容フィルター
  const [anchorElBusinessContent, setAnchorElBusinessContent] =
    React.useState<HTMLButtonElement | null>(null);
  const handleClickBusinessContent = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElBusinessContent(event.currentTarget);
  };
  const handleCloseBusinessContent = () => {
    setAnchorElBusinessContent(null);
  };
  const openBusinessContent = Boolean(anchorElBusinessContent);

  // 言語フィルター
  const [anchorElLanguages, setAnchorElLanguages] =
    React.useState<HTMLButtonElement | null>(null);
  const handleClickLanguages = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElLanguages(event.currentTarget);
  };
  const handleCloseLanguages = () => {
    setAnchorElLanguages(null);
  };
  const openLanguages = Boolean(anchorElLanguages);

  // 開発工程フィルター
  const [anchorElDevelopProcess, setAnchorElDevelopProcess] =
    React.useState<HTMLButtonElement | null>(null);
  const handleClickDevelopProcess = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElDevelopProcess(event.currentTarget);
  };
  const handleCloseDevelopProcess = () => {
    setAnchorElDevelopProcess(null);
  };
  const openDevelopProcess = Boolean(anchorElDevelopProcess);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const [filterStringForBusCont, setFilterStringForBusCont] = useState("");
  const [filterLanguages, setFilterLanguages] = useState("");
  const [filterSelectedDevelopProcess, setFilterSelectedDevelopProcess] =
    useState<listData[]>([]);
  const setFilterData = (inputKey: number, val: any) => {
    // 期間フィルター
    let newStartDateRange: Date | null = null;
    let newEndDateRange: Date | null = null;
    let newFilterStringForBusCont = "";
    let newFilterLanguages = "";
    let newFilterSelectedDevelopProcess: listData[] = [];
    switch (inputKey) {
      case 0:
        setStartDateRange(val);
        if (val.length === 7) {
          newStartDateRange = new Date(val);
        }
        if (endDateRange.length === 7) {
          newEndDateRange = new Date(endDateRange);
        }
        newFilterStringForBusCont = filterStringForBusCont;
        newFilterLanguages = filterLanguages;
        newFilterSelectedDevelopProcess = filterSelectedDevelopProcess;
        break;
      case 1:
        setEndDateRange(val);
        if (startDateRange.length === 7) {
          newStartDateRange = new Date(startDateRange);
        }
        if (val.length === 7) {
          newEndDateRange = new Date(val);
        }
        newFilterStringForBusCont = filterStringForBusCont;
        newFilterLanguages = filterLanguages;
        newFilterSelectedDevelopProcess = filterSelectedDevelopProcess;
        break;
      case 2:
        setFilterStringForBusCont(val);
        if (startDateRange.length === 7) {
          newStartDateRange = new Date(startDateRange);
        }
        if (endDateRange.length === 7) {
          newEndDateRange = new Date(endDateRange);
        }
        newFilterStringForBusCont = val;
        newFilterLanguages = filterLanguages;
        newFilterSelectedDevelopProcess = filterSelectedDevelopProcess;
        break;
      case 3:
        setFilterLanguages(val);
        if (startDateRange.length === 7) {
          newStartDateRange = new Date(startDateRange);
        }
        if (endDateRange.length === 7) {
          newEndDateRange = new Date(endDateRange);
        }
        newFilterStringForBusCont = filterStringForBusCont;
        newFilterLanguages = val;
        newFilterSelectedDevelopProcess = filterSelectedDevelopProcess;
        break;
      case 4:
        setFilterSelectedDevelopProcess(val);
        if (startDateRange.length === 7) {
          newStartDateRange = new Date(startDateRange);
        }
        if (endDateRange.length === 7) {
          newEndDateRange = new Date(endDateRange);
        }
        newFilterStringForBusCont = filterStringForBusCont;
        newFilterLanguages = filterLanguages;
        newFilterSelectedDevelopProcess = val;
        break;
    }

    let newData = JSON.parse(JSON.stringify(projectDatas));

    // 期間フィルター
    if (!(!newStartDateRange && !newEndDateRange)) {
      newData = newData.filter((item: projectData) => {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate2);
        if (newStartDateRange && !newEndDateRange) {
          return startDate >= newStartDateRange;
        } else if (!newStartDateRange && newEndDateRange) {
          return endDate <= newEndDateRange;
        } else if (newStartDateRange && newEndDateRange) {
          return startDate >= newStartDateRange && endDate <= newEndDateRange;
        }
      });
    }

    // 業務内容フィルター
    if (newFilterStringForBusCont.length > 0) {
      newData = newData.filter((item: projectData) => {
        if (item.businessContent.indexOf(newFilterStringForBusCont) !== -1) {
          return item;
        }
      });
    }

    // 言語フィルター
    if (newFilterLanguages.length > 0) {
      let newFilterLanguagesArray = newFilterLanguages
        .split(",")
        .filter((d) => d.length > 0)
        .map((d) => d.toLocaleLowerCase());
      newData = newData.filter((item: projectData) => {
        let ret = false;
        // プログラミング言語
        let programLang = item.programLang
          .split(",")
          .map((d) => d.toLocaleLowerCase());

        // フレームワーク
        let framework = item.framework
          .split(",")
          .map((d) => d.toLocaleLowerCase());

        // データベース
        let database = item.database
          .split(",")
          .map((d) => d.toLocaleLowerCase());

        // ツール
        let tool = item.tool.split(",").map((d) => d.toLocaleLowerCase());

        newFilterLanguagesArray.forEach((filterItem) => {
          let result1 = programLang.filter((d) => d.includes(filterItem));
          if (result1.length > 0) ret = true;
          let result2 = framework.filter((d) => d.includes(filterItem));
          if (result2.length > 0) ret = true;
          let result3 = database.filter((d) => d.includes(filterItem));
          if (result3.length > 0) ret = true;
          let result4 = tool.filter((d) => d.includes(filterItem));
          if (result4.length > 0) ret = true;
        });

        if (ret) return item;
      });
    }

    // 開発工程フィルター
    if (newFilterSelectedDevelopProcess.length > 0) {
      newData = newData.filter((item: projectData) => {
        let developProcessArray = item.developProcess
          .split(",")
          .map((d) => parseInt(d));
        let ret = false;
        developProcessArray.forEach((filterItem) => {
          if (newFilterSelectedDevelopProcess.some((d) => d.key === filterItem))
            ret = true;
        });
        if (ret) return item;
      });
    }

    // 並び替え
    let descending = sortOrder === "desc" ? true : false;
    sortByKey(newData, "startDate", descending);

    setFilterdProjectDatas(newData);
  };

  return (
    <>
      <Paper className={classes.paper} style={{ height: paperHeight }}>
        <Box className={classes.box}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setMode("insert");
              setEditProjectData(null);
              setIsShowDialog(true);
            }}
          >
            プロジェクト追加
          </Button>
          <Button
            href="#text-buttons"
            size="small"
            disabled={
              sortOrder === "asc" &&
              startDateRange === "" &&
              endDateRange === "" &&
              filterStringForBusCont === "" &&
              filterLanguages === "" &&
              filterSelectedDevelopProcess.length === 0
            }
            onClick={() => {
              setSortOrder("asc");
              setStartDateRange("");
              setEndDateRange("");
              setFilterStringForBusCont("");
              setFilterLanguages("");
              setFilterSelectedDevelopProcess([]);
              setFilterdProjectDatas(projectDatas);
            }}
          >
            フィルタークリア
          </Button>
        </Box>
        <TableContainer
          className={classes.container}
          style={{ maxHeight: paperHeight - 70 }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "17%" }}>
                  <TableSortLabel
                    active
                    direction={sortOrder}
                    onClick={handleSort}
                  >
                    期間
                  </TableSortLabel>
                  <IconButton
                    color="inherit"
                    aria-describedby="filterPeriod"
                    onClick={handleClickPeriod}
                  >
                    <FilterListIcon />
                  </IconButton>
                  <Popover
                    open={openPeriod}
                    id="filterPeriod"
                    anchorEl={anchorElPeriod}
                    onClose={handleClosePeriod}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Box sx={{ p: 2 }} style={{ display: "flex" }}>
                      <TextField
                        size="small"
                        type="month"
                        color="primary"
                        value={startDateRange}
                        onChange={(e) => {
                          setFilterData(0, e.target.value);
                        }}
                        style={{ width: "120px" }}
                      />
                      <span style={{ lineHeight: "29px", margin: "0 10px" }}>
                        ~
                      </span>
                      <TextField
                        size="small"
                        type="month"
                        color="primary"
                        value={endDateRange}
                        onChange={(e) => {
                          setFilterData(1, e.target.value);
                        }}
                        style={{ width: "120px" }}
                      />
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          setStartDateRange("");
                          setEndDateRange("");
                          setFilterdProjectDatas(projectDatas);
                          handleClosePeriod();
                        }}
                      >
                        クリア
                      </Button>
                    </Box>
                  </Popover>
                </TableCell>
                <TableCell style={{ width: "25%" }}>
                  業務内容
                  <FilterPopover
                    onClick={handleClickBusinessContent}
                    open={openBusinessContent}
                    anchorEl={anchorElBusinessContent}
                    onClose={handleCloseBusinessContent}
                    childComponent={
                      <>
                        <Box sx={{ p: 2 }} style={{ display: "flex" }}>
                          <SearchIcon style={{ margin: "3px" }} />
                          <TextField
                            size="small"
                            type="text"
                            placeholder="フィルター"
                            style={{ width: "230px" }}
                            value={filterStringForBusCont}
                            onChange={(e) => {
                              setFilterData(2, e.target.value);
                            }}
                          />
                        </Box>
                      </>
                    }
                  />
                </TableCell>
                <TableCell style={{ width: "30%" }}>
                  言語・環境等
                  <FilterPopover
                    onClick={handleClickLanguages}
                    open={openLanguages}
                    anchorEl={anchorElLanguages}
                    onClose={handleCloseLanguages}
                    childComponent={
                      <>
                        <Box sx={{ p: 2 }} style={{ display: "flex" }}>
                          <SearchIcon style={{ margin: "3px" }} />
                          <TextField
                            size="small"
                            type="text"
                            placeholder="フィルター（カンマ区切りで複数検索）"
                            style={{ width: "300px" }}
                            value={filterLanguages}
                            onChange={(e) => {
                              setFilterData(3, e.target.value);
                            }}
                          />
                        </Box>
                      </>
                    }
                  />
                </TableCell>
                <TableCell>
                  開発工程
                  <FilterPopover
                    onClick={handleClickDevelopProcess}
                    open={openDevelopProcess}
                    anchorEl={anchorElDevelopProcess}
                    onClose={handleCloseDevelopProcess}
                    childComponent={
                      <>
                        <Box sx={{ p: 2 }}>
                          <FormControl component="fieldset">
                            <FormGroup>
                              {developProcessList.map((process, index) => {
                                return (
                                  <FormControlLabel
                                    key={index}
                                    value={process.key}
                                    control={
                                      <Checkbox
                                        color="primary"
                                        size="small"
                                        checked={filterSelectedDevelopProcess.some(
                                          (d: listData) => d.key === process.key
                                        )}
                                        onChange={() => {
                                          let newData = JSON.parse(
                                            JSON.stringify(
                                              filterSelectedDevelopProcess
                                            )
                                          );
                                          if (
                                            filterSelectedDevelopProcess.some(
                                              (d: listData) =>
                                                d.key === process.key
                                            )
                                          ) {
                                            newData = newData.filter(
                                              (d: listData) =>
                                                d.key !== process.key
                                            );
                                          } else {
                                            newData.push(process);
                                          }
                                          setFilterData(4, newData);
                                        }}
                                      />
                                    }
                                    label={process.label}
                                  />
                                );
                              })}
                            </FormGroup>
                          </FormControl>
                        </Box>
                      </>
                    }
                  />
                </TableCell>
                <TableCell style={{ width: "150px" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterdProjectDatas.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {getDispDate(data.startDate)}&nbsp;~&nbsp;
                    {getDispDate(data.endDate, data.startDate)}
                    <br />
                    (&nbsp;{calcPeriod(data.startDate, data.endDate)}&nbsp;)
                  </TableCell>
                  <TableCell>
                    {data.businessContent.split("\n").map((line, lineIndex) => (
                      <React.Fragment key={lineIndex}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </TableCell>
                  <TableCell>
                    ■プログラミング言語
                    <br />
                    &nbsp;&nbsp;{data.programLang}
                    <br />
                    ■フレームワーク
                    <br />
                    &nbsp;&nbsp;{data.framework}
                    <br />
                    ■データベース
                    <br />
                    &nbsp;&nbsp;{data.database}
                    <br />
                    ■ツール
                    <br />
                    &nbsp;&nbsp;{data.tool}
                  </TableCell>
                  <TableCell>
                    {developProcessList
                      .filter((d: listData) =>
                        data.developProcess
                          .split(",")
                          .includes(d.key.toString())
                      )
                      .map((d) => d.label)
                      .map((line, lineIndex) => (
                        <React.Fragment key={lineIndex}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                  </TableCell>
                  <TableCell>
                    <ButtonGroup
                      orientation="vertical"
                      color="primary"
                      aria-label="vertical outlined primary button group"
                    >
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setEditProjectData(data);
                          setMode("update");
                          setIsShowDialog(true);
                        }}
                      >
                        編集
                      </Button>
                      <Button
                        startIcon={<FileCopyIcon />}
                        onClick={() => {
                          setEditProjectData(data);
                          setMode("insert");
                          setIsShowDialog(true);
                        }}
                      >
                        コピー
                      </Button>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          setIsShowDelComfirm(true);
                          setDelItemId(data.projectId);
                        }}
                      >
                        削除
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div>
        <ProjectRegistDialog
          isShow={isShowDialog}
          setIsShow={setIsShowDialog}
          nextProjectId={nextProjectId}
          editProjectData={editProjectData}
          mode={mode}
          developProcessList={developProcessList}
          getProjectData={getProjectData}
        />
      </div>
      <div>
        <ComfirmDialog
          isShow={isShowDelComfirm}
          setIsShow={setIsShowDelComfirm}
          message="プロジェクトを削除します。よろしいですか？"
          onClickOk={() => deleteProjectData(delItemId)}
        />
      </div>
    </>
  );
};

const TitleText = (props: { text: string; isErr: boolean }) => {
  const { text, isErr } = props;
  return (
    <>
      {isErr ? (
        <Typography color="error">
          <Box fontWeight="fontWeightBold">{text}*</Box>
        </Typography>
      ) : (
        <Typography>
          <Box fontWeight="fontWeightBold">{text}</Box>
        </Typography>
      )}
    </>
  );
};

/**
 * プロジェクト登録ダイアログ
 */
interface comfirmDialogProps {
  isShow: boolean;
  setIsShow: any;
  nextProjectId: string;
  editProjectData: projectData | null;
  mode: "insert" | "update";
  developProcessList: listData[];
  getProjectData: any;
}

const usetDialogStyles = makeStyles((theme: Theme) =>
  createStyles({
    textBox: {
      "& .MuiFormHelperText-contained ": {
        marginLeft: 0,
      },
    },
  })
);

const ProjectRegistDialog = (props: comfirmDialogProps) => {
  const classes = usetDialogStyles();
  const {
    isShow,
    setIsShow,
    nextProjectId,
    editProjectData,
    mode,
    developProcessList,
    getProjectData,
  } = props;
  const [isShowDialog, setIsShowDialog] = useState(false);

  let projectId: string | null = null;

  // 開始日
  const [startDate, setStartDate] = useState<string>("");

  // 終了日
  const [endDate, setEndDate] = useState<string>("");

  // 業務内容
  const [businessContent, setBusinessContent] = useState<string>("");

  // 主要プログラミング言語一覧
  const programLangList: listData[] = [
    { key: 1, label: "Java" },
    { key: 2, label: "C" },
    { key: 3, label: "C#" },
    { key: 5, label: "PHP" },
    { key: 6, label: "Ruby" },
    { key: 7, label: "JavaScript" },
    { key: 9, label: "Python" },
    { key: 11, label: "TypeScript" },
    { key: 12, label: "VBA" },
    { key: 13, label: "COBOL" },
    { key: 14, label: "HTML" },
    { key: 15, label: "CSS" },
  ];

  // 選択済みプログラミング言語一覧
  const [selectedProgramLang, setSelectedProgramLang] = useState<listData[]>(
    []
  );

  // 主要フレームワーク一覧
  const frameworkList: listData[] = [
    { key: 1, label: "Ruby on Rails" },
    { key: 2, label: "Unity" },
    { key: 3, label: "Node.js" },
    { key: 4, label: "Laravel" },
    { key: 5, label: "React" },
    { key: 6, label: "Vue.js" },
    { key: 7, label: "Angular" },
    { key: 8, label: "Django" },
  ];

  // 選択済みフレームワーク一覧
  const [selectedFramework, setSelectedFramework] = useState<listData[]>([]);

  // 主要データベース一覧
  const databaseList: listData[] = [
    { key: 1, label: "Oracle" },
    { key: 2, label: "PostgreSQL" },
    { key: 3, label: "MySQL" },
    { key: 4, label: "DB2" },
    { key: 5, label: "SQLite" },
    { key: 6, label: "SQLServer" },
    { key: 7, label: "MongoDB" },
  ];
  // 選択済みデータベース一覧
  const [selectedDatabase, setSelectedDatabase] = useState<listData[]>([]);

  // ツール一覧
  const toolList: listData[] = [
    { key: 1, label: "Eclipse" },
    { key: 2, label: "Visual Studio Code" },
    { key: 3, label: "Visual Studio" },
    { key: 4, label: "Xcode" },
    { key: 5, label: "IntelliJ IDEA" },
  ];
  const [selectedTool, setSelectedTool] = useState<listData[]>([]);

  // 開発工程
  const [selectedDevelopProcess, setSelectedDevelopProcess] = useState<
    listData[]
  >([]);

  // リスト作成
  const getListData = (data: string, listData: listData[]) => {
    let array = data.split(",");
    let newData: listData[] = [];
    array.forEach((item) => {
      let list = listData.find((d) => d.label === item);
      if (list) newData.push(list);
    });
    let notListData: string[] = array.filter(
      (item) => !listData.map((d) => d.label).includes(item)
    );
    let maxListKey = Math.max.apply(
      null,
      listData.map((item) => item.key)
    );
    notListData.forEach((item) => {
      newData.push({
        key: maxListKey + 1,
        label: item,
      });
      maxListKey++;
    });

    return newData;
  };

  // エラーフラグ
  const [isErrStartDate, setIsErrStartDate] = useState(false);
  const [isErrEndDate, setIsErrEndDate] = useState(false);
  const [isErrBusinessContent, setIsErrBusinessContent] = useState(false);
  const [isErrProcess, setIsErrProcess] = useState(false);

  useEffect(() => {
    setIsShowDialog(isShow);
    setIsErrStartDate(false);
    setIsErrEndDate(false);
    setIsErrBusinessContent(false);
    setIsErrProcess(false);
    if (isShow) {
      if (editProjectData) {
        projectId = editProjectData.projectId;

        if (mode === "update") {
          setStartDate(editProjectData.startDate);
          setEndDate(editProjectData.endDate);
        } else {
          setStartDate("");
          setEndDate("");
        }

        setBusinessContent(editProjectData.businessContent);

        let programLang: listData[] = getListData(
          editProjectData.programLang,
          programLangList
        );
        if (programLang.length > 0) setSelectedProgramLang(programLang);

        let framework: listData[] = getListData(
          editProjectData.framework,
          frameworkList
        );
        if (framework.length > 0) setSelectedFramework(framework);

        let database: listData[] = getListData(
          editProjectData.database,
          databaseList
        );
        if (database.length > 0) setSelectedDatabase(database);

        let tool: listData[] = getListData(editProjectData.tool, toolList);
        if (tool.length > 0) setSelectedTool(tool);

        let developProcess = editProjectData.developProcess.split(",");
        let newSelectedDevelopProcess: listData[] = [];
        developProcess.forEach((data) => {
          let listData = developProcessList.find(
            (d) => d.key === parseInt(data)
          );
          if (listData) newSelectedDevelopProcess.push(listData);
        });
        if (developProcess.length > 0)
          setSelectedDevelopProcess(newSelectedDevelopProcess);
      } else {
        setStartDate("");
        setEndDate("");
        setBusinessContent("");
        setSelectedProgramLang([]);
        setSelectedFramework([]);
        setSelectedDatabase([]);
        setSelectedTool([]);
        setSelectedDevelopProcess([]);
      }
    }
  }, [isShow]);

  // プロジェクト保存
  const onClickSave = () => {
    let isErr = false;
    let startYear = "";
    let startMonth = "";
    if (startDate.length === 7) {
      startYear = startDate.slice(0, 4);
      startMonth = startDate.slice(-2);
      setIsErrStartDate(false);
    } else {
      setIsErrStartDate(true);
      isErr = true;
    }

    let endYear = "";
    let endMonth = "";
    if (endDate.length === 7) {
      endYear = endDate.slice(0, 4);
      endMonth = endDate.slice(-2);
      if (parseInt(startYear) - parseInt(endYear) > 0) {
        setIsErrEndDate(true);
        isErr = true;
      } else if (
        parseInt(startYear) === parseInt(endYear) &&
        parseInt(startMonth) - parseInt(endMonth) > 0
      ) {
        setIsErrEndDate(true);
        isErr = true;
      } else {
        setIsErrEndDate(false);
      }
    }

    if (businessContent.trim().length === 0) {
      setIsErrBusinessContent(true);
      isErr = true;
    } else {
      setIsErrBusinessContent(false);
    }
    if (selectedDevelopProcess.length === 0) {
      setIsErrProcess(true);
      isErr = true;
    } else {
      setIsErrProcess(false);
    }

    if (isErr) return;

    const programLang = selectedProgramLang.map((d) => d.label).join(",");
    const framework = selectedFramework.map((d) => d.label).join(",");
    const database = selectedDatabase.map((d) => d.label).join(",");
    const tool = selectedTool.map((d) => d.label).join(",");
    const developProcess = selectedDevelopProcess.map((d) => d.key).join(",");

    const params = {
      user: userId,
      projectId: mode === "insert" ? nextProjectId : editProjectData?.projectId,
      mode: mode,
      startYear: startYear,
      startMonth: startMonth,
      endYear: endYear,
      endMonth: endMonth,
      businessContent: businessContent,
      programLang: programLang,
      framework: framework,
      database: database,
      tool: tool,
      developProcess: developProcess,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    };
    fetch("/saveProjectData", requestOptions)
      //レスポンスをjsonとして受け取りjsオブジェクトを生成
      //生成したjsオブジェクトをdataに代入
      .then((res) => res.json())
      .then((json) => {
        alert("プロジェクトを登録しました。");
        getProjectData();
        setIsShowDialog(false);
        setIsShow(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div>
      <Dialog
        open={isShowDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={false}
      >
        <DialogTitle id="confirmation-dialog-title">
          {projectId ? "プロジェクト情報編集" : "プロジェクト追加"}
        </DialogTitle>
        <DialogContent style={{ width: "820px" }}>
          {(isErrStartDate ||
            isErrEndDate ||
            isErrBusinessContent ||
            isErrProcess) && (
            <div style={{ marginBottom: "10px" }}>
              {isErrStartDate && (
                <FormHelperText error>*開始日は必須です</FormHelperText>
              )}
              {isErrEndDate && (
                <FormHelperText error>
                  *終了日は開始日以降を設定してください
                </FormHelperText>
              )}
              {isErrBusinessContent && (
                <FormHelperText error>*業務内容は必須です</FormHelperText>
              )}
              {isErrProcess && (
                <FormHelperText error>*開発工程は必須です</FormHelperText>
              )}
            </div>
          )}
          <div style={{ display: "flex", marginBottom: "15px" }}>
            <div style={{ marginRight: "30px" }}>
              <TitleText text={"開始日"} isErr={isErrStartDate} />
              <TextField
                type="month"
                value={startDate}
                style={{ width: "130px", marginRight: "20px" }}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                error={isErrStartDate}
              />
            </div>
            <div>
              <TitleText text={"終了日"} isErr={isErrEndDate} />
              <TextField
                type="month"
                style={{ width: "130px" }}
                value={endDate}
                onChange={(e: any) => {
                  setEndDate(e.target.value);
                }}
                error={isErrEndDate}
              />
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <TitleText text={"業務内容"} isErr={isErrBusinessContent} />
            <TextField
              required
              multiline
              fullWidth
              rows={2}
              variant="outlined"
              value={businessContent}
              onChange={(e: any) => {
                setBusinessContent(e.target.value);
              }}
              className={classes.textBox}
              error={isErrBusinessContent}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <TitleText text="プログラミング言語" isErr={false} />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {programLangList.map((data) => {
                return (
                  <Button
                    key={data.key}
                    size="small"
                    variant={
                      selectedProgramLang.some((d) => d.key === data.key)
                        ? "contained"
                        : "outlined"
                    }
                    color={
                      selectedProgramLang.some((d) => d.key === data.key)
                        ? "default"
                        : "primary"
                    }
                    disableElevation
                    style={{
                      textTransform: "none",
                      marginRight: "3px",
                      marginBottom: "2px",
                    }}
                    startIcon={<CheckIcon />}
                    onClick={() => {
                      let newData = JSON.parse(
                        JSON.stringify(selectedProgramLang)
                      );
                      if (selectedProgramLang.some((d) => d.key === data.key)) {
                        newData = newData.filter(
                          (d: listData) => d.key !== data.key
                        );
                      } else {
                        newData.push(data);
                      }
                      setSelectedProgramLang(newData);
                    }}
                  >
                    {data.label}
                  </Button>
                );
              })}
            </div>
            <AddArea
              listItem={programLangList}
              selectedItem={selectedProgramLang}
              setSelectedItem={setSelectedProgramLang}
            />
            <ChipsArray
              chipData={selectedProgramLang}
              setChipData={setSelectedProgramLang}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <TitleText text="フレームワーク" isErr={false} />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {frameworkList.map((data) => {
                return (
                  <Button
                    key={data.key}
                    size="small"
                    variant={
                      selectedFramework.some((d) => d.key === data.key)
                        ? "contained"
                        : "outlined"
                    }
                    color={
                      selectedFramework.some((d) => d.key === data.key)
                        ? "default"
                        : "primary"
                    }
                    disableElevation
                    style={{
                      textTransform: "none",
                      marginRight: "3px",
                      marginBottom: "2px",
                    }}
                    startIcon={<CheckIcon />}
                    onClick={() => {
                      let newData = JSON.parse(
                        JSON.stringify(selectedFramework)
                      );
                      if (selectedFramework.some((d) => d.key === data.key)) {
                        newData = newData.filter(
                          (d: listData) => d.key !== data.key
                        );
                      } else {
                        newData.push(data);
                      }
                      setSelectedFramework(newData);
                    }}
                  >
                    {data.label}
                  </Button>
                );
              })}
            </div>
            <AddArea
              listItem={frameworkList}
              selectedItem={selectedFramework}
              setSelectedItem={setSelectedFramework}
            />
            <ChipsArray
              chipData={selectedFramework}
              setChipData={setSelectedFramework}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <TitleText text="データベース" isErr={false} />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {databaseList.map((data) => {
                return (
                  <Button
                    key={data.key}
                    size="small"
                    variant={
                      selectedDatabase.some((d: listData) => d.key === data.key)
                        ? "contained"
                        : "outlined"
                    }
                    color={
                      selectedDatabase.some((d: listData) => d.key === data.key)
                        ? "default"
                        : "primary"
                    }
                    disableElevation
                    style={{
                      textTransform: "none",
                      marginRight: "3px",
                      marginBottom: "2px",
                    }}
                    startIcon={<CheckIcon />}
                    onClick={() => {
                      let newData = JSON.parse(
                        JSON.stringify(selectedDatabase)
                      );
                      if (
                        selectedDatabase.some(
                          (d: listData) => d.key === data.key
                        )
                      ) {
                        newData = newData.filter(
                          (d: listData) => d.key !== data.key
                        );
                      } else {
                        newData.push(data);
                      }
                      setSelectedDatabase(newData);
                    }}
                  >
                    {data.label}
                  </Button>
                );
              })}
            </div>
            <AddArea
              listItem={databaseList}
              selectedItem={selectedDatabase}
              setSelectedItem={setSelectedDatabase}
            />
            <ChipsArray
              chipData={selectedDatabase}
              setChipData={setSelectedDatabase}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <TitleText text="ツール" isErr={false} />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {toolList.map((data) => {
                return (
                  <Button
                    key={data.key}
                    size="small"
                    variant={
                      selectedTool.some((d: listData) => d.key === data.key)
                        ? "contained"
                        : "outlined"
                    }
                    color={
                      selectedTool.some((d: listData) => d.key === data.key)
                        ? "default"
                        : "primary"
                    }
                    disableElevation
                    style={{
                      textTransform: "none",
                      marginRight: "3px",
                      marginBottom: "2px",
                    }}
                    startIcon={<CheckIcon />}
                    onClick={() => {
                      let newData = JSON.parse(JSON.stringify(selectedTool));
                      if (
                        selectedTool.some((d: listData) => d.key === data.key)
                      ) {
                        newData = newData.filter(
                          (d: listData) => d.key !== data.key
                        );
                      } else {
                        newData.push(data);
                      }
                      setSelectedTool(newData);
                    }}
                  >
                    {data.label}
                  </Button>
                );
              })}
            </div>
            <AddArea
              listItem={toolList}
              selectedItem={selectedTool}
              setSelectedItem={setSelectedTool}
            />
            <ChipsArray chipData={selectedTool} setChipData={setSelectedTool} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <TitleText text={"開発工程"} isErr={isErrProcess} />
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                {developProcessList.map((process, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      value={process.key}
                      control={
                        <Checkbox
                          color="primary"
                          checked={selectedDevelopProcess.some(
                            (d: listData) => d.key === process.key
                          )}
                          onChange={() => {
                            let newData = JSON.parse(
                              JSON.stringify(selectedDevelopProcess)
                            );
                            if (
                              selectedDevelopProcess.some(
                                (d: listData) => d.key === process.key
                              )
                            ) {
                              newData = newData.filter(
                                (d: listData) => d.key !== process.key
                              );
                            } else {
                              newData.push(process);
                            }
                            setSelectedDevelopProcess(newData);
                          }}
                        />
                      }
                      label={process.label}
                      labelPlacement="end"
                    />
                  );
                })}
              </FormGroup>
            </FormControl>
          </div>
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
            閉じる
          </Button>
          <Button
            variant="contained"
            color="primary"
            autoFocus
            onClick={() => {
              onClickSave();
            }}
          >
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

/**
 * 選択済みアイテムチップコンポーネント
 */
const useChipStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      overflowY: "auto",
      listStyle: "none",
      border: "lightgray 1px solid",
      borderRadius: "4px",
      padding: theme.spacing(0.5),
      marginTop: theme.spacing(0.5),
      height: "90px",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

const ChipsArray = (props: { chipData: listData[]; setChipData: any }) => {
  const { chipData, setChipData } = props;
  const classes = useChipStyles();

  const handleDelete = (chipToDelete: listData) => {
    setChipData((chips: listData[]) =>
      chips.filter((chip: listData) => chip.key !== chipToDelete.key)
    );
  };

  return (
    <div className={classes.root}>
      {chipData.map((data) => {
        return (
          <li key={data.key}>
            <Chip
              label={data.label}
              variant="outlined"
              color="default"
              onDelete={() => {
                handleDelete(data);
              }}
              className={classes.chip}
            />
          </li>
        );
      })}
    </div>
  );
};

/**
 * アイテム追加テキストボタンエリア
 */
const useAddAreaStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "230px",
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: theme.palette.primary.main,
        },
        "&:hover fieldset": {
          borderColor: theme.palette.primary.main,
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main,
        },
      },
      "& .MuiInputBase-input": {
        padding: "0  0 0 10px",
      },
      "& .MuiOutlinedInput-adornedEnd ": {
        paddingRight: 0,
      },
    },
  })
);
const AddArea = (props: {
  listItem: listData[];
  selectedItem: listData[];
  setSelectedItem: any;
}) => {
  const { listItem, selectedItem, setSelectedItem } = props;
  const classes = useAddAreaStyles();

  const [addItem, setAddItem] = useState("");

  const handleClick = () => {
    if (addItem.trim().length === 0) return;
    const maxListKey = Math.max.apply(
      null,
      listItem.map((item) => item.key)
    );
    const listItemKey = listItem.map((list) => list.key);
    const noneListData = selectedItem.filter(
      (item) => !listItemKey.includes(item.key)
    );
    let newItem = JSON.parse(JSON.stringify(selectedItem));
    let key = 0;
    if (noneListData.length === 0) {
      key = maxListKey + 1;
    } else {
      key =
        Math.max.apply(
          null,
          noneListData.map((item) => item.key)
        ) + 1;
    }
    newItem.push({
      key: key,
      label: addItem,
    });
    setSelectedItem(newItem);
    setAddItem("");
  };

  return (
    <TextField
      size="small"
      variant="outlined"
      className={classes.root}
      value={addItem}
      onChange={(e) => {
        setAddItem(e.target.value);
      }}
      InputProps={{
        endAdornment: (
          <Button
            size="small"
            variant="contained"
            color="primary"
            disableElevation
            style={{
              margin: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              height: "100%",
            }}
            onClick={handleClick}
          >
            追加
          </Button>
        ),
      }}
    />
  );
};

interface filterPopoverProps {
  onClick: any;
  open: boolean;
  anchorEl: any;
  onClose: any;
  childComponent: React.ReactNode;
}

/**
 * フィルター子画面
 */
const FilterPopover = (props: filterPopoverProps) => {
  const { onClick, open, anchorEl, onClose, childComponent } = props;
  return (
    <>
      <IconButton
        color="inherit"
        aria-describedby="filterBusinessContens"
        onClick={onClick}
      >
        <FilterListIcon />
      </IconButton>
      <Popover
        open={open}
        id="filterBusinessContens"
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {childComponent}
      </Popover>
    </>
  );
};

export default ProjectList;
