import { Response } from "express";
import { IReqAuth } from "../config/interface";
import Notifications from "../models/notificationModel";

const notificationController = {
  getNotifications: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    const limit = Number(req.query.limit) * 1 || 5;
    const skip = Number(req.query.skip);

    try {
      const notifications = await Notifications.aggregate([
        {
          $facet: {
            totalData: [
              { $match: { receiver: { $eq: req.user._id } } },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              { $match: { receiver: { $eq: req.user._id } } },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      const data = notifications[0].totalData;
      const total = notifications[0].count || 0;

      return res.json({ data, total });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateNotificationView: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    const _id = `${req.params.id}`;
    const receiver = `${req.user._id}`;

    try {
      await Notifications.findOneAndUpdate({ _id, receiver }, { viewed: true });

      return res.json({ msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default notificationController;
