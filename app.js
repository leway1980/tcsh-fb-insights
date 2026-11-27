'use strict';

const report = window.reportData;
const byId = new Map(report.records.map(record => [record.id, record]));
const facebookPosts = report.records.filter(record => record.kind === 'fb');
const postCount = facebookPosts.length;
const eventCount = report.records.length - postCount;
const textArchive = report.coverage.textArchive || {};
const storedText = new Set(textArchive.stored);
const noVisibleText = new Set(textArchive.noVisibleText);
const indexOnly = new Set(textArchive.indexOnly);
const pendingTextCount = postCount - storedText.size - noVisibleText.size - indexOnly.size;

function textStatus(record) {
  if (record.kind !== 'fb') return '';
  if (storedText.has(record.id)) return '已封存文字';
  if (noVisibleText.has(record.id)) return '未見獨立正文';
  if (indexOnly.has(record.id)) return '僅留索引';
  return '文字待查';
}
const unverifiedTimeCount = facebookPosts.filter(record => !record.time).length;
const insights = [
  {
    id: 'school-curriculum', group: 'course', period: '2017–2025',
    title: '校本課程從前導試行走到三年規劃',
    idea: '早期先做跨科共備、校訂必修與選修試行。正式課程計畫逐年留下班型、年段、學習目標與評量證據。',
    detail: '2018 年，幼兒園、國小與中學教師分享主題課程，也有「樂活花蓮」與國一英語公開授課。2019 年 6 月的官帖記錄，校方在 107 學年度試行「慈濟學與 NGO」及「生活美學」校訂必修，並以茶道、花道發表成果。同年 11 月，花蓮地區國高中教師跨校共備，練習把領域知識轉成概念。2020 年的合心共識營記下校本課程、教師社群與自主學習的討論。112 至 114 學年度備查計畫記載普通班、兩種實驗班和跨科必修的正式架構。',
    topic: '課程與專題',
    evidence: ['event-04','fb-909','fb-645','fb-1125','fb-933','fb-1143','fb-940','fb-1120','event-08','event-12','event-15','event-22','event-38','event-45','event-59']
  },
  {
    id: 'local-learning', group: 'course', period: '2019–2025',
    title: '花蓮的街區與海岸成為任務現場',
    idea: '早期選修已用實地踏查。近年的紀錄讓學生做了什麼更清楚，例如規劃路線、測量海蝕洞高度與做文創設計。',
    detail: '2019 年附小畢業旅行讓學生先規劃路線，再整合成六條城市探索路線。2022 年的「見學東台灣」回顧四科共備，由高二學生帶高一學弟妹完成關卡與走讀。2025 年可比較國中「港市尋蹤」與高一「見學東台灣」各自的任務。見學東台灣有八則貼文，涵蓋出發、各站任務與回顧。',
    topic: '在地與校外學習',
    evidence: ['event-10','event-11','fb-741','fb-755','fb-796','fb-31','fb-25','fb-24','fb-23','fb-22','fb-21','fb-20','fb-19','fb-18']
  },
  {
    id: 'inquiry', group: 'course', period: '2022–2025',
    title: '專題學習有了指導、發表與修正歷程',
    idea: '實驗班從科學思維與研究方法起步，結合大學指導、跨學期專題、口頭發表與探究評量。',
    detail: '2022 年官粉已記錄雙語實驗班與大學教師合作，由學生用兩學期完成研究並發表海報。後續紀錄可見國二、高二科學班以口頭或海報展示研究，以及高二雙語班以英語報告。小論文競賽的模擬口試也讓學生練習研究表達。',
    topic: '課程與專題',
    evidence: ['event-25','fb-758','event-28','fb-654','event-40','event-41','event-45','event-53','event-54','fb-52','fb-26']
  },
  {
    id: 'life-education', group: 'activity', period: '2017–2025',
    title: '「感飢 12」延續年末體驗，也因議題調整',
    idea: '12 小時體驗和參與行動延續多年。不同年份用分齡安排、視訊交流與募款，回應不同的國際議題。',
    detail: '2017 年中學、國小與親師志工已共同響應。2022 年的視訊把行動連到烏克蘭難民，2025 年則以南蘇丹為援助對象，海外學校也有各自的響應方式。',
    topic: '生命教育與服務',
    evidence: ['event-03','fb-70','fb-69','fb-64','fb-61','event-09','event-14','event-20','event-21','event-30','fb-624','event-36','fb-10','event-57']
  },
  {
    id: 'anniversary', group: 'activity', period: '2017–2025',
    title: '校慶把運動展演、園遊會與社區服務排在一起',
    idea: '歷年可見運動會、社區清掃與國際文化進場。2025 年的校慶串起精舍志工、三地服務、運動會、義賣與校友回聚。',
    detail: '2017、2018 年已有校慶前的社區服務。2024 年粉專分享校慶專題節目並預告活動。2025 年的多則貼文可比對預告、實際服務、義賣用途及校友餐會，讀出安排的先後與分工。',
    topic: '校慶、藝文與體育',
    evidence: ['event-02','event-05','event-06','fb-663','fb-649','event-13','event-26','event-35','fb-463','event-43','fb-55','fb-51','fb-50','fb-47','fb-45','fb-43']
  },
  {
    id: 'international', group: 'activity', period: '2017–2025',
    title: '國際交流有出訪、入校共學和長程課程',
    idea: '早年已有海外修學和接待。後來的可見紀錄增加視訊、學伴共學、跨科任務與雙聯學位等形式。',
    detail: '2021 年官粉記錄印尼姊妹校交流改用視訊，以及與美國緬因中央中學合作的雙聯學位開學。2023 年首屆學生取得兩校畢業證書。2024 年暑期規劃五國六團，赴美的雙聯團參加實體 STEAM 課程。2025 年盛岡交流加入在地走讀，青森南高校則在地震後以視訊維持共學。',
    topic: '國際與雙語',
    evidence: ['fb-72','event-07','event-16','event-24','fb-792','fb-793','event-27','event-29','event-31','event-34','fb-717','event-44','fb-544','fb-542','fb-540','event-51','event-56','fb-17','fb-13']
  }
];

