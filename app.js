document.getElementById('fileInput').addEventListener('change', handleFileInput);

function handleFileInput(event) {
    const file = event.target.files[0];
    if (!file) return;

    compressImage(file, 0.5).then(compressedFile => {
        displayImage(compressedFile);
    });
}

function compressImage(file, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 画像のサイズを小さくするためのロジック
                const MAX_WIDTH = 800;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = function() {
                reject(new Error('画像の読み込みに失敗しました'));
            };
        };

        reader.readAsDataURL(file);
    });
}

function displayImage(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const imgElement = document.getElementById('outputImage');
        imgElement.src = event.target.result;
    };
    reader.readAsDataURL(file);
}
