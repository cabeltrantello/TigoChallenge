const fs = require('fs').promises;
const path = require('path');
const db = require('../../src/config/litedb');

async function createBackupLocal() {
  try {
    db.reload();

    let logs = db.getData('/logs') || [];

    if (!Array.isArray(logs)) {
      if (typeof logs === 'object' && logs !== null) {
        console.warn('🛠️ Logs data is not an array. Converting indexed object to array...');
        logs = Object.values(logs);
      } else {
        console.warn('⚠️ Invalid log data. The backup will be skipped.');
        logs = [];
      }
    }

    if (!logs.length) {
      console.warn('⚠️ There are no logs to back up.');
      return;
    }

    const backupDir = path.resolve(__dirname, '../../backups');
    await fs.mkdir(backupDir, { recursive: true });

    const fileName = `backup-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const filePath = path.join(backupDir, fileName);

    await fs.writeFile(filePath, JSON.stringify(logs, null, 2), 'utf8');

    console.log(`✅ Backup saved in: ${filePath}`);
  } catch (error) {
    console.error('❌ Error saving backup:', error);
  }
}

createBackupLocal();
