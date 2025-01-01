import { Webhook } from "svix";
import User from "../models/user.model.js";

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET_KEY;

  // check webhook secret
  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook secret needed!");
  }

  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);

  let event;

  try {
    event = wh.verify(payload, headers);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Webhook verification failed!",
    });
  }

  // console.log(event.data);

  // storing user data in db
  if (event.type === "user.created") {
    const newUser = new User({
      clerkUserId: event.data.id,
      userName:
        event.data.username || event.data.email_addresses[0].email_address, // if no userName then email would be used as userName
      email: event.data.email_addresses[0].email_address,
      img: event.data.profile_image_url,
    });

    await newUser.save();
  }

  return res.status(201).json({ success: true, message: "Web hook recieved" });
};
