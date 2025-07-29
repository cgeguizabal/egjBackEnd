export const adminOnly = async (req, res, next) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Admins Only" });
  }
  next();
};
