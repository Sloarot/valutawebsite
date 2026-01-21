# 💱 Currency Exchange Rate Comparison Tool

A modern, responsive web application that compares real-time currency exchange rates from multiple providers using the Wise API. Built as an affiliate comparison site with comprehensive tracking and analytics.

## ✨ Features

### Core Functionality

- ✅ **Real-time Rate Comparison** - Live data from Wise API
- ✅ **35+ Currencies** - Major world currencies supported

- ✅ **Smart Caching** - 5-minute cache to reduce API calls
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Dark/Light Gradient UI** - Modern, professional design

### Affiliate Features

- 💰 **Affiliate Link Integration** - Earn commissions on referrals
- 📊 **Click Tracking** - Comprehensive analytics dashboard
- 🎯 **UTM Parameters** - Full marketing attribution
- 📈 **Performance Metrics** - Track which providers perform best
- 🔒 **FTC Compliant** - Disclosure notice included

### Advanced Features

- 🔍 **Searchable Dropdowns** - Find currencies quickly
- 💵 **Total Cost Display** - See fees + exchange rate clearly
- ⚡ **Loading States** - Visual feedback during API calls
- 🛡️ **XSS Protection** - Safe HTML rendering
- ⏱️ **Last Updated Display** - Know when rates were fetched
- 🌐 **Direct Provider Links** - One-click to complete transfer

## 🚀 Quick Start

### Prerequisites

- Web server (XAMPP, Apache, Nginx, or any static host)
- Modern web browser
- No backend required!

### Installation

1. **Clone/Download** the project to your web server directory

   ```
   C:\xampp\htdocs\dropdown\  (for XAMPP)
   ```

2. **Update Affiliate IDs** in `scripts.js`:

   ```javascript
   const AFFILIATE_CONFIG = {
     wise: "ref=YOUR_CODE_HERE",
     paypal: "partner_id=YOUR_ID_HERE",
     // etc...
   };
   ```

3. **Open in Browser**:

   ```
   http://localhost/dropdown/index.html
   ```

4. **Test the comparison**:
   - Select currencies (e.g., USD → EUR)
   - Enter amount or use slider
   - Click "Compare rates"
   - Results display with affiliate links

## 📁 Project Structure

```
dropdown/
├── index.html           # Main HTML file
├── scripts.js          # JavaScript logic and API calls
├── styles.css          # All styling and responsive design
├── package.json        # Dependencies (axios)
├── AFFILIATE_SETUP.md  # Detailed affiliate guide
├── README.md          # This file
└── img/               # Logo images
    ├── logo_white.png
    ├── wise_logo.png
    ├── paypal.jpg
    └── ...
```

## 🔧 Configuration

### Currencies

Add/remove currencies in `scripts.js`:

```javascript
let currencies = [
  ["EUR - Euro", "eu", "EUR"],
  ["GBP - United Kingdom", "gb", "GBP"],
  // Add more...
];
```

### Provider Filter

Control which providers show in results:

```javascript
const filterbyID = [39, 6, 44, 23, 22, 121, 127];
// 39 = Wise, 6 = PayPal, etc.
```

### Cache Duration

Adjust caching time (default 5 minutes):

```javascript
const fiveMinutes = 5 * 60 * 1000; // Change 5 to your preferred minutes
```

## 📊 Analytics

View detailed click analytics in browser console:

```javascript
viewClickAnalytics();
```

Returns:

- Total affiliate clicks
- Clicks per provider
- Recent click history
- Timestamps and full URLs

## 🔗 API Information

### Wise API

- **Endpoint**: `https://api.transferwise.com/v3/comparisons/`
- **Method**: GET
- **Authentication**: None required (public endpoint)
- **Rate Limits**: Unknown (implement caching)
- **Response**: JSON with provider quotes

### Example Request

```
https://api.transferwise.com/v3/comparisons/?sourceCurrency=USD&targetCurrency=EUR&sendAmount=1000
```

### Important Notes

- ⚠️ This is an undocumented public API
- ⚠️ No official support from Wise
- ⚠️ Could change or require auth in future
- ✅ Currently stable and working (as of Jan 2026)

## 💡 How It Works

1. **User Input**: Select currencies and amount (or use slider)
2. **Validation**: Check for valid inputs
3. **Cache Check**: Look for recent cached data (5 min)
4. **API Call**: If no cache, fetch from Wise API
5. **Data Processing**: Filter and sort providers
6. **Display Results**: Show table with rates and fees
7. **Track Clicks**: Log affiliate link clicks
8. **Redirect**: Send user to provider with affiliate params

## 🎨 Customization

### Colors

Main gradient in `styles.css`:

```css
background: linear-gradient(
  0deg,
  rgba(71, 192, 182, 1) 0%,
  rgba(54, 153, 217, 1) 100%
);
```

### Slider Range

Change min/max amounts in `index.html`:

```html
<input type="range" id="amountSlider" min="10" max="50000" value="1000" />
```

### Table Columns

Modify headers in `scripts.js`:

```javascript
const headers = [
  "Provider",
  "Exchange rate",
  "Fees",
  "Total Cost",
  "You Get",
  "Action",
];
```

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### API Not Working?

- Check network tab for errors
- Verify URL structure hasn't changed
- Test endpoint directly in browser

### Caching Issues?

```javascript
// Clear all cache
localStorage.clear();
```

### Affiliate Links Not Tracking?

- Open console (F12)
- Check for JavaScript errors
- Verify localStorage is enabled
- Test: `localStorage.getItem('totalAffiliateClicks')`

### Mobile Display Issues?

- Clear browser cache
- Test in Chrome DevTools mobile view
- Check viewport meta tag in HTML

## 🔐 Security

- ✅ XSS Protection via escapeHtml()
- ✅ Safe DOM manipulation (no innerHTML for user data)
- ✅ External links use rel="noopener noreferrer"
- ✅ Input validation on amounts
- ⚠️ No sensitive data stored (only analytics)

## 📈 Performance

- **Initial Load**: ~500ms
- **API Call**: ~1-2 seconds (varies by network)
- **Cached Load**: Instant
- **Optimizations**:
  - LocalStorage caching (5 min)
  - Minimal dependencies
  - Efficient DOM manipulation
  - Responsive images

## 🚧 Future Enhancements

Potential features to add:

- [ ] Historical rate charts
- [ ] Rate alerts (notify when rate reaches target)
- [ ] Compare "send amount" vs "receive amount" modes
- [ ] Save favorite currency pairs
- [ ] Export comparison as PDF
- [ ] Multi-language support
- [ ] Server-side caching
- [ ] Provider reviews/ratings
- [ ] Integration with more comparison APIs

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and improve! Key areas for contribution:

- Additional provider URLs
- More currencies
- UI/UX improvements
- Performance optimizations
- Better mobile experience

## 📞 Support

For affiliate program questions, see [AFFILIATE_SETUP.md](AFFILIATE_SETUP.md)

For technical issues:

- Check browser console for errors
- Verify API endpoint is accessible
- Test with simple currency pairs first

## ⚖️ Legal

### Affiliate Disclosure

This site contains affiliate links. We earn commissions on qualifying transfers at no extra cost to you.

### Data Usage

- No personal data collected
- Analytics stored locally only
- No cookies (except localStorage)
- No third-party tracking scripts

### API Usage

- Using publicly available Wise comparison API
- Not affiliated with or endorsed by Wise
- Rates shown are informational only
- Always verify on provider's site before transferring

---

**Built with**: Vanilla JavaScript, HTML5, CSS3  
**Version**: 2.0  
**Last Updated**: January 19, 2026
