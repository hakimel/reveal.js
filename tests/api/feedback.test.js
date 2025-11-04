/**
 * Backend API Tests for Feedback System
 * Tests the Express.js API endpoints for feedback submission and retrieval
 */

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Mock data
const {
  mockFeedbackItem,
  mockFeedbackList,
  createMockFeedback,
  invalidFeedbackMissingRequired,
  invalidFeedbackWrongType,
  invalidFeedbackEmptyDescription,
} = require('../fixtures/feedback-data');

// Mock feedback storage
let feedbackStore = [];
let nextId = 1;

// Create Express app for testing
function createTestApp() {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
      const uniqueName = `screenshot-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
      }
    },
  });

  // POST /api/feedback - Submit feedback
  app.post('/api/feedback', upload.single('screenshot'), async (req, res) => {
    try {
      const { presentationId, slideNumber, type, description } = req.body;

      // Validation
      if (!presentationId || !slideNumber || !type || !description) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['presentationId', 'slideNumber', 'type', 'description'],
        });
      }

      if (!['issue', 'suggestion'].includes(type)) {
        return res.status(400).json({
          error: 'Invalid feedback type',
          message: 'Type must be either "issue" or "suggestion"',
        });
      }

      if (description.trim().length === 0) {
        return res.status(400).json({
          error: 'Description cannot be empty',
        });
      }

      const slideNum = parseInt(slideNumber, 10);
      if (isNaN(slideNum) || slideNum < 0) {
        return res.status(400).json({
          error: 'Invalid slide number',
          message: 'Slide number must be a non-negative integer',
        });
      }

      // Create feedback object
      const feedback = {
        id: String(nextId++),
        presentationId,
        slideNumber: slideNum,
        type,
        description: description.trim(),
        timestamp: new Date().toISOString(),
        screenshot: req.file ? `uploads/${req.file.filename}` : null,
        userAgent: req.get('user-agent'),
      };

      feedbackStore.push(feedback);

      res.status(201).json({
        success: true,
        feedback,
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });

  // GET /api/feedback - Get all feedback
  app.get('/api/feedback', (req, res) => {
    const { presentationId, slideNumber } = req.query;

    let filtered = feedbackStore;

    if (presentationId) {
      filtered = filtered.filter((f) => f.presentationId === presentationId);
    }

    if (slideNumber !== undefined) {
      const slideNum = parseInt(slideNumber, 10);
      if (!isNaN(slideNum)) {
        filtered = filtered.filter((f) => f.slideNumber === slideNum);
      }
    }

    res.json({
      success: true,
      count: filtered.length,
      feedback: filtered,
    });
  });

  // GET /api/feedback/report/:presentationId - Get feedback report grouped by slide
  app.get('/api/feedback/report/:presentationId', (req, res) => {
    const { presentationId } = req.params;

    const presentationFeedback = feedbackStore.filter(
      (f) => f.presentationId === presentationId
    );

    // Group by slide number
    const grouped = presentationFeedback.reduce((acc, feedback) => {
      const slide = feedback.slideNumber;
      if (!acc[slide]) {
        acc[slide] = [];
      }
      acc[slide].push(feedback);
      return acc;
    }, {});

    res.json({
      success: true,
      presentationId,
      totalFeedback: presentationFeedback.length,
      bySlide: grouped,
    });
  });

  // DELETE /api/feedback/:id - Delete feedback (for testing)
  app.delete('/api/feedback/:id', async (req, res) => {
    const { id } = req.params;
    const index = feedbackStore.findIndex((f) => f.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: 'Feedback not found',
      });
    }

    const feedback = feedbackStore[index];

    // Delete screenshot if exists
    if (feedback.screenshot) {
      try {
        await fs.unlink(path.join(__dirname, '..', feedback.screenshot));
      } catch (err) {
        // File might not exist, ignore error
      }
    }

    feedbackStore.splice(index, 1);

    res.json({
      success: true,
      message: 'Feedback deleted',
    });
  });

  return app;
}

describe('Feedback API Tests', () => {
  let app;

  beforeEach(() => {
    // Reset feedback store
    feedbackStore = [];
    nextId = 1;
    app = createTestApp();
  });

  describe('POST /api/feedback', () => {
    it('should successfully submit feedback without screenshot', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .send({
          presentationId: 'test-presentation',
          slideNumber: 5,
          type: 'issue',
          description: 'Test feedback description',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.feedback).toMatchObject({
        presentationId: 'test-presentation',
        slideNumber: 5,
        type: 'issue',
        description: 'Test feedback description',
        screenshot: null,
      });
      expect(response.body.feedback.id).toBeDefined();
      expect(response.body.feedback.timestamp).toBeDefined();
    });

    it('should successfully submit feedback with screenshot', async () => {
      const testImagePath = path.join(__dirname, '../fixtures/test-image.png');

      // Create a test image buffer
      const testBuffer = Buffer.from('fake-image-data');

      const response = await request(app)
        .post('/api/feedback')
        .field('presentationId', 'test-presentation')
        .field('slideNumber', '10')
        .field('type', 'suggestion')
        .field('description', 'Add more examples')
        .attach('screenshot', testBuffer, 'screenshot.png')
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.feedback.screenshot).toMatch(/^uploads\/screenshot-/);
    });

    it('should reject feedback with missing presentationId', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .send({
          slideNumber: 5,
          type: 'issue',
          description: 'Test description',
        })
        .expect(400);

      expect(response.body.error).toBe('Missing required fields');
    });

    it('should reject feedback with missing slideNumber', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .send({
          presentationId: 'test-presentation',
          type: 'issue',
          description: 'Test description',
        })
        .expect(400);

      expect(response.body.error).toBe('Missing required fields');
    });

    it('should reject feedback with missing type', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .send({
          presentationId: 'test-presentation',
          slideNumber: 5,
          description: 'Test description',
        })
        .expect(400);

      expect(response.body.error).toBe('Missing required fields');
    });

    it('should reject feedback with missing description', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .send({
          presentationId: 'test-presentation',
          slideNumber: 5,
          type: 'issue',
        })
        .expect(400);

      expect(response.body.error).toBe('Missing required fields');
    });

    it('should reject feedback with invalid type', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .send({
          presentationId: 'test-presentation',
          slideNumber: 5,
          type: 'invalid-type',
          description: 'Test description',
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid feedback type');
    });

    it('should reject feedback with empty description', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .send({
          presentationId: 'test-presentation',
          slideNumber: 5,
          type: 'issue',
          description: '   ',
        })
        .expect(400);

      expect(response.body.error).toBe('Description cannot be empty');
    });

    it('should reject feedback with invalid slide number', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .send({
          presentationId: 'test-presentation',
          slideNumber: -1,
          type: 'issue',
          description: 'Test description',
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid slide number');
    });

    it('should reject file larger than 10MB', async () => {
      // Create a buffer larger than 10MB
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024);

      const response = await request(app)
        .post('/api/feedback')
        .field('presentationId', 'test-presentation')
        .field('slideNumber', '5')
        .field('type', 'issue')
        .field('description', 'Test description')
        .attach('screenshot', largeBuffer, 'large-screenshot.png')
        .expect(500);

      expect(response.body.error).toBeDefined();
    });

    it('should trim whitespace from description', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .send({
          presentationId: 'test-presentation',
          slideNumber: 5,
          type: 'issue',
          description: '  Test description with whitespace  ',
        })
        .expect(201);

      expect(response.body.feedback.description).toBe('Test description with whitespace');
    });

    it('should capture user agent', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .set('User-Agent', 'TestAgent/1.0')
        .send({
          presentationId: 'test-presentation',
          slideNumber: 5,
          type: 'issue',
          description: 'Test description',
        })
        .expect(201);

      expect(response.body.feedback.userAgent).toContain('TestAgent');
    });
  });

  describe('GET /api/feedback', () => {
    beforeEach(() => {
      // Populate with test data
      feedbackStore = [
        createMockFeedback({ id: '1', presentationId: 'pres-1', slideNumber: 5 }),
        createMockFeedback({ id: '2', presentationId: 'pres-1', slideNumber: 10 }),
        createMockFeedback({ id: '3', presentationId: 'pres-2', slideNumber: 5 }),
      ];
      nextId = 4;
    });

    it('should get all feedback', async () => {
      const response = await request(app).get('/api/feedback').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.feedback).toHaveLength(3);
    });

    it('should filter feedback by presentationId', async () => {
      const response = await request(app)
        .get('/api/feedback')
        .query({ presentationId: 'pres-1' })
        .expect(200);

      expect(response.body.count).toBe(2);
      expect(response.body.feedback.every((f) => f.presentationId === 'pres-1')).toBe(true);
    });

    it('should filter feedback by slideNumber', async () => {
      const response = await request(app)
        .get('/api/feedback')
        .query({ slideNumber: 5 })
        .expect(200);

      expect(response.body.count).toBe(2);
      expect(response.body.feedback.every((f) => f.slideNumber === 5)).toBe(true);
    });

    it('should filter by both presentationId and slideNumber', async () => {
      const response = await request(app)
        .get('/api/feedback')
        .query({ presentationId: 'pres-1', slideNumber: 5 })
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.feedback[0].presentationId).toBe('pres-1');
      expect(response.body.feedback[0].slideNumber).toBe(5);
    });

    it('should return empty array when no feedback matches filter', async () => {
      const response = await request(app)
        .get('/api/feedback')
        .query({ presentationId: 'nonexistent' })
        .expect(200);

      expect(response.body.count).toBe(0);
      expect(response.body.feedback).toHaveLength(0);
    });
  });

  describe('GET /api/feedback/report/:presentationId', () => {
    beforeEach(() => {
      feedbackStore = [
        createMockFeedback({ presentationId: 'pres-1', slideNumber: 5, type: 'issue' }),
        createMockFeedback({ presentationId: 'pres-1', slideNumber: 5, type: 'suggestion' }),
        createMockFeedback({ presentationId: 'pres-1', slideNumber: 10, type: 'issue' }),
        createMockFeedback({ presentationId: 'pres-2', slideNumber: 3, type: 'issue' }),
      ];
    });

    it('should generate report grouped by slide', async () => {
      const response = await request(app)
        .get('/api/feedback/report/pres-1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.presentationId).toBe('pres-1');
      expect(response.body.totalFeedback).toBe(3);
      expect(response.body.bySlide[5]).toHaveLength(2);
      expect(response.body.bySlide[10]).toHaveLength(1);
    });

    it('should return empty report for presentation with no feedback', async () => {
      const response = await request(app)
        .get('/api/feedback/report/nonexistent')
        .expect(200);

      expect(response.body.totalFeedback).toBe(0);
      expect(response.body.bySlide).toEqual({});
    });

    it('should not include feedback from other presentations', async () => {
      const response = await request(app)
        .get('/api/feedback/report/pres-1')
        .expect(200);

      const allFeedback = Object.values(response.body.bySlide).flat();
      expect(allFeedback.every((f) => f.presentationId === 'pres-1')).toBe(true);
    });
  });

  describe('Concurrent submissions', () => {
    it('should handle multiple concurrent feedback submissions', async () => {
      const submissions = Array.from({ length: 10 }, (_, i) =>
        request(app)
          .post('/api/feedback')
          .send({
            presentationId: 'test-presentation',
            slideNumber: i,
            type: 'issue',
            description: `Concurrent feedback ${i}`,
          })
      );

      const responses = await Promise.all(submissions);

      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      expect(feedbackStore).toHaveLength(10);

      // Verify all IDs are unique
      const ids = feedbackStore.map((f) => f.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });
  });
});
