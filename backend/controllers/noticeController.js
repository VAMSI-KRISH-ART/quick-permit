const Notice = require('../models/noticeModel.js');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private (any logged in user)
const getAllNotices = async (req, res, next) => {
    try {
        const notices = await Notice.find({}).populate('postedBy', 'name').sort({ createdAt: -1 });
        
        // Format for dashboard
        const formattedNotices = notices.map(n => ({
            title: n.title,
            content: n.content,
            posted_on: n.createdAt
        }));

        res.json(formattedNotices);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllNotices };