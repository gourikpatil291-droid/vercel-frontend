const mongoose = require('mongoose');

const closureFormSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    acceptance_date: Date,
    document_number: String,
    customer_name: String,
    equipment_name: String,
    instrument_number: String,
    serial_number: String,
    installation_remarks: String,
    customer_representative: String,
    company_representative: String
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('ClosureForm', closureFormSchema);
