import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') ?? 'Ilham Pamungkas'
  const tag = searchParams.get('tag') ?? ''
  const readingTime = searchParams.get('rt') ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
          backgroundColor: '#F2EDE4',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Paper texture feel — subtle grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 31px, #D4C5B0 31px, #D4C5B0 32px)',
            opacity: 0.3,
          }}
        />

        {/* Tag */}
        {tag && (
          <p
            style={{
              fontSize: 18,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#C4785A',
              marginBottom: 20,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {tag}
          </p>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: title.length > 60 ? 44 : 56,
            fontWeight: 900,
            lineHeight: 1.1,
            color: '#1C1917',
            marginBottom: 32,
            maxWidth: 820,
          }}
        >
          {title}
        </h1>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #D4C5B0',
            paddingTop: 24,
          }}
        >
          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#1C1917',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Ilham Pamungkas
          </p>
          {readingTime && (
            <p
              style={{
                fontSize: 16,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#8B7355',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {readingTime} min read
            </p>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
