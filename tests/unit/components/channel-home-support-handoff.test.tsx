/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, act, waitFor } from '@testing-library/react';
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

// Distinguishes the two SidebarPlaylist call sites in ChannelHome.tsx: the mobile
// "videos" tab panel (only mounted when activeTab === "videos", showSupportBox
// defaults true) vs. the always-rendered desktop aside (explicit showSupportBox={false}).
// Only the mobile instance should ever expose #donations for this test.
//
// #donations mount is configurable via setDonationsMountDelay to simulate the real
// SidebarPlaylist, where DonationBox only renders once Clerk's authLoaded/isSignedIn
// resolves — which can lag behind the tab's own slide-in animation on a cold load.
const { setDonationsMountDelay, getDonationsMountDelay } = vi.hoisted(() => {
  let delay = 0;
  return {
    setDonationsMountDelay: (ms: number) => {
      delay = ms;
    },
    getDonationsMountDelay: () => delay,
  };
});

vi.mock('@/app/components/channel/SidebarPlaylist', async () => {
  const ReactActual = await import('react');
  return {
    SidebarPlaylist: (props: { showSupportBox?: boolean }) => {
      const delay = getDonationsMountDelay();
      const [ready, setReady] = ReactActual.useState(delay === 0);
      ReactActual.useEffect(() => {
        if (delay === 0) return;
        const timer = setTimeout(() => setReady(true), delay);
        return () => clearTimeout(timer);
      }, []);
      if (props.showSupportBox === false) return null;
      return ready ? ReactActual.createElement('div', { id: 'donations' }, 'donation-box-stub') : null;
    },
    SidebarSupportBox: () => null,
  };
});

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
    setDonationsMountDelay(0);
  });

  it('switches to the videos tab and scrolls to #donations after the slide-in animation settles, on mobile', () => {
    mockMatchMedia({ isMobile: true, reducedMotion: false });
    vi.useFakeTimers();

    const { container } = render(
      <ChannelHome mainVideo={mainVideo} allVideos={[mainVideo]} userProfile={null} />,
    );

    // Starting tab is "comments" — the mobile videos-tab panel (and its #donations) must not exist yet.
    expect(container.querySelector('#donations')).toBeNull();

    act(() => {
      window.dispatchEvent(new CustomEvent('polutek:open-support'));
    });

    // The tab switch itself must be synchronous/immediate, not waiting on the scroll delay.
    expect(container.querySelector('#donations')).not.toBeNull();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(349);
    });
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('scrolls immediately (no delay) when prefers-reduced-motion is on', () => {
    mockMatchMedia({ isMobile: true, reducedMotion: true });
    vi.useFakeTimers();

    const { container } = render(
      <ChannelHome mainVideo={mainVideo} allVideos={[mainVideo]} userProfile={null} />,
    );

    act(() => {
      window.dispatchEvent(new CustomEvent('polutek:open-support'));
    });

    expect(container.querySelector('#donations')).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('keeps polling and still scrolls when #donations mounts late (slow Clerk auth resolution)', async () => {
    // Simulates SidebarPlaylist's real gating: DonationBox only renders once Clerk's
    // authLoaded/isSignedIn resolves, which can lag well past the ~300ms tab-switch
    // slide-in animation on a cold page load. Real timers here (not fake) — mixing
    // fake timers with a mock component's own independently-scheduled setTimeout
    // makes React's commit timing hard to reason about across act() boundaries;
    // real timers plus waitFor exercise the exact same retry code path without
    // that harness-specific noise, just slower (real milliseconds) than fake-timer
    // tests.
    setDonationsMountDelay(500);

    mockMatchMedia({ isMobile: true, reducedMotion: false });

    const { container } = render(
      <ChannelHome mainVideo={mainVideo} allVideos={[mainVideo]} userProfile={null} />,
    );

    act(() => {
      window.dispatchEvent(new CustomEvent('polutek:open-support'));
    });

    // Tab switches immediately, but the donation box itself isn't mounted yet.
    expect(container.querySelector('#donations')).toBeNull();

    // A single fixed-delay attempt (the animation's own ~350ms wait) would have
    // silently given up before the box mounts at 500ms; the poll must keep
    // retrying past that and still find it.
    await waitFor(
      () => {
        expect(container.querySelector('#donations')).not.toBeNull();
        expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 },
    );
  });
});
