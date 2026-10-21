# Quick Reference: Phase 11 Advanced Features

## 5 New Features at a Glance

### 1️⃣ Fuzzy Deduplication
**What:** Groups similar products (Nike Air Hoodie ≈ Nike Air Fleece Hoodie)
**How:** String similarity >80% + same brand = merge
**Result:** 40 products → 12 logical products
**Code:** `productEnhancer.fuzzyDeduplicateProducts()`

### 2️⃣ Price Intelligence  
**What:** Tags prices as "Great Deal 🔥", "Good Price ✓", or "High Price ⚠️"
**How:** Calculates market average, compares each offer
**Logic:** 
- <85% of avg = "Great Deal 🔥"
- 85-120% of avg = "Good Price ✓"  
- >120% of avg = "High Price ⚠️"
**Code:** `productEnhancer.tagPricesAsDeals()`

### 3️⃣ Size Parsing
**What:** Automatically extracts sizes from product titles
**How:** Regex matching for XS/S/M/L/XL or numeric (US 7, 8.5, etc)
**Example:** "Nike Air Max US 8.5" → detects "Size 8.5"
**Code:** `productEnhancer.extractSizeFromTitle()`

### 4️⃣ Style Recommendations
**What:** "Complete the Look" suggestions based on detected garment
**How:** Garment detection + pairing rules lookup
**Example:** Scan hoodie → suggests jeans, joggers, sneakers
**Code:** `productEnhancer.generateStyleRecommendations()`

### 5️⃣ Persistent File Cache
**What:** Cache survives server restarts (24-hour TTL)
**How:** Writes JSON files to `.scan-cache/` directory
**Benefit:** Don't repay API costs for same image after restart
**Code:** `productEnhancer.readFromFileCache()` / `writeToFileCache()`

---

## How to Test

### Test Fuzzy Matching
```
1. Scan a hoodie
2. Check console for: "✨ [FUZZY] Matched..."
3. Verify products reduced: "40 → 12"
```

### Test Price Intelligence
```
1. Scan any item
2. Check console: "💰 [PRICES]"
3. Look for tags: 🔥 / ✓ / ⚠️
4. Example: "Aerie: $35.97 → Great Deal 🔥 (21% below average)"
```

### Test Size Parsing
```
1. Scan shoes or clothing
2. Check console: "👕 [SIZE]"
3. Example: "Detected 'L' in 'Women's Hoodie Size L'"
```

### Test Style Recommendations
```
1. Scan a hoodie
2. Check console: "👗 [STYLE]"
3. Example: "Generated 1 pairing suggestion for Green Hoodie"
```

### Test File Cache Persistence
```
1. Scan an item - server prints: "💾 [CACHE] File cache WRITE:"
2. Kill/restart server: npm run server
3. Scan same item again - should say: "💾 [CACHE] File cache HIT:"
4. Check .scan-cache/ directory created
```

---

## File Structure

```
server/
  lib/
    productEnhancer.ts      ← NEW: All 5 features
  routes/
    scan.ts                 ← MODIFIED: Uses fuzzy dedup + features
  index.ts                  ← MODIFIED: Initialize cache
  
.scan-cache/                ← NEW: Persistent cache directory
  [sha256-hash].json
  [sha256-hash].json
  ...

src/
  types/
    index.ts                ← MODIFIED: New Offer/Product fields
```

---

## Console Output Signatures

### When Working
```
🔄 [DEDUP] Deduplicating 40 raw results...
✨ [FUZZY] Matched "..." (0.89) → "..."
✨ [FUZZY] Fuzzy deduplication reduced results: 40 → 12
💰 [PRICING] Analyzing market prices...
💰 [PRICES] Product: avg=$45.50, range=$35.00-$65.00
👕 [SIZES] Parsing product sizes...
👕 [SIZE] Detected "L" in "..."
👗 [STYLING] Generating style recommendations...
👗 [STYLE] Generated 1 pairing suggestion for ...
💾 [CACHE] File cache WRITE: ...
📦 [RESPONSE] Sending 12 enhanced products to client
```

### If Something's Wrong
- No fuzzy matching output? → Check if `string-similarity` installed
- No price tags? → Check productEnhancer import
- No size detection? → Product titles might not have size info
- No file cache? → Check `.scan-cache/` directory permissions

---

## Configuration

### Adjust Fuzzy Threshold
Edit `server/lib/productEnhancer.ts` line 10:
```typescript
const SIMILARITY_THRESHOLD = 0.8;  // 80% match
// Increase to 0.9 for stricter
// Decrease to 0.7 for looser
```

### Adjust Price Deal Thresholds
Edit `server/lib/productEnhancer.ts` line 46-48:
```typescript
if (offer.price < avgPrice * 0.85)      // 15% below = Great Deal
if (offer.price > avgPrice * 1.2)       // 20% above = High Price
// Adjust percentages as needed
```

### Adjust Cache TTL
Edit `server/lib/productEnhancer.ts` line 194:
```typescript
if (ageMs > 24 * 60 * 60 * 1000)  // 24 hours
// Change to 12 hours, 7 days, etc.
```

### Add More Pairing Rules
Edit `server/lib/productEnhancer.ts` line 156:
```typescript
const PAIRING_RULES = {
  'hoodie': ['jeans', 'joggers', 'sneakers'],
  // Add more here
  'coat': ['scarf', 'boots', 'pants'],
};
```

---

## Dependencies Added

```json
{
  "string-similarity": "^4.0.4"
}
```

**Already included:**
- `fs`, `path`, `crypto` (Node.js built-ins)

---

## Troubleshooting

### "string-similarity not found"
```bash
npm install string-similarity
```

### File cache not working
- Check `.scan-cache/` directory exists (auto-created)
- Check file permissions
- Check disk space

### Fuzzy matching too aggressive
- Increase `SIMILARITY_THRESHOLD` from 0.8 to 0.85

### Fuzzy matching too strict
- Decrease `SIMILARITY_THRESHOLD` from 0.8 to 0.75

### Size parsing misses some items
- Regex only handles standard size formats
- Custom sizes (like "One Size") not detected
- Could expand with ML if needed

---

## Next Steps

1. **Test all 5 features** with real scans
2. **Monitor console output** for errors
3. **Check file cache** persistence
4. **Adjust thresholds** based on results
5. **Deploy to production** when satisfied

---

## Success Indicators ✅

- [ ] Console shows fuzzy matching output
- [ ] Product count reduced 40→12 or similar
- [ ] Price tags visible: 🔥, ✓, ⚠️
- [ ] Sizes detected for most products
- [ ] Style suggestions generated
- [ ] File cache survives restart
- [ ] No TypeScript errors
- [ ] No console errors

---

All 5 features now live! 🎉 Time to test with real products.
