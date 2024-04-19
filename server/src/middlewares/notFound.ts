import { NextFunction, Request, Response } from "express";

export const NotFound = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return res.status(500).json({ err: err.message });
};
