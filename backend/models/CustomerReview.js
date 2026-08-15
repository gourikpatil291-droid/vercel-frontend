const mongoose = require('mongoose');

const customerReviewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service_report_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceReport' },
    rating: Number,
    feedback: String
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('CustomerReview', customerReviewSchema);
