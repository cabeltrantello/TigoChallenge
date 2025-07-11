const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const config = require('./src/config/env');
const configureMiddleware = require('./src/config/middleware');
const adminRoutes = require('./src/routes/admin.routes');
const { handleMockRequest } = require('./src/controllers/mock.controller');
const { errorHandler } = require('./src/utils/error.util');
const logger = require('./src/utils/logger.util');

const db = require('./src/config/litedb'); // Ajusta ruta si es distinta

const app = express();

configureMiddleware(app);

app.use('/admin', adminRoutes);

app.use(handleMockRequest);

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`
  🚀 Mock API Server running in ${config.env} mode
  📡 Listening on port ${config.port}
  📊 Database: ${config.dbPath}
  ⏱️  Rate limit: ${config.rateLimit.max} req/${config.rateLimit.windowMs/60000}min
  `);
});

// Función para crear backup local con logs
async function crearBackupLocal() {
  try {
    const logs = db.getData('/logs') || [];
    const backupDir = path.resolve(__dirname, 'backups');
    await fs.mkdir(backupDir, { recursive: true });

    const fileName = `backup-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const filePath = path.join(backupDir, fileName);

    await fs.writeFile(filePath, JSON.stringify(logs, null, 2), 'utf8');

    logger.info(`Backup guardado en: ${filePath}`);
  } catch (error) {
    logger.error('Error guardando backup:', error);
  }
}

// Escuchar Ctrl+C o terminación para crear backup antes de cerrar
process.on('SIGINT', async () => {
  logger.info('Detección de cierre (SIGINT). Creando backup...');
  await crearBackupLocal();
  process.exit(0);
});

module.exports = app; // For testing
