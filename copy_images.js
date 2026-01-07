const fs = require('fs');
const path = require('path');

// 定义源目录和目标目录
const sourceDir = 'e:\\个人网站\\photo';
const targetDir = 'e:\\个人网站\\public\\images';

console.log('开始执行图片复制操作...');

// 检查并创建目标目录
if (!fs.existsSync(targetDir)) {
    console.log(`创建目录: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
} else {
    console.log(`目录已存在: ${targetDir}`);
}

// 获取源目录中的所有文件
fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error(`读取源目录失败: ${err}`);
        return;
    }

    console.log(`找到 ${files.length} 个文件:`);
    files.forEach(file => {
        console.log(`- ${file}`);
    });

    // 复制每个文件到目标目录
    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);

        fs.copyFile(sourcePath, targetPath, (err) => {
            if (err) {
                console.error(`复制文件失败 ${file}: ${err}`);
            } else {
                console.log(`成功复制: ${file} -> ${targetPath}`);
            }
        });
    });

    console.log('图片复制操作完成!');
});
