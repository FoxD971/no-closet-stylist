# Testing Guide: Real Data End-to-End 🧪

## Quick Test (2 minutes)

### Prerequisites
- Node.js 18+ installed
- `.env` file configured with:
  - `GOOGLE_CLOUD_VISION_API_KEY` ✓ (should be set)
  - `SERPAPI_KEY` ✓ (tested and working)
  - `PORT=3001`

### Test 1: Start Backend Server

```powershell
# Navigate to workspace
cd "c:\Users\Dor97\Downloads\No closet stylist"

# Install dependencies (if not already done)
npm install

# Start the backend server
npx tsx server/index.ts
```

**Expected output:**
```
🚀 Server running on http://localhost:3001
```

⏱️ **Takes ~10 seconds**

---

## Test 2: Start Frontend

**In a new PowerShell terminal:**

```powershell
cd "c:\Users\Dor97\Downloads\No closet stylist"

# For web/Vite
npm run dev

# OR for Expo native
expo start
```

**Expected output (Vite):**
```
  ➜  local:   http://localhost:5173/
  ➜  press h to show help
```

**Expected output (Expo):**
```
Expo server is running...
```

---

## Test 3: Take a Scan

### Web (Vite):
1. Open `http://localhost:5173` in browser
2. Click "Scanner" tab
3. **Option A:** Upload a screenshot of a clothing item
   - Right-click any online product image
   - Select "Save image"
   - Upload in app
4. **Option B:** Take screenshot of real clothing
   - Press `Print Screen` / `Snip & Sketch`
   - Save as image
   - Upload in app

### Expo (Native):
1. Run app on simulator or device
2. Click "Scanner" tab
3. Grant camera permissions
4. Take photo of clothing item

---

## Test 4: Verify Results

### You should see:

**Loading State:**
- Spinner animation
- "Finding best matches..." message
- ⏱️ Takes 3-10 seconds (first time longer due to Vision API)

**Results Screen:**
- List of products appears
- Each product card shows:
  - Product image
  - Product name
  - Brand (if detected)
  - Price
  - Rating (if available)

### Click on any product to see the **Detail Sheet**:

**You should see (in order):**

1. **Product Header**
   - Product name
   - Category (e.g., "Clothing > Hoodie")

2. **Product Image**
   - Large preview image

3. **Try On in AR Button**
   - Green button with sparkle icon

4. **BEST DEALS Section** ⭐ NEW
   - **Green Card:** "Best Price"
     - Shows lowest price offer
     - Display format: `Retailer Name | $XX.XX | Discount tag (if any)`
     - Example: `Aerie | $35.97 | 50% OFF`
   - **Gold Card:** "Top Rated"
     - Shows highest-rated offer
     - Display format: `Retailer Name | $XX.XX | ⭐ 4.8`
     - Example: `Nike.com | $65.00 | ⭐ 4.9`

5. **All Offers Section** (Price Comparison)
   - Header: "All Offers (N)"
   - Primary retailer (selected product) at top with green border
   - Alternative offers listed below, sorted by price (up to 5)
   - Each offer shows:
     - Product thumbnail
     - Retailer name
     - Price
     - Rating (if available)

6. **Buy Now Button**
   - Large blue button at bottom
   - Opens retailer page in new tab when clicked

---

## Test 5: Verify Data Accuracy

### Check the Console (Browser DevTools)

1. **Open DevTools** (F12)
2. Go to **Network** tab
3. Search for requests to:
   - `localhost:3001/api/scan` → Should show **200 OK**
   - `serpapi.com` → Should show **200 OK** with shopping results

4. Click on `/api/scan` response → **Preview** tab
5. Verify response contains:
   ```json
   {
     "detectedAttributes": { ... },  // Vision results
     "query": "...",                  // Canonical query
     "products": [ ... ],             // Deduped products
     "cheapestOffer": { ... },        // Best price
     "bestRatedOffer": { ... }        // Best rated
   }
   ```

### Check Product Data

