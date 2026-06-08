# Backend API Specifications for Analytics & Statistics Page

This document defines the REST API endpoints required to make the dashboard's Analytics/Statistics page fully functional.

All requests require authorization using a JWT bearer token.

---

## 1. Global Headers & Configuration

Every request to these endpoints must include the following headers:

| Header Name | Value / Format | Description |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <JWT_ACCESS_TOKEN>` | User authentication token |
| `Content-Type` | `application/json` | Required for API requests/payloads |

---

## 2. Analytics KPIs & Summary

Retrieves high-level Key Performance Indicators (KPIs) to display at the top of the analytics page.

* **URL**: `/api/analytics/summary`
* **Method**: `GET`
* **Response Status**: `200 OK`
* **Response Body**:
```json
{
  "totalSpent": {
    "value": 42000,
    "trend": "-4%",
    "trendType": "positive"
  },
  "avgDailySpent": {
    "value": 1400
  },
  "topCategory": {
    "value": "Food"
  },
  "aiSavings": {
    "value": 2100,
    "trend": "Saved",
    "trendType": "positive"
  }
}
```

---

## 3. Cash Flow API (Income vs. Expense Chart)

Retrieves income vs. expense historical records to populate the line/area chart. Supports filtering by date range (e.g. last 7 days, 30 days, or monthly).

* **URL**: `/api/analytics/cash-flow`
* **Method**: `GET`
* **Query Parameters**:
  * `range` (Optional): `"7d" | "30d" | "12m" | "ytd"` (Default: `"30d"`)
* **Response Status**: `200 OK`
* **Response Body**:
```json
[
  {
    "period": "Mon",
    "income": 5000,
    "expense": 1200
  },
  {
    "period": "Tue",
    "income": 0,
    "expense": 900
  },
  {
    "period": "Wed",
    "income": 0,
    "expense": 2200
  },
  {
    "period": "Thu",
    "income": 10000,
    "expense": 400
  },
  {
    "period": "Fri",
    "income": 0,
    "expense": 1800
  },
  {
    "period": "Sat",
    "income": 1500,
    "expense": 3500
  },
  {
    "period": "Sun",
    "income": 0,
    "expense": 2100
  }
]
```

---

## 4. Category Spend Distribution API

Retrieves category limits and spent amounts to feed the category spending progress bars.

* **URL**: `/api/analytics/category-distribution`
* **Method**: `GET`
* **Response Status**: `200 OK`
* **Response Body**:
```json
[
  {
    "label": "Food & Drinks",
    "amount": 4500,
    "limit": 6000
  },
  {
    "label": "Entertainment",
    "amount": 1200,
    "limit": 3000
  },
  {
    "label": "Shopping",
    "amount": 9200,
    "limit": 10000
  },
  {
    "label": "Travel",
    "amount": 2000,
    "limit": 2500
  }
]
```

---

## 5. AI Insights & Spending Alerts API

Retrieves AI-generated spending insights, anomalies, and saving opportunities.

* **URL**: `/api/analytics/insights`
* **Method**: `GET`
* **Response Status**: `200 OK`
* **Response Body**:
```json
[
  {
    "type": "insight",
    "title": "💡 AI Insight",
    "description": "Your weekend spending on Food is 40% higher than weekdays."
  },
  {
    "type": "trend",
    "title": "📈 Trend Alert",
    "description": "Subscription costs increased by ₹499 this month (Netflix). Check if you're still using all active services."
  }
]
```
