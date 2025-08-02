import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { catchAsync } from "../middleware/errorHandler";
import { Author } from "../models/Author";

// Get all authors
export const getAllAuthors = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = {};

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { nationality: { $regex: req.query.search, $options: "i" } },
    ];
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  }

  if (req.query.nationality) {
    filter.nationality = { $regex: req.query.nationality, $options: "i" };
  }

  // Get authors with pagination
  const authors = await Author.find(filter)
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit)
    .select("name slug description nationality photo isActive createdAt")
    .lean();

  const totalAuthors = await Author.countDocuments(filter);
  const totalPages = Math.ceil(totalAuthors / limit);

  res.status(200).json({
    status: "success",
    data: {
      authors,
      pagination: {
        currentPage: page,
        totalPages,
        totalAuthors,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
});

// Get single author by ID or slug
export const getAuthor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Try to find by ID first, then by slug
  let author = await Author.findById(id);
  if (!author) {
    author = await Author.findOne({ slug: id });
  }

  if (!author) {
    return res.status(404).json({
      status: "error",
      message: "No author found with that ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      author,
    },
  });
});

// Create new author
export const createAuthor = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      name,
      description,
      biography,
      birthDate,
      deathDate,
      nationality,
      photo,
      website,
      socialMedia,
      genres,
      awards,
      isActive = true,
    } = req.body;

    // Create author with metadata
    const author = await Author.create({
      name,
      description,
      biography,
      birthDate,
      deathDate,
      nationality,
      photo,
      website,
      socialMedia,
      genres,
      awards,
      isActive,
      metadata: {
        addedBy: req.user?._id,
        lastModifiedBy: req.user?._id,
        addedAt: new Date(),
        lastModifiedAt: new Date(),
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        author,
      },
    });
  }
);

// Update author
export const updateAuthor = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const {
      name,
      description,
      biography,
      birthDate,
      deathDate,
      nationality,
      photo,
      website,
      socialMedia,
      genres,
      awards,
      isActive,
    } = req.body;

    const author = await Author.findByIdAndUpdate(
      id,
      {
        name,
        description,
        biography,
        birthDate,
        deathDate,
        nationality,
        photo,
        website,
        socialMedia,
        genres,
        awards,
        isActive,
        "metadata.lastModifiedBy": req.user?._id,
        "metadata.lastModifiedAt": new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!author) {
      return res.status(404).json({
        status: "error",
        message: "No author found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        author,
      },
    });
  }
);

// Delete author
export const deleteAuthor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const author = await Author.findByIdAndDelete(id);

  if (!author) {
    return res.status(404).json({
      status: "error",
      message: "No author found with that ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get authors for dropdown/select options
export const getAuthorsForSelect = catchAsync(
  async (req: Request, res: Response) => {
    const authors = await Author.find({ isActive: true })
      .select("_id name description")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      status: "success",
      data: {
        authors,
      },
    });
  }
);