Look at the **products** array:
- Should have **fewer items than raw SerpAPI** (due to deduplication)
- Each product should have:
  - `id`, `name`, `brand`, `price`, `currency`
  - `retailer` object with name
  - `offers` array (if grouped)
  - `cheapestOffer` and `bestRatedOffer` objects

**Example:**
```json
{
  "id": "nike_green_hoodie_001",
  "name": "Nike Women's Green Hoodie",
  "brand": "Nike",
  "price": 35.97,
  "offers": [
    {
      "retailer": { "name": "Aerie" },
      "price": 35.97,
      "rating": 4.8,
      "url": "https://aerie.com/..."
    },
    {
      "retailer": { "name": "Nike.com" },
      "price": 65.00,
      "rating": 4.9,
      "url": "https://nike.com/..."
    }
  ],
  "cheapestOffer": { "retailer": "Aerie", "price": 35.97 },
  "bestRatedOffer": { "retailer": "Nike.com", "price": 65.00, "rating": 4.9 }
}
```

---

## Test 6: Click Best Price/Rated Cards

1. In the product detail sheet, locate the green "Best Price" card
2. **Click it** → Should open retailer website in new tab
3. Verify:
   - New tab opened
   - URL matches the offer's retailer
   - Product is displayed on retailer site

4. Go back to app, click gold "Top Rated" card
5. Verify same behavior (different retailer)

---

## Test 7: Price Comparison Accuracy

1. Look at the "All Offers" section
2. **Verify sorting:** Prices should be in ascending order (cheapest first)
3. **Verify count:** Should show main retailer + up to 5 alternatives
4. **Verify data:** Each offer should have:
   - Retailer name
   - Price (formatted as $XX.XX)
   - Star rating (if available)

**Example comparison:**
```
Aerie         $35.97   ⭐ 4.8
Amazon        $39.99   ⭐ 4.7
Nike.com      $65.00   ⭐ 4.9
Walmart       $42.50
Target        $48.99   ⭐ 4.6
```

---

## Test 8: Caching Test

1. **First scan:** Note the time taken (5-10 seconds)
2. **Second scan with same image:** Click back to scanner, re-upload same image
3. **Expected:** Results appear **instantly** (< 1 second)
4. **Why:** Cache hit by image hash

---

## Test 9: Error Handling

### Test "No Clothing Detected"
1. Upload a screenshot of a random object (chair, landscape, etc.)
2. Expected: Alert shows "No clear clothing detected"
3. Verify app returns to scanner without crashing

### Test Network Fallback
1. Stop the backend server (Ctrl+C)
2. Try to scan in app
3. Expected: Network error message or graceful fallback
4. Restart server to resume

---

## Test 10: Vision Detection Accuracy

### Test various clothing types:

| Item | Expected Detection |
|------|-------------------|
| Blue jeans | jeans, denim, blue |
| Red dress | dress, formal, red |
| White t-shirt | t-shirt, casual, white |
| Black leather jacket | jacket, leather, black |
| Green hoodie | hoodie, casual, green |
| Pink swimsuit | swimsuit, beachwear, pink |

**Verify:**
- Category is correctly identified
- Colors are accurate
- Style is appropriate

---

## Detailed Flow Test

### Scenario: User scans a green Nike hoodie

**Step 1: Image Capture**
```
User uploads image
↓
App compresses to ~200KB
↓
Converts to base64
```

**Step 2: Vision Processing**
```
POST /api/scan with base64
↓
Server calls Google Vision API
↓
Vision returns:
  - Labels: [hoodie, jacket, casual]
  - Objects: [clothing (0.87 confidence)]
  - Colors: [green, gray]
  - Web: [Nike logo detected]
```

**Step 3: Query Building**
```
Canonical query builder merges:
  - Detected category: "hoodie"
  - Color: "green"
  - Brand: "Nike"
  - Labels: "casual"
↓
Result: "green hoodie casual nike"
```

**Step 4: Product Search**
```
SerpAPI query: "green hoodie casual nike"
↓
Returns: 40 Google Shopping results
↓
Deduplication groups by (brand, normalized-title)
↓
Result: 8-12 unique logical products
```

