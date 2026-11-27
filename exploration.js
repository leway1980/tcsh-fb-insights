'use strict';

(function () {
  // Public titles and editor notes only. Aliases are literal substrings after
  // NFKC normalization and whitespace removal; each post counts once per term.
  const dictionary = [
    ['見學東台灣', ['見學東台灣', '見學東臺灣']],
    ['港市尋蹤', ['港市尋蹤']], ['感飢12', ['感飢12', '感飢十二']],
    ['雙聯學位', ['雙聯學位']], ['雙語教育', ['雙語教育', '雙語班', '雙語實驗班']],
    ['國際交流', ['國際交流', '海外交流', '姊妹校', '姐妹校']],
    ['視訊交流', ['視訊交流', '線上交流']], ['修學旅行', ['修學旅行', '海外修學']],
    ['在地走讀', ['走讀', '在地踏查', '實地踏查']],
    ['科學探究', ['科學探究', '自然探究', '探究與實作']],
    ['專題研究', ['專題研究', '研究專題', '專題發表']],
    ['小論文', ['小論文']], ['科學展覽', ['科學展覽', '科展']],
    ['跨科共備', ['跨科共備', '跨領域共備']],
    ['多元選修', ['多元選修']], ['校訂必修', ['校訂必修']],
    ['新課綱', ['新課綱', '108課綱']], ['實驗班', ['實驗班']],
    ['服務學習', ['服務學習', '社區服務', '志工服務']],
    ['生命教育', ['生命教育']], ['環境教育', ['環境教育', '淨灘', '環境保護']],
    ['校慶活動', ['校慶']], ['運動會', ['運動會']],
    ['園遊義賣', ['園遊會', '義賣']], ['藝文展演', ['藝文', '音樂會', '戲劇展演']],
    ['茶道課程', ['茶道']], ['花道課程', ['花道']],
    ['閱讀學習', ['閱讀', '讀書會']]
  ];
  const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase('zh-Hant').replace(/\s+/g, '');
  const collator = new Intl.Collator('zh-Hant');
  function node(tag, className, text) {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (text !== undefined) result.textContent = text;
    return result;
  }
  function button(text, label, pick) {
    const result = node('button', 'explore-pick', text);
    result.type = 'button';
    result.setAttribute('aria-label', label);
    result.addEventListener('click', pick);
    return result;
  }
  function keywordCounts(records) {
    const texts = records.map(record => [record.id, normalize([record.title, ...(record.notes || [])].join(' '))]);
    return dictionary.map(([term, aliases]) => ({term, aliases,
      ids: texts.filter(([, text]) => aliases.some(alias => text.includes(normalize(alias)))).map(([id]) => id)
    }));
  }
  window.initPostExploration = function ({records = [], topics = [], coverage = {}, onPick = () => {}}) {
    const posts = records.filter(record => record.kind === 'fb');
    const firstYear = Number(coverage.start?.slice(0, 4) || 2017);
    const lastYear = Number(coverage.end?.slice(0, 4) || 2025);
    const years = Array.from({length: lastYear - firstYear + 1}, (_, index) => String(firstYear + index));
    const topicNames = [...new Set([...topics, ...posts.map(record => record.topic)].filter(Boolean))];
    const matrixMount = document.getElementById('topic-year-explorer');
    if (matrixMount) {
      matrixMount.replaceChildren();
      matrixMount.append(node('h2', '', '主題 × 年份'),
        node('p', 'explore-note', `${posts.length} 則已收錄 Facebook 貼文，每則只歸一個主分類。同一場活動的預告、現場紀錄和回顧各自計入。`),
        node('p', 'explore-legend', '選取數字或主題即可查看貼文。完整發文量仍待對帳。'));
      const tableWrap = node('div', 'explore-matrix');
      const table = node('table');
      table.setAttribute('aria-label', '各主題歷年已收錄 Facebook 貼文篇數');
      const head = table.createTHead().insertRow();
      const corner = node('th', '', '主題'); corner.scope = 'col'; head.append(corner);
      const visited = new Set((coverage.visited || []).map(item => item[0]));
      for (const year of years) {
        const th = node('th'); th.scope = 'col';
        th.append(node('span', '', year));
        const months = [...visited].filter(month => month.startsWith(year)).length;
        th.append(node('small', '', `${months} 個月已初查`)); head.append(th);
      }
      const counts = topicNames.map(topic => years.map(year => posts.filter(record => record.topic === topic && String(record.year) === year).length));
      const maximum = Math.max(1, ...counts.flat());
      const body = table.createTBody();
      topicNames.forEach((topic, index) => {
        const row = body.insertRow(); const title = node('th', '', topic); title.scope = 'row'; row.append(title);
        years.forEach((year, yearIndex) => {
          const count = counts[index][yearIndex]; const cell = row.insertCell();
          if (!count) { cell.append(node('span', 'explore-zero', '未收錄')); return; }
          const level = Math.ceil(4 * Math.sqrt(count / maximum));
          cell.className = `explore-level-${level}`;
          cell.append(button(String(count), `${year} 年，${topic}，已收錄 ${count} 則，查看貼文`, () => onPick({year, topic, label: `${year} 年 · ${topic}`}))); });
      });
      const totalRow = table.createTFoot().insertRow(); const totalTitle = node('th', '', '年度合計'); totalTitle.scope = 'row'; totalRow.append(totalTitle);
      for (const year of years) {
        const count = posts.filter(record => String(record.year) === year).length;
        const cell = totalRow.insertCell();
        cell.append(count ? button(String(count), `${year} 年已收錄合計 ${count} 則，查看貼文`, () => onPick({year, label: `${year} 年`})) : node('span', 'explore-zero', '未收錄'));
      }
      tableWrap.append(node('p', 'explore-color-key', '顏色越深，收錄篇數越多。'), table);
      matrixMount.append(tableWrap);
      const mobile = node('div', 'explore-mobile'); const label = node('label', '', '選擇年份 ');
      const select = node('select'); select.setAttribute('aria-label', '主題排行的年份');
      years.slice().reverse().forEach(year => { const option = node('option', '', `${year} 年`); option.value = year; select.append(option); });
      const ranked = node('div', 'explore-ranked');
      function renderMobile() {
        const year = select.value; ranked.replaceChildren();
        const count = posts.filter(record => String(record.year) === year).length;
        ranked.append(node('p', 'explore-note', `${year} 年已收錄合計 ${count} 則`));
        topicNames.map(topic => ({topic, count: posts.filter(record => String(record.year) === year && record.topic === topic).length})).sort((a, b) => b.count - a.count || collator.compare(a.topic, b.topic)).forEach(item => {
          ranked.append(item.count ? button(`${item.topic} · ${item.count} 則`, `${year} 年，${item.topic}，已收錄 ${item.count} 則，查看貼文`, () => onPick({year, topic: item.topic, label: `${year} 年 · ${item.topic}`})) : node('p', 'explore-zero', `${item.topic} · 未收錄`)); });
      }
      select.addEventListener('change', renderMobile); label.append(select); mobile.append(label, ranked); matrixMount.append(mobile); renderMobile();
    }
    const cloudMount = document.getElementById('keyword-explorer');
    if (cloudMount) {
      cloudMount.replaceChildren();
      cloudMount.append(node('h2', '', '關鍵詞雲'),
        node('p', 'explore-note', `統計 ${posts.length} 則已收錄 Facebook 貼文的公開標題與整理摘要。`),
        node('p', 'explore-legend', '點詞查看含該詞或別名的貼文。同一篇對每個詞只計一次，也可能出現在多個詞的結果裡。'));
      const terms = keywordCounts(posts); const nonzero = terms.filter(term => term.ids.length);
      const controls = node('div', 'explore-order'); const label = node('label', '', '排列方式 '); const order = node('select');
      [['cloud', '文字雲'], ['count', '篇數由多到少'], ['name', '詞彙名稱']].forEach(([value, title]) => { const option = node('option', '', title); option.value = value; order.append(option); });
      label.append(order); controls.append(label); cloudMount.append(controls);
      const display = node('div', 'explore-words'); cloudMount.append(display);
      function renderWords() {
        display.replaceChildren(); display.className = order.value === 'cloud' ? 'explore-words' : 'explore-word-list';
        const sorted = nonzero.slice().sort((a,b) => order.value === 'name' ? collator.compare(a.term,b.term) : b.ids.length-a.ids.length || collator.compare(a.term,b.term));
        const max = Math.max(1, ...sorted.map(term => term.ids.length));
        for (const term of sorted) {
          const control = button(`${term.term} · ${term.ids.length} 則`, `${term.term}，${term.ids.length} 則標題或摘要命中，查看貼文`, () => onPick({ids: term.ids.slice(), label: `關鍵詞 · ${term.term}`}));
          if (order.value === 'cloud') control.style.fontSize = `${1 + 1.15 * Math.sqrt(term.ids.length / max)}rem`;
          display.append(control);
        }
        if (!sorted.length) display.append(node('p', '', '目前未收錄命中詞彙的貼文。'));
      }
      order.addEventListener('change', renderWords); renderWords();
      const method = node('details', 'explore-method'); method.append(node('summary', '', '詞彙與別名如何計算？'));
      method.append(node('p', '', '使用人工詞表，以列出的詞或別名比對標題與摘要。比對前統一全形半形、英文大小寫及空白。文字雲顯示至少命中一則貼文的詞。'));
      const aliases = node('ul'); terms.forEach(term => aliases.append(node('li', '', `${term.term} · ${term.aliases.join('、')}（${term.ids.length} 則）`))); method.append(aliases); cloudMount.append(method);
    }
  };
})();
