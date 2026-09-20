# PixVerse prompt — seamless Spirit X hero loop

Use this when regenerating the home hero clip so the first and last frames match and `<video loop>` needs no crossfade.

## Budget (30–40 credits / day)

1. Generate **one** 16:9 landscape clip (below).
2. Do **not** spend a second generation on portrait — centre-crop with ffmpeg:

```bash
ffmpeg -i hero-loop-16x9.mp4 -vf "crop=ih*3/4:ih:(iw-ih*3/4)/2:0,scale=804:1072" \
  -an -c:v libx264 -crf 22 -preset slow -pix_fmt yuv420p -movflags +faststart \
  home-snowboard-portrait.mp4
```

Redeem once the daily cap resets if the first pass needs a retry.

## Settings

| Setting | Value |
| --- | --- |
| Aspect | 16:9 |
| Duration | 5–8 s |
| Motion | Medium |
| Camera | Locked / static (or very subtle dolly that returns) |
| Style | Cinematic sports / night stadium, photoreal |

If PixVerse exposes a “loop” or “first=last frame” toggle, turn it on.

## Prompt

```
Seamless infinite loop of a lone athlete carving on a snow-dusted halfpipe at night under stadium floodlights, Sri Lankan sports-innovation mood. Locked camera position: first frame and last frame are identical composition, framing, and athlete pose so the clip can loop forever with no cut. Single continuous motion arc — athlete enters from the same entry point they exit toward. Soft powder spray, cool blue rim light, warm sodium key light, shallow depth of field, 24fps cinematic. No text, no logos, no UI, no watermark, no cuts, no jump cuts, no morphs, no scene changes.
```

## Negative (if available)

```
text, watermark, logo, subtitle, cut, jump cut, morph, different ending pose, camera whip, zoom punch, shaky cam, montage
```

## Drop-in paths

After generation, replace:

- `lithos/public/media/home-snowboard.mp4`
- `lithos/public/media/home-snowboard-portrait.mp4`

Regenerate posters from frame 0 if the new look differs from the current poster stills.
