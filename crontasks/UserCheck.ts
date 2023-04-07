const cron = require("node-cron");
import { User } from "../models/User";

const now: any = new Date().getTime();

export const checkUser = {
  userFunc: async () => {
    const finduser = await User.find({});

    for (let i = 0; i < finduser.length; i++) {
      if (finduser[i].daysLeft < now) {
        finduser[i].userLevel = "Maraba";
        await finduser[i].save();
        continue;
      }
    }
  },

  runschedule: () =>
    cron.schedule("0 0 0 * * *", async () => {
      await checkUser.userFunc();
    }),
};
