import StdModel from "../core/StdModel";
import stdUser from "../core/StdUser";
import {stdRequest} from "../core/network";

class CourseModel implements StdModel {

  public async update(offset: 0 | 1 = 0) {
    const sid = stdUser.userInfo.sid;
    const x = await stdRequest(
      "/edu_admin_center/fetchCourseTimetable",
      { "code": sid, "offset": offset }
    );
    console.log(x);
  }
}

export default new CourseModel();
