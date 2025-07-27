const express = require('express');
const router = express.Router();
const { Enrollment, Course } = require('../models');
const auth = require('../middleware/auth');

// Check if user is enrolled in a course
router.get('/check', auth, async (req, res) => {
  try {
    const { courseId } = req.query;
    const enrollment = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        courseId
      }
    });

    res.json({ 
      isEnrolled: !!enrollment,
      enrollment
    });
  } catch (error) {
    console.error('Error checking enrollment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Enroll in a course
router.post('/', auth, async (req, res) => {
  console.log('Enrollment request received:', { 
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    user: req.user
  });
  console.log('Enrollment request received:', { 
    user: req.user.id, 
    body: req.body 
  });
  
  try {
    const { courseId } = req.body;
    
    if (!courseId) {
      console.error('Missing courseId in request body');
      return res.status(400).json({ error: 'courseId is required' });
    }
    
    // Check if already enrolled
    console.log('Checking for existing enrollment...');
    const existingEnrollment = await Enrollment.findOne({
      where: { 
        userId: req.user.id, 
        courseId: parseInt(courseId) 
      }
    });

    if (existingEnrollment) {
      console.log('User already enrolled in this course');
      return res.status(400).json({ 
        error: 'Already enrolled in this course',
        enrollmentId: existingEnrollment.id
      });
    }

    // Check if course exists
    console.log('Verifying course exists...');
    const course = await Course.findByPk(parseInt(courseId));
    if (!course) {
      console.error('Course not found:', courseId);
      return res.status(404).json({ 
        error: 'Course not found',
        courseId: parseInt(courseId)
      });
    }

    // Create enrollment
    console.log('Creating new enrollment...');
    try {
      const enrollment = await Enrollment.create({
        userId: req.user.id,
        courseId: parseInt(courseId),
        status: 'active',
        enrolledAt: new Date()
      });

      console.log('Enrollment created successfully:', enrollment.id);
      
      // In a real app, you would integrate with a payment processor here
      // and only create the enrollment after successful payment
      
      res.status(201).json({
        success: true,
        enrollmentId: enrollment.id,
        courseId: enrollment.courseId,
        userId: enrollment.userId,
        enrolledAt: enrollment.enrolledAt
      });
    } catch (dbError) {
      console.error('Database error during enrollment creation:', dbError);
      throw dbError; // This will be caught by the outer catch block
    }
  } catch (error) {
    console.error('Error in enrollment route:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...(error.errors && { errors: error.errors.map(e => e.message) })
    });
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Server error during enrollment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's enrolled courses
router.get('/my-courses', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Course,
        attributes: ['id', 'title', 'description']
      }]
    });

    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
