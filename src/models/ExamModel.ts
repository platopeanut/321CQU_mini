import StdModel from "../core/StdModel";
import {stdRequest} from "../core/network";
import stdUser from "../core/StdUser";

class ExamModel implements StdModel {
  async update() {
    const sid = stdUser.userInfo.sid;
    const x = await stdRequest(
      "/edu_admin_center/fetchExam",
      { "sid": sid }
    );
    console.log(x);
  }
}

export default new ExamModel();
