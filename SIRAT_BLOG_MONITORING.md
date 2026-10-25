# সীরাত.ব্লগ (Sirat Blog) লাইভ সার্ভার মনিটরিং গাইড
**সার্ভার:** `200.141.0.187`  
**ইউজার:** `root`  
**প্রজেক্ট লোকেশন:** `/root/app`  
**লাইভ ডোমেইন:** `https://api.islahbd.com` ও `https://islahbd.com/blog`  
**সর্বশেষ আপডেট:** ২৫ অক্টোবর, ২০২৬  

---

## ⚡ ১. এক কমান্ডে সম্পূর্ণ ড্যাশবোর্ড (All-in-One Dashboard)

সার্ভারের টার্মিনালে ঢুকে শুধুমাত্র নিচের কমান্ডটি দিলেই রিকোয়েস্ট লগ, ট্রাফিক, র‍্যাম, সিপিইউ ও স্টোরেজের একটি পূর্ণাঙ্গ রঙিন ড্যাশবোর্ড দেখতে পাবেন:

```bash
/root/app/monitor_sirat.sh
```

> **টিপস (লোকাল ম্যাক/পিসি থেকে সরাসরি দেখতে):**  
> সার্ভারে আলাদা করে SSH লগইন না করেই আপনার কম্পিউটারের টার্মিনাল থেকে এক লাইনে এই ড্যাশবোর্ড দেখতে রান করুন:
> ```bash
> sshpass -p 'sN3fzQi.pgyP2(@S' ssh root@200.141.0.187 '/root/app/monitor_sirat.sh'
> ```

---

## 🌐 ২. রিকোয়েস্ট ট্রাফিক ও লগস ট্র্যাকিং (Traffic & Request Logs)

ব্লগ সেকশনে কতটুকু রিকোয়েস্ট আসছে, কোন পেজ বেশি ভিজিট হচ্ছে এবং রেসপন্স কোড কী আসছে তা ট্র্যাক করার কমান্ডসমূহ:

### ক. রিয়েল-টাইমে লাইভ ট্রাফিক স্ট্রিম (Real-time Live Stream)
যখনই কোনো পাঠক ব্লগের কোনো আর্টিকেল বা পেজে প্রবেশ করবে, সাথে সাথে টার্মিনালে তার রিকোয়েস্ট ভেসে উঠবে:
```bash
tail -f /var/log/nginx/access.log | grep --line-buffered "/api/sirat"
```

### খ. মোট রিকোয়েস্ট সংখ্যা গণনা (Total Hit Count)
সার্ভার লগে মোট কতটি ব্লগ রিকোয়েস্ট জমা হয়েছে:
```bash
grep -c "/api/sirat" /var/log/nginx/access.log
```

### গ. সর্বশেষ ২০টি রিকোয়েস্টের বিস্তারিত লগ (Recent 20 Requests)
আইপি, সময়, রিকোয়েস্ট মেথড, ইউআরএল এবং এইচটিটিপি স্ট্যাটাস দেখতে:
```bash
grep "/api/sirat" /var/log/nginx/access.log | tail -n 20
```

### ঘ. সফল বনাম ব্যর্থ রিকোয়েস্টের পরিসংখ্যান
```bash
echo "সফল (200 OK): $(grep "/api/sirat" /var/log/nginx/access.log | grep -c ' 200 ')"
echo "ব্যর্থ (Non-200): $(grep "/api/sirat" /var/log/nginx/access.log | grep -v -c ' 200 ')"
```

### ঙ. জ্যাঙ্গো ব্যাকএন্ড কন্টেইনারের অভ্যন্তরীণ লাইভ লগ (Django App Logs)
কোনো ইন্টারনাল এরর বা ব্যাকএন্ড প্রসেসিং দেখতে:
```bash
cd /root/app && docker compose logs -f web --tail=50
```

---

## 💻 ৩. র‍্যাম (RAM) ও প্রসেসর (CPU) ব্যবহার মনিটরিং

### ক. ব্যাকএন্ড ও ডেটাবেজ কন্টেইনারসমূহের লাইভ মেমোরি ও সিপিইউ
```bash
docker stats app-web-1 app-db-1 app-nginx-1 --no-stream
```

**আউটপুট ফিল্ড ব্যাখ্যা:**
- `app-web-1`: জ্যাঙ্গো ব্যাকএন্ড প্রসেস (সাধারণত ~১০০–১২০ MiB RAM নেয়)।
- `app-db-1`: পোস্টগ্রেসকিউএল ডেটাবেজ ইঞ্জিন (সাধারণত ~৫০০–৫৫০ MiB RAM নেয়)।
- `app-nginx-1`: এনজিনিক্স রিভার্স প্রক্সি (~১০ MiB RAM নেয়)।

