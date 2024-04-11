const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = getFileExtension(file.originalname); // Lấy phần mở rộng từ tên tệp gốc
        const fileName = fileNameWithoutExtension(file.originalname);
        cb(null, fileName +  uniqueSuffix + fileExtension)
    }
});

function getFileExtension(filename) {
  return '.' + filename.split('.').pop();
}

const fileNameWithoutExtension = (fileName) => fileName.substring(0, fileName.lastIndexOf('.'));

const upload = multer({storage: storage})

module.exports = {upload};