const get = id => document.getElementById(id);
const query = get('query');
const yearFilter = get('year');
const topicFilter = get('topic');
const kindFilter = get('kind');
const monthButton = get('remove-month');
const explorationButton = get('remove-exploration');
const recordList = get('record-list');
const loadMore = get('load-more');
const pageSize = 16;
let monthFilter = '';
let explorationFilter = null;
let visibleLimit = pageSize;

function element(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function sourceType(record) {
  return record.kind === 'fb' ? 'Facebook 貼文' : '公開網頁事件';
}

function sourceLinks(record) {
  const list = element('div', 'source-links');
  const sources = record.observedSource
    ? [...record.sources, { label: 'Facebook 候選連結（同篇待核）', url: record.observedSource }]
    : record.sources;
  for (const source of sources) {
    const link = element('a', 'source-link', source.label);
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    list.append(link);
  }
  return list;
}

function dates(record) {
  const list = element('dl', 'record-dates');
  const entries = record.kind === 'fb'
    ? [['發文', [record.published, record.time].filter(Boolean).join(' ')], ['活動', record.activity || '未記載']]
    : [['活動或適用', record.activity], ['刊登或備查', record.published || '未載']];
  for (const [label, value] of entries) {
    const pair = element('div');
    pair.append(element('dt', '', label), element('dd', '', value));
    list.append(pair);
  }
  return list;
}

function notes(record) {
  const wrapper = element('div', 'record-notes');
  const list = element('ul');
  for (const point of record.notes) list.append(element('li', '', point));
  wrapper.append(list);
  const hints = [record.timeNote].filter(Boolean);
  if (hints.length) wrapper.append(element('p', 'record-hint', hints.join(' · ')));
  return wrapper;
}

function recordChips(record) {
  const line = element('div', 'chips');
  line.append(element('span', 'chip', sourceType(record)), element('span', 'chip secondary', record.topic));
  const status = textStatus(record);
  if (status) line.append(element('span', status === '文字待查' ? 'chip pending-chip' : 'chip', status));
  return line;
}

function evidenceItem(record) {
  const item = element('li', 'evidence-item');
  const year = element('span', 'evidence-year', String(record.year));
  const body = element('div', 'evidence-body');
  body.append(recordChips(record), element('h4', '', record.title), dates(record), notes(record), sourceLinks(record));
  item.append(year, body);
  return item;
}

function resetControls() {
  query.value = '';
  yearFilter.value = 'all';
  topicFilter.value = 'all';
  kindFilter.value = 'fb';
  monthFilter = '';
  explorationFilter = null;
  visibleLimit = pageSize;
}

function showRecords() {
  renderRecords();
  const target = get('records-title');
  target.tabIndex = -1;
  target.focus({ preventScroll: true });
  get('records').scrollIntoView({ block: 'start' });
}

function showExplorationRecords({ year, topic, label, ids }) {
  resetControls();
  if (year) yearFilter.value = String(year);
  if (topic) topicFilter.value = topic;
  explorationFilter = { label, ids: ids ? new Set(ids) : null };
  showRecords();
}

function renderInsights() {
  const list = get('insight-list');
  for (const insight of insights) {
    const panel = element('details', 'insight');
    panel.id = insight.id;
    panel.dataset.group = insight.group;
    const summary = element('summary', 'insight-summary');
    const content = element('div', 'insight-summary-content');
    const marker = insight.group === 'course' ? '課程發展' : '課外活動';
    content.append(element('span', 'insight-meta', marker + ' · ' + insight.period),
      element('h3', '', insight.title), element('p', '', insight.idea));
    const icon = element('span', 'expand-icon');
    icon.setAttribute('aria-hidden', 'true');
    summary.append(content, icon);
    const expanded = element('div', 'insight-expanded');
    const sources = insight.evidence.map(id => byId.get(id)).filter(Boolean);
    const fbSources = sources.filter(record => record.kind === 'fb');
    const webSources = sources.filter(record => record.kind === 'web');
    const timeline = element('ol', 'evidence-list');
    for (const record of fbSources) timeline.append(evidenceItem(record));
    const evidenceNote = element('p', 'record-hint', fbSources.length ? '以下為已收錄的 Facebook 貼文。跨年份觀察也參考補充公開資料。' : '這項觀察的依據是補充公開資料，目前尚無已收錄的 Facebook 貼文。');
    const supplement = element('details', 'method');
    const webList = element('ol', 'evidence-list');
    for (const record of webSources) webList.append(evidenceItem(record));
    supplement.append(element('summary', '', '查看補充來源：公開網頁事件（' + webSources.length + ' 筆）'), webList);
    const more = element('button', 'button more-topic', '查詢更多「' + insight.topic + '」紀錄');
    more.type = 'button';
    more.addEventListener('click', () => {
      resetControls();
      topicFilter.value = insight.topic;
      showRecords();
    });
    expanded.append(element('p', 'insight-explanation', insight.detail),
      evidenceNote, element('h4', 'evidence-title', '已收錄的 Facebook 貼文'), timeline);
    if (webSources.length) expanded.append(supplement);
    expanded.append(more);
    panel.append(summary, expanded);
    list.append(panel);
  }

  const groupButtons = [...document.querySelectorAll('[data-group][aria-pressed]')];
  for (const button of groupButtons) {
    button.addEventListener('click', () => {
      const group = button.dataset.group;
      for (const other of groupButtons) other.setAttribute('aria-pressed', String(other === button));
      for (const panel of list.children) panel.hidden = group !== 'all' && panel.dataset.group !== group;
    });
  }
}

function normalize(value) {
  return value.normalize('NFKC').toLocaleLowerCase('zh-Hant').replace(/\s+/g, '');
}

function dateKey(record) {
  if (record.kind === 'fb') return record.published + record.time.replace(':', '');
  const date = record.activity.match(/\b20\d{2}-\d{2}-\d{2}\b/)?.[0];
  return (date || record.year + '-01-01') + '0000';
}

const ordered = report.records.slice().sort((a, b) => dateKey(b).localeCompare(dateKey(a)));
const searchIndex = new Map(ordered.map(record => [record.id,
  normalize([record.title, record.topic, record.activity, record.published,
    sourceType(record), ...record.notes].filter(Boolean).join(' '))
]));

function matchRecords() {
  const term = normalize(query.value);
  return ordered.filter(record =>
    (yearFilter.value === 'all' || String(record.year) === yearFilter.value) &&
    (topicFilter.value === 'all' || record.topic === topicFilter.value) &&
    (kindFilter.value === 'all' || record.kind === kindFilter.value) &&
    (!monthFilter || (record.kind === 'fb' && record.published.startsWith(monthFilter))) &&
    (!explorationFilter?.ids || explorationFilter.ids.has(record.id)) &&
    (!term || searchIndex.get(record.id).includes(term))
  );
}

function recordCard(record) {
  const panel = element('details', 'record');
  panel.id = record.id;
  const summary = element('summary', 'record-summary');
  const stamp = record.kind === 'fb' ? record.published : String(record.year) + ' 年';
  const text = element('div', 'record-summary-content');
  text.append(element('h3', '', record.title), recordChips(record));
  const icon = element('span', 'expand-icon');
  icon.setAttribute('aria-hidden', 'true');
  summary.append(element('span', 'record-date', stamp), text, icon);
  const content = element('div', 'record-expanded');
  content.append(dates(record), notes(record), sourceLinks(record));
  panel.append(summary, content);
  return panel;
}

function renderRecords() {
  const records = matchRecords();
  const shown = records.slice(0, visibleLimit);
  const open = new Set([...recordList.querySelectorAll('details[open]')].map(panel => panel.id));
  const posts = records.filter(record => record.kind === 'fb').length;
  get('result-count').textContent = records.length
    ? '顯示 ' + shown.length + ' / ' + records.length + ' 筆 · Facebook ' + posts + ' 則 · 公開網頁 ' + (records.length - posts) + ' 筆'
    : '符合條件的紀錄 0 筆';
  monthButton.hidden = !monthFilter;
  if (monthFilter) monthButton.textContent = '移除月份 ' + monthFilter;
  explorationButton.hidden = !explorationFilter;
  if (explorationFilter) explorationButton.textContent = `清除圖表選取 · ${explorationFilter.label}`;
  loadMore.hidden = shown.length === records.length;
  recordList.replaceChildren();
  if (!records.length) {
    const empty = element('div', 'no-results');
    empty.append(element('h3', '', '找不到符合條件的紀錄'),
      element('p', '', '可換一個關鍵字，或清除年份、主題和來源條件。'));
    recordList.append(empty);
  }
  for (const record of shown) {
    const card = recordCard(record);
    card.open = open.has(record.id);
    recordList.append(card);
  }
}

function initFilters() {
  const years = [...new Set(ordered.map(record => record.year))].sort((a, b) => b - a);
  for (const year of years) yearFilter.add(new Option(year + ' 年', String(year)));
  for (const topic of report.topics) topicFilter.add(new Option(topic, topic));
  const filterForm = get('record-filters');
  filterForm.addEventListener('submit', event => event.preventDefault());
  for (const control of [query, yearFilter, topicFilter, kindFilter]) {
    control.addEventListener(control === query ? 'input' : 'change', () => {
      if (control === yearFilter || control === kindFilter) monthFilter = '';
      if (control === kindFilter || (!explorationFilter?.ids && (control === yearFilter || control === topicFilter))) {
        explorationFilter = null;
      }
      visibleLimit = pageSize;
      renderRecords();
    });
  }
  get('clear-filters').addEventListener('click', () => {
    resetControls();
    renderRecords();
  });
  monthButton.addEventListener('click', () => {
    monthFilter = '';
    visibleLimit = pageSize;
    renderRecords();
  });
  explorationButton.addEventListener('click', () => {
    resetControls();
    showRecords();
  });
  loadMore.addEventListener('click', () => {
    const firstNew = matchRecords()[visibleLimit];
    visibleLimit += pageSize;
    renderRecords();
    if (firstNew) get(firstNew.id)?.querySelector('summary').focus();
  });
}

function renderAnnualChart() {
  const list = get('annual-chart');
  const firstYear = Number(report.coverage.start.slice(0, 4));
  const lastYear = Number(report.coverage.end.slice(0, 4));
  const counts = new Map();
  const visited = new Map();
  for (const { year } of facebookPosts) counts.set(year, (counts.get(year) || 0) + 1);
  for (const [month] of report.coverage.visited) {
    const year = Number(month.slice(0, 4));
    visited.set(year, (visited.get(year) || 0) + 1);
  }
  const maximum = Math.max(1, ...counts.values());
  for (let year = firstYear; year <= lastYear; year++) {
    const count = counts.get(year) || 0;
    const firstMonth = year === firstYear ? Number(report.coverage.start.slice(5)) : 1;
    const lastMonth = year === lastYear ? Number(report.coverage.end.slice(5)) : 12;
    const coverage = `${visited.get(year) || 0} / ${lastMonth - firstMonth + 1} 個月有查核紀錄`;
    const item = element('li');
    const row = element(count ? 'button' : 'div', 'annual-row');
    const track = element('span', 'annual-track');
    track.setAttribute('aria-hidden', 'true');
    const bar = element('span', 'annual-bar');
    bar.style.width = `${100 * count / maximum}%`;
    track.append(bar);
    row.append(element('span', 'annual-year', `${year} 年`), track,
      element('span', 'annual-count', count ? `${count} 則` : '尚無收錄'), element('span', 'annual-coverage', coverage));
    if (count) {
      row.type = 'button';
      row.setAttribute('aria-label', `查看 ${year} 年 ${count} 則已收錄的 Facebook 貼文，${coverage}`);
      row.addEventListener('click', () => {
        resetControls();
        yearFilter.value = String(year);
        showRecords();
      });
    }
    item.append(row);
    list.append(item);
  }
}

function renderCoverage() {
  const table = get('coverage-table');
  const head = table.createTHead().insertRow();
  const yearHeader = element('th', '', '年份');
  yearHeader.scope = 'col';
  head.append(yearHeader);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  for (const month of months) {
    const cell = element('th', '', month + ' 月');
    cell.scope = 'col';
    head.append(cell);
  }
  const body = table.createTBody();
  const known = new Map(report.coverage.visited.map(([month, state, count]) => [month, [state, count]]));
  const states = { partial: '當月部分', scanned: '讀到跨月', located: '原文已定位', empty: '介面無結果', pending: '待查' };
  const symbols = { located: '有', empty: '空', pending: '—' };
  let pending = 0;
  let inScope = 0;
  for (let year = 2017; year <= 2025; year++) {
    const row = body.insertRow();
    const label = element('th', '', String(year));
    label.scope = 'row';
    row.append(label);
    for (const month of months) {
      const key = year + '-' + String(month).padStart(2, '0');
      const cell = row.insertCell();
      if (key < report.coverage.start || key > report.coverage.end) {
        cell.className = 'out';
        continue;
      }
      inScope++;
      const [state, count] = known.get(key) || ['pending', 0];
      if (state === 'pending') pending++;
      cell.className = state;
      const spoken = year + ' 年 ' + month + ' 月，' + states[state] + (count ? '，收錄 ' + count + ' 則' : '');
      cell.title = spoken;
      if (count) {
        const button = element('button', 'month-button', String(count) + (state === 'partial' ? '*' : ''));
        button.type = 'button';
        button.setAttribute('aria-label', spoken + '，查看當月貼文');
        button.addEventListener('click', () => {
          resetControls();
          monthFilter = key;
          yearFilter.value = String(year);
          kindFilter.value = 'fb';
          showRecords();
        });
        cell.append(button);
      } else {
        cell.textContent = symbols[state];
        cell.setAttribute('aria-label', spoken);
      }
    }
  }
  const coverageSummary = pending
    ? `範圍 ${inScope} 個月，${pending} 個月待查。`
    : `${inScope} 個月都有初次查核紀錄。各月實際發文總數仍待對帳。`;
  const timeSummary = unverifiedTimeCount
    ? `${unverifiedTimeCount} 則發文時刻待核。`
    : '已收錄的貼文皆有發文時刻，有介面讀值差異者逐篇附註。';
  get('coverage-note').textContent = `${coverageSummary}已封存 ${storedText.size} 則文字，${pendingTextCount} 則文字待查，${noVisibleText.size} 則未見獨立正文，${indexOnly.size} 則僅留索引。${timeSummary}`;
}

get('hero-posts').textContent = String(postCount);
get('hero-events').textContent = String(eventCount);
renderInsights();
initFilters();
renderRecords();
renderAnnualChart();
renderCoverage();
window.initPostExploration?.({ ...report, onPick: showExplorationRecords });
window.initEvidenceTimeline?.({ records: report.records, textStatus, onPick: showExplorationRecords });
