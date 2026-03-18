import cloudinary from "../utils/cloudinary.js";
import GalleryImage from "../models/galleryImage.model.js";

const GALLERY_FOLDER = "Gallery";
const IMAGES_PER_PAGE = 20;

// GET /api/v1/gallery?page=1
export const getGalleryImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const maxResults = IMAGES_PER_PAGE;

    // Fetch all resources from the Gallery folder in Cloudinary
    // next_cursor is used for Cloudinary pagination
    let allResources = [];
    let nextCursor = null;

    // We need to collect enough to skip to the requested page
    // Cloudinary paginates with cursors, so we gather page * maxResults items minimum
    const targetCount = page * maxResults;

    do {
      const options = {
        type: "upload",
        prefix: GALLERY_FOLDER + "/",
        max_results: 500,
        resource_type: "image",
      };
      if (nextCursor) options.next_cursor = nextCursor;

      const result = await cloudinary.api.resources(options);
      allResources = allResources.concat(result.resources);
      nextCursor = result.next_cursor || null;

      if (allResources.length >= targetCount) break;
    } while (nextCursor);

    const totalImages = allResources.length;
    const totalPages = Math.ceil(totalImages / maxResults);

    const startIndex = (page - 1) * maxResults;
    const pageResources = allResources.slice(
      startIndex,
      startIndex + maxResults,
    );

    // Get or create like counts for the returned images
    const publicIds = pageResources.map((r) => r.public_id);

    const likeDocs = await GalleryImage.find({ public_id: { $in: publicIds } });
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
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/gallery/:publicId/like
export const likeGalleryImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    // public_id may contain slashes (e.g. "Gallery/abc123"), decode it
    const decodedPublicId = decodeURIComponent(publicId);

    const doc = await GalleryImage.findOneAndUpdate(
      { public_id: decodedPublicId },
      { $inc: { likes: 1 } },
      { new: true, upsert: true },
    );

    res.status(200).json({ success: true, likes: doc.likes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/gallery/:publicId/unlike
export const unlikeGalleryImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    const decodedPublicId = decodeURIComponent(publicId);

    const doc = await GalleryImage.findOneAndUpdate(
      { public_id: decodedPublicId, likes: { $gt: 0 } },
      { $inc: { likes: -1 } },
      { new: true, upsert: false },
    );

    const likes = doc ? doc.likes : 0;
    res.status(200).json({ success: true, likes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
