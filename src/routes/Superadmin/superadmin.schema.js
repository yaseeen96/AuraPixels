/**
 * @swagger
 * /superadmin/users:
 *   get:
 *     summary: Get all users with optional status filter
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [approved, pending, rejected]
 *         description: Filter users by status
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid status filter
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /superadmin/approve/{id}:
 *   post:
 *     summary: Approve a user by ID
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to approve
 *     responses:
 *       200:
 *         description: User approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /superadmin/reject/{id}:
 *   post:
 *     summary: Reject a user by ID
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to reject
 *     responses:
 *       200:
 *         description: User rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /superadmin/createUser:
 *   post:
 *     summary: Create a new user
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the new user
 *     responses:
 *       201:
 *         description: User created successfully and email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User with this email already exists
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /superadmin/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Something went wrong
 */

// components
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The Auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *         status:
 *           type: string
 *           enum: ["approved", "pending", "rejected"]
 *           description: The account status of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time the user was last updated
 */
