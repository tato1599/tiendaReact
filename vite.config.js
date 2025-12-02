import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'fs-persistence',
      configureServer(server) {
        server.middlewares.use('/api/save', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { file, data } = JSON.parse(body);
                const filePath = path.resolve(__dirname, 'src/data', file);
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } catch (error) {
                console.error('Error writing file:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to write file' }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})
