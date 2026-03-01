#!/bin/bash
# ═══════════════════════════════════════════════════
# WholesaleUp Color Scheme Update Script
# Replaces sky/blue colors with orange throughout
# ═══════════════════════════════════════════════════
# Run from project root: bash color-swap.sh

echo "🎨 Updating color scheme to orange..."

# Target all phase component files
FILES="src/components/phases/*.jsx src/app/page.tsx"

for file in $FILES; do
  if [ -f "$file" ]; then
    echo "  Updating: $file"

    # ── Primary brand color: sky → orange ──
    sed -i '' 's/sky-50/orange-50/g' "$file"
    sed -i '' 's/sky-100/orange-100/g' "$file"
    sed -i '' 's/sky-200/orange-200/g' "$file"
    sed -i '' 's/sky-300/orange-300/g' "$file"
    sed -i '' 's/sky-400/orange-400/g' "$file"
    sed -i '' 's/sky-500/orange-500/g' "$file"
    sed -i '' 's/sky-600/orange-600/g' "$file"
    sed -i '' 's/sky-700/orange-700/g' "$file"
    sed -i '' 's/sky-800/orange-800/g' "$file"

    # ── Secondary: blue → orange (darker shade) ──
    sed -i '' 's/blue-50/orange-50/g' "$file"
    sed -i '' 's/blue-100/orange-100/g' "$file"
    sed -i '' 's/blue-200/orange-200/g' "$file"
    sed -i '' 's/blue-500/orange-600/g' "$file"
    sed -i '' 's/blue-600/orange-700/g' "$file"
    sed -i '' 's/blue-700/orange-800/g' "$file"
    sed -i '' 's/blue-800/orange-800/g' "$file"
    sed -i '' 's/blue-900/slate-900/g' "$file"

    # ── Gradient fixes: from-sky to-blue → from-orange to-orange ──
    # These are already handled by the above replacements

    # ── Text "sky" references in JSX strings (like "text-sky-400") ──
    # Already handled above

  fi
done

echo ""
echo "✅ Color scheme updated!"
echo ""
echo "⚠️  Manual review recommended for:"
echo "   - Gradient combinations that might need fine-tuning"
echo "   - Any decorative colors that should stay as-is (emerald, amber, violet, etc.)"
echo "   - The index page (src/app/page.tsx) may need some colors kept for visual variety"
echo ""
echo "🔍 To verify, search for remaining blue/sky references:"
echo "   grep -rn 'sky-\|blue-' src/components/phases/"
