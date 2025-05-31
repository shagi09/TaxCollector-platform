const path = require('path');
 exports.viewReceipt = async (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename) {
      return res.status(400).json({ error: 'Receipt filename is required' });
    }

    // Build the full file path
    const receiptPath = path.join(__dirname, '..', 'utils' ,  'uploads', 'receipts', filename);
    console.log(__dirname)
    console.log("receiptPath" + receiptPath)
    // Send the file if it exists
    res.sendFile(receiptPath, (err) => {
      if (err) {
        console.error('Error sending receipt file:', err);

        return res.status(404).json({ error: 'Receipt file not found' });
      }
    });
  } catch (error) {
    console.error('View Receipt Error:', error);
    res.status(500).json({ error: 'Failed to load receipt' });
  }
};
