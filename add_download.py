with open('glimmer100.html', 'r') as f:
    html = f.read()

# 在 LINE 按鈕後面加入三個按鈕
old = '<a href="https://line.me/R/ti/p/@899nuuvy" target="_blank" class="btn-secondary">LINE 聯絡我們</a>'

new = '''<a href="https://line.me/R/ti/p/@899nuuvy" target="_blank" class="btn-secondary">LINE 聯絡我們</a>
        <div style="margin-top:1.2rem; display:flex; gap:0.8rem; flex-wrap:wrap; justify-content:center;">
          <button onclick="copyPlan()" id="copyBtn" style="padding:0.6rem 1.2rem; border:1px solid rgba(255,255,255,0.2); background:transparent; color:rgba(255,255,255,0.6); font-size:0.8rem; cursor:pointer; border-radius:4px;">📋 複製說明</button>
          <button onclick="downloadTxt()" style="padding:0.6rem 1.2rem; border:1px solid rgba(255,255,255,0.2); background:transparent; color:rgba(255,255,255,0.6); font-size:0.8rem; cursor:pointer; border-radius:4px;">⬇ 下載 TXT</button>
          <button onclick="downloadPdf()" style="padding:0.6rem 1.2rem; border:1px solid rgba(255,255,255,0.2); background:transparent; color:rgba(255,255,255,0.6); font-size:0.8rem; cursor:pointer; border-radius:4px;">⬇ 下載 PDF</button>
        </div>'''

html = html.replace(old, new)

script = """  <script>
    const planText = `微光100 · Glimmer 100
一杯咖啡的花費，成為偏鄉孩子心裡的一道光

【創辦人的話】
五元，握在手心裡的喜悅。

我小時候，五元是很大的事。

把硬幣握在手心裡，走進巷口的雜貨店，那種開心，現在想起來還記得清楚。
不是因為五元能買到多少東西，是因為那是屬於我的、我能決定的、我期待了很久的一刻。

後來長大了。吃過很貴的餐，出國旅遊，買過很多東西。
但那種感動，再也沒有過了。

後來我懂了——那五元的喜悅，不只是喜悅。
是一種「被給予、被看見、被期待」的感覺。
是一個孩子知道：有人願意讓我有這一刻。

現在有很多偏鄉的孩子，從小沒有零用錢。
不是因為不努力，是因為生活沒給他們這個選項。

我想把我當初的那份喜悅，給他們一次，這就是微光100。

— Steve · Beyond AI Lab 創辦人

【關於微光100】
一杯咖啡的花費，能不能成為偏鄉孩子心裡的一道光？
有些孩子從小沒有零用錢，不是因為不努力，而是生活沒有給他們太多選擇。
我們希望透過一百元的微小支持，讓孩子感受到的不只是幫助，而是一種被看見、被鼓勵、被期待的力量。
微光100不是施捨，而是一份關於尊嚴、勇氣與成長的約定。

【認養機制】

01 一杯咖啡的付出
每人每月 100 元（每年 1,200 元）。款項直接匯入教會官方帳戶，不經手任何中間組織。教會將開立合法收據，可供個人所得稅抵稅。

02 不需要找人，系統自動配對
你只需要完成捐款，其他什麼都不用做。每間陪讀班每月開放 5 個名額，當 5 位捐款人各自完成捐款，這間陪讀班就自動被點亮。不需要自己找人，不需要去陪讀班，不需要做任何其他事。
每月 500 元照亮一個陪讀班，你只需要貢獻其中的 100 元。

03 孩子用努力爭取
每月 5 個名額，老師邀請孩子把心裡的話說出來——一個真實的心情。可以是文字，可以是錄音轉成文字，不用修飾，不必押韻，無需完美。只要勇敢表達，就有機會獲得那個月的微光津貼。

你的 100 元 → 5 個孩子的期待 → 20 座陪讀班點亮 → 100 個孩子被看見

【我們的承諾】
直接匯款：款項直接匯入教會官方帳戶，不經手任何中間組織。
合法收據：教會將開立正式合法收據，可供年度個人所得稅抵稅。
100% 純粹：沒有行政抽成，只有 100% 的愛與傳遞。

【願景】
20 座教會陪讀班 · 2,000 個孩子被看見 · 100 元 · 一杯咖啡的力量

【聯絡我們】
Email：beyond.ai.lab@gmail.com

一杯咖啡、一份喜悅、讓孩子多一種期待。`;

    function copyPlan() {
      navigator.clipboard.writeText(planText).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.textContent = '✅ 已複製！';
        setTimeout(() => btn.textContent = '📋 複製說明', 2000);
      });
    }

    function downloadTxt() {
      const blob = new Blob([planText], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '微光100計畫說明.txt';
      a.click();
    }

    function downloadPdf() {
      const win = window.open('', '_blank');
      win.document.write('<html><head><meta charset="utf-8"><title>微光100計畫說明</title><style>body{font-family:serif;max-width:700px;margin:40px auto;line-height:1.9;color:#222;}pre{white-space:pre-wrap;font-family:serif;font-size:1rem;}</style></head><body><pre>' + planText + '<\\/pre><script>window.onload=function(){window.print();}<\\/script></body></html>');
      win.document.close();
    }
  </script>"""

html = html.replace('</body>', script + '\n</body>', 1)

with open('glimmer100.html', 'w') as f:
    f.write(html)
print('Done!' if 'copyPlan' in html else 'FAILED')
