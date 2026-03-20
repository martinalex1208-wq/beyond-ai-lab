with open('vibe-coding-lab.html', 'r') as f:
    html = f.read()

old = '''          <div class="project-card">
            <h3 class="project-title">1919 環島活動網頁</h3>
            <p class="project-desc">公益環島活動專頁，整合活動資訊、報名與募款流程。</p>
            <div class="project-tags">
              <span class="project-tag">HTML</span>
              <span class="project-tag">CSS</span>
              <span class="project-tag">JavaScript</span>
            </div>
          </div>
          <div class="project-card">
            <h3 class="project-title">LINE 期貨訊息自動化</h3>
            <p class="project-desc">自動化發送期貨相關訊息至 LINE 群組，節省重複操作時間。</p>
            <div class="project-tags">
              <span class="project-tag">Automation</span>
              <span class="project-tag">JavaScript</span>
            </div>
          </div>
          <div class="project-card">
            <h3 class="project-title">每日 AI 圖片生成</h3>
            <p class="project-desc">每日自動生成 AI 圖像的系統，結合排程與 API 串接。</p>
            <div class="project-tags">
              <span class="project-tag">AI</span>
              <span class="project-tag">Automation</span>
            </div>
          </div>
          <div class="project-card">
            <h3 class="project-title">Beyond AI Lab 網站</h3>
            <p class="project-desc">本網站。整合 Gallery、Music、微光100、Guardian Prompts 等創作實驗室。</p>
            <div class="project-tags">
              <span class="project-tag">HTML</span>
              <span class="project-tag">CSS</span>
              <span class="project-tag">JavaScript</span>
            </div>
          </div>'''

new = '''          <div class="project-card">
            <h3 class="project-title">1919 環島活動網頁</h3>
            <p class="project-desc">公益環島活動專頁，整合活動資訊、報名與募款流程。2026年擔任隊長，帶隊騎行台灣一圈。</p>
            <div class="project-tags">
              <span class="project-tag">HTML</span>
              <span class="project-tag">CSS</span>
              <span class="project-tag">JavaScript</span>
            </div>
            <a href="https://1919-ride-sop.vercel.app" target="_blank" style="display:inline-block; margin-top:1rem; font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.08em; color:var(--gold); text-decoration:none; border-bottom:1px solid rgba(201,168,76,0.3); padding-bottom:2px;">查看作品 →</a>
          </div>
          <div class="project-card">
            <h3 class="project-title">LINE 期貨訊息自動化</h3>
            <p class="project-desc">自動化發送期貨相關訊息至 LINE 群組，節省重複操作時間。</p>
            <div class="project-tags">
              <span class="project-tag">Automation</span>
              <span class="project-tag">JavaScript</span>
            </div>
            <span style="display:inline-block; margin-top:1rem; font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.08em; color:var(--text-muted);">內部工具</span>
          </div>
          <div class="project-card">
            <h3 class="project-title">每日 AI 圖片生成</h3>
            <p class="project-desc">每日自動生成 AI 圖像的系統，結合排程與 API 串接。</p>
            <div class="project-tags">
              <span class="project-tag">AI</span>
              <span class="project-tag">Automation</span>
            </div>
            <span style="display:inline-block; margin-top:1rem; font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.08em; color:var(--text-muted);">內部工具</span>
          </div>
          <div class="project-card">
            <h3 class="project-title">Beyond AI Lab 網站</h3>
            <p class="project-desc">本網站。整合 Gallery、Music、微光100、Guardian Prompts 等創作實驗室。</p>
            <div class="project-tags">
              <span class="project-tag">HTML</span>
              <span class="project-tag">CSS</span>
              <span class="project-tag">JavaScript</span>
            </div>
            <a href="https://beyond-ai-lab.vercel.app" target="_blank" style="display:inline-block; margin-top:1rem; font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.08em; color:var(--gold); text-decoration:none; border-bottom:1px solid rgba(201,168,76,0.3); padding-bottom:2px;">查看作品 →</a>
          </div>'''

html = html.replace(old, new)
with open('vibe-coding-lab.html', 'w') as f:
    f.write(html)
print('Done!' if '1919-ride-sop.vercel.app' in html else 'FAILED')
