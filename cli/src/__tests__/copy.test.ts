import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { copyAiDirectory, createBridges } from '../utils/copy.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

describe('copy', () => {
  let sourceDir: string;
  let targetDir: string;
  let baseDir: string;

  beforeEach(async () => {
    const uniqueId = crypto.randomBytes(8).toString('hex');
    baseDir = path.join(os.tmpdir(), `ai-cowork-copy-${uniqueId}`);
    sourceDir = path.join(baseDir, 'source');
    targetDir = path.join(baseDir, 'target');
    
    await fs.ensureDir(sourceDir);
    await fs.ensureDir(targetDir);

    // Create mock source structure
    await fs.ensureDir(path.join(sourceDir, 'context'));
    await fs.ensureDir(path.join(sourceDir, 'skills'));
    await fs.ensureDir(path.join(sourceDir, 'agents'));
    await fs.ensureDir(path.join(sourceDir, 'templates'));
    await fs.ensureDir(path.join(sourceDir, 'stacks', 'react-typescript'));
    await fs.ensureDir(path.join(sourceDir, 'stacks', 'php-laravel'));
    await fs.ensureDir(path.join(sourceDir, 'stacks', 'node-express'));

    // Add some content
    await fs.writeFile(path.join(sourceDir, 'context', 'index.md'), '# Context');
    await fs.writeFile(path.join(sourceDir, 'skills', 'test.md'), '# Test Skill');
    await fs.writeFile(path.join(sourceDir, 'stacks', 'react-typescript', 'stack.json'), '{}');
    await fs.writeFile(path.join(sourceDir, 'stacks', 'php-laravel', 'stack.json'), '{}');
  });

  afterEach(async () => {
    if (baseDir && await fs.pathExists(baseDir)) {
      await fs.remove(baseDir);
    }
  });

  describe('copyAiDirectory', () => {
    it('should copy core directories without stack', async () => {
      const result = await copyAiDirectory(sourceDir, targetDir, {
        skipStacks: true,
        aiTools: 'all',
        overwrite: false
      });

      expect(result.success).toBe(true);
      expect(result.copied).toContain('.ai/context');
      expect(result.copied).toContain('.ai/skills');
      expect(result.copied).toContain('.ai/agents');
      expect(result.copied).toContain('.ai/templates');
      expect(result.skipped).toContain('.ai/stacks (skipped - no stack selected)');

      // Verify files exist
      expect(await fs.pathExists(path.join(targetDir, '.ai', 'context', 'index.md'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.ai', 'skills', 'test.md'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.ai', 'stacks'))).toBe(false);
    });

    it('should copy specific stack when specified', async () => {
      const result = await copyAiDirectory(sourceDir, targetDir, {
        stack: 'react-typescript',
        aiTools: 'all',
        overwrite: false
      });

      expect(result.success).toBe(true);
      expect(result.copied).toContain('.ai/stacks/react-typescript');
      
      // Verify only specified stack exists
      expect(await fs.pathExists(path.join(targetDir, '.ai', 'stacks', 'react-typescript'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.ai', 'stacks', 'php-laravel'))).toBe(false);
    });

    it('should copy all stacks when no stack specified and not skipping', async () => {
      const result = await copyAiDirectory(sourceDir, targetDir, {
        aiTools: 'all',
        overwrite: false
      });

      expect(result.success).toBe(true);
      expect(result.copied).toContain('.ai/stacks (all)');
      
      // Verify all stacks exist
      expect(await fs.pathExists(path.join(targetDir, '.ai', 'stacks', 'react-typescript'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.ai', 'stacks', 'php-laravel'))).toBe(true);
    });

    it('should skip when .ai already exists', async () => {
      await fs.ensureDir(path.join(targetDir, '.ai'));

      const result = await copyAiDirectory(sourceDir, targetDir, {
        aiTools: 'all',
        overwrite: false
      });

      expect(result.skipped).toContain('.ai (already exists, use --force to overwrite)');
    });
  });

  describe('createBridges', () => {
    it('should create all bridge directories', async () => {
      const result = await createBridges(targetDir, 'all');

      expect(result.success).toBe(true);
      expect(result.copied).toContain('.claude');
      expect(result.copied).toContain('.cursor');
      expect(result.copied).toContain('.opencode');
      expect(result.copied).toContain('.agent');

      // Verify directories exist with README
      expect(await fs.pathExists(path.join(targetDir, '.claude', 'README.md'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.opencode', 'README.md'))).toBe(true);
    });

    it('should create specific bridges when specified', async () => {
      const result = await createBridges(targetDir, ['claude', 'opencode']);

      expect(result.copied).toContain('.claude');
      expect(result.copied).toContain('.opencode');
      expect(result.copied).not.toContain('.cursor');
      expect(result.copied).not.toContain('.agent');
    });

    it('should skip existing bridges', async () => {
      await fs.ensureDir(path.join(targetDir, '.claude'));

      const result = await createBridges(targetDir, ['claude']);

      expect(result.skipped).toContain('.claude (already exists)');
    });

    it('should create tool-specific config files', async () => {
      await createBridges(targetDir, 'all');

      expect(await fs.pathExists(path.join(targetDir, '.claude', 'CLAUDE.md'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.cursor', 'rules.md'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.opencode', 'config.md'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.agent', 'AGENT.md'))).toBe(true);
    });
  });
});
