import rateLimit from "express-rate-limit"

const authRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    headers: true,
    message: "All login attempts used - lockout for 5 minutes."
})

export { authRateLimiter }