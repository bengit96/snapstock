# Logo Usage Guide

The SnapPChart logo has been created and saved as constants. Here's how to use it throughout the app:

## React Components (Recommended)

Import from `components/common/logo.tsx`:

### Full Logo (with text)
```tsx
import { Logo } from '@/components/common/logo';

export default function Header() {
  return (
    <header>
      <Logo className="my-custom-class" />
    </header>
  );
}
```

### Logo Icon Only
```tsx
import { LogoIcon } from '@/components/common/logo';

export default function Favicon() {
  return <LogoIcon className="w-12 h-12" />;
}
```

### Compact Logo (for mobile)
```tsx
import { LogoCompact } from '@/components/common/logo';

export default function MobileNav() {
  return (
    <nav>
      <LogoCompact className="md:hidden" />
    </nav>
  );
}
```

## SVG String (for metadata, favicons, etc.)

Import from `lib/constants`:

```tsx
import { LOGO_SVG, LOGO_INFO } from '@/lib/constants';

export const metadata = {
  icons: {
    icon: `data:image/svg+xml,${encodeURIComponent(LOGO_SVG)}`,
  },
};
```

## Logo Design Features

- **Concentric Circles**: Represents camera shutter/"snap" concept
- **Candlestick Charts**: Shows 3 bullish candles (green) and 1 bearish (red)
- **Lightning Bolt**: Indicates speed and instant analysis
- **Color Scheme**:
  - Primary: Blue (#3B82F6)
  - Bullish: Green (#10B981)
  - Bearish: Red (#EF4444)
  - Accent: Yellow/Gold (#FBBF24)

## Logo Colors

Access logo colors from constants:

```tsx
import { LOGO_INFO } from '@/lib/constants';

const colors = LOGO_INFO.colors;
// colors.primary = "#3B82F6"
// colors.bullish = "#10B981"
// colors.bearish = "#EF4444"
// colors.accent = "#FBBF24"
```
