import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

function SignaturePad() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };
  const stopDrawing = () => {
    setIsDrawing(false);
    canvasRef.current.getContext('2d').beginPath();
    setImageURL(canvasRef.current.toDataURL());
  };
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = (event) => {
         setImageURL(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clear = () => {
    setImageURL(null);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="w-full relative min-h-[60px] flex flex-col items-center justify-center mt-2 border-b border-gray-300 pb-2">
       {imageURL ? (
         <div className="relative w-full h-[60px]">
           <img src={imageURL} className="max-h-[60px] mx-auto object-contain" alt="Signature" />
           <button type="button" onClick={clear} className="absolute top-0 right-0 text-[10px] bg-red-500 text-white px-2 py-1 rounded no-print">Clear</button>
         </div>
       ) : (
         <div className="w-full no-print bg-gray-50 border border-dashed border-gray-300 rounded p-1">
           <canvas
             ref={canvasRef}
             width={250}
             height={60}
             className="cursor-crosshair w-full bg-white touch-none"
             onMouseDown={startDrawing}
             onMouseUp={stopDrawing}
             onMouseOut={stopDrawing}
             onMouseMove={draw}
             onTouchStart={startDrawing}
             onTouchEnd={stopDrawing}
             onTouchMove={draw}
           />
           <div className="flex justify-between items-center mt-1 px-1 text-[10px]">
             <span className="text-gray-500">Draw signature</span>
             <label className="text-blue-600 cursor-pointer font-semibold">
               Upload
               <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
             </label>
           </div>
         </div>
       )}
    </div>
  );
}

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

  const handleDownloadPDF = async () => {
    const element = document.getElementById('pdf-wrapper');
    const opt = {
      margin: 0,
      filename: `service_forms_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach(el => el.style.display = 'none');

    // Temporarily replace inputs/textareas with divs so text isn't cut off in the PDF
    const inputs = element.querySelectorAll('input, textarea');
    const replacements = [];
    
    inputs.forEach(input => {
      const div = document.createElement('div');
      div.innerText = input.value || '';
      div.className = input.className;
      div.style.minHeight = input.offsetHeight ? input.offsetHeight + 'px' : 'auto';
      div.style.whiteSpace = 'pre-wrap';
      div.style.wordWrap = 'break-word';
      
      // Add borders so it looks structured in the PDF
      if (input.tagName.toLowerCase() === 'textarea' || input.type === 'text' || input.type === 'date' || input.type === 'number') {
         div.style.padding = '0 2px';
         div.style.backgroundColor = 'transparent';
      }

      if (input.type === 'radio' || input.type === 'checkbox') {
        div.innerText = input.checked ? '☑' : '☐';
        div.style.fontSize = '18px';
        div.style.minHeight = 'auto';
        div.style.border = 'none';
        div.style.padding = '0';
      }
      
      input.parentNode.insertBefore(div, input);
      input.style.display = 'none';
      replacements.push({ input, div });
    });

    await html2pdf().set(opt).from(element).save();

    // Restore original inputs
    replacements.forEach(({ input, div }) => {
      input.style.display = '';
      div.remove();
    });
    noPrintElements.forEach(el => el.style.display = '');
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
            border: 1px solid #ccc;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            color: #000;
            font-family: Arial, Helvetica, sans-serif;
            page-break-after: always;
            box-sizing: border-box;
            position: relative;
        }
        .footer-credits { position: absolute; bottom: 15px; right: 20px; font-size: 10px; font-style: italic; color: #555; }
        .header-sec { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 15px; }
        .logo-title { display: flex; gap: 10px; align-items: center; flex: 1; }
        .logo-img { width: 60px; height: 60px; object-fit: contain; }
        .company-name { font-size: 22px; font-weight: bold; line-height: 1.2; color: #000; }
        .company-details { text-align: right; font-size: 11px; line-height: 1.3; flex-shrink: 0; color: #333; }
        .form-title { text-align: center; font-size: 20px; font-weight: bold; margin: 5px 0; text-decoration: underline; text-transform: uppercase; }
        .format-no { text-align: right; font-size: 11px; font-weight: bold; margin-bottom: 5px; }
        .a4-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
        .a4-table td, .a4-table th { border: 1px solid #000; padding: 5px; font-size: 13px; vertical-align: middle; }
        .lbl { width: 25%; font-weight: bold; background-color: #f9f9f9; font-size: 13px; }
        .note { margin-top: 15px; font-size: 14px; line-height: 1.4; text-align: justify; }
        .note ul { margin-left: 20px; margin-top: 5px; }
        .sig-section { margin-top: 15px; display: flex; justify-content: space-between; gap: 30px; }
        .sig-box { width: 45%; font-size: 13px; }
        .sig-line { border-bottom: 1px solid #000; margin-top: 20px; }
        .ctr { text-align: center; }
        .sml { font-size: 11px; color: #555; }
        .chk { width: 16px; height: 16px; accent-color: #000; cursor: pointer; }
        .sec-title { font-weight: bold; background: #e5e5e5 !important; text-align: center; text-transform: uppercase; }
        .a4-input { width: 100%; border: none; outline: none; font-size: 14px; background: transparent; font-family: inherit; }
        .a4-textarea { width: 100%; border: none; outline: none; resize: none; font-size: 14px; background: transparent; font-family: inherit; }
        .chk-row { display: flex; gap: 15px; align-items: center; flex-wrap: wrap; margin-top: 5px; }
        .save-btn { display: block; width: 100%; margin-top: 20px; padding: 12px; background: #28a745; color: white; border-radius: 6px; font-weight: bold; font-size: 16px; cursor: pointer; text-align: center; border: none; transition: background 0.3s; }
        .save-btn:hover { background: #218838; }
        
        @media print {
            body { background: #fff; padding: 0; }
            .a4-page { border: none; margin: 0; padding: 15mm; width: 210mm; min-height: 297mm; box-shadow: none; page-break-after: always; }
            .no-print { display: none !important; }
        }
      `}</style>

      <div id="pdf-wrapper">
        
        {/* ========================================================= */}
        {/* ================= ACCEPTANCE CERTIFICATE ================= */}
        {/* ========================================================= */}
        <form onSubmit={submitInstallation} className="a4-page">

          
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
                  <td colSpan="3"><textarea rows="2" className="a4-textarea" name="customer_name" value={installationForm.customer_name||''} onChange={handleInstallChange}></textarea></td>
              </tr>
              <tr>
                  <td className="lbl">Delivery Address:</td>
                  <td colSpan="3"><textarea rows="2" className="a4-textarea" name="delivery_address" value={installationForm.delivery_address||''} onChange={handleInstallChange}></textarea></td>
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
                  Customer Representative:<br/><br/>Name: <input type="text" className="a4-input w-full border-b border-gray-300" />
                  <SignaturePad /><br/>
                  Date: <input type="date" className="a4-input w-auto inline-block" />
              </div>
              <div className="sig-box">
                  Nucleus Representative:<br/><br/>Name: <input type="text" className="a4-input w-full border-b border-gray-300" />
                  <SignaturePad /><br/>
                  Date: <input type="date" className="a4-input w-auto inline-block" />
              </div>
          </div>
          <br/><br/>
          <div className="sml ctr">
              Note: Warranty ending date may be changed based on the terms and conditions
              mentioned on Customer's PO and Order confirmation received from M/s. Spectro, Germany.
          </div>
          
          <button type="submit" className="save-btn no-print">Save Acceptance Certificate</button>
          <div className="footer-credits">developed by nexoresha</div>
        </form>

        {/* ========================================================= */}
        {/* ====================== SERVICE REPORT ==================== */}
        {/* ========================================================= */}
        <form onSubmit={submitServiceReport} className="a4-page">

          
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
                  <td><textarea rows="2" className="a4-textarea" name="customer_address" value={serviceForm.customer_address||''} onChange={handleServiceChange}></textarea></td>
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
                      <textarea className="a4-textarea h-[40px]" name="problem_reported" value={serviceForm.problem_reported||''} onChange={handleServiceChange}></textarea>
                  </td>
                  <td colSpan="2">
                      <b>Observations:</b>
                      <textarea className="a4-textarea h-[40px]" name="observations" value={serviceForm.observations||''} onChange={handleServiceChange}></textarea>
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
                      <textarea className="a4-textarea h-[30px]" name="engineer_remarks" value={serviceForm.engineer_remarks||''} onChange={handleServiceChange}></textarea>
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
                  <td height="50"><textarea className="a4-textarea h-full"></textarea></td>
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
                  <td><b>Signature</b><SignaturePad /><br/>Date <input type="date" className="a4-input w-auto inline-block" /></td>
                  <td><b>Signature</b><SignaturePad /><br/>Date <input type="date" className="a4-input w-auto inline-block" /></td>
              </tr>
            </tbody>
          </table>
          
          <button type="submit" className="save-btn no-print">Save Service Report</button>
          <div className="footer-credits">developed by nexoresha</div>
        </form>

        {/* ========================================================= */}
        {/* ================= CUSTOMER FEEDBACK FORM ================= */}
        {/* ========================================================= */}
        <form onSubmit={submitCustomerFeedback} className="a4-page">


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
                  <td><textarea rows="2" className="a4-textarea" name="address" value={feedbackForm.address||''} onChange={handleFeedbackChange}></textarea></td>
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
                    <td className="h-[35px]">
                        {q}<br/>
                        <div className="chk-row">
                            {['Very Good', 'Good', 'Average', 'Poor'].map(lvl => (
                              <label key={lvl} className="flex items-center gap-1 text-sm">
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
                      <textarea rows="2" className="a4-textarea border border-gray-300 p-2" name="improvement" value={feedbackForm.improvement||''} onChange={handleFeedbackChange}></textarea>
                  </td>
              </tr>
            </tbody>
          </table>

          <div className="sig-section">
              <div className="sig-box">
                  Acknowledgement<br/><br/>Customer Name: <input type="text" className="a4-input w-full border-b border-gray-300" />
                  <SignaturePad /><br/>
                  Date: <input type="date" className="a4-input w-auto inline-block" />
              </div>
              <div className="sig-box">
                  Acknowledgement<br/><br/>Engineer Name: <input type="text" className="a4-input w-full border-b border-gray-300" />
                  <SignaturePad /><br/>
                  Date: <input type="date" className="a4-input w-auto inline-block" />
              </div>
          </div>
          
          <button type="submit" className="save-btn no-print">Save Customer Feedback</button>
          <div className="footer-credits">developed by nexoresha</div>
        </form>

      </div>
    </div>
  );
}
