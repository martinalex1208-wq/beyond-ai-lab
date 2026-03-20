with open('vibe-coding-lab.html', 'r') as f:
    html = f.read()

html = html.replace(
    '自動化發送期貨相關訊息至 LINE 群組，節省重複操作時間。',
    '用 AI 寫出即時監控台指期、波動警示、散戶多空比的系統，自動發送到 LINE 群組。真的跑起來過——這是第一個讓我相信「原來可以做到」的作品。'
)

with open('vibe-coding-lab.html', 'w') as f:
    f.write(html)
print('Done!' if '台指期' in html else 'FAILED')
