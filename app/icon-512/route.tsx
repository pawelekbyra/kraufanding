import { ImageResponse } from 'next/og';
import {
  APP_ICON_BACKGROUND,
  APP_ICON_INK,
  GLASSES_MARK_DATA_URI,
  glassesMarkRect,
  roundedSquarePath,
} from '@/lib/icons/app-icon';

export const runtime = 'edge';

const size = {
  width: 512,
  height: 512,
};

export async function GET() {
  const borderPath = roundedSquarePath(size.width, 80, 7, 16);
  const innerPath = roundedSquarePath(size.width, 83, 57, 21);
  const mark = glassesMarkRect(size.width);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          background: APP_ICON_BACKGROUND,
        }}
      >
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          style={{ position: 'absolute', inset: 0 }}
        >
          <path d={borderPath} fill="none" stroke={APP_ICON_INK} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
          <path d={innerPath} fill="none" stroke={APP_ICON_INK} strokeWidth={4} opacity={0.3} />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (satori) rendering, not DOM */}
        <img
          src={GLASSES_MARK_DATA_URI}
          alt=""
          width={mark.width}
          height={mark.height}
          style={{ position: 'absolute', left: mark.x, top: mark.y }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
