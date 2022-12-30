const cron = require("node-cron");
import { User } from "../models/User";

export const UserTask = {
  runschedule: () =>
    cron.schedule("* * * * *", async () => {
      const finduser = await User.find({});

      for (let i = 0; i < finduser.length; i++) {
        finduser[i].daysLeft = finduser[i].daysLeft - 1;
        await finduser[i].save();

        console.log(finduser[i]);
      }
    }),
};
