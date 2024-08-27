/**
 * @swagger
 * /wallpaper/create:
 *   post:
 *     summary: Create a new wallpaper
 *     tags: [Wallpapers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imageTitle:
 *                 type: string
 *                 description: The title of the wallpaper
 *               screen:
 *                 type: string
 *                 enum: [Mobile, Desktop]
 *                 description: The type of screen for the wallpaper
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the wallpaper
 *               description:
 *                 type: string
 *                 description: A brief description of the wallpaper
 *               category:
 *                 type: string
 *                 description: The category ID for the wallpaper
 *     responses:
 *       201:
 *         description: Wallpaper created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallpaper'
 *       400:
 *         description: Invalid input or image file required
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /wallpaper/update/{id}:
 *   post:
 *     summary: Update a wallpaper by ID
 *     tags: [Wallpapers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the wallpaper to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imageTitle:
 *                 type: string
 *                 description: The updated title of the wallpaper
 *               screen:
 *                 type: string
 *                 enum: [Mobile, Desktop]
 *                 description: The updated type of screen for the wallpaper
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The updated image file for the wallpaper
 *               description:
 *                 type: string
 *                 description: The updated description of the wallpaper
 *               category:
 *                 type: string
 *                 description: The updated category ID for the wallpaper
 *     responses:
 *       200:
 *         description: Wallpaper updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallpaper'
 *       400:
 *         description: Invalid input or image file required
 *       404:
 *         description: Wallpaper not found
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /wallpaper/all:
 *   get:
 *     summary: Get all wallpapers
 *     tags: [Wallpapers]
 *     responses:
 *       200:
 *         description: List of all wallpapers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallpaper'
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /wallpaper/{id}:
 *   get:
 *     summary: Get a wallpaper by ID
 *     tags: [Wallpapers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the wallpaper to retrieve
 *     responses:
 *       200:
 *         description: The requested wallpaper
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallpaper'
 *       404:
 *         description: Wallpaper not found
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /wallpaper/category/{categoryId}:
 *   get:
 *     summary: Get all wallpapers by category ID
 *     tags: [Wallpapers]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to filter wallpapers
 *     responses:
 *       200:
 *         description: List of wallpapers for the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallpaper'
 *       404:
 *         description: No wallpapers found for this category
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /wallpaper/owner/{ownerId}:
 *   get:
 *     summary: Get all wallpapers by owner ID
 *     tags: [Wallpapers]
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the owner to filter wallpapers
 *     responses:
 *       200:
 *         description: List of wallpapers for the specified owner
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallpaper'
 *       404:
 *         description: No wallpapers found for this owner
 *       500:
 *         description: Something went wrong
 */

// component
/**
 * @swagger
 * components:
 *   schemas:
 *     Wallpaper:
 *       type: object
 *       required:
 *         - imageTitle
 *         - screen
 *         - image
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the wallpaper
 *         imageTitle:
 *           type: string
 *           description: The title of the wallpaper
 *         screen:
 *           type: string
 *           enum: [Mobile, Desktop]
 *           description: The type of screen for the wallpaper
 *         image:
 *           type: string
 *           description: The URL of the wallpaper image
 *         description:
 *           type: string
 *           description: A brief description of the wallpaper
 *         owner:
 *           type: string
 *           description: The ID of the owner of the wallpaper
 *         category:
 *           type: string
 *           description: The ID of the category for the wallpaper
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the wallpaper was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time the wallpaper was last updated
 */
