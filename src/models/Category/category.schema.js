/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - coverImage
 *       properties:
 *         id:
 *           type: string
 *           description: The Auto-generated id of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         coverImage:
 *           type: string
 *           description: The cover image URL for the category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time the category was last updated
 *       example:
 *         id: 60e3b6d6f22e4e00c4a8b8e4
 *         name: Nature
 *         coverImage: https://example.com/images/nature.jpg
 *         createdAt: 2024-08-25T08:30:00Z
 *         updatedAt: 2024-08-25T08:30:00Z
 */
