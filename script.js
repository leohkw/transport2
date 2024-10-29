document.addEventListener('DOMContentLoaded', () => {
    const videoElements = [
        { id: 'video-1', src: 'https://streaming1.dsatmacau.com/traffic/m2029.m3u8', thumbnailId: 'thumbnail-1', titleId: 'video-title-1' },
        { id: 'video-2', src: 'https://streaming1.dsatmacau.com/traffic/m2092.m3u8', thumbnailId: 'thumbnail-2', titleId: 'video-title-2' }
    ];

    videoElements.forEach(video => {
        const videoElement = document.getElementById(video.id);
        const thumbnail = document.getElementById(video.thumbnailId);
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
            } catch (error) {
                console.error('Error generating thumbnail:', error);
                thumbnail.alt = '无法加载预览图';
            }
        });
    });
}); 