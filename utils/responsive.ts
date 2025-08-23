// src/utils/responsive.ts
import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';
import { PixelRatio } from 'react-native';

/**
 * 原则：以某个设计稿宽度为基准（常见 375），按屏幕宽度等比缩放。
 * moderateScale 提供温和缩放（避免极端屏幕过大/过小时失衡）
 */

export const guidelineBaseWidth = 430; // 设计稿基准宽度
export const guidelineBaseHeight = 932;

export function scale(size: number, screenWidth = guidelineBaseWidth) {
  return (screenWidth / guidelineBaseWidth) * size;
}

export function verticalScale(size: number, screenHeight = guidelineBaseHeight) {
  return (screenHeight / guidelineBaseHeight) * size;
}

export function moderateScale(size: number, factor = 0.5, screenWidth = guidelineBaseWidth) {
  const scaled = scale(size, screenWidth);
  return size + (scaled - size) * factor;
}

/**
 * rem 模拟：把 1rem 定为 baseFontSize（例如 16），然后用 moderateScale 缩放
 * 使用：fontSize: rem(1.125) // 1.125rem = 18px in design
 */
export function rem(remValue: number, baseFontSize = 16, screenWidth = guidelineBaseWidth) {
  return moderateScale(baseFontSize * remValue, 0.5, screenWidth);
}

/**
 * Hook：在组件里使用，自动响应尺寸变化
 * 返回一个对象 { rem, scale, verticalScale, isTablet, breakpoint }
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const pixelRatio = PixelRatio.get();

  return useMemo(() => {
    const isTablet = Math.min(width, height) >= 600;
    const breakpoint = width >= 768 ? 'lg' : width >= 375 ? 'md' : 'sm';

    return {
      width,
      height,
      pixelRatio,
      isTablet,
      breakpoint,
      scale: (s: number) => scale(s, width),
      verticalScale: (s: number) => verticalScale(s, height),
      moderateScale: (s: number, f = 0.5) => moderateScale(s, f, width),
      rem: (r: number, base = 16) => rem(r, base, width),
    };
  }, [width, height, pixelRatio]);
}
