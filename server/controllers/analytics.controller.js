const { analyticsService } = require("../services/analytics.services");

const getUserAnalytics = async (req, res) => {
    try {
        const { userId } = req.user;
        const analytics = await analyticsService(userId);
        res.status(200).json(analytics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getUserAnalytics,
};
