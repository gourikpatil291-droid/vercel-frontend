import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ServiceFormsPage() {
  const [installationForm, setInstallationForm] = useState({});
  const [serviceForm, setServiceForm] = useState({});
  const [closureForm, setClosureForm] = useState({});

  const handleInstallChange = (e) => setInstallationForm({...installationForm, [e.target.name]: e.target.value});
  const handleServiceChange = (e) => setServiceForm({...serviceForm, [e.target.name]: e.target.value});
  const handleClosureChange = (e) => setClosureForm({...closureForm, [e.target.name]: e.target.value});

  const submitInstallation = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/forms/installations', installationForm);
      toast.success('Installation report saved successfully!');
    } catch (error) {
      toast.error('Failed to save installation report');
    }
  };

  const submitServiceReport = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/forms/service-reports', serviceForm);
      toast.success('Service report saved successfully!');
    } catch (error) {
      toast.error('Failed to save service report');
    }
  };

  const submitClosureForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/forms/closure-forms', closureForm);
      toast.success('Closure form saved successfully!');
    } catch (error) {
      toast.error('Failed to save closure form');
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-content');
    const opt = {
      margin:       0.2,
      filename:     `service_form_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Temporarily hide elements with no-print class
    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach(el => el.style.display = 'none');

    // Make backgrounds white and text black temporarily for perfect PDF styling
    element.classList.add('print:bg-white', 'print:text-black');

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore elements
      noPrintElements.forEach(el => el.style.display = '');
      element.classList.remove('print:bg-white', 'print:text-black');
    });
  };

  // Helper for input without borders (since the table cell acts as the border)
  const TableInput = ({ name, type = 'text', value, onChange }) => (
    <input 
      type={type} 
      name={name} 
      onChange={onChange} 
      value={value || ''} 
      className="w-full bg-transparent outline-none text-text-main px-2 py-1 print:text-black" 
    />
  );

  const TableDate = ({ name, value, onChange }) => (
    <input 
      type="date" 
      name={name} 
      onChange={onChange} 
      value={value || ''} 
      className="w-full bg-transparent outline-none text-text-main px-2 py-1  print:text-black print:[color-scheme:light]" 
    />
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-text-main pb-10">
      
      <div className="flex justify-end mb-4 no-print gap-4">
        <button 
          onClick={() => window.print()}
          className="flex items-center px-4 py-2 bg-surfaceHover hover:bg-input-border text-white rounded-lg transition-colors shadow-lg"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print
        </button>
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors shadow-lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF
        </button>
      </div>

      <div id="pdf-content" className="bg-surface shadow-2xl border border-input-border print:border-black rounded-xl overflow-hidden print:rounded-none">
        
        {/* HEADER */}
        <div className="border-b border-input-border print:border-black p-6 text-center bg-surfaceHover print:bg-white">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-primary-500 print:text-black">
            Nucleus Analytics
          </h1>
          <p className="text-sm mt-2 font-medium text-text-muted print:text-black">
            Installation Report / Service Report / Acceptance Certificate
          </p>
        </div>

        {/* COMPANY DETAILS */}
        <div className="grid grid-cols-2 border-b border-input-border print:border-black text-sm">
          <div className="border-r border-input-border print:border-black p-4">
            <div className="flex items-center"><span className="font-bold w-24">Customer:</span> <input type="text" className="bg-transparent border-b border-input-border print:border-black outline-none flex-1 ml-2 text-text-main print:text-black" /></div>
            <div className="flex items-center mt-2"><span className="font-bold w-24">Address:</span> <input type="text" className="bg-transparent border-b border-input-border print:border-black outline-none flex-1 ml-2 text-text-main print:text-black" /></div>
            <div className="flex items-center mt-2"><input type="text" className="bg-transparent border-b border-input-border print:border-black outline-none w-full text-text-main print:text-black" /></div>
          </div>

          <div className="p-4">
            <div className="flex items-center"><span className="font-bold w-28">Document No:</span> <input type="text" className="bg-transparent border-b border-input-border print:border-black outline-none flex-1 ml-2 text-text-main print:text-black" /></div>
            <div className="flex items-center mt-2"><span className="font-bold w-28">Date:</span> <input type="date" className="bg-transparent border-b border-input-border print:border-black outline-none flex-1 ml-2 text-text-main  print:text-black print:[color-scheme:light]" /></div>
            <div className="flex items-center mt-2"><span className="font-bold w-28">Engineer:</span> <input type="text" className="bg-transparent border-b border-input-border print:border-black outline-none flex-1 ml-2 text-text-main print:text-black" /></div>
          </div>
        </div>

        {/* INSTALLATION REPORT */}
        <form onSubmit={submitInstallation} className="border-b border-input-border print:border-black">
          <div className="bg-primary-500/10 border-b border-input-border print:border-black print:bg-gray-200 text-center py-3 flex justify-between px-6 items-center">
            <h2 className="font-bold text-xl uppercase text-primary-400 print:text-black">Installation Report</h2>
            <button type="submit" className="px-4 py-1.5 bg-primary-500 text-white rounded text-sm no-print">Save</button>
          </div>

          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold w-1/4 bg-surfaceHover/50 print:bg-transparent">Equipment Name</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="equipment_name" onChange={handleInstallChange} value={installationForm.equipment_name} /></td>
                <td className="border border-input-border print:border-black p-2 font-bold w-1/4 bg-surfaceHover/50 print:bg-transparent">Instrument No</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="instrument_number" onChange={handleInstallChange} value={installationForm.instrument_number} /></td>
              </tr>

              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Serial No</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="serial_number" onChange={handleInstallChange} value={installationForm.serial_number} /></td>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Invoice No</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="invoice_number" onChange={handleInstallChange} value={installationForm.invoice_number} /></td>
              </tr>

              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Invoice Date</td>
                <td className="border border-input-border print:border-black p-0"><TableDate name="invoice_date" onChange={handleInstallChange} value={installationForm.invoice_date} /></td>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Installation Date</td>
                <td className="border border-input-border print:border-black p-0"><TableDate name="installation_date" onChange={handleInstallChange} value={installationForm.installation_date} /></td>
              </tr>

              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Warranty Start</td>
                <td className="border border-input-border print:border-black p-0"><TableDate name="warranty_start" onChange={handleInstallChange} value={installationForm.warranty_start} /></td>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Warranty End</td>
                <td className="border border-input-border print:border-black p-0"><TableDate name="warranty_end" onChange={handleInstallChange} value={installationForm.warranty_end} /></td>
              </tr>
            </tbody>
          </table>

          <div className="p-4 border-t border-input-border print:border-black">
            <p className="font-bold mb-2 text-primary-400 print:text-black">Remarks:</p>
            <textarea name="remarks" onChange={handleInstallChange} value={installationForm.remarks || ''} className="w-full h-20 border border-input-border print:border-black bg-transparent outline-none p-2 text-text-main print:text-black resize-none"></textarea>
          </div>
        </form>

        {/* SERVICE REPORT */}
        <form onSubmit={submitServiceReport} className="border-b border-input-border print:border-black">
          <div className="bg-primary-500/10 border-b border-input-border print:border-black print:bg-gray-200 text-center py-3 flex justify-between px-6 items-center">
            <h2 className="font-bold text-xl uppercase text-primary-400 print:text-black">Service Report</h2>
            <button type="submit" className="px-4 py-1.5 bg-primary-500 text-white rounded text-sm no-print">Save</button>
          </div>

          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold w-1/4 bg-surfaceHover/50 print:bg-transparent">Model</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="model" onChange={handleServiceChange} value={serviceForm.model} /></td>
                <td className="border border-input-border print:border-black p-2 font-bold w-1/4 bg-surfaceHover/50 print:bg-transparent">Service Date</td>
                <td className="border border-input-border print:border-black p-0"><TableDate name="service_date" onChange={handleServiceChange} value={serviceForm.service_date} /></td>
              </tr>

              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Contact Person</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="contact_person" onChange={handleServiceChange} value={serviceForm.contact_person} /></td>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Mobile Number</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="mobile_number" onChange={handleServiceChange} value={serviceForm.mobile_number} /></td>
              </tr>

              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">AMC Period</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="amc_period" onChange={handleServiceChange} value={serviceForm.amc_period} /></td>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">PO Number</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="po_number" onChange={handleServiceChange} value={serviceForm.po_number} /></td>
              </tr>

              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Call Type</td>
                <td className="border border-input-border print:border-black p-0 bg-transparent" colSpan="3">
                  <select name="call_type" onChange={handleServiceChange} value={serviceForm.call_type || ''} className="w-full bg-transparent outline-none text-text-main print:text-black px-2 py-1">
                    <option className="bg-surface print:bg-white" value="">Select Call Type</option>
                    <option className="bg-surface print:bg-white" value="Installation">Installation</option>
                    <option className="bg-surface print:bg-white" value="Warranty">Warranty</option>
                    <option className="bg-surface print:bg-white" value="AMC">AMC</option>
                    <option className="bg-surface print:bg-white" value="On Call">On Call</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Problem Reported</td>
                <td className="border border-input-border print:border-black p-0" colSpan="3">
                  <textarea name="problem_reported" onChange={handleServiceChange} value={serviceForm.problem_reported || ''} className="w-full h-16 bg-transparent outline-none p-2 resize-none text-text-main print:text-black"></textarea>
                </td>
              </tr>

              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Observations</td>
                <td className="border border-input-border print:border-black p-0" colSpan="3">
                  <textarea name="observations" onChange={handleServiceChange} value={serviceForm.observations || ''} className="w-full h-16 bg-transparent outline-none p-2 resize-none text-text-main print:text-black"></textarea>
                </td>
              </tr>
            </tbody>
          </table>

          {/* CHECKLIST */}
          <div className="p-4 border-t border-input-border print:border-black">
            <h3 className="font-bold text-lg mb-3 uppercase text-primary-400 print:text-black">
              Service Checklist
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                'Cleaning of Instrument Inside & Outside',
                'Cleaning of Electronic PCB & Cooling Fans',
                'Checked Movement of Motor',
                'Optical Calibration & X-Ray Laser Position',
                'Gain Mention Energy Level',
                'MCA Calibration',
                'Detector Calibration',
                'Global Calibration',
                'Pile-Up Calibration',
                'Reference Material Check',
                'Backup Saved to Drive',
              ].map((item, index) => (
                <label key={index} className="flex items-center gap-2 border border-input-border print:border-black p-2">
                  <input type="checkbox" className="accent-primary-500" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* PARTS REPLACEMENT */}
          <div className="p-4 border-t border-input-border print:border-black">
            <h3 className="font-bold text-lg mb-3 uppercase text-primary-400 print:text-black">
              Parts Replacement
            </h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-surfaceHover print:bg-transparent">
                  <th className="border border-input-border print:border-black p-2 text-left">Part Description</th>
                  <th className="border border-input-border print:border-black p-2 text-left">Part No</th>
                  <th className="border border-input-border print:border-black p-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3].map((row) => (
                  <tr key={row}>
                    <td className="border border-input-border print:border-black p-0 h-8"><input type="text" className="w-full h-full bg-transparent px-2 outline-none text-text-main print:text-black" /></td>
                    <td className="border border-input-border print:border-black p-0"><input type="text" className="w-full h-full bg-transparent px-2 outline-none text-text-main print:text-black" /></td>
                    <td className="border border-input-border print:border-black p-0"><input type="text" className="w-full h-full bg-transparent px-2 outline-none text-text-main print:text-black" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* REMARKS */}
          <div className="grid grid-cols-2 border-t border-input-border print:border-black text-sm">
            <div className="border-r border-input-border print:border-black p-4">
              <p className="font-bold mb-2 text-primary-400 print:text-black">Engineer Remarks</p>
              <textarea name="engineer_remarks" onChange={handleServiceChange} value={serviceForm.engineer_remarks || ''} className="w-full h-16 border border-input-border print:border-black bg-transparent outline-none p-2 resize-none text-text-main print:text-black"></textarea>
            </div>
            <div className="p-4">
              <p className="font-bold mb-2 text-primary-400 print:text-black">Customer Remarks</p>
              <textarea name="customer_remarks" onChange={handleServiceChange} value={serviceForm.customer_remarks || ''} className="w-full h-16 border border-input-border print:border-black bg-transparent outline-none p-2 resize-none text-text-main print:text-black"></textarea>
            </div>
          </div>
        </form>

        {/* ACCEPTANCE CERTIFICATE */}
        <form onSubmit={submitClosureForm} className="border-b border-input-border print:border-black">
          <div className="bg-primary-500/10 border-b border-input-border print:border-black print:bg-gray-200 text-center py-3 flex justify-between px-6 items-center">
            <h2 className="font-bold text-xl uppercase text-primary-400 print:text-black">
              Acceptance Certificate
            </h2>
            <button type="submit" className="px-4 py-1.5 bg-primary-500 text-white rounded text-sm no-print">Save</button>
          </div>

          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold w-1/4 bg-surfaceHover/50 print:bg-transparent">Acceptance Date</td>
                <td className="border border-input-border print:border-black p-0"><TableDate name="acceptance_date" onChange={handleClosureChange} value={closureForm.acceptance_date} /></td>
                <td className="border border-input-border print:border-black p-2 font-bold w-1/4 bg-surfaceHover/50 print:bg-transparent">Document No</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="document_number" onChange={handleClosureChange} value={closureForm.document_number} /></td>
              </tr>

              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Customer Name</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="customer_name" onChange={handleClosureChange} value={closureForm.customer_name} /></td>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Equipment Name</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="equipment_name" onChange={handleClosureChange} value={closureForm.equipment_name} /></td>
              </tr>

              <tr>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Instrument No</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="instrument_number" onChange={handleClosureChange} value={closureForm.instrument_number} /></td>
                <td className="border border-input-border print:border-black p-2 font-bold bg-surfaceHover/50 print:bg-transparent">Serial No</td>
                <td className="border border-input-border print:border-black p-0"><TableInput name="serial_number" onChange={handleClosureChange} value={closureForm.serial_number} /></td>
              </tr>
            </tbody>
          </table>

          <div className="p-4 border-t border-input-border print:border-black">
            <p className="font-bold mb-2 text-primary-400 print:text-black">Installation Remarks</p>
            <textarea name="installation_remarks" onChange={handleClosureChange} value={closureForm.installation_remarks || ''} className="w-full h-16 border border-input-border print:border-black bg-transparent outline-none p-2 resize-none text-text-main print:text-black"></textarea>
          </div>

          <div className="grid grid-cols-2 border-t border-input-border print:border-black text-sm">
            <div className="border-r border-input-border print:border-black p-4">
              <p className="font-bold text-primary-400 print:text-black">Customer Representative</p>
              <TableInput name="customer_representative" onChange={handleClosureChange} value={closureForm.customer_representative} />
              <div className="h-12 mt-2 border border-input-border print:border-black bg-surfaceHover/30 print:bg-transparent"></div>
            </div>

            <div className="p-4">
              <p className="font-bold text-primary-400 print:text-black">Company Representative</p>
              <TableInput name="company_representative" onChange={handleClosureChange} value={closureForm.company_representative} />
              <div className="h-12 mt-2 border border-input-border print:border-black bg-surfaceHover/30 print:bg-transparent"></div>
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="bg-primary-600 print:bg-white print:border-t print:border-black text-text-main print:text-black text-center py-4 text-sm tracking-widest font-bold">
          Developed by NEXORESHA
        </div>
      </div>
    </div>
  );
}
