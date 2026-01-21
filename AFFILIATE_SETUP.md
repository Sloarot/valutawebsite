# 💰 Affiliate Link Setup Guide

This document explains how to set up and manage affiliate links for your currency comparison website.

## 📋 Quick Start

### 1. Update Affiliate IDs

Open `scripts.js` and find the `AFFILIATE_CONFIG` object at the top. Replace the placeholder values with your actual affiliate IDs:

```javascript
const AFFILIATE_CONFIG = {
  wise: "ref=yoursite123", // Replace with your Wise referral code
  paypal: "partner_id=YOUR_PAYPAL_ID", // Replace with your PayPal partner ID
  moneygram: "affiliate=YOUR_MG_ID", // Replace with your MoneyGram affiliate ID
  revolut: "referral=YOUR_REVOLUT_CODE", // Replace with your Revolut referral code
  westernunion: "affid=YOUR_WU_ID", // Replace with your Western Union affiliate ID
  xoom: "partner=YOUR_XOOM_ID", // Replace with your Xoom partner ID
};
```

## 🔗 How to Get Affiliate Links

### Wise (TransferWise)

- **Program**: Wise Affiliate Program
- **Website**: https://wise.com/help/contact/affiliates
- **Commission**: Varies by country, typically $50-100 per qualified referral
- **Cookie Duration**: 90 days
- **How to Join**: Apply through their affiliate page or contact their partnership team

### PayPal

- **Program**: PayPal Partner Program (limited availability)
- **Website**: https://www.paypal.com/us/webapps/mpp/referral/paypal-business-affiliates
- **Commission**: Varies by product
- **Note**: PayPal has restricted affiliate programs. Consider using Xoom instead.

### Xoom (PayPal Service)

- **Program**: Xoom Affiliate Program
- **Website**: https://www.xoom.com/affiliates
- **Commission**: Varies
- **Note**: Easier to join than PayPal direct

### MoneyGram

- **Program**: MoneyGram Affiliate Program
- **Contact**: Business development team
- **Commission**: Negotiable based on volume

### Revolut

- **Program**: Revolut Affiliate Program
- **Website**: https://www.revolut.com/business/partnerships
- **Commission**: Variable
- **How to Join**: Apply through business partnerships

### Western Union

- **Program**: Western Union Affiliate Network
- **Platform**: Often available through CJ Affiliate or Impact
- **Commission**: Percentage of transaction fees

## 📊 Tracking & Analytics

### View Click Analytics

Open browser console and type:

```javascript
viewClickAnalytics();
```

This shows:

- Total affiliate clicks
- Clicks per provider
- Recent click history with full URLs
- Timestamps and currency pairs

### What Gets Tracked

Every affiliate click records:

- Provider name and ID
- Currency pair (USD → EUR)
- Transfer amount
- Full URL with affiliate parameters
- Timestamp
- UTM tracking parameters

### Storage Location

All data is stored in browser localStorage:

- `providerClickHistory` - Last 50 clicks with details
- `providerClickCounts` - Click count per provider
- `totalAffiliateClicks` - Total affiliate link clicks
- `lastClickedProvider` - Last provider clicked
- `lastClickTime` - Timestamp of last click

## 🎯 URL Structure

Each affiliate link includes:

1. **Base URL** with pre-filled parameters:

   ```
   https://wise.com/send?sourceCurrency=USD&targetCurrency=EUR&sourceAmount=1000
   ```

2. **Affiliate Parameters**:

   ```
   &ref=yoursite123
   ```

3. **UTM Tracking**:
   ```
   &utm_source=currencycomparison&utm_medium=affiliate&utm_campaign=comparison_tool
   ```

Final URL example:

```
https://wise.com/send?sourceCurrency=USD&targetCurrency=EUR&sourceAmount=1000&ref=yoursite123&utm_source=currencycomparison&utm_medium=affiliate&utm_campaign=comparison_tool
```

## 💡 Best Practices

### 1. Test Your Links

Before going live, test each affiliate link:

```javascript
// In browser console
getProviderUrl({ id: 39, name: "Wise" }, "USD", "EUR", 1000);
```

### 2. Monitor Performance

- Check analytics weekly: `viewClickAnalytics()`
- Track which providers get most clicks
- Identify high-value currency pairs

### 3. Compliance

- **FTC Disclosure**: Already included in the footer
- Keep disclosure visible and clear
- Update if regulations change

### 4. Optimize Conversions

- Focus on providers with best rates (they rank higher)
- Ensure links are working (test regularly)
- Consider adding provider reviews/trust signals

## 🚀 Advanced Features

### Custom Tracking Parameters

To add custom tracking per campaign:

```javascript
// In getProviderUrl function, modify utm_campaign:
const utmParams = `utm_source=currencycomparison&utm_medium=affiliate&utm_campaign=summer2026_promo`;
```

### A/B Testing

Track different link variations:

```javascript
const testVariant = Math.random() > 0.5 ? "variant_a" : "variant_b";
// Add to clickData in trackProviderClick()
```

### External Analytics

Send data to Google Analytics:

```javascript
// In trackProviderClick(), add:
gtag("event", "affiliate_click", {
  provider: providerName,
  amount: amount,
  currency_pair: `${sourceCurrency}_${targetCurrency}`,
});
```

## 📈 Revenue Optimization Tips

1. **Highlight Best Deals**: Top 3 results in table show larger amounts (already implemented)
2. **Add Trust Signals**: Show user reviews or ratings
3. **Speed Matters**: Cache keeps site fast (already implemented)
4. **Mobile Optimization**: Responsive design included
5. **Clear CTAs**: "Go →" button is simple and clear

## ⚠️ Important Notes

### Provider Availability

Not all providers are available for all currency pairs. The API returns what's available.

### Link Validity

- Test affiliate links monthly
- Providers may change URL structures
- Update `getProviderUrl()` function as needed

### Commission Tracking

- Affiliate programs track conversions on their end
- Your analytics show clicks, not conversions
- Check partner dashboards for actual earnings

### Legal Requirements

- Maintain FTC compliance disclosure
- Update privacy policy to mention affiliate links
- Include cookie consent if required in your region

## 🔧 Troubleshooting

### Links Not Working?

1. Check affiliate ID format in `AFFILIATE_CONFIG`
2. Test URL manually in browser
3. Verify provider hasn't changed URL structure

### No Tracking Data?

1. Open console and check for errors
2. Verify localStorage isn't disabled
3. Try: `localStorage.getItem('totalAffiliateClicks')`

### Affiliate Not Crediting?

1. Ensure cookies are enabled
2. Check affiliate dashboard for rules
3. Some programs require minimum amounts
4. Verify your IDs are correct

## 📞 Support

For questions about specific affiliate programs, contact:

- **Wise**: affiliates@wise.com
- **MoneyGram**: Through their business portal
- **Revolut**: partnerships@revolut.com

---

**Last Updated**: January 19, 2026
**Version**: 1.0
