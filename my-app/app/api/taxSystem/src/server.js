const app = require('./app');
require('dotenv').config();
require('./services/taxNotifications'); // after other setup


const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
