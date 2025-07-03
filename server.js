require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const app = express();

// السماح فقط لدومين معين
app.use(cors({
  origin: "https://mydomain.com"
}));
app.use(express.json());

// يخدم جميع الملفات الثابتة في المجلد (HTML, CSS, JS, صور...)
app.use(express.static(__dirname));

// نقطة دفع Apple Pay
app.post("/create-payment", async (req, res) => {
  try {
    if (!req.body.token) {
      return res.status(400).json({ error: "Token is required" });
    }
    const response = await axios.post("https://api.moyasar.com/v1/payments", {
      amount: 15000,
      currency: "SAR",
      description: "طلب Apple Pay",
      callback_url: "https://yourdomain.com/thanks",
      source: {
        type: "applepay",
        token: req.body.token
      }
    }, {
      auth: {
        username: process.env.MOYASAR_API_KEY,
        password: ""
      }
    });

    res.json({ status: response.data.status, payment: response.data });
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
});

// يخدم cart.html كصفحة رئيسية للموقع
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "cart.html"));
});

// معالجة أي أخطاء غير معرفة
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

/*
ملاحظات:
- جميع ملفات الموقع (cart.html, privacy.html, store-style.css, إلخ) يجب أن تكون في نفس المجلد مع هذا الملف.
- ملف .env يجب أن يحتوي على:
  MOYASAR_API_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
*/