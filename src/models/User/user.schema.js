/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The Auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         phone:
 *           type: number
 *           description: The phone number of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         status:
 *           type: string
 *           enum: ["approved", "pending", "rejected"]
 *           description: The account status of the user
 *         role:
 *           type: string
 *           enum: ["SuperAdmin", "Admin"]
 *           description: The role of the user
 *         refreshToken:
 *           type: string
 *           description: The refresh token for the user
 *         profilePic:
 *           type: string
 *           description: The URL of the user's profile picture
 *         bio:
 *           type: string
 *           maxLength: 120
 *           description: A short biography of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time the user was last updated
 *       example:
 *         id: 60e3b6d6f22e4e00c4a8b8e4
 *         name: John Doe
 *         phone: 1234567890
 *         email: johndoe@example.com
 *         password: secret
 *         status: approved
 *         role: Admin
 *         refreshToken: someRefreshToken
 *         profilePic: https://example.com/images/johndoe.jpg
 *         bio: Software Developer at Example Inc.
 *         createdAt: 2024-08-25T08:30:00Z
 *         updatedAt: 2024-08-25T08:30:00Z
 */
