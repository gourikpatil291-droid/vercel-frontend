import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ServiceFormsPage() {
  const [installationForm, setInstallationForm] = useState({});
  const [serviceForm, setServiceForm] = useState({});
  const [feedbackForm, setFeedbackForm] = useState({ checks: {} });

  const handleInstallChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setInstallationForm({ ...installationForm, [e.target.name]: value });
  };
  const handleServiceChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setServiceForm({ ...serviceForm, [e.target.name]: value });
  };
  const handleFeedbackChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFeedbackForm({ ...feedbackForm, [e.target.name]: value });
  };
  
  const handleFeedbackCheck = (qIndex, label) => {
    setFeedbackForm({
      ...feedbackForm,
      checks: {
        ...feedbackForm.checks,
        [qIndex]: label
      }
    });
  };

  const submitInstallation = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/forms/installations`, installationForm);
      toast.success('Acceptance Certificate saved successfully!');
    } catch (error) {
      toast.error('Failed to save Acceptance Certificate');
    }
  };

  const submitServiceReport = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/forms/service-reports`, serviceForm);
      toast.success('Service report saved successfully!');
    } catch (error) {
      toast.error('Failed to save service report');
    }
  };

  const submitCustomerFeedback = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        service_report_id: null,
        rating: feedbackForm.checks['6'] === 'Very Good' ? 5 : feedbackForm.checks['6'] === 'Good' ? 4 : 3,
        feedback: JSON.stringify({
          document_id: feedbackForm.document_id,
          model: feedbackForm.model,
          company: feedbackForm.company,
          answers: feedbackForm.checks,
          improvement: feedbackForm.improvement
        })
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/forms/customer-feedbacks`, payload);
      toast.success('Customer Feedback saved successfully!');
    } catch (error) {
      toast.error('Failed to save Customer Feedback');
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-wrapper');
    const opt = {
      margin: 0,
      filename: `service_forms_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach(el => el.style.display = 'none');

    html2pdf().set(opt).from(element).save().then(() => {
      noPrintElements.forEach(el => el.style.display = '');
    });
  };

  return (
    <div className="bg-[#f4f1ea] min-h-screen p-8 pb-20">
      
      {/* Global Print / PDF Controls */}
      <div className="flex justify-end max-w-[210mm] mx-auto mb-6 no-print gap-4">
        <button 
          onClick={() => window.print()}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg shadow-sm"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Forms
        </button>
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center px-4 py-2 bg-[#a67c52] hover:bg-[#8b6845] text-white rounded-lg shadow-sm"
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF
        </button>
      </div>

      <style>{`
        .a4-page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto 30px auto;
            background: #fff;
            padding: 25px;
            border: 1px solid #000;
            color: #000;
            font-family: Arial, Helvetica, sans-serif;
            position: relative;
        }
        .header-sec { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .logo-title { display: flex; gap: 12px; align-items: flex-start; }
        .logo-img { width: 60px; height: 60px; border: 2px solid #000; border-radius: 50%; object-fit: contain; }
        .company-name { font-size: 30px; font-weight: 700; line-height: 1.2; }
        .company-details { text-align: right; font-size: 13px; line-height: 1.5; }
        .form-title { text-align: center; font-size: 34px; font-weight: 700; margin: 20px 0 10px; }
        .format-no { text-align: right; font-size: 14px; font-weight: 700; margin-bottom: 12px; }
        .a4-table { width: 100%; border-collapse: collapse; }
        .a4-table td, .a4-table th { border: 1px solid #000; padding: 8px; font-size: 15px; vertical-align: top; }
        .lbl { width: 180px; font-weight: 700; }
        .note { margin-top: 25px; font-size: 17px; line-height: 1.7; }
        .note ul { margin-left: 30px; margin-top: 10px; }
        .sig-section { margin-top: 60px; display: flex; justify-content: space-between; gap: 40px; }
        .sig-box { width: 45%; }
        .sig-line { border-bottom: 1px solid #000; margin-top: 50px; }
        .ctr { text-align: center; }
        .sml { font-size: 12px; }
        .chk { width: 18px; height: 18px; accent-color: #000; }
        .sec-title { font-weight: 700; background: #f1f1f1; }
        .a4-input { width: 100%; border: none; outline: none; font-size: 15px; background: transparent; }
        .a4-textarea { width: 100%; border: none; outline: none; resize: none; font-size: 15px; background: transparent; }
        .chk-row { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
        .save-btn { position: absolute; top: -15px; right: -15px; padding: 8px 16px; background: #a67c52; color: white; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: none; }
        
        @media print {
            body { background: #fff; padding: 0; }
            .a4-page { border: none; margin: 0 auto; page-break-after: always; padding: 0; width: 100%; }
            .no-print { display: none !important; }
        }
      `}</style>

      <div id="pdf-wrapper">
        
        {/* ========================================================= */}
        {/* ================= ACCEPTANCE CERTIFICATE ================= */}
        {/* ========================================================= */}
        <form onSubmit={submitInstallation} className="a4-page shadow-2xl">
          <button type="submit" className="save-btn no-print hover:bg-[#8b6845]">Save Acceptance</button>
          
          <div className="header-sec">
              <div className="logo-title">
                  <img src="/logo.png" className="logo-img" alt="Logo" />
                  <div className="company-name">Nucleus Analytics Private Limited</div>
              </div>
              <div className="company-details">
                  # 30C, 3rd Floor, 6th Main, J.C Industrial Layout,<br/>
                  Kanakapura Main Road, Yelachenahalli,<br/>
                  Bengaluru – 560 062. INDIA<br/>
                  Tel: +91 80 79617756<br/>
                  CIN: U29305KA2012PTC063848<br/>
                  GSTIN: 29AACEN0161E1ZR
              </div>
          </div>

          <div className="form-title">Acceptance Certificate</div>
          <div className="format-no">Format no: NAPL/FOR/ACC/01</div>

          <table className="a4-table">
            <tbody>
              <tr>
                  <td className="lbl">Document ID:</td>
                  <td><input type="text" className="a4-input" name="document_id" value={installationForm.document_id||''} onChange={handleInstallChange} /></td>
                  <td className="lbl">Date:</td>
                  <td><input type="date" className="a4-input" name="invoice_date" value={installationForm.invoice_date||''} onChange={handleInstallChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Equipment:</td>
                  <td colSpan="3"><input type="text" className="a4-input" name="equipment_name" value={installationForm.equipment_name||''} onChange={handleInstallChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Instrument No.:</td>
                  <td colSpan="3"><input type="text" className="a4-input" name="instrument_number" value={installationForm.instrument_number||''} onChange={handleInstallChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Serial No.:</td>
                  <td colSpan="3"><input type="text" className="a4-input" name="serial_number" value={installationForm.serial_number||''} onChange={handleInstallChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Customer:</td>
                  <td colSpan="3"><textarea rows="3" className="a4-textarea" name="customer_name" value={installationForm.customer_name||''} onChange={handleInstallChange}></textarea></td>
              </tr>
              <tr>
                  <td className="lbl">Delivery Address:</td>
                  <td colSpan="3"><textarea rows="3" className="a4-textarea" name="delivery_address" value={installationForm.delivery_address||''} onChange={handleInstallChange}></textarea></td>
              </tr>
              <tr>
                  <td className="lbl">Nucleus Invoice No.:</td>
                  <td colSpan="3"><input type="text" className="a4-input" name="invoice_number" value={installationForm.invoice_number||''} onChange={handleInstallChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Nucleus Invoice Date:</td>
                  <td colSpan="3"><input type="date" className="a4-input" /></td>
              </tr>
              <tr>
                  <td className="lbl">Warranty Period:</td>
                  <td>Start: <input type="date" className="a4-input w-auto inline-block ml-2" name="warranty_start" value={installationForm.warranty_start||''} onChange={handleInstallChange} /></td>
                  <td colSpan="2">End: <input type="date" className="a4-input w-auto inline-block ml-2" name="warranty_end" value={installationForm.warranty_end||''} onChange={handleInstallChange} /></td>
              </tr>
            </tbody>
          </table>

          <div className="note">
              This is to certify that the equipment mentioned above has been successfully installed,
              tested, and commissioned on <input type="date" className="a4-input inline-block w-auto border-b border-black" name="installation_date" value={installationForm.installation_date||''} onChange={handleInstallChange} />, to the satisfaction of the customer
              as per the agreed terms and conditions.
              <br/><br/>
              The system is now fully functional and ready for operational use.
              <br/><br/>
              Enclosures (if applicable):
              <ul>
                  <li>Minutes of Meeting</li>
                  <li>Installation Report</li>
                  <li>Claim Report</li>
              </ul>
          </div>

          <div className="sig-section">
              <div className="sig-box">
                  Customer Representative:<br/><br/>Name & Signature
                  <div className="sig-line"></div><br/>
                  Date: <input type="date" className="a4-input w-auto inline-block" />
              </div>
              <div className="sig-box">
                  Nucleus Representative:<br/><br/>Name & Signature
                  <div className="sig-line"></div><br/>
                  Date: <input type="date" className="a4-input w-auto inline-block" />
              </div>
          </div>
          <br/><br/>
          <div className="sml ctr">
              Note: Warranty ending date may be changed based on the terms and conditions
              mentioned on Customer's PO and Order confirmation received from M/s. Spectro, Germany.
          </div>
        </form>

        {/* ========================================================= */}
        {/* ====================== SERVICE REPORT ==================== */}
        {/* ========================================================= */}
        <form onSubmit={submitServiceReport} className="a4-page shadow-2xl">
          <button type="submit" className="save-btn no-print hover:bg-[#8b6845]">Save Service</button>
          
          <div className="header-sec">
              <div className="logo-title">
                  <img src="/logo.png" className="logo-img" alt="Logo" />
                  <div className="company-name">Nucleus Analytics Private Limited</div>
              </div>
              <div className="company-details">
                  # 30C, 3rd Floor, 6th Main, J.C Industrial Layout,<br/>
                  Kanakapura Main Road, Yelachenahalli,<br/>
                  Bengaluru – 560 062. INDIA<br/>
                  Tel: +91 80 79617756<br/>
                  CIN: U29305KA2012PTC063848
              </div>
          </div>

          <div className="form-title">Service Report</div>
          <div className="format-no">Format no : NAPL/FOR/SER/01</div>

          <table className="a4-table">
            <tbody>
              <tr>
                  <td className="lbl">Document ID</td>
                  <td colSpan="3"><input type="text" className="a4-input" name="service_report_id" value={serviceForm.service_report_id||''} onChange={handleServiceChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Model</td>
                  <td><input type="text" className="a4-input" name="model" value={serviceForm.model||''} onChange={handleServiceChange} /></td>
                  <td className="lbl">Instrument No</td>
                  <td><input type="text" className="a4-input" name="instrument_number" value={serviceForm.instrument_number||''} onChange={handleServiceChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Company</td>
                  <td><input type="text" className="a4-input" name="company_name" value={serviceForm.company_name||''} onChange={handleServiceChange} /></td>
                  <td className="lbl">Contact Person</td>
                  <td><input type="text" className="a4-input" name="contact_person" value={serviceForm.contact_person||''} onChange={handleServiceChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Address</td>
                  <td><textarea rows="3" className="a4-textarea" name="customer_address" value={serviceForm.customer_address||''} onChange={handleServiceChange}></textarea></td>
                  <td className="lbl">Mobile No.</td>
                  <td><input type="text" className="a4-input" name="mobile_number" value={serviceForm.mobile_number||''} onChange={handleServiceChange} /></td>
              </tr>
              <tr>
                  <td colSpan="4">
                      <div className="chk-row">
                          Type of call:
                          <label>Installation <input name="call_type" value="Installation" checked={serviceForm.call_type==='Installation'} onChange={handleServiceChange} type="radio" className="chk ml-1" /></label>
                          <label>Warranty <input name="call_type" value="Warranty" checked={serviceForm.call_type==='Warranty'} onChange={handleServiceChange} type="radio" className="chk ml-1" /></label>
                          <label>AMC <input name="call_type" value="AMC" checked={serviceForm.call_type==='AMC'} onChange={handleServiceChange} type="radio" className="chk ml-1" /></label>
                          <label>On-Call <input name="call_type" value="On Call" checked={serviceForm.call_type==='On Call'} onChange={handleServiceChange} type="radio" className="chk ml-1" /></label>
                      </div>
                  </td>
              </tr>
              <tr>
                  <td colSpan="2">
                      <b>Problem Reported:</b>
                      <textarea className="a4-textarea h-[80px]" name="problem_reported" value={serviceForm.problem_reported||''} onChange={handleServiceChange}></textarea>
                  </td>
                  <td colSpan="2">
                      <b>Observations:</b>
                      <textarea className="a4-textarea h-[80px]" name="observations" value={serviceForm.observations||''} onChange={handleServiceChange}></textarea>
                  </td>
              </tr>
            </tbody>
          </table>
          <br/>
          
          <table className="a4-table">
            <tbody>
              <tr className="sec-title">
                  <td>Checked Actions</td>
                  <td width="80" className="ctr">Yes</td>
                  <td width="80" className="ctr">No</td>
              </tr>
              {[
                'Cleaning of Instrument Inside & Outside.',
                'Cleaning of Electronic PCB & Cooling Fans.',
                'Checked Movement of all the Motor & Cleaned.',
                'Checked the Optical Calibration & X-Ray, Laser Position.',
                'Checked Gain (Au) Mention Energy Level.',
                'Performed MCA Calibration - Impulse:',
                'Performed Detector Calibration',
                'Performed Global Calibration & Checked the Data',
                'Pile-Up Calibration Performed Mention the Old & Current Values.',
                'Checked Reference Material & Customer sample & Result found OK',
                'Copied & Saved Backup to the Drive'
              ].map((act, i) => (
                <tr key={i}>
                    <td>{i+1}. {act}</td>
                    <td className="ctr"><input name={`chk_${i}`} type="radio" value="yes" className="chk" /></td>
                    <td className="ctr"><input name={`chk_${i}`} type="radio" value="no" className="chk" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <br/>

          <table className="a4-table">
            <tbody>
              <tr>
                  <td>
                      <b>Engineer Remarks:</b>
                      <textarea className="a4-textarea h-[60px]" name="engineer_remarks" value={serviceForm.engineer_remarks||''} onChange={handleServiceChange}></textarea>
                  </td>
              </tr>
            </tbody>
          </table>
          <br/>

          <table className="a4-table">
            <tbody>
              <tr className="sec-title">
                  <td colSpan="3">Parts Replaced</td>
              </tr>
              <tr>
                  <td>Parts Description</td>
                  <td>Part No.</td>
                  <td>Remarks</td>
              </tr>
              <tr>
                  <td height="60"><textarea className="a4-textarea h-full"></textarea></td>
                  <td><textarea className="a4-textarea h-full"></textarea></td>
                  <td><textarea className="a4-textarea h-full"></textarea></td>
              </tr>
            </tbody>
          </table>
          <br/>

          <table className="a4-table">
            <tbody>
              <tr>
                  <td width="50%"><b>Engineer Name</b><input type="text" className="a4-input" /></td>
                  <td width="50%"><b>Customer Name</b><input type="text" className="a4-input" /></td>
              </tr>
              <tr>
                  <td><b>Signature/Date</b><div className="sig-line mt-10"></div></td>
                  <td><b>Signature/Date</b><div className="sig-line mt-10"></div></td>
              </tr>
            </tbody>
          </table>
        </form>

        {/* ========================================================= */}
        {/* ================= CUSTOMER FEEDBACK FORM ================= */}
        {/* ========================================================= */}
        <form onSubmit={submitCustomerFeedback} className="a4-page shadow-2xl">
          <button type="submit" className="save-btn no-print hover:bg-[#8b6845]">Save Feedback</button>

          <div className="header-sec">
              <div className="logo-title">
                  <img src="/logo.png" className="logo-img" alt="Logo" />
                  <div className="company-name">Nucleus Analytics Private Limited</div>
              </div>
              <div className="company-details">
                  # 30C, 3rd Floor, 6th Main, J.C Industrial Layout,<br/>
                  Kanakapura Main Road, Yelachenahalli,<br/>
                  Bengaluru – 560 062. INDIA<br/>
                  Tel: +91 80 79617756<br/>
                  CIN: U29305KA2012PTC063848
              </div>
          </div>

          <div className="form-title">Customer Feedback Form</div>
          <div className="format-no">Format no : NAPL/FOR/CFF/01</div>

          <table className="a4-table">
            <tbody>
              <tr>
                  <td className="lbl">Document ID</td>
                  <td colSpan="3"><input type="text" className="a4-input" name="document_id" value={feedbackForm.document_id||''} onChange={handleFeedbackChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Model</td>
                  <td><input type="text" className="a4-input" name="model" value={feedbackForm.model||''} onChange={handleFeedbackChange} /></td>
                  <td className="lbl">Instrument No</td>
                  <td><input type="text" className="a4-input" name="instrument_number" value={feedbackForm.instrument_number||''} onChange={handleFeedbackChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Company</td>
                  <td><input type="text" className="a4-input" name="company" value={feedbackForm.company||''} onChange={handleFeedbackChange} /></td>
                  <td className="lbl">Contact Person</td>
                  <td><input type="text" className="a4-input" name="contact_person" value={feedbackForm.contact_person||''} onChange={handleFeedbackChange} /></td>
              </tr>
              <tr>
                  <td className="lbl">Address</td>
                  <td><textarea rows="3" className="a4-textarea" name="address" value={feedbackForm.address||''} onChange={handleFeedbackChange}></textarea></td>
                  <td className="lbl">Telephone/Mobile</td>
                  <td><input type="text" className="a4-input" name="telephone" value={feedbackForm.telephone||''} onChange={handleFeedbackChange} /></td>
              </tr>
            </tbody>
          </table>
          <br/>

          <table className="a4-table">
            <tbody>
              {[
                "1. Promptness in Delivering the Instrument On-Time?",
                "2. Were you satisfied with the customer service we provided?",
                "3. How was the Engineer Appearance?",
                "4. How clear and helpful was the communication during Installation / Service?",
                "5. How satisfied are you with the response / resolution time?",
                "6. Overall, how satisfied are you with our company’s service?"
              ].map((q, i) => (
                <tr key={i}>
                    <td className="h-[65px]">
                        {q}<br/><br/>
                        <div className="chk-row">
                            {['Very Good', 'Good', 'Average', 'Poor'].map(lvl => (
                              <label key={lvl} className="flex items-center gap-1">
                                <input type="radio" name={`fb_${i}`} className="chk" checked={feedbackForm.checks[i] === lvl} onChange={() => handleFeedbackCheck(i, lvl)} /> {lvl}
                              </label>
                            ))}
                        </div>
                    </td>
                </tr>
              ))}
              <tr>
                  <td>
                      7. What can we improve to serve you better?<br/><br/>
                      <textarea rows="4" className="a4-textarea border border-gray-300 p-2" name="improvement" value={feedbackForm.improvement||''} onChange={handleFeedbackChange}></textarea>
                  </td>
              </tr>
            </tbody>
          </table>

          <div className="sig-section">
              <div className="sig-box">
                  Acknowledgement<br/><br/>Customer Name & Signature
                  <div className="sig-line"></div><br/>
                  Date: <input type="date" className="a4-input w-auto inline-block" />
              </div>
              <div className="sig-box">
                  Acknowledgement<br/><br/>Engineer Name & Signature
                  <div className="sig-line"></div><br/>
                  Date: <input type="date" className="a4-input w-auto inline-block" />
              </div>
          </div>
        </form>

      </div>
    </div>
  );
}
