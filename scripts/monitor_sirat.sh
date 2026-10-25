#!/bin/bash
# ========================================================
# Sirat Blog Live Monitoring Script
# Server: 200.141.0.187
# ========================================================

GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
CYAN="\033[0;36m"
BOLD="\033[1m"
NC="\033[0m"

export TERM=${TERM:-xterm}
clear
echo -e "${CYAN}${BOLD}======================================================${NC}"
echo -e "${CYAN}${BOLD}       সীরাত.ব্লগ (Sirat Blog) লাইভ মনিটরিং ড্যাশবোর্ড      ${NC}"
echo -e "${CYAN}${BOLD}======================================================${NC}"
echo -e "তারিখ ও সময়: $(date '+%Y-%m-%d %H:%M:%S')\n"

# 1. Platform Metrics (Live API)
echo -e "${YELLOW}${BOLD}১. সীরাত প্ল্যাটফর্ম মেট্রিক্স (Live Analytics):${NC}"
echo -e "------------------------------------------------------"
METRICS=$(curl -s http://127.0.0.1:8081/api/sirat/analytics/ 2>/dev/null)
if [ -n "$METRICS" ]; then
    ARTICLES=$(echo "$METRICS" | grep -o '"articlesCount":[0-9]*' | head -n 1 | cut -d: -f2)
    AUTHORS=$(echo "$METRICS" | grep -o '"authorsCount":[0-9]*' | head -n 1 | cut -d: -f2)
    TOPICS=$(echo "$METRICS" | grep -o '"topicsCount":[0-9]*' | head -n 1 | cut -d: -f2)
    VIEWS=$(echo "$METRICS" | grep -o '"totalViews":[0-9]*' | head -n 1 | cut -d: -f2)
    JAZAKALLAH=$(echo "$METRICS" | grep -o '"totalJazakallah":[0-9]*' | head -n 1 | cut -d: -f2)
    SALAWAT=$(echo "$METRICS" | grep -o '"totalSalawat":[0-9]*' | head -n 1 | cut -d: -f2)
    echo -e "  মোট প্রবন্ধ: ${GREEN}${ARTICLES}${NC} টি | মোট লেখক: ${GREEN}${AUTHORS}${NC} জন | বিষয়: ${GREEN}${TOPICS}${NC} টি"
    echo -e "  মোট পাঠ/ভিউ: ${GREEN}${VIEWS}${NC} বার"
    echo -e "  জাযাকাল্লাহ্ প্রতিক্রিয়া: ${GREEN}${JAZAKALLAH}${NC} টি | সালাওয়াত: ${GREEN}${SALAWAT}${NC} টি"
else
    echo "  মেট্রিক্স লোড করা যায়নি।"
fi
echo ""

# 2. Request Traffic & Logs
echo -e "${YELLOW}${BOLD}২. রিকোয়েস্ট ট্রাফিক ও লগস (/api/sirat):${NC}"
echo -e "------------------------------------------------------"
LOG_FILE="/var/log/nginx/access.log"
if [ -f "$LOG_FILE" ]; then
    TOTAL_HITS=$(grep -c "/api/sirat" "$LOG_FILE" 2>/dev/null || echo 0)
    SUCCESS_HITS=$(grep "/api/sirat" "$LOG_FILE" 2>/dev/null | grep -c " 200 " || echo 0)
    echo -e "  মোট রিকোয়েস্ট (Nginx access log): ${GREEN}${TOTAL_HITS}${NC} টি"
    echo -e "  সফল রেসপন্স (HTTP 200 OK): ${GREEN}${SUCCESS_HITS}${NC} টি"
    echo -e "\n  ${BOLD}সর্বশেষ ৫টি রিকোয়েস্ট:${NC}"
    grep "/api/sirat" "$LOG_FILE" 2>/dev/null | tail -n 5 | awk '{print "  • " $4 " " $6 " " $7 " -> Status: " $9 " (" $10 " bytes)"}'
else
    echo "  Nginx access log পাওয়া যায়নি।"
fi
echo ""

# 3. RAM & CPU Usage (Docker)
echo -e "${YELLOW}${BOLD}৩. র‍্যাম (RAM) ও সিপিইউ (CPU) ব্যবহার:${NC}"
echo -e "------------------------------------------------------"
docker stats app-web-1 app-db-1 app-nginx-1 --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}"
echo ""
echo -e "  ${BOLD}সার্ভারের সার্বিক মেমোরি:${NC}"
free -h | grep -E "total|Mem" | awk '{print "  " $0}'
echo ""

# 4. Storage & Database Usage
echo -e "${YELLOW}${BOLD}৪. স্টোরেজ ও ডেটাবেজ ব্যবহার (Storage Usage):${NC}"
echo -e "------------------------------------------------------"
echo -e "  ${BOLD}সীরাত টেবিলসমূহের সাইজ (PostgreSQL):${NC}"
cd /root/app && docker compose exec -T web python manage.py shell -c "
from django.db import connection
cursor = connection.cursor()
cursor.execute(\"SELECT table_name, pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) FROM information_schema.tables WHERE table_name LIKE 'api_sirat%' ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;\")
for row in cursor.fetchall():
    print(f'    • {row[0]:<25}: {row[1]}')
" 2>/dev/null
echo ""
MEDIA_SIZE=$(du -sh /var/lib/docker/volumes/app_media/_data 2>/dev/null | cut -f1)
echo -e "  মিডিয়া ফাইল সাইজ: ${GREEN}${MEDIA_SIZE:-0B}${NC}"
echo -e "  হোস্ট ডিস্ক স্পেস: $(df -h / | tail -n 1 | awk '{print "মোট: " $2 " | ব্যবহৃত: " $3 " (" $5 ") | খালি: " $4}')"
echo ""
echo -e "${CYAN}${BOLD}======================================================${NC}"
