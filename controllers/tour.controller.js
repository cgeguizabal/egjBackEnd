import Tour from "../models/tour.model.js";
import cloudinary from "../utils/cloudinary.js";

// Function to create a new tour with image upload
export const createTour = async (req, res) => {
  try {
    const { name, description, price, stripeProductId } = req.body;

    const files = req.files; // Uploaded files

    // Upload each image buffer to Cloudinary
    const imageUploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "tours" }, (error, result) => {
            if (error) reject(error);
            else
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
          })
          .end(file.buffer); // Send file buffer
      });
    });

    const imageUrls = await Promise.all(imageUploadPromises);

    const tour = new Tour({
      name,
      description,
      price,
      images: imageUrls,
      stripeProductId,
    });

    await tour.save();

    res.status(201).json({
      success: true,
      data: tour,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Tour
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Delete all images stored in the tour

    await Promise.all(
      tour.images.map(async (img) => {
        const result = await cloudinary.uploader.destroy(img.public_id);

        return result;
      })
    );
    await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Tour and images deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//GETTING TOURS

export const getTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      success: true,
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//Getting Tour by ID
export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(302).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
