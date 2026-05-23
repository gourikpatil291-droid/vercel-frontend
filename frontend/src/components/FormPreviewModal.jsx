import { X, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function FormPreviewModal({ isOpen, onClose, formType, formData }) {
  if (!isOpen || !formData) return null;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('preview-pdf-wrapper');
    const opt = {
      margin: 0,
      filename: `${formType}_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    await html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#f4f1ea] rounded-xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 bg-white border-b shadow-sm z-10">
          <h2 className="text-xl font-bold uppercase">{formType} Preview</h2>
          <div className="flex gap-3">
            <button 
              onClick={handleDownloadPDF} 
              className="flex items-center gap-2 px-4 py-2 bg-[#a67c52] text-white rounded-lg hover:bg-[#8b6845] transition-colors"
            >
              <Printer size={18} /> Download PDF
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          
          <style>{`
            .a4-preview {
                width: 210mm;
                min-height: 297mm;
                margin: 0 auto;
                background: #fff;
                padding: 40px;
                border: 1px solid #ccc;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                color: #000;
                font-family: Arial, Helvetica, sans-serif;
            }
            .header-sec { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 20px; }
            .logo-title { display: flex; gap: 15px; align-items: center; flex: 1; }
            .logo-img { width: 75px; height: 75px; object-fit: contain; }
            .company-name { font-size: 26px; font-weight: bold; line-height: 1.2; color: #000; }
            .company-details { text-align: right; font-size: 12px; line-height: 1.4; flex-shrink: 0; color: #333; }
            .form-title { text-align: center; font-size: 28px; font-weight: bold; margin: 30px 0 10px; text-decoration: underline; text-transform: uppercase; }
            .format-no { text-align: right; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
            .a4-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            .a4-table td, .a4-table th { border: 1px solid #000; padding: 10px; font-size: 14px; vertical-align: middle; }
            .lbl { width: 25%; font-weight: bold; background-color: #f9f9f9; }
            .val { font-weight: bold; color: #333; white-space: pre-wrap; word-wrap: break-word; }
            .sig-section { margin-top: 50px; display: flex; justify-content: space-between; gap: 40px; }
            .sig-box { width: 45%; font-size: 14px; }
            .sig-line { border-bottom: 1px solid #000; margin-top: 40px; }
            .ctr { text-align: center; }
            .sec-title { font-weight: bold; background: #e5e5e5 !important; text-align: center; text-transform: uppercase; }
          `}</style>

          <div id="preview-pdf-wrapper">
            <div className="a4-preview">
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

              <div className="form-title">{formType}</div>
              <div className="format-no">Format no : NAPL/FOR/{formType === 'Acceptance Certificate' ? 'ACC' : formType === 'Service Report' ? 'SER' : 'CFF'}/01</div>

              {/* Dynamic Table based on Form Data */}
              <table className="a4-table">
                <tbody>
                  {Object.entries(formData).map(([key, value]) => {
                    // Skip internal fields
                    if (['id', 'user_id', 'created_at'].includes(key)) return null;
                    
                    let displayValue = value;
                    if (key === 'feedback' && value) {
                      try {
                        const parsed = JSON.parse(value);
                        displayValue = Object.entries(parsed).map(([k, v]) => {
                          if (typeof v === 'object') return `${k}:\n  ${Object.entries(v).map(([q, a]) => `Q${q}: ${a}`).join('\n  ')}`;
                          return `${k}: ${v}`;
                        }).join('\n\n');
                      } catch (e) {
                         displayValue = value;
                      }
                    }

                    return (
                      <tr key={key}>
                        <td className="lbl capitalize">{key.replace(/_/g, ' ')}</td>
                        <td className="val">{displayValue || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="sig-section">
                  <div className="sig-box">
                      Customer / Client<br/><br/>Name & Signature
                      <div className="sig-line"></div>
                  </div>
                  <div className="sig-box">
                      Nucleus Representative<br/><br/>Name & Signature
                      <div className="sig-line"></div>
                  </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
