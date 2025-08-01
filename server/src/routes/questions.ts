import { Router } from "express";
import { body, param } from "express-validator";
import { validateRequest } from "../middleware/validate-request";
import { Question } from "../models/Question";

const router = Router();

// API key middleware
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
};

router.use(apiKeyAuth);

// Create question
router.post(
  "/",
  [
    body("course_id").isString().notEmpty(),
    body("text").isString().notEmpty(),
    body("options").isArray({ min: 2 }),
    body("correct_index").isInt({ min: 0 }),
    body("explanation").optional().isString(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const question = await Question.create(req.body);
      res.status(201).json(question);
    } catch (error) {
      res.status(500).json({ error: "Failed to create question" });
    }
  }
);

// Bulk create questions
router.post(
  "/bulk",
  [body().isArray({ min: 1 })],
  validateRequest,
  async (req, res) => {
    try {
      const questions = await Question.bulkCreate(req.body);
      res.status(201).json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to create questions" });
    }
  }
);

// Get questions by course
router.get(
  "/course/:courseId",
  [param("courseId").isString().notEmpty()],
  validateRequest,
  async (req, res) => {
    try {
      const questions = await Question.findAll({
        where: { course_id: req.params.courseId },
      });
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  }
);

export default router;
