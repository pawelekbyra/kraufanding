/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import React from 'react';
import type { AccessTier, VideoStatus } from '@prisma/client';
import ChannelHome from '@/app/components/ChannelHome';
import type { PublicVideoDTO } from '@/app/types/video';

vi.mock('@/app/components/preload/AppPreloadProvider', () => ({
  AppPreloadProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAppPreload: () => ({ warmVideo: vi.fn() }),
}));

vi.mock('@/app/components/preload/PreloadProgressBar', () => ({
  PreloadProgressBar: () => null,
}));

vi.mock('@/components/skeletons', () => ({
  CommentLoadingSkeleton: () => <div>loading-comments-skeleton</div>,
}));

vi.mock('@/app/components/comments/EmbeddedComments', () => ({
  default: () => <div>comments-stub</div>,
}));

// The mobile "videos" tab panel is now always mounted (only hidden via a CSS class
// when inactive — see ChannelHome.tsx), so #donations should always exist once
// signed in, regardless of which tab is showing. Distinguishes the two
// SidebarPlaylist call sites in ChannelHome.tsx: the always-mounted mobile "videos"
// tab panel (showSupportBox defaults true) vs. the always-rendered desktop aside
// (explicit showSupportBox={false}).
vi.mock('@/app/components/channel/SidebarPlaylist', () => ({
  SidebarPlaylist: (props: { showSupportBox?: boolean }) =>
    props.showSupportBox === false ? null : <div id="donations">donation-box-stub</div>,
  SidebarSupportBox: () => null,
}));

vi.mock('@/app/components/Hero', () => ({
  default: () => <div>hero-stub</div>,
}));

vi.mock('@/app/components/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'pl',
    t: { comments: 'Komentarze', videosTab: 'Filmy' },
  }),
}));

vi.mock('@/app/hooks/useClientEnvironment', () => ({
  useClientReady: () => true,
}));

function mockMatchMedia({ isMobile, reducedMotion }: { isMobile: boolean; reducedMotion: boolean }) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    let matches = false;
    if (query.includes('min-width: 1024px')) matches = !isMobile;
    if (query.includes('prefers-reduced-motion')) matches = reducedMotion;
    return {
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  });
}

const mainVideo = {
  id: 'video_1',
  slug: 'video-1',
  title: 'Test Video',
  tier: 'PUBLIC' as AccessTier,
  status: 'PUBLISHED' as VideoStatus,
  views: 0,
  likesCount: 0,
  dislikesCount: 0,
} as unknown as PublicVideoDTO;

describe('ChannelHome mobile "Wspieraj" tab handoff', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('reveals the mobile "videos" tab panel and scrolls to #donations, from the comments tab', () => {
    mockMatchMedia({ isMobile: true, reducedMotion: false });
    vi.useFakeTimers();

    const { getByTestId } = render(
      <ChannelHome mainVideo={mainVideo} allVideos={[mainVideo]} userProfile={null} />,
    );

    // #donations always exists (the panel is always mounted), but starts hidden
    // since the initial tab is "comments".
    const panel = getByTestId('mobile-videos-panel');
    const classTokens = () => panel.className.split(/\s+/);
    expect(classTokens()).toContain('hidden');

    act(() => {
      window.dispatchEvent(new CustomEvent('polutek:open-support'));
    });

    // The tab switch is a synchronous class toggle — no mount to wait for.
    // (Checking the exact "hidden" token, not a substring — "lg:hidden" is
    // always present and would otherwise give a false negative.)
    expect(classTokens()).not.toContain('hidden');
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('scrolls without switching tabs on desktop', () => {
    mockMatchMedia({ isMobile: false, reducedMotion: false });
    vi.useFakeTimers();

    const { getByTestId } = render(
      <ChannelHome mainVideo={mainVideo} allVideos={[mainVideo]} userProfile={null} />,
    );

    const panel = getByTestId('mobile-videos-panel');
    const initialClassName = panel.className;

    act(() => {
      window.dispatchEvent(new CustomEvent('polutek:open-support'));
    });

    // Desktop never touches the mobile tab state.
    expect(panel.className).toBe(initialClassName);

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });
});
