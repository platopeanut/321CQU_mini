const task_api = require('./task_api')

Page({
    data: {
        subscribeList: [
            {
                name: "成绩通知",
                tmplId: "3NUUHtF4lmAUyL8knfaca_KRIpkblB50rFOMrNCRMAk",
                isSubscribed: false,
                event: 0
            },
            // {
            //     name: "考试提醒",
            //     tmplId: "QI0OxAxPk65czf4PSv94Wku8OkO0FIB9Rq0GipY2zS4",
            //     isSubscribed: false,
            //     event: 1
            // },
        ]
    },

    onShow() { this.updateInfo(); },

    onTapItem(e) {
        const that = this;
        const item = e.currentTarget.dataset.item;
        console.log(item);
        const StuInfo = wx.getStorageSync("StuInfo");
        if (!StuInfo || !StuInfo["id"]) {
            wx.showToast({
                title: "请先绑定统一身份信息",
                icon: "none"
            })
            return;
        }
        if (item.isSubscribed) {
            task_api.updateSubscribeInfo(StuInfo["id"], StuInfo["stu_id"], item["event"], false).then(res => {
                console.log(res);
                that.updateInfo();
            })
        }
        else {
            wx.requestSubscribeMessage({
                tmplIds: [item["tmplId"]],
                success (res) {
                    const opt = res[item["tmplId"]] === "accept";
                    console.log(opt);
                    task_api.updateSubscribeInfo(StuInfo["id"], StuInfo["stu_id"], item["event"], opt).then(res => {
                        console.log(res);
                        that.updateInfo();
                    })
                }
            })
        }
    },

    updateInfo() {
        const StuInfo = wx.getStorageSync("StuInfo");
        if (StuInfo && StuInfo["id"]) {
            console.log(StuInfo["id"])
            task_api.getSubscribeInfo(StuInfo['id']).then(res => {
                console.log(res.events)
                const subscribeList = this.data.subscribeList;
                for (const item of subscribeList) {
                    item.isSubscribed = res.events.includes(item.event);
                }
                this.setData({ subscribeList: subscribeList });
            })
        } else {
            wx.showToast({
                title: "请先绑定统一身份信息",
                icon: "none"
            });
        }
    }
})