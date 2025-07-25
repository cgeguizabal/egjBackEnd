export const getUserData = async (req, res) => {
  try {
    const { _id, username, email, image, role } = req.user;
    res.status(200).json({ success: true, _id, username, email, image, role });
  } catch (error) {
    res.status(500).json({
      success: false, // typo fixed from 'succes'
      message: error.message,
    });
  }
};
