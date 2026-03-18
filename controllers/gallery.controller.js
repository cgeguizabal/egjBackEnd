import cloudinary from "../utils/cloudinary.js";
import GalleryImage from "../models/galleryImage.model.js";

const GALLERY_FOLDER = "Gallery";
const IMAGES_PER_PAGE = 20;

// GET /api/v1/gallery?page=1
export const getGalleryImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const maxResults = IMAGES_PER_PAGE;

    let allResources = [];
    let nextCursor = null;

    do {
      const options = {
        max_results: 500,
        resource_type: "image",
      };

      if (nextCursor) {
        options.next_cursor = nextCursor;
      }

      const result = await cloudinary.api.resources_by_asset_folder(
        GALLERY_FOLDER,
        options,
      );

      allResources = allResources.concat(result.resources || []);
      nextCursor = result.next_cursor || null;
    } while (nextCursor);

    const totalImages = allResources.length;
    const totalPages = Math.ceil(totalImages / maxResults) || 1;

    const startIndex = (page - 1) * maxResults;
    const pageResources = allResources.slice(
      startIndex,
      startIndex + maxResults,
    );

    const publicIds = pageResources.map((resource) => resource.public_id);

    const likeDocs = await GalleryImage.find({
      public_id: { $in: publicIds },
    });

    const likeMap = {};
    likeDocs.forEach((doc) => {
      likeMap[doc.public_id] = doc.likes;
    });

    const images = pageResources.map((resource) => ({
      public_id: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      likes: likeMap[resource.public_id] || 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        images,
        pagination: {
          currentPage: page,
          totalPages,
          totalImages,
          imagesPerPage: maxResults,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /api/v1/gallery/like
export const likeGalleryImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "public_id is required",
      });
    }

    const doc = await GalleryImage.findOneAndUpdate(
      { public_id },
      { $inc: { likes: 1 } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      success: true,
      likes: doc.likes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /api/v1/gallery/unlike
export const unlikeGalleryImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "public_id is required",
      });
    }

    const doc = await GalleryImage.findOneAndUpdate(
      { public_id, likes: { $gt: 0 } },
      { $inc: { likes: -1 } },
      { new: true },
    );

    res.status(200).json({
      success: true,
      likes: doc ? doc.likes : 0,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
