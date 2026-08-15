const mongoose = require('mongoose');

const serviceReportSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service_report_id: String,
    service_date: Date,
    model: String,
    instrument_number: String,
    company_name: String,
    contact_person: String,
    mobile_number: String,
    amc_period: String,
    po_number: String,
    call_type: { type: String, enum: ['Installation', 'Warranty', 'AMC', 'On Call'] },
    customer_address: String,
    problem_reported: String,
    observations: String,
    engineer_remarks: String,
    customer_remarks: String,
    service_status: { type: String, enum: ['Completed', 'Incomplete'] },
    completion_date: Date
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('ServiceReport', serviceReportSchema);
