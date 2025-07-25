export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    res.status(200).json({ success: true, role });
  } catch (error) {
    res.status(500).json({
      success: false, // typo fixed from 'succes'
      message: error.message,
    });
  }
};
