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
 *           description: The Auto-generated id of the wallpaper
 *         imageTitle:
 *           type: string
 *           description: The title of the wallpaper
 *         screen:
 *           type: string
 *           enum: ["Mobile", "Desktop"]
 *           description: The screen type (Mobile/Desktop)
 *         image:
 *           type: string
 *           description: The image URL for the wallpaper
 *         description:
 *           type: string
 *           description: A brief description of the wallpaper
 *         owner:
 *           type: string
 *           description: The user ID of the owner of the wallpaper
 *         category:
 *           type: string
 *           description: The category ID to which the wallpaper belongs
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the wallpaper was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time the wallpaper was last updated
 *       example:
 *         id: 60e3b6d6f22e4e00c4a8b8e4
 *         imageTitle: Sunset Wallpaper
 *         screen: Mobile
 *         image: https://example.com/images/sunset.jpg
 *         description: A beautiful sunset wallpaper for mobile screens
 *         owner: 60e3b6d6f22e4e00c4a8b8e4
 *         category: 60e3b6d6f22e4e00c4a8b8e4
 *         createdAt: 2024-08-25T08:30:00Z
 *         updatedAt: 2024-08-25T08:30:00Z
 */
