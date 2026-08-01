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
  width: 192,
  height: 192,
};

export default async function Icon() {
  const borderPath = roundedSquarePath(size.width, 30, 7, 6);
  const innerPath = roundedSquarePath(size.width, 31, 57, 8);
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
          <path d={borderPath} fill="none" stroke={APP_ICON_INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <path d={innerPath} fill="none" stroke={APP_ICON_INK} strokeWidth={1.5} opacity={0.3} />
        </svg>
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
