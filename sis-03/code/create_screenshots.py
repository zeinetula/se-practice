"""
Generate placeholder evidence screenshots for SIS #03.
These are valid PNG files with proper dimensions.
Run: python create_screenshots.py
IMPORTANT: Replace these with REAL screenshots from the browser before submission.
"""
import struct
import zlib
import os

def make_png(width, height, bg=(248, 250, 252), text_color=(30, 30, 30)):
    """Create a simple solid-color PNG with some text-like pixels."""
    def chunk(name, data):
        crc = zlib.crc32(name + data) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', crc)

    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))

    rows = []
    for y in range(height):
        row = [0]  # filter byte
        for x in range(width):
            # Draw a simple UI-like pattern
            # Header bar at top
            if y < 60:
                row.extend([37, 99, 235])  # blue header
            # Sidebar divider
            elif x == width // 2 and y > 60:
                row.extend([226, 232, 240])  # slate divider
            # Available result banner at bottom
            elif y > height - 100 and x > width // 4 and x < 3 * width // 4:
                row.extend([209, 250, 229])  # green result
            # Form area
            elif y > 80 and y < height - 110 and x > width // 2 + 10 and x < width - 10:
                # input field
                if (y - 80) % 80 > 30 and (y - 80) % 80 < 65:
                    row.extend([255, 255, 255])  # white input
                else:
                    row.extend([248, 250, 252])  # light background
            # Room list
            elif y > 80 and y < height - 110 and x > 10 and x < width // 2 - 10:
                if (y - 80) % 90 > 10 and (y - 80) % 90 < 85:
                    if (y - 80) // 90 == 0:
                        row.extend([239, 246, 255])  # selected room blue
                    else:
                        row.extend([255, 255, 255])  # other room white
                else:
                    row.extend([248, 250, 252])  # gap
            else:
                row.extend(list(bg))
        rows.append(bytes(row))

    raw = b''.join(rows)
    idat = chunk(b'IDAT', zlib.compress(raw, 9))
    iend = chunk(b'IEND', b'')
    return sig + ihdr + idat + iend


def make_narrow_png(width=375, height=812):
    """Portrait narrow screenshot."""
    def chunk(name, data):
        crc = zlib.crc32(name + data) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', crc)

    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))

    rows = []
    for y in range(height):
        row = [0]
        for x in range(width):
            if y < 56:
                row.extend([37, 99, 235])
            elif y < 90:
                row.extend([255, 255, 255])
            elif y > height - 120 and x > 20 and x < width - 20:
                row.extend([209, 250, 229])
            elif y > 100 and y < height - 130:
                if (y - 100) % 70 > 15 and (y - 100) % 70 < 60:
                    row.extend([255, 255, 255])
                else:
                    row.extend([248, 250, 252])
            else:
                row.extend([248, 250, 252])
        rows.append(bytes(row))

    raw = b''.join(rows)
    idat = chunk(b'IDAT', zlib.compress(raw, 9))
    iend = chunk(b'IEND', b'')
    return sig + ihdr + idat + iend


evidence_dir = os.path.join(os.path.dirname(__file__), '..', 'evidence')
os.makedirs(evidence_dir, exist_ok=True)

# before-1.png: v1 with no input hints (issue: unclear UX)
with open(os.path.join(evidence_dir, 'before-1.png'), 'wb') as f:
    f.write(make_png(1200, 700))
print("Created before-1.png (1200x700)")

# after-1.png: final with hint text added below inputs
with open(os.path.join(evidence_dir, 'after-1.png'), 'wb') as f:
    f.write(make_png(1200, 700, bg=(245, 250, 255)))
print("Created after-1.png (1200x700)")

# final-narrow.png: portrait at ~375px width
with open(os.path.join(evidence_dir, 'final-narrow.png'), 'wb') as f:
    f.write(make_narrow_png(375, 812))
print("Created final-narrow.png (375x812, portrait)")

print("\nDONE. Replace these placeholder screenshots with real browser captures!")
print("See the screenshot instructions in the report.")
