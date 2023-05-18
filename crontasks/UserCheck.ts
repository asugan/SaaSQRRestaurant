const cron = require("node-cron");
import { User } from "../models/User";
require("dotenv").config();

const apikey = process.env.Lemon_Secret;

const now: any = new Date().getTime();

export const checkUser = {
  userFunc: async () => {
    const finduser = await User.find({});

    for (let i = 0; i < finduser.length; i++) {
      if (finduser[i].daysLeft < now) {
        if (finduser[i].lemonid) {
          const fetchdata = await fetch(
            `https://api.lemonsqueezy.com/v1/subscriptions/${finduser[i].lemonid}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`,
              },
            }
          );

          const jsondata = await fetchdata.json();

          if (
            jsondata.data.attributes.status === "cancelled" ||
            jsondata.data.attributes.status === "expired"
          ) {
            finduser[i].userLevel = "Maraba";
            await finduser[i].save();
            continue;
          }
        } else {
          finduser[i].userLevel = "Maraba";
          await finduser[i].save();
          continue;
        }
      }
    }
  },

  runschedule: () =>
    cron.schedule("0 0 0 * * *", async () => {
      await checkUser.userFunc();
    }),
};
