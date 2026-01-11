import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { detectStack, isValidStack } from '../utils/detector.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

describe('detector', () => {
  let tempDir: string;

  beforeEach(async () => {
    const uniqueId = crypto.randomBytes(8).toString('hex');
    tempDir = path.join(os.tmpdir(), `ai-cowork-detector-${uniqueId}`);
    await fs.ensureDir(tempDir);
  });

  afterEach(async () => {
    if (tempDir && await fs.pathExists(tempDir)) {
      await fs.remove(tempDir);
    }
  });

  describe('detectStack', () => {
    it('should detect Laravel from composer.json', async () => {
      await fs.writeJson(path.join(tempDir, 'composer.json'), {
        require: {
          'laravel/framework': '^10.0'
        }
      });

      const result = await detectStack(tempDir);

      expect(result.stack).toBe('php-laravel');
      expect(result.confidence).toBe('high');
      expect(result.reason).toContain('laravel/framework');
    });

    it('should detect React from package.json', async () => {
      await fs.writeJson(path.join(tempDir, 'package.json'), {
        dependencies: {
          'react': '^18.0.0',
          'react-dom': '^18.0.0'
        }
      });

      const result = await detectStack(tempDir);

      expect(result.stack).toBe('react-typescript');
      expect(result.confidence).toBe('high');
      expect(result.reason).toContain('react');
    });

    it('should detect Express from package.json', async () => {
      await fs.writeJson(path.join(tempDir, 'package.json'), {
        dependencies: {
          'express': '^4.18.0'
        }
      });

      const result = await detectStack(tempDir);

      expect(result.stack).toBe('node-express');
      expect(result.confidence).toBe('high');
      expect(result.reason).toContain('express');
    });

    it('should detect TypeScript with low confidence when no framework', async () => {
      await fs.writeJson(path.join(tempDir, 'package.json'), {
        devDependencies: {
          'typescript': '^5.0.0'
        }
      });

      const result = await detectStack(tempDir);

      expect(result.stack).toBe('react-typescript');
      expect(result.confidence).toBe('low');
    });

    it('should detect .tsx files with medium confidence', async () => {
      const filePath = path.join(tempDir, 'App.tsx');
      await fs.writeFile(filePath, 'export default function App() {}');
      
      // Verify file was created
      const exists = await fs.pathExists(filePath);
      expect(exists).toBe(true);

      const result = await detectStack(tempDir);

      expect(result.stack).toBe('react-typescript');
      expect(result.confidence).toBe('medium');
    });

    it('should detect .php files with low confidence', async () => {
      await fs.writeFile(path.join(tempDir, 'index.php'), '<?php echo "Hello"; ?>');

      const result = await detectStack(tempDir);

      expect(result.stack).toBe('php-laravel');
      expect(result.confidence).toBe('low');
    });

    it('should return null stack when nothing detected', async () => {
      // Empty directory
      const result = await detectStack(tempDir);

      expect(result.stack).toBeNull();
      expect(result.confidence).toBe('low');
    });

    it('should prefer Laravel over PHP files when composer.json exists', async () => {
      await fs.writeJson(path.join(tempDir, 'composer.json'), {
        require: {
          'laravel/framework': '^10.0'
        }
      });
      await fs.writeFile(path.join(tempDir, 'index.php'), '<?php');

      const result = await detectStack(tempDir);

      expect(result.stack).toBe('php-laravel');
      expect(result.confidence).toBe('high');
    });
  });

  describe('isValidStack', () => {
    it('should return true for valid stacks', () => {
      expect(isValidStack('react-typescript')).toBe(true);
      expect(isValidStack('php-laravel')).toBe(true);
      expect(isValidStack('node-express')).toBe(true);
    });

    it('should return false for invalid stacks', () => {
      expect(isValidStack('invalid-stack')).toBe(false);
      expect(isValidStack('')).toBe(false);
      expect(isValidStack('python')).toBe(false);
    });
  });
});
