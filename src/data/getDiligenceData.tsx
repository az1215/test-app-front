export function getAtndData(year: Number, month: Number) {
  let isApproved = true;
  if (month === 1) {
    isApproved = false;
  }
  let result = {
    isApproved: isApproved,
    data: [],
  };

  fetch("/getAtndData")
    //レスポンスをjsonとして受け取りjsオブジェクトを生成
    //生成したjsオブジェクトをdataに代入
    .then((res) => res.json())
    .then((json) => {
      result.isApproved = json.isApproved;
      result.data = json.data;
      return result;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
