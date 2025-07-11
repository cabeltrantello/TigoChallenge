const fs = require('fs').promises;
const path = require('path');
const db = require('../../src/config/litedb');

async function crearBackupLocal() {
  try {
    db.reload(); // 💥 recarga la base desde mocks.db.json

    let logs = db.getData('/logs') || [];

    // Si logs no es un array pero es un objeto tipo {"0": {...}, "1": {...}}, convertirlo
    if (!Array.isArray(logs)) {
      if (typeof logs === 'object' && logs !== null) {
        console.warn('🛠️ Logs data no es un array. Convirtiendo objeto indexado a array...');
        logs = Object.values(logs);
      } else {
        console.warn('⚠️ Logs data no válida. Se omitirá el backup.');
        logs = [];
      }
    }

    if (!logs.length) {
      console.warn('⚠️ No hay logs que respaldar.');
      return;
    }

    const backupDir = path.resolve(__dirname, '../../backups');
    await fs.mkdir(backupDir, { recursive: true });

    const fileName = `backup-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const filePath = path.join(backupDir, fileName);

    await fs.writeFile(filePath, JSON.stringify(logs, null, 2), 'utf8');

    console.log(`✅ Backup guardado en: ${filePath}`);
  } catch (error) {
    console.error('❌ Error guardando backup:', error);
  }
}

crearBackupLocal();
