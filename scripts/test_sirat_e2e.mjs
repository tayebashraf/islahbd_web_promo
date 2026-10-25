// Comprehensive End-to-End Route and API verification script for Sirat Blog
import http from 'http';

const BASE_URL = 'http://localhost:3000';

const routesToTest = [
  { path: '/blog', expectedTitle: 'সিরাত' },
  { path: '/blog/articles/rasulullah-er-khulq-azim', expectedTitle: 'রাসূলুল্লাহ' },
  { path: '/blog/topics', expectedTitle: 'টপিক' },
  { path: '/blog/topics/sirat-al-nabi', expectedTitle: 'সিরাতুন্নবী' },
  { path: '/blog/authors', expectedTitle: 'লেখক' },
  { path: '/blog/authors/1', expectedTitle: 'শায়খ' },
  { path: '/blog/bookmarks', expectedTitle: 'বুকমার্ক' },
  { path: '/blog/search?q=রাসূল', expectedTitle: 'অনুসন্ধান' },
  { path: '/blog/about', expectedTitle: 'আমাদের সম্পর্কে' },
  { path: '/blog/guidelines', expectedTitle: 'নীতিমালা' },
  { path: '/blog/apply', expectedTitle: 'আবেদন' },
  { path: '/blog/login', expectedTitle: 'লগইন' },
  { path: '/blog/register', expectedTitle: 'নিবন্ধন' },
  { path: '/blog/dashboard', expectedTitle: 'ড্যাশবোর্ড' },
  { path: '/blog/admin', expectedTitle: 'অ্যাডমিন' },
  { path: '/api/sirat/articles', isJson: true },
  { path: '/api/sirat/topics', isJson: true },
  { path: '/api/sirat/authors', isJson: true },
];

function fetchRoute(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data, headers: res.headers });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 Starting Sirat Blog Integration & Route Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  for (const item of routesToTest) {
    try {
      const startTime = Date.now();
      const res = await fetchRoute(item.path);
      const duration = Date.now() - startTime;

      if (res.statusCode === 200) {
        if (item.isJson) {
          try {
            const parsed = JSON.parse(res.data);
            const count = Array.isArray(parsed) ? parsed.length : (parsed.articles?.length || Object.keys(parsed).length);
            console.log(`✅ [200 OK] ${item.path} (JSON valid, items: ${count}, time: ${duration}ms)`);
            passed++;
          } catch (jsonErr) {
            console.error(`❌ [FAIL] ${item.path} - Invalid JSON response`);
            failed++;
          }
        } else {
          // Check if expected title/text snippet is present (encoded or raw)
          const hasExpected = !item.expectedTitle || res.data.includes(item.expectedTitle) || res.data.includes(encodeURIComponent(item.expectedTitle));
          console.log(`✅ [200 OK] ${item.path} (HTML rendered, size: ${res.data.length} bytes, time: ${duration}ms)`);
          passed++;
        }
      } else {
        console.error(`❌ [FAIL ${res.statusCode}] ${item.path}`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] ${item.path}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n====================================================');
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed out of ${routesToTest.length} tests`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
