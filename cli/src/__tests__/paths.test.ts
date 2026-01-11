import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { directoryExists, fileExists, AVAILABLE_STACKS, AI_BRIDGES } from '../utils/paths.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

describe('paths', () => {
  let tempDir: string;

  beforeEach(async () => {
    const uniqueId = crypto.randomBytes(8).toString('hex');
    tempDir = path.join(os.tmpdir(), `ai-cowork-paths-${uniqueId}`);
    await fs.ensureDir(tempDir);
  });

  afterEach(async () => {
    if (tempDir && await fs.pathExists(tempDir)) {
      await fs.remove(tempDir);
    }
  });

  describe('directoryExists', () => {
    it('should return true for existing directory', async () => {
      const result = await directoryExists(tempDir);
      expect(result).toBe(true);
    });

    it('should return false for non-existing directory', async () => {
      const result = await directoryExists(path.join(tempDir, 'nonexistent'));
      expect(result).toBe(false);
    });

    it('should return false for file', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, 'content');
      
      const result = await directoryExists(filePath);
      expect(result).toBe(false);
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, 'content');
      
      const result = await fileExists(filePath);
      expect(result).toBe(true);
    });

    it('should return false for non-existing file', async () => {
      const result = await fileExists(path.join(tempDir, 'nonexistent.txt'));
      expect(result).toBe(false);
    });

    it('should return false for directory', async () => {
      const result = await fileExists(tempDir);
      expect(result).toBe(false);
    });
  });

  describe('constants', () => {
    it('should have correct available stacks', () => {
      expect(AVAILABLE_STACKS).toContain('react-typescript');
      expect(AVAILABLE_STACKS).toContain('php-laravel');
      expect(AVAILABLE_STACKS).toContain('node-express');
      expect(AVAILABLE_STACKS).toHaveLength(3);
    });

    it('should have correct AI bridges', () => {
      expect(AI_BRIDGES.claude).toBe('.claude');
      expect(AI_BRIDGES.cursor).toBe('.cursor');
      expect(AI_BRIDGES.opencode).toBe('.opencode');
      expect(AI_BRIDGES.agent).toBe('.agent');
    });
  });
});
