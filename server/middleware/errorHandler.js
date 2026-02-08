// 全域錯誤處理 Middleware
const errorHandler = (err, req, res, next) => {
    // 記錄錯誤 (在實際專案中，這裡應該連接到 logging service 如 Sentry)
    console.error(`[Error] ${req.method} ${req.url}:`, err);

    // 預設狀態碼與訊息
    let statusCode = 500;
    let message = 'Server error';

    // 根據錯誤類型進行客製化處理
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.code === 'P2002') { // Prisma Unique Constraint Violation
        statusCode = 409;
        message = 'Data already exists (Unique constraint failed)';
    } else if (err.code === 'P2025') { // Prisma Record Not Found
        statusCode = 404;
        message = 'Record not found';
    }

    // 回傳錯誤訊息
    // 注意：在 Production 環境中，絕對隱藏 err.stack
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack, detail: err.message })
    });
};

module.exports = errorHandler;
