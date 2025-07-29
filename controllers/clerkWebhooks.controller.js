import { Webhook } from "svix";
import User from "../models/user.model.js";
import { connectDB } from "../configs/db.js";

// THIS CREATES AND POST NEW USERS, ACTUALLY EVERYTHING IN DELETE AND UPDATE USER

const clerkWebhooks = async (req, res) => {
  try {
    await connectDB();

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify webhook signature
    await whook.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      username: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0].email_address,
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findOneAndUpdate({ _id: data.id }, userData);
        break;
      case "user.deleted":
        await User.findOneAndDelete({ _id: data.id });
        break;
      default:
        break;
    }

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
