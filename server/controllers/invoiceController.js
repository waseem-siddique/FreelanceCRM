const Project = require('../models/Project');
const User = require('../models/User');

const generateInvoice = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('client');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Mock user for testing
    const user = { companyName: 'TestCompany', name: 'Test', email: 'test@t', phone: '123' };

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${project.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.15); }
          .header { display: flex; justify-content: space-between; }
          .company-details, .client-details { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          table td, table th { border: 1px solid #ddd; padding: 8px; }
          table th { background-color: #f2f2f2; }
          .total { text-align: right; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <h2>INVOICE</h2>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
          <div class="company-details">
            <h3>${user.companyName || user.name}</h3>
            <p>${user.email}<br>${user.phone || 'Phone not provided'}</p>
          </div>
          <div class="client-details">
            <h3>Bill To:</h3>
            <p>${project.client.name}<br>${project.client.email}<br>${project.client.company || ''}</p>
          </div>
          <table>
            <tr><th>Description</th><th>Amount</th></tr>
            <tr><td>${project.title} - ${project.description || 'Project work'}</td><td>INR${project.budget || 0}</td></tr>
          </table>
          <div class="total">
            <strong>Total: INR${project.budget || 0}</strong>
          </div>
        </div>
      </body>
      </html>
    `;

    res.send(invoiceHTML);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateInvoice };