const express = require('express');
const validate = require('../../middlewares/validate');
const lobbyValidation = require('../../validations/lobby.validation');
const lobbyController = require('../../controllers/lobby.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', validate(lobbyValidation.createLobby), lobbyController.createLobby);

router.get('/:lobbyCode', validate(lobbyValidation.getLobbyInfo), lobbyController.getLobbyInfo);

router.delete('/:lobbyCode', validate(lobbyValidation.deleteLobby), lobbyController.deleteLobby);

router.post('/:lobbyCode/enter', validate(lobbyValidation.enterLobby), lobbyController.enterLobby);

router.post('/:lobbyCode/leave', validate(lobbyValidation.leaveLobby), lobbyController.leaveLobby);

router.put('/:lobbyCode/addAdmin', validate(lobbyValidation.addAdminToLobby), lobbyController.addAdminToLobby);

router.put('/:lobbyCode/removeAdmin', validate(lobbyValidation.removeAdminFromLobby), lobbyController.removeAdminFromLobby);

//testing remove later
router.get('/', validate(lobbyValidation.getAllLobies), lobbyController.getActiveLobbies);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Lobby
 *   description: Lobby management
 */

/**
 * @swagger
 * /lobby:
 *   post:
 *     summary: Create a lobby
 *     description: Every user can create a new lobby
 *     tags: [Lobby]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lobbyCode
 *               - userId
 *             properties:
 *               lobbyCode:
 *                 type: string
 *               userId:
 *                 type: string
 *             example:
 *               lobbyCode: testing-lobby-123
 *               userId: 42331255634
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *
 */
/**
 * @swagger
 * /lobby/{lobbyCode}:
 *   get:
 *     summary: Get a lobby info
 *     description: Everyone can get lobby info (for now. this must change to only registered players).
 *     tags: [Lobby]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lobbyCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Lobby code
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lobby'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */

/**
 * @swagger
 * /lobby/{lobbyCode}:
 *   delete:
 *     summary: Delete a lobby
 *     description: Only lobby admins can delete lobbies
 *     tags: [Lobby]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: DAJDLKJ1DHQIW=E=1JD-P1-2ENODAKSND12TU3VHDAJK
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /lobby/{lobbyCode}/enter:
 *   put:
 *     summary: Enter a lobby
 *     description: Everyone can enter a lobby
 *     tags: [Lobby]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *             example:
 *               userId: 18923798123
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lobby'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /lobby/{lobbyCode}/leave:
 *   put:
 *     summary: Leave a lobby
 *     description: Every player who is inside the lobby can leave the lobby
 *     tags: [Lobby]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *             example:
 *               userId: 18923798123
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lobby'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /lobby/{lobbyCode}/addAdmin:
 *   put:
 *     summary: Add admin to lobby
 *     description: Only admin of the lobby can add new admins
 *     tags: [Lobby]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
*              required:
 *               - refreshToken
 *               - adminId
 *             example:
 *               refreshToken: mdo1jd10239=1-=13i01ndaud190
 *               adminId: 12312314
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lobby'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /lobby/{lobbyCode}/removeAdmin:
 *   put:
 *     summary: Remove admin from lobby
 *     description: Only admin of the lobby can remove new admins and cannot remove last one
 *     tags: [Lobby]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *               - adminId
 *             example:
 *               refreshToken: nmdkancjnjDJSADB1UGD12T318EDVASU
 *               adminId: 18923798123
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lobby'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