### খ. সার্বিক সার্ভার মেমোরি স্ট্যাটাস (Host Total RAM)
```bash
free -h
```
*সার্ভারের মোট মেমোরি ১৫ জিবি, যার মধ্যে সিস্টেম ক্যাশসহ প্রায় ৯+ জিবি মেমোরি সবসময় ফ্রি থাকে।*

---

## 💾 ৪. স্টোরেজ ও ডেটাবেজ সাইজ (Storage & Database Usage)

### ক. সীরাত ব্লগের প্রতিটি টেবিল ডেটাবেজে কতটুকু জায়গা নিচ্ছে
পোস্টগ্রেস ডেটাবেজে সীরাত ব্লগের ৮টি টেবিলের আলাদা আলাদা সাইজ দেখতে:
```bash
cd /root/app && docker compose exec -T web python manage.py shell -c "
from django.db import connection
cursor = connection.cursor()
cursor.execute(\"SELECT table_name, pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) FROM information_schema.tables WHERE table_name LIKE 'api_sirat%' ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;\")
for row in cursor.fetchall():
    print(f'  • {row[0]:<25}: {row[1]}')
"
```

**টেবিলসমূহের সাইজ বিবরণ:**
| টেবিল নাম | কার্যাবলী | বর্তমান সাইজ |
| :--- | :--- | :--- |
| `api_siratarticle` | প্রবন্ধের মূল টেক্সট ও কন্টেন্ট | ~২৭২ kB |
| `api_siratapplication` | লেখক হওয়ার আবেদনসমূহ | ~৯৬ kB |
| `api_siratcomment` | পাঠকদের মন্তব্য ও উত্তর | ~৬৪ kB |
| `api_sirattopic` | ঐতিহাসিক ও শাস্ত্রীয় বিষয়সমূহ | ~৬৪ kB |
| `api_siratauthor` | নিবন্ধিত গবেষক ও আলেম প্রোফাইল | ~৬৪ kB |
| `api_siratsetting` | প্ল্যাটফর্ম ডায়নামিক কনফিগারেশন | ~৬৪ kB |
| `api_siratreaction` | জাযাকাল্লাহ্ ও সালাওয়াত রিঅ্যাকশন | ~৪০ kB |
| `api_siratfeedback` | পরামর্শ ও তাহকিক সংক্রান্ত মতামত | ~৩২ kB |

### খ. ব্লগের আপলোডকৃত মিডিয়া/ইমেজ ফাইল স্টোরেজ
```bash
du -sh /var/lib/docker/volumes/app_media/_data
```

### গ. সার্ভারের সম্পূর্ণ ডিস্ক স্পেস ব্যবহার
```bash
df -h /
```
*(মোট ১৯৩ জিবি ডিস্ক স্পেসের মধ্যে মাত্র ৩১ জিবি ব্যবহৃত, ১৬৩ জিবি ফাঁকা রয়েছে)*

---

## 📈 ৫. লাইভ প্ল্যাটফর্ম মেট্রিক্স এপিআই (Live Analytics API)

সার্ভারে বা ব্রাউজারে সরাসরি এপিআই থেকে লাইভ ভিজিটর ও পাঠক পরিসংখ্যান দেখতে:

```bash
curl -s https://api.islahbd.com/api/sirat/analytics/
```

**রেসপন্স ফরম্যাট:**
```json
{
  "articlesCount": 8,
  "authorsCount": 4,
  "topicsCount": 8,
  "totalJazakallah": 1341,
  "totalSalawat": 949,
  "totalViews": 19430,
  "applicationsCount": 2,
  "feedbackCount": 2,
  "topicsBreakdown": [ ... ]
}
```

---

## 🛠️ ৬. জরুরি মেইনটেন্যান্স ও ট্রাবলশুটিং কমান্ডসমূহ

### ক. ব্যাকএন্ড কন্টেইনার রিস্টার্ট করা:
```bash
cd /root/app && docker compose restart web
```

### খ. নতুন কোড আপডেট করে কন্টেইনার রিবিল্ড করা:
```bash
cd /root/app
git pull origin main
docker compose up -d --build web
```

### গ. ডেটাবেজ মাইগ্রেশন রান করা:
```bash
cd /root/app && docker compose exec -T web python manage.py migrate
```

### ঘ. পুনরায় সীরাত ডেমো ডেটা সিড করতে হলে:
```bash
cd /root/app && docker compose exec -T web python manage.py seed_sirat_data
```

### ঙ. ব্যাকএন্ডের ইউনিট টেস্টগুলো সার্ভারে রান করে যাচাই করা:
```bash
cd /root/app && docker compose exec -T web python manage.py test api.tests_sirat --keepdb
```
