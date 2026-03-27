import path from 'path';
import { createRequire } from 'module';

// Ensure node is in PATH for Turbopack child processes
const nodeDir = path.dirname(process.execPath);
process.env.PATH = `${nodeDir}:${process.env.PATH || ''}`;

// Set argv to simulate "next dev"
process.argv = [process.execPath, 'next', 'dev'];

const require = createRequire(import.meta.url);
require('next/dist/bin/next');
