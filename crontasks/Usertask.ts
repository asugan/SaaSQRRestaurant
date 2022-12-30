const cron = require("node-cron");
import { User } from "../models/User";

export const UserTask = {
  findwithday: async () => {
    const finduser = await User.find({}).populate("userMenu");

    for (let i = 0; i < finduser.length; i++) {
      if (finduser[i].daysLeft >= 1) {
        finduser[i].daysLeft = finduser[i].daysLeft - 1;
        await finduser[i].save();

        console.log(finduser[i]);
        continue;
      } else if (finduser[i].daysLeft === 0) {
        if (finduser[i].userLevel === "Abone" || "Satıcı") {
          finduser[i].userLevel = "Deneme";
          await finduser[i].save();

          continue;
        }
        continue;
      }
    }
  },

  findwithoutday: async () => {
    const finddeneme: any = await User.find({
      daysLeft: 0,
      userLevel: "Deneme",
    }).populate("userMenu");

    for (let i = 0; i < finddeneme.length; i++) {
      for (let x = 0; x < finddeneme[i].userMenu.length; x++) {
        finddeneme[i].userMenu[x].isVisible = false;

        await finddeneme[i].userMenu[x].save();
      }
    }
  },

  runschedule: () =>
    cron.schedule("0 0 0 * * *", async () => {
      await UserTask.findwithday();
      await UserTask.findwithoutday();
    }),
};
