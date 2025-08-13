// 文件处理工具函数

const fs = require('fs');
const path = require('path');

// MIME 类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.xml': 'application/xml',
    '.zip': 'application/zip'
};

// 获取文件的 MIME 类型
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

// 读取文件内容
function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// 检查文件是否存在
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch (error) {
        return false;
    }
}

// 检查目录是否存在
function directoryExists(dirPath) {
    try {
        return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    } catch (error) {
        return false;
    }
}

// 获取文件信息
function getFileStats(filePath) {
    try {
        return fs.statSync(filePath);
    } catch (error) {
        return null;
    }
}

// 创建目录（递归）
function ensureDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        return true;
    } catch (error) {
        console.error('创建目录失败:', error);
        return false;
    }
}

// 获取目录下的文件列表
function getDirectoryFiles(dirPath) {
    try {
        if (!directoryExists(dirPath)) {
            return [];
        }
        return fs.readdirSync(dirPath);
    } catch (error) {
        console.error('读取目录失败:', error);
        return [];
    }
}

// 写入文件
function writeFile(filePath, content) {
    return new Promise((resolve, reject) => {
        // 确保目录存在
        const dirPath = path.dirname(filePath);
        ensureDirectory(dirPath);

        fs.writeFile(filePath, content, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// 删除文件
function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// 复制文件
function copyFile(sourcePath, targetPath) {
    return new Promise((resolve, reject) => {
        // 确保目标目录存在
        const targetDir = path.dirname(targetPath);
        ensureDirectory(targetDir);

        fs.copyFile(sourcePath, targetPath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// 获取文件大小（格式化）
function getFormattedFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const bytes = stats.size;
        
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    } catch (error) {
        return '未知';
    }
}

// 获取文件扩展名
function getFileExtension(filePath) {
    return path.extname(filePath).toLowerCase().slice(1);
}

// 检查是否为图片文件
function isImageFile(filePath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico'];
    const ext = path.extname(filePath).toLowerCase();
    return imageExtensions.includes(ext);
}

// 检查是否为文本文件
function isTextFile(filePath) {
    const textExtensions = ['.txt', '.md', '.html', '.css', '.js', '.json', '.xml', '.csv'];
    const ext = path.extname(filePath).toLowerCase();
    return textExtensions.includes(ext);
}

// 安全的路径检查（防止路径遍历攻击）
function isSafePath(requestPath, basePath) {
    const normalizedPath = path.normalize(requestPath);
    const normalizedBase = path.normalize(basePath);
    
    // 检查是否包含路径遍历
    if (normalizedPath.includes('..')) {
        return false;
    }
    
    // 检查是否在基础路径内
    const resolvedPath = path.resolve(basePath, normalizedPath);
    const resolvedBase = path.resolve(normalizedBase);
    
    return resolvedPath.startsWith(resolvedBase);
}

// 清理文件路径
function sanitizePath(inputPath) {
    // 移除危险字符和路径遍历尝试
    return inputPath
        .replace(/\.\./g, '') // 移除 ..
        .replace(/[<>:"|?*]/g, '') // 移除 Windows 不允许的字符
        .replace(/\/{2,}/g, '/') // 合并多个斜杠
        .trim();
}

module.exports = {
    getMimeType,
    readFile,
    fileExists,
    directoryExists,
    getFileStats,
    ensureDirectory,
    getDirectoryFiles,
    writeFile,
    deleteFile,
    copyFile,
    getFormattedFileSize,
    getFileExtension,
    isImageFile,
    isTextFile,
    isSafePath,
    sanitizePath
};