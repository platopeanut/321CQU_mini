import StdModel from "../core/StdModel";
import {stdRequest} from "../core/network";
import stdUser from "../core/StdUser";

class GradeModel implements StdModel {
  async update() {
    const sid = stdUser.userInfo.sid;
    const x = await stdRequest(
      "/edu_admin_center/fetchScore",
      { "sid": sid, "is_minor": true }
    );
    console.log(x);
  }
}

export default new GradeModel();
