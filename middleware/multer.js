import multer from "multer";

// Memory storage means files won't be saved on disk
const storage = multer.memoryStorage();

export const upload = multer({ storage });
