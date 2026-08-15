const mongoose = require('mongoose');

const installationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    document_id: String,
    installation_date: Date,
    equipment_name: String,
    instrument_number: String,
    serial_number: String,
    invoice_number: String,
    invoice_date: Date,
    warranty_start: Date,
    warranty_end: Date,
    customer_name: String,
    delivery_address: String,
    customer_representative: String,
    engineer_name: String,
    remarks: String
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Installation', installationSchema);
