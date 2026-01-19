'use client';

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useRssFeed } from '../../hooks/useRssFeed';

interface EmbedMakerProps {
  url: string;
  name: string;
  size?: string;
  fontClassName?: string;
  _rssLimit?: string;
  _rssTitle?: string;
}

function extractTweetInfo(url: string) {
  if (url.includes('/status/')) return { value: url, isProfile: false };
  const match = url.match(/twitter\.com\/(\w+)/);
  if (match?.[1]) return { value: match[1], isProfile: true };
  return { value: url, isProfile: false };
}

function getYouTubeVideoId(url: string): string {
  const videoIdMatch = url.match(/[?&]v=(.+?)(?:$|[&?])/)?.[1];
  const shortLinkMatch = url.match(/https:\/\/youtu\.be\/(.+?)(?:$|[&?])/)?.[1];
  const embedLinkMatch = url.match(/https:\/\/www\.youtube(-nocookie)?\.com\/embed\/(.+?)(?:$|[&?])/)?.[2];
  const shortsVideoIdMatch = url.match(/^https?:\/\/(?:www\.)?youtube\.com\/shorts\/(.+?)\b/)?.[1];
  return videoIdMatch ?? shortLinkMatch ?? embedLinkMatch ?? shortsVideoIdMatch ?? '';
}

const TikTokProfileEmbed = ({ url, fontClassName }: { url: string; fontClassName?: string }) => {
  const username = url.split('@').pop() || '';
  return (
    <blockquote
      className="tiktok-embed"
      cite={url}
      data-unique-id={username}
      data-embed-type="creator"
      style={{ width: '100%' }}
    >
      <section>
        <a target="_blank" href={`${url}?refer=creator_embed`} rel="noreferrer" className={fontClassName}>
          @{username}
        </a>
      </section>
    </blockquote>
  );
};

export const EmbedMaker: React.FC<EmbedMakerProps> = ({
  url,
  name,
  size = 'large',
  fontClassName,
  _rssLimit,
  _rssTitle,
}) => {
  const { rssFeed, loading: rssLoading, fetchRssFeed } = useRssFeed();
  const [rssTitle, setRssTitle] = useState(_rssTitle || 'RSS Feed');
  const [rssLimit, setRssLimit] = useState(3);

  useEffect(() => {
    if (name === 'RSS' && url) {
      fetchRssFeed(url);
    }
  }, [url, name, fetchRssFeed]);

  useEffect(() => {
    if (name === 'RSS' && url) {
      try {
        const urlObj = new URL(url);
        const limit = Number(_rssLimit || urlObj.searchParams.get('limit') || 3);
        const title = _rssTitle || urlObj.searchParams.get('title') || 'RSS Feed';
        setRssLimit(limit);
        setRssTitle(title);
      } catch {
        setRssLimit(3);
        setRssTitle('RSS Feed');
      }
    }
  }, [_rssLimit, _rssTitle, url, name]);

  if (rssLoading || !name) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (name.toLowerCase().startsWith('spotify')) {
    const height = size && ['small', 'medium'].includes(size) ? 152 : 352;
    return (
      <iframe
        width="100%"
        height={height}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        src={url.replace(/.com/g, '.com/embed')}
        style={{ border: 'none', borderRadius: '8px' }}
      />
    );
  }

  if (name.toLowerCase().startsWith('youtube')) {
    const videoId = getYouTubeVideoId(url);
    const options: { width: string | number; height: number } = {
      width: '100%',
      height: size === 'large' ? 450 : 300,
    };

    if (url.includes('shorts')) {
      options.height = 620;
      if (size === 'large') {
        options.height = Math.round((620 / 320) * 380);
      }
    }

    return (
      <iframe
        {...options}
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ border: 'none', borderRadius: '8px' }}
      />
    );
  }

  if (name.toLowerCase().startsWith('facebook')) {
    return (
      <Box sx={{ padding: 'var(--padding-md)', textAlign: 'center', color: 'var(--color-gray-600)' }}>
        Facebook embeds are not available. Please use iframe or other embed method.
      </Box>
    );
  }

  if (name.toLowerCase().startsWith('tiktok')) {
    if (!url.includes('/video/')) {
      return <TikTokProfileEmbed url={url} fontClassName={fontClassName} />;
    }
    return (
      <Box sx={{ padding: 'var(--padding-md)', textAlign: 'center', color: 'var(--color-gray-600)' }}>
        TikTok video embeds are not available. Please use TikTok's official embed code.
      </Box>
    );
  }

  if (name === 'Twitter') {
    return (
      <Box sx={{ padding: 'var(--padding-md)', textAlign: 'center', color: 'var(--color-gray-600)' }}>
        Twitter embeds are not available. Please use Twitter's official embed code.
      </Box>
    );
  }

  if (name.toLowerCase().startsWith('instagram')) {
    return (
      <Box sx={{ padding: 'var(--padding-md)', textAlign: 'center', color: 'var(--color-gray-600)' }}>
        Instagram embeds are not available. Please use Instagram's official embed code.
      </Box>
    );
  }

  if (name === 'RSS' && rssFeed.length > 0) {
    return (
      <Box sx={{ width: '100%', marginTop: 'var(--padding-md)' }}>
        {rssTitle && (
          <Box sx={{ marginBottom: 'var(--padding-md)', fontSize: 'var(--font-size-md-1)', fontWeight: 'var(--font-weight-semibold)' }}>
            {rssTitle}
          </Box>
        )}
        <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden', padding: 0, margin: 0 }}>
          {rssFeed.slice(0, rssLimit).map((feed: any, index: number) => (
            <Box
              component="li"
              key={feed.id || index}
              sx={{
                borderBottom: index < rssFeed.slice(0, rssLimit).length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                padding: 'var(--padding-md)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box
                component="a"
                href={feed.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
                onClick={(e) => {
                  if (!feed.link) e.preventDefault();
                }}
              >
                <Box sx={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-normal)', marginBottom: 'var(--padding-xs)', lineHeight: 1.5 }}>
                  {feed.title}
                </Box>
                {feed.content && (
                  <Box
                    sx={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-gray-600)',
                      lineHeight: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: feed.content.toString().replace(/(<([^>]+)>)/gi, ''),
                    }}
                  />
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return null;
};

export default EmbedMaker;
