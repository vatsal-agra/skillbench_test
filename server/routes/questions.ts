import { Router } from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';
import { apiKeyAuth } from '../middleware/auth';
import Question from '../models/Question';

const router = Router();

// Apply API key auth to all question routes
router.use(apiKeyAuth);

// Create a new question
router.post(
  '/',
  [
    body('course_id').isString().notEmpty(),
    body('text').isString().notEmpty(),
    body('options').isArray({ min: 2 }),
    body('correct_index').isInt({ min: 0 }),
    body('explanation').optional().isString(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const question = await Question.create({
        ...req.body,
        options: req.body.options.map((opt: string) => opt.trim()).filter(Boolean),
      });
      res.status(201).json(question);
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ error: 'Failed to create question' });
    }
  }
);

// Bulk import questions
router.post(
  '/bulk',
  [
    body().isArray({ min: 1 }),
    body('*.course_id').isString().notEmpty(),
    body('*.text').isString().notEmpty(),
    body('*.options').isArray({ min: 2 }),
    body('*.correct_index').isInt({ min: 0 }),
    body('*.explanation').optional().isString(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const questions = await Question.bulkCreate(
        req.body.map((q: any) => ({
          ...q,
          options: q.options.map((opt: string) => opt.trim()).filter(Boolean),
        }))
      );
      res.status(201).json(questions);
    } catch (error) {
      console.error('Error bulk creating questions:', error);
      res.status(500).json({ error: 'Failed to create questions' });
    }
  }
);

// Get questions for a course
router.get(
  '/course/:courseId',
  [param('courseId').isString().notEmpty()],
  validateRequest,
  async (req, res) => {
    try {
      const questions = await Question.findAll({
        where: { course_id: req.params.courseId },
        order: [['created_at', 'ASC']],
      });
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  }
);

export default router;
