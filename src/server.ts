import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 EnterpriseFlow API ejecutándose en http://localhost:${PORT}`);
});