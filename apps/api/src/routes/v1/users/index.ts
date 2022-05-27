import { Router } from "express";
import { ASRequest } from "types/custom";

import { prisma } from "@abuse-sleuth/prisma";

import requireAuth from "@utils/middleware/requireAuth";

const v1UserRouter = Router();

// GET REQUESTS

// Get All Users (Admin Required)
v1UserRouter.get("/", requireAuth, async (req: ASRequest, res) => {
    if (req.user?.userRole === "USER") {
        return res.status(401).send({
            ok: false,
            data: "Not Authorised",
        });
    }

    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const users = await prisma.user.findMany({
        select: {
            email: true,
            userRole: true,
            createdAt: true,
        },
        skip,
        take: limit,
    });

    res.json({
        ok: true,
        data: users,
    });
});

// Get Self User (User Required)
v1UserRouter.get("/self", requireAuth, (req: ASRequest, res) => {
    res.json({
        ok: true,
        data: req.user,
    });
});

// Get Single User (Admin Required)
v1UserRouter.get("/:userId", (req, res) => {
    res.json({
        message: "Hello from V1 User Get Single!",
    });
});

// POST REQUESTS

// Create User (Admin Required)
v1UserRouter.post("/", (req, res) => {});

export { v1UserRouter };
export default v1UserRouter;
