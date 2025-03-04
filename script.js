document.addEventListener('DOMContentLoaded', () => {
    const videoElements = [
        { id: 'video-1', src: 'https://streaming1.dsatmacau.com/traffic/m2029.m3u8', thumbnailId: 'thumbnail-1', titleId: 'video-title-1', buttonId: 'toggle-video-1', generatedThumbnailId: 'generated-thumbnail-1' },
        { id: 'video-2', src: 'https://streaming1.dsatmacau.com/traffic/m2092.m3u8', thumbnailId: 'thumbnail-2', titleId: 'video-title-2', buttonId: 'toggle-video-2', generatedThumbnailId: 'generated-thumbnail-2' }
    ];

    videoElements.forEach(video => {
        const videoElement = document.getElementById(video.id);
        const thumbnail = document.getElementById(video.thumbnailId);
        const toggleButton = document.getElementById(video.buttonId);
        const generatedThumbnail = document.getElementById(video.generatedThumbnailId);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(video.src);
            hls.attachMedia(videoElement);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoElement.play().catch(error => {
                    console.log('自动播放被阻止:', error);
                });
            });
        } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            videoElement.src = video.src;
            videoElement.addEventListener('loadedmetadata', () => {
                videoElement.play().catch(error => {
                    console.log('自动播放被阻止:', error);
                });
            });
        }

        videoElement.addEventListener('canplay', () => {
            try {
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                thumbnail.src = canvas.toDataURL('image/png');

                // 生成缩略图
                const imgBase64 = canvas.toDataURL('image/jpeg');
                const img = new Image();
                img.src = imgBase64;
                img.onload = () => {
                    const oc = document.createElement('canvas'), octx = oc.getContext('2d');
                    oc.width = img.width;
                    oc.height = img.height;
                    octx.drawImage(img, 0, 0);
                    while (oc.width * 0.5 > 320) { // 假设缩略图宽度为320
                        oc.width *= 0.5;
                        oc.height *= 0.5;
                        octx.drawImage(oc, 0, 0, oc.width, oc.height);
                    }
                    oc.width = 320;
                    oc.height = oc.width * img.height / img.width;
                    octx.drawImage(img, 0, 0, oc.width, oc.height);
                    const thumb = oc.toDataURL('image/jpeg');
                    generatedThumbnail.src = thumb;
                };
                img.onerror = (error) => {
                    console.log('Error loading image:', error);
                };
            } catch (error) {
                console.error('Error generating thumbnail:', error);
                thumbnail.alt = '无法加载预览图';
            }
        });

        toggleButton.addEventListener('click', () => {
            if (videoElement.style.visibility === 'hidden') {
                videoElement.style.visibility = 'visible';
                toggleButton.textContent = '隱藏視頻';
            } else {
                videoElement.style.visibility = 'hidden';
                toggleButton.textContent = '顯示視頻';
            }
        });
    });
}); 