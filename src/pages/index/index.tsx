import {FC} from "react";
import {View} from "@tarojs/components";
import {printAllStorage} from "../../core/storage";
import examModel from "../../models/ExamModel";

type IndexPropsType = {}

async function main() {
  try {
    // await login("20201682", "cjm2857177614");
    // console.log("登陆成功！");
    // await bindOpenID();
    // console.log("绑定成功！");
    // await courseModel.update();
    // console.log("获取课程信息成功！");
    await examModel.update();
    printAllStorage();
    // clearAllStorage();
  } catch (e) {
    console.log(e);
  }
}

const Index: FC<IndexPropsType> = () => {
  main().catch(console.error);
  return (<View></View>);
}

export default Index
