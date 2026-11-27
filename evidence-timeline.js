(function () {
  'use strict';
  const stories = [
    { title: '國際交流 · 修學、線上共學與雙聯課程', intro: '同樣是國際交流，貼文記下的學習形式各有不同。', points: [
      ['fb-72', '赴日修學', '農家文化、半日高校生與城市探索，出現在日本修學回顧中。'],
      ['fb-792', '線上交換校園生活', '國中雙語班與印尼姊妹校以視訊分享飲食文化、風俗與校園生活。'],
      ['fb-717', '雙聯學位畢業', '第一屆五位學生在畢業典禮領取美國學校證書，貼文記載取得臺美兩校證書。'],
      ['fb-542', '赴美實體 STEAM', '第三屆 MCI 雙聯學位學生啟程，參加暑期實體 STEAM 課程。'],
      ['fb-17', '入校共學與花蓮走讀', '盛岡第一高校來訪，校內共學結合湯圓、天文與國術，校外安排地理歷史解謎。'],
      ['fb-13', '改以視訊維持共學', '貼文說明日本地震後改以視訊，學生用英語和日語介紹學校及地方文化。']
    ] },
    { title: '校本課程 · 共備、公開授課與學生任務', intro: '從教師交流到學生作品，對照不同種類的課程紀錄。', points: [
      ['fb-909', '跨學段共備', '幼兒園、國小與中學教師分享主題課程，中學例子包含「走讀東海岸」。'],
      ['fb-645', '公開授課與議課', '多元選修「樂活花蓮」與國一英語公開授課，依說課、觀課、共同議課交流。'],
      ['fb-933', '電影導讀與校外問卷', '高二課程與電影學校合作；多元選修也安排學生到校外以問卷訪問。'],
      ['fb-940', '人文必修成果發表', '高一、高二延伸靜思茶道與花道課程，以不同情境展示成果。']
    ] },
    { title: '感飢 12 · 體驗與不同年度的關懷行動', intro: '比較已收錄年份的體驗方式、課程安排與援助對象。', points: [
      ['fb-61', '中學與國小共同體驗', '師生參與清晨六時至下午六時的體驗，家長、志工、校友及海外友人共同響應。'],
      ['fb-624', '生命教育月與烏克蘭關懷', '貼文記載「感飢 12」辦理第六年，系列活動納入十二月生命教育月，連結對烏克蘭的關懷。'],
      ['fb-10', '援助南蘇丹與海外聲援', '全校十二小時體驗及募款援助南蘇丹，並與海外夥伴交流或互相聲援。']
    ] }
  ];
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }
  window.initEvidenceTimeline = function ({ records, textStatus, onPick } = {}) {
    const root = document.getElementById('evidence-timeline');
    if (!root) return;
    root.replaceChildren();
    const byId = new Map((records || []).filter(r => r.kind === 'fb').map(r => [r.id, r]));
    root.append(el('h2', '', '三條主題時間軸'),
      el('p', 'et-limit', '選讀官方粉專貼文，依發文日排列。展開節點可查已知活動日期、摘要和 Facebook 原文。'));
    for (const story of stories) {
      const panel = el('details', 'et-story');
      panel.open = story === stories[0];
      const summary = el('summary', 'et-story-summary', story.title);
      panel.append(summary, el('p', 'et-intro', story.intro));
      const list = el('ol', 'et-points');
      const points = story.points.filter(([id]) => byId.has(id)).sort((a, b) => byId.get(a[0]).published.localeCompare(byId.get(b[0]).published));
      for (const [id, label, description] of points) {
        const record = byId.get(id);
        const item = el('li', 'et-point');
        const detail = el('details', 'et-milestone');
        const heading = el('summary', 'et-point-summary');
        heading.append(el('span', 'et-date', record.published), el('span', 'et-label', label));
        const body = el('div', 'et-body');
        body.append(el('p', '', description), el('p', 'et-source-title', record.title));
        const posted = ['發文', record.published, record.time].filter(Boolean).join(' ');
        body.append(el('p', 'et-meta', posted), el('p', 'et-meta', '活動日期 ' + (record.activity || '未記載')));
        const sourceNote = [textStatus?.(record), record.timeNote].filter(Boolean).join(' · ');
        if (sourceNote) body.append(el('p', 'et-caution', sourceNote));
        const links = el('div', 'et-actions');
        for (const source of record.sources || []) {
          let url;
          try { url = new URL(source.url); } catch (_) { continue; }
          if (url.protocol !== 'https:' || !/(^|\.)facebook\.com$/i.test(url.hostname)) continue;
          const a = el('a', '', source.label || 'Facebook 原文');
          a.href = url.href; a.target = '_blank'; a.rel = 'noopener noreferrer';
          links.append(a);
        }
        if (typeof onPick === 'function') {
          const button = el('button', 'et-open-record', '在資料庫查看這則');
          button.type = 'button';
          button.addEventListener('click', () => onPick({ ids: [id], label: story.title + ' · ' + label }));
          links.append(button);
        }
        body.append(links); detail.append(heading, body); item.append(detail); list.append(item);
      }
      panel.append(list); root.append(panel);
    }
  };
}());
