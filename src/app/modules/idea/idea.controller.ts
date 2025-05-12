import catchAsync from '../../utils/catchAsync';
import { sendImageToCloudinary } from '../../utils/cloudinaryImageUploader';
import { httpStatus } from '../../utils/httpStatus';
import pick from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';
import { ideaFilterOptions, ideaPaginationOption } from './idea.constants';
import { IdeaServices } from './idea.service';

export class IdeaControllers {
  // draftAnIdea
  static draftAnIdea = catchAsync(async (req, res) => {
    const payload = req.body;

    if (req.files && req.files instanceof Array) {
      const imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
          const imageName = `${uniqueSuffix}-${req.user?.email.split('@')[0]}`;
          const path = file?.buffer;

          const { secure_url } = await sendImageToCloudinary(imageName, path);
          return secure_url;
        })
      );
      payload.images = [...payload.images, ...imageUrls];
    }

    const result = await IdeaServices.draftAnIdeaIntoDB(req.user, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Idea drafted successfully!',
      data: result,
    });
  });

  // createAnIdea
  static createAnIdea = catchAsync(async (req, res) => {
    const payload = req.body;

    if (req.files && req.files instanceof Array) {
      const imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
          const imageName = `${uniqueSuffix}-${req.user?.email.split('@')[0]}`;
          const path = file?.buffer;

          const { secure_url } = await sendImageToCloudinary(imageName, path);
          return secure_url;
        })
      );
      payload.images = [...payload.images, ...imageUrls];
    }

    const result = await IdeaServices.createAnIdeaIntoDB(req.user, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Idea posted successfully!',
      data: result,
    });
  });

  // getAllIdeas
  static getAllIdeas = catchAsync(async (req, res) => {
    const filters = pick(req.query, ideaFilterOptions);
    const options = pick(req.query, ideaPaginationOption);
    const result = await IdeaServices.getAllIdeasFromDB(filters, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Ideas fetched successfully!',
      meta: result.meta,
      data: result.data,
    });
  });

  // get all own ideas
  static getOwnAllIdeas = catchAsync(async (req, res) => {
    const filters = pick(req.query, ideaFilterOptions);
    const options = pick(req.query, ideaPaginationOption);
    const result = await IdeaServices.getOwnAllIdeasFromDB(
      filters,
      options,
      req.user
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Ideas fetched successfully!',
      meta: result.meta,
      data: result.data,
    });
  });

  // getSingleIdea
  static getSingleIdea = catchAsync(async (req, res) => {
    const result = await IdeaServices.getSingleIdeaFromDB(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Idea fetched successfully!',
      data: result,
    });
  });

  // updateAIdea
  static updateAIdea = catchAsync(async (req, res) => {
    const payload = req.body;

    // Check if new image files are uploaded
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
          const imageName = `${uniqueSuffix}-${req.user?.email.split('@')[0]}`;
          const path = file?.buffer;

          const { secure_url } = await sendImageToCloudinary(imageName, path);
          return secure_url;
        })
      );
      payload.images = imageUrls;
    } else {
      const existingIdea = await IdeaServices.getSingleIdeaFromDB(
        req.params.id
      );
      if (existingIdea) {
        payload.images = existingIdea.images;
      }
    }

    const result = await IdeaServices.updateIdeaFromDB(req.params.id, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Idea updated successfully!',
      data: result,
    });
  });

  // deleteAIdea
  static deleteAIdea = catchAsync(async (req, res) => {
    await IdeaServices.deleteAnIdeaFromDB(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Idea deleted successfully',
      data: null,
    });
  });
}
