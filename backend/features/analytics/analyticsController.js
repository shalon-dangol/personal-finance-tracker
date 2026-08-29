import * as analyticsService from './analyticsService.js';

export const getSummary = async (req, res, next) => {
  try {
    const data = await analyticsService.getDashboardSummary(req.user._id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