**Step 5: Offer Grouping**
```
Product 1: Nike Green Hoodie
  Offers from: Aerie, Nike.com, Amazon
  Cheapest: Aerie $35.97
  Best Rated: Nike.com 4.9★

Product 2: Adidas Green Hoodie
  Offers from: Amazon, Dick's, Walmart
  Cheapest: Amazon $49.99
  Best Rated: Dick's 4.6★

... (6-10 more products)
```

**Step 6: UI Rendering**
```
ProductList shows 8-12 product cards
User taps one → StyleResultSheet opens
Sees:
  - Best Price (green) highlighted
  - Best Rated (gold) highlighted
  - Full price comparison below
```

**Step 7: Purchase**
```
User clicks "Best Price" → Aerie tab opens
↓
User purchases Green Nike Hoodie for $35.97
✓ Success!
```

---

## Performance Benchmarks

| Operation | Expected Time |
|-----------|---------------|
| Image compress | < 1 sec |
| Vision API call | 3-5 sec (cached after) |
| Product search | 2-3 sec |
| Deduplication | < 100ms |
| Total first scan | 5-10 sec |
| Total cached scan | < 100ms |

---

## Success Criteria ✅

Your implementation is successful if:

- [ ] Backend server starts: `🚀 Server running on http://localhost:3001`
- [ ] Frontend loads without TypeScript errors
- [ ] Can upload/take image and trigger scan
- [ ] Vision API detects clothing correctly
- [ ] SerpAPI returns 40+ real products
- [ ] Products deduplicated to 8-20 logical items
- [ ] Best Price card shows actual cheapest offer (green, highlighted)
- [ ] Best Rated card shows highest-rated offer (gold, highlighted)
- [ ] All Offers section lists alternatives sorted by price
- [ ] Click "Buy Now" redirects to retailer successfully
- [ ] Same image scanned twice: second returns instantly (cached)
- [ ] Non-clothing image: graceful error message
- [ ] All data displayed with correct formatting (prices, ratings, etc.)

**If all ✅, the app is ready for production! 🚀**

---

## Debugging Tips

### If Vision API fails:
```powershell
# Verify key
$env:GOOGLE_CLOUD_VISION_API_KEY
# Should output your key, not blank
```

### If SerpAPI returns 0 results:
```powershell
# Test directly:
node -r dotenv/config server/lib/test_serpapi.js
# Should output 40 results
```

### If products don't deduplicate:
1. Check dedup key function in `scan.ts` line ~87
2. Verify brand names are consistent
3. Adjust `substring(0, 50)` to tune sensitivity

### If TypeScript errors:
```powershell
npx tsc --noEmit
# Shows any type issues
```

### If server won't start:
```powershell
# Check if port 3001 is in use
netstat -ano | findstr :3001
# Kill process if needed
taskkill /PID <PID> /F
```

---

## Troubleshooting Checklist

| Issue | Check |
|-------|-------|
| Server won't start | Port 3001 available? Node 18+? Dependencies installed? |
| No products found | SerpAPI key valid? Network connected? Query too specific? |
| Offers not grouping | Brand names consistent? Dedup key function working? |
| Best Price not highlighted | Check `cheapestOffer` computed correctly in scan.ts |
| TypeScript errors | Run `npm run build` to see all errors |
| Slow first scan | Normal (Vision API takes 3-5 sec); cached scans faster |
| App crashes on upload | Check image format (JPEG/PNG); max 20MB |

---

## Final Verification Script

Run this to verify everything is ready:

```powershell
# 1. Check Node version
node --version
# Should be v18.0.0 or higher

# 2. Check dependencies installed
npm ls | Select-String "lucide-react|axios" -First 2
# Should show versions

# 3. Check .env keys
$env:GOOGLE_CLOUD_VISION_API_KEY
$env:SERPAPI_KEY
# Both should output keys (not blank)

# 4. Try starting server (Ctrl+C after "🚀 Server running")
npx tsx server/index.ts

# If all pass, you're ready! 🎉
```

---

**Ready to test? Start with Backend Server test above! 👆**
