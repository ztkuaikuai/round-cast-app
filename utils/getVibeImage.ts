// 根据 session id 获取对应的 vibe 图片
export const getVibeImage = (id: string) => {
    const imageIndex = (parseInt(id) % 9) + 1 // 1-9 对应 1.png - 9.png

    // 创建图片资源映射数组
    const vibeImages = [
        require('assets/vibe/1.png'),
        require('assets/vibe/2.png'),
        require('assets/vibe/3.png'),
        require('assets/vibe/4.png'),
        require('assets/vibe/5.png'),
        require('assets/vibe/6.png'),
        require('assets/vibe/7.png'),
        require('assets/vibe/8.png'),
        require('assets/vibe/9.png'),
    ]

    return vibeImages[imageIndex - 1] || vibeImages[0] // 默认返回第一张图片
